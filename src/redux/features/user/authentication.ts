import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loginURL } from "../../api/API";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoading: false,
  isAuthenticated: !!localStorage.getItem("token"),
  token: localStorage.getItem("token") || null,
  error: "",
};

export const loginUser = createAsyncThunk("user/loginUser", async (user) => {
  const response = await axios.post(loginURL, user);
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  localStorage.removeItem("user");
  localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.error = "something went wrong";
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "something went wrong";
    });
  },
});

export const { setUser, setToken, logout } = authSlice.actions;
// export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
