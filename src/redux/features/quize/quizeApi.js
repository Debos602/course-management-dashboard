// src/redux/features/quiz/quizApi.js
import { baseApi } from "../../api/baseApi";

export const quizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuizById: builder.query({
      // expects quizId (string) -> GET /quizzes/:id
      query: (courseId) => ({
        url: `/quizzes/${courseId}`,
        method: "GET",
      }),
      providesTags: (result, error, courseId) => [{ type: "Quizzes", id: courseId }],
    }),

    // Optional: submit quiz (you can remove if not needed now)
    submitQuiz: builder.mutation({
      query: ({ quizId, answers }) => ({
        url: `/quizzes/${quizId}/submit`,
        method: "POST",
        body: { answers },
      }),
      invalidatesTags: (result, error, { quizId }) => [{ type: "Quizzes", id: quizId }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetQuizByIdQuery, useSubmitQuizMutation } = quizApi;
