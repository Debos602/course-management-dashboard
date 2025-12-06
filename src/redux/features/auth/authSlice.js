import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set user info and tokens
    setUser: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user || state.user; // Preserve existing user if not provided
      state.token = token;
      state.refreshToken = refreshToken;
    },
    // Logout clears all
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
});

// Actions
export const { setUser, logout } = authSlice.actions;

// Selectors
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.user;
export const selectRefreshToken = (state) => state.auth.refreshToken;

// Reducer
export default authSlice.reducer;
