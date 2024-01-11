import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loginURL, getUserURL } from "../../api/API";



const initialState = {
  user: {},
  isLoading: false,
  error: "",
};

export const getAdminUser = createAsyncThunk("user/getAdminUser", async () => {
    const response = await axios.get(getUserURL);
    return response.data;
    });

export const loginUser = createAsyncThunk("user/loginUser", async (user) => {
  const response = await axios.post(loginURL, user);
  return response.data;
});

const admin = createSlice({
    name: "admin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAdminUser.pending, (state) => {
        state.isLoading = true;
        });
        builder.addCase(getAdminUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = "something went wrong";
        });
        builder.addCase(getAdminUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "something went wrong";
        });
        builder.addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = "something went wrong";
        });
        builder.addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "something went wrong";
        });
    },
    });

    export default admin.reducer;