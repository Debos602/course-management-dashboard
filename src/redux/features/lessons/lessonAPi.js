import { baseApi } from "../../api/baseApi";

export const lessonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /lessons
   getLessons: builder.query({
    query: ({ page = 1, limit = 6 } = {}) => ({
        url: `/lessons?page=${page}&limit=${limit}`,
        method: "GET",
    }),
    providesTags: [{ type: "Lessons", id: "LIST" }],
    }),


    // GET /lessons/:id
    getLessonById: builder.query({
      query: (lessonId) => ({
        url: `/lessons/${lessonId}`,
        method: "GET",
      }),
      providesTags: (result, error, lessonId) => [
        { type: "Lessons", id: lessonId },
      ],
    }),

    // POST /lessons
    createLesson: builder.mutation({
      query: (payload) => ({
        url: "/lessons",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Lessons", id: "LIST" }],
    }),

   // update /lessons/:id
    updateLesson: builder.mutation({
      query: ({ lessonId, body }) => ({
        url: `/lessons/${lessonId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { lessonId }) => [
        { type: "Lessons", id: lessonId },
        { type: "Lessons", id: "LIST" },
      ],
    }),

  }),
});

export const {
  useGetLessonsQuery,
  useGetLessonByIdQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
} = lessonApi;
