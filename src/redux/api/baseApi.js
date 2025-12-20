import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setUser } from "../features/auth/authSlice";

// Base query with token header
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL, // Example: http://localhost:5000/api/v1
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // headers.set("Content-Type", "application/json");
    const token = getState().auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// Wrapper to handle 401 + refresh token
const baseQueryWithRefreshToken = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const { token, refreshToken, user } = api.getState().auth;

    if (!refreshToken) {
      console.warn("[baseQuery] No refresh token available, logging out");
      api.dispatch(logout());
      return result;
    }

    try {
      // Refresh token request
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { accessToken: token, refreshToken }, // server expects object
        },
        api,
        extraOptions
      );

      if (refreshResult.data && refreshResult.data.accessToken && refreshResult.data.refreshToken) {
        const { accessToken, refreshToken: newRefreshToken } = refreshResult.data;

        // Update Redux state with new tokens
        api.dispatch(
          setUser({
            user, // preserve existing user info
            token: accessToken,
            refreshToken: newRefreshToken,
          })
        );

        console.log("[baseQuery] Token refreshed, retrying original request");

        // Retry original request with new token
        return await baseQuery(
          {
            ...args,
            headers: {
              ...args.headers,
              Authorization: `Bearer ${accessToken}`,
            },
          },
          api,
          extraOptions
        );
      } else {
        console.warn("[baseQuery] Refresh token failed, logging out");
        api.dispatch(logout());
      }
    } catch (err) {
      console.error("[baseQuery] Refresh token error:", err);
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["User", "Admin", "Materials", "Quizzes"],
  endpoints: () => ({}),
});
