import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiUtils";
interface User {
  token: string;
}
interface AuthState {
  isLoading: boolean;
  error: string;
  user: User | null;
  token: string | null;
}

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");


const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  isLoading: false,
  error: "",
};

export const loginUser = createAsyncThunk("auth/loginUser", async (userData) => {
  try {
    const response = await api.post("/login", userData);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
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
      state.token = action.payload.token;
      state.error = "";
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "something went wrong";
    });
  },
});

export const { setUser, setToken, logout } = authSlice.actions;
export const selectToken = (state: { auth: { token: string } }) => state.auth.token;
export const selectUser = (state: { auth: { user: User } }) => state.auth.user;
export default authSlice.reducer;
