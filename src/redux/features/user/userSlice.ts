import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { usersURL } from "../../api/API";
import { selectToken } from "./authentication";

interface UserState {
  users: [];
  isLoading: boolean;
  token: string | null;
  error: string | null;
  message: string | null;
  errors: string[] | null;
}

const initialState: UserState = {
  users: [],
  isLoading: false,
  token: localStorage.getItem("token") || null,
  error: null,
  errors:[],
  message: null

};



export const getUsers = createAsyncThunk("user/getUser", async (_, { getState }) => {
  const token = selectToken(getState()); // Pass the state as the first argument
  try {
    const response = await axios.get(usersURL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // Re-throw the error so that it can be caught in the rejected case
  }
});


export const createUser = createAsyncThunk('user/createUser', async (newUserData, { rejectWithValue }) => {
  const token = localStorage.getItem("token") || null;
  
  try {
    const response = await axios.post(usersURL, newUserData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return the created user data
  } catch (error) {
    return rejectWithValue(error.response?.data);
    // Re-throw the error so that it can be caught in the rejected case
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
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getUsers.fulfilled, (state, action) => {
      // const {data} = ;
       state.users =action.payload ;
      state.isLoading = false;
      state.error = null;
    })
    builder.addCase(getUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || null;
    })
    builder.addCase(createUser.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.isLoading = false;
      // const data = action.payload;
      const {data, message} = action.payload
      console.log(data,message);
      state.message = message;
      
      [...state.users, data];
    })
    builder.addCase(createUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message || null;
      state.errors = action.payload.errors || null;
    })
  },
});

export const { setToken } = user.actions;
export default user.reducer;

