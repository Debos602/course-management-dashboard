import { baseApi } from "../../api/baseApi";

export const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEnrollments: builder.query({
      query: () => ({
        url: "/enrollments/mine",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getCourseLessons: builder.query({
      query: (courseId) => ({
        url: `/lessons/course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Materials"],
    }),
    updateEnrollmentProgress: builder.mutation({
      query: ({ courseId, body }) => ({
        url: `/enrollments/${courseId}/progress`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User", "Materials"],
    }),
    createAssignment: builder.mutation({
      query: ({ courseId, body }) => ({
        url: `/courses/${courseId}/assignments`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Materials", "User"],
    }),
  }),
});

export const { useGetEnrollmentsQuery, useGetCourseLessonsQuery, useUpdateEnrollmentProgressMutation, useCreateAssignmentMutation } = coursesApi;
