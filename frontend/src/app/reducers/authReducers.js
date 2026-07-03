import { createSlice } from "@reduxjs/toolkit";

const savedToken = localStorage.getItem("token");
let savedUser = null;
try {
  const userStr = localStorage.getItem("user");
  if (userStr) savedUser = JSON.parse(userStr);
} catch (e) {
  console.error("Failed to parse saved user from localStorage", e);
}

const initialState = {
    user: savedUser,
    token: savedToken,
    isAuthenticated: !!savedToken,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;