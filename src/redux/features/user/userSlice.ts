import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { usersURL } from "../../api/API";

interface UserState {
  users: [];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  isLoading: false,
  error: null,
};



export const getUsers = createAsyncThunk("user/getUser", async () => {
  const response = await axios.get(usersURL);
  return response.data;
});


export const createUser = createAsyncThunk('user/createUser', async (newUserData) => {
  console.log(newUserData);
  
  try {
    const response = await axios.post(usersURL, newUserData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

export const updateUser = createAsyncThunk("user/updateUser", async (user) => {
  const response = await axios.put(usersURL, user);
  return response.data;
});

export const deleteUser = createAsyncThunk("user/deleteUser", async (user) => {
  const response = await axios.delete(usersURL, user);
  return response.data;
});




const user = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.users = action.payload;
      state.isLoading = false;
      state.error = null;
    })
    builder.addCase(getUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || null;
    })
    .addCase(createUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(createUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
    })
    .addCase(createUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    })
  },
});

export default user.reducer;
