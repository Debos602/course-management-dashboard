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
    // In coursesApi.js - Fix the getAllCourses query
    getAllCourses: builder.query({
      query: ({ 
        page = 0, 
        limit = 0, 
        search = "", 
        category = "", 
        tags = "", 
        status = "", 
        minPrice = "", 
        maxPrice = "" 
      }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        
        // Only append parameters that have values
        if (search && search.trim() !== "") {
          params.append("search", search.trim());
        }
        if (category && category.trim() !== "") {
          params.append("category", category.trim());
        }
        if (tags && tags.trim() !== "") {
          params.append("tags", tags.trim());
        }
        if (status && status.trim() !== "") {
          params.append("status", status.trim());
        }
        if (minPrice && minPrice.trim() !== "") {
          params.append("minPrice", minPrice.trim());
        }
        if (maxPrice && maxPrice.trim() !== "") {
          params.append("maxPrice", maxPrice.trim());
        }

        console.log("API Request URL:", `/courses?${params.toString()}`);
        
        return {
          url: `/courses?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Courses"],
    }),

   createCourse: builder.mutation({
      query: (formData) => ({
        url: "/admin/courses",
        method: "POST",
        body: formData,
        // Important: Don't set Content-Type header for FormData
      }),
      invalidatesTags: ["Courses"],
    }),
    updateCourse: builder.mutation({
      query: ({ courseId, body }) => ({
        url: `/admin/courses/${courseId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Courses"],
    }),
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/admin/courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

  }),
});

export const { useGetEnrollmentsQuery, useGetCourseLessonsQuery, useUpdateEnrollmentProgressMutation, useCreateAssignmentMutation, useGetAllCoursesQuery, useCreateCourseMutation, useDeleteCourseMutation, useUpdateCourseMutation } = coursesApi;
