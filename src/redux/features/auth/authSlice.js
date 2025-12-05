import { createSlice } from "@reduxjs/toolkit";

// Define your initial state
const initialState = {
    user: null,
    token: null,
    refreshToken: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Changed from 'reducer' to 'reducers' (plural)
        setUser: (state, action) => {
            const { user, token, refreshToken } = action.payload;
            state.user = user;
            state.token = token;
            state.refreshToken = refreshToken;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null; // Added to clear refreshToken on logout
        },
    },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.user;
export const selectRefreshToken = (state) => state.auth.refreshToken;
