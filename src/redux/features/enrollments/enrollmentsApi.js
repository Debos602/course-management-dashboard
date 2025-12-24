import { baseApi } from "../../api/baseApi";


 export const enrollmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEnrollments: builder.query({
        query: () => ({
        url: "/admin/enrolled",
        method: "GET",


        }),
        providesTags: ["User"],
    }),

    createEnrollments: builder.mutation({
      query: ({ courseId, userId }) => ({
        url: `/enrollments/${courseId}/enroll`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["User"],
    })


  }),

  
}); 
export const { useGetEnrollmentsQuery, useCreateEnrollmentsMutation } = enrollmentsApi;