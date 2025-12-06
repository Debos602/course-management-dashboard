import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentQuiz: null, // API থেকে আসা quiz store করে রাখবে
  loading: false,
  error: null,
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuizLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setQuizSuccess: (state, action) => {
      state.loading = false;
      state.currentQuiz = action.payload; // quiz object
    },
    setQuizError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearQuiz: (state) => {
      state.currentQuiz = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setQuizLoading, setQuizSuccess, setQuizError, clearQuiz } =
  quizSlice.actions;

export default quizSlice.reducer;
