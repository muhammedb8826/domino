import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface UserState {
  user: [] | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

const url = "https://jsonplaceholder.typicode.com/users/1";

export const getUser = createAsyncThunk("user/getUser", async () => {
    const response = await axios.get(url);
    return response.data;
    });


const user = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || null;
    });
  },
});

export default user.reducer;