// src/redux/features/quiz/quizApi.js
import { baseApi } from "../../api/baseApi";

export const quizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /quizzes
    getQuizzes: builder.query({
      query: () => ({ url: `/quizzes`, method: "GET" }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((q) => ({ type: "Quizzes", id: q._id || q.id })),
              { type: "Quizzes", id: "LIST" },
            ]
          : [{ type: "Quizzes", id: "LIST" }],
    }),

    // GET /quizzes/:id
    getQuizById: builder.query({
      query: (quizId) => ({ url: `/quizzes/${quizId}`, method: "GET" }),
      providesTags: (result, error, quizId) => [{ type: "Quizzes", id: quizId }],
    }),

    // POST /quizzes
    createQuiz: builder.mutation({
      query: (payload) => ({ url: `/quizzes`, method: "POST", body: payload }),
      invalidatesTags: [{ type: "Quizzes", id: "LIST" }],
    }),

    // PUT /quizzes/:id
    updateQuiz: builder.mutation({
      query: ({ id, ...patch }) => ({ url: `/quizzes/${id}`, method: "PUT", body: patch }),
      invalidatesTags: (result, error, { id }) => [{ type: "Quizzes", id }],
    }),

    // DELETE /quizzes/:id
    deleteQuiz: builder.mutation({
      query: (id) => ({ url: `/quizzes/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, id) => [{ type: "Quizzes", id }, { type: "Quizzes", id: "LIST" }],
    }),

    // Optional: submit quiz
    submitQuiz: builder.mutation({
      query: ({ quizId, answers }) => ({ url: `/quizzes/${quizId}/submit`, method: "POST", body: { answers } }),
      invalidatesTags: (result, error, { quizId }) => [{ type: "Quizzes", id: quizId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetQuizzesQuery,
  useGetQuizByIdQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useSubmitQuizMutation,
} = quizApi;
