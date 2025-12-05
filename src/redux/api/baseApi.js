import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setUser } from "../features/auth/authSlice"; // setCredentials ব্যবহার করুন

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    credentials: "same-origin",
    prepareHeaders: (headers, { getState }) => {
        headers.set("Content-Type", "application/json");
        const token = getState().auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithRefreshToken = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // 401 এরর চেক করুন
    if (result?.error?.status === 401) {
        console.log("টোকেন এক্সপায়ার্ড, রিফ্রেশ চেষ্টা করছি...");

        const { token, refreshToken } = api.getState().auth;

        if (!refreshToken) {
            console.error("রিফ্রেশ টোকেন নেই, লগআউট করছি");
            api.dispatch(logout());
            return result;
        }

        try {
            // সঠিক বডি স্ট্রাকচার ব্যবহার করুন
            const refreshResponse = await baseQuery(
                {
                    url: "/Account/RefreshToken",
                    method: "POST",
                    body: JSON.stringify({
                        AccessToken: token,
                        RefreshToken: refreshToken,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                api,
                extraOptions
            );

            if (refreshResponse.data) {
                console.log("টোকেন রিফ্রেশ সফল");
                const { AccessToken, RefreshToken } = refreshResponse.data;

                // শুধু টোকেন আপডেট করুন (user ডাটা ছাড়া)
                api.dispatch(
                    setUser({
                        token: AccessToken,
                        refreshToken: RefreshToken,
                    })
                );

                // নতুন টোকেন দিয়ে রিকোয়েস্ট রিট্রাই করুন
                const retryResult = await baseQuery(
                    {
                        ...args,
                        headers: {
                            ...args.headers,
                            Authorization: `Bearer ${AccessToken}`,
                        },
                    },
                    api,
                    extraOptions
                );
                return retryResult;
            } else {
                console.error("রিফ্রেশ ফেইল্ড, লগআউট করছি");
                api.dispatch(logout());
            }
        } catch (error) {
            console.error("রিফ্রেশ টোকেন এরর:", error);
            api.dispatch(logout());
        }
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithRefreshToken,
    tagTypes: ["User", "Admin", "Materials"],
    endpoints: () => ({}),
});
