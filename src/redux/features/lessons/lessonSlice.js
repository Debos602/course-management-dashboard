import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentLessonId: null,
  isPlaying: false,
  progress: 0,
  isCompleted: false,
};

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {

    startLesson: (state, action) => {
      state.currentLessonId = action.payload;
      state.isPlaying = true;
      state.progress = 0;
      state.isCompleted = false;
    },

    updateProgress: (state, action) => {
      state.progress = action.payload;
    },

    completeLesson: (state) => {
      state.isPlaying = false;
      state.isCompleted = true;
      state.progress = 100;
    },

    // ✅ lesson delete হলে UI clean
    clearCurrentLesson: (state) => {
      state.currentLessonId = null;
      state.isPlaying = false;
      state.progress = 0;
      state.isCompleted = false;
    },
  },
});

export const {
  startLesson,
  updateProgress,
  completeLesson,
  clearCurrentLesson,
} = lessonSlice.actions;

export default lessonSlice.reducer;
