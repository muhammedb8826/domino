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
  message: null,
  registrationErrors: {},

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


export const createUser = createAsyncThunk('user/createUser', async (newUserData, { getState, rejectWithValue }) => {
  const token = selectToken(getState());
  
  try {
    const response = await axios.post(usersURL, newUserData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return the created user data
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

export const updateUser = createAsyncThunk("user/updateUser", async (user) => {
  
  const response = await axios.put(usersURL, user);
  return response.data;
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (id, { getState, rejectWithValue }) => { 
  try {
    const token = selectToken(getState());
    const response = await axios.delete(`${usersURL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data+"response");
    
    return id;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // Handle 404 Not Found error
      console.error('User not found:', error.response.data);
      return rejectWithValue('User not found');
    } else {
      // Handle other errors
      console.error('Error deleting user:', error.message);
      throw error;
    }
  }
});




const user = createSlice({
  name: "users",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearSuccessMessage: (state) => {
      state.message = null;
      state.errors = [];
      state.registrationErrors = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getUsers.fulfilled, (state, action) => {
       state.users =action.payload.data;
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
      const { data, message } = action.payload;
      state.message = message;
      state.users.unshift(data);
    })
    builder.addCase(createUser.rejected, (state, action) => {
      state.isLoading = false;  
      state.registrationErrors = action.payload || null;
      state.errors = action.payload.errors || null;
    })
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false;
      const data = action.payload;
      state.users = state.users.map((user) => {
        if (user.id === data.id) {
          return data;
        }
        return user;
      });
    })
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || null;
    })
    builder.addCase(deleteUser.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.isLoading = false; 
      
      state.users = state.users.filter((user) => user.id !== action.payload);
    })
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || null;
    })
  },
});

export const { setToken } = user.actions;
export const { clearSuccessMessage } = user.actions;
export default user.reducer;

