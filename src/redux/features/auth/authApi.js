import { baseApi } from "../../api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials, // { email, password }
      }),
      transformResponse: (response) => {
        // Server response structure: { statusCode, message, data: { user, accessToken, refreshToken } }
        const { data } = response;
        return {
          user: data.user,
          token: data.accessToken,
          refreshToken: data.refreshToken,
        };
      },
      invalidatesTags: ["User"],
    }),

    // Logout mutation
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      // Clear user-related tags
      invalidatesTags: ["User"],
    }),
    // Register mutation
    register: builder.mutation({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } = authApi;
