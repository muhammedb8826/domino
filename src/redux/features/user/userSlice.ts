import { getRoles } from './../role/roleSlice';
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { usersURL } from "../../api/API";
import api from "../../api/apiUtils";

interface UserState {
  users: [];
  isLoading: boolean;
  token: string | null;
  error: string | null;
  message: string | null;
  errors: string[] | null;
  registrationErrors: {} | null;
  roles: string;
  user: null;
}

const initialState: UserState = {
  users: [],
  user: null,
  isLoading: false,
  token: localStorage.getItem("token") || null,
  error: null,
  errors:[],
  message: null,
  registrationErrors: {},
 roles: "",
};

export const getUsers = createAsyncThunk("user/getUsers", async (_, { getState }) => {
  try {
    const { token } = getState().auth; // Access token from Redux state
    const response = await api.get("/users", { token });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});

export const setTokenUser = createAsyncThunk('auth/setToken', async (_, { getState }) => {
  try {
    const { token } = getState().auth; 
  const response = await api.get('/user', { token });
  const user = response.data;
console.log(user+"user");

  // Return token and user details
  return { token, user };
} catch (error) {
  console.error("Error fetching user:", error);
  throw error;
}
});

export const getRoles = createAsyncThunk("user/getRoles", async (_, { getState }) => {
  try {
    const { token } = getState().auth; // Access token from Redux state
    const response = await api.get("/roles", { token });
    console.log(response.data+"response");
    return response.data;
    
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
});

export const createUser = createAsyncThunk('user/createUser', async (newUserData, { getState, rejectWithValue }) => {
  const { token } = getState().auth;
  try {
    const response = await api.post(usersURL, newUserData, { token });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

export const updateUser = createAsyncThunk("user/updateUser", async (user, {getState, rejectWithValue}) => {
 const {token} = getState().auth;
 try {
  const response = await api.put(usersURL, user, { token});
  return response.data;
 } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (id, { getState, rejectWithValue }) => { 
  try {
    const {token} = getState().auth
    const response = await api.delete(`${usersURL}/${id}`, { token });
    console.log(response.data+"response");
    return id;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.error('User not found:', error.response.data);
      return rejectWithValue('User not found');
    } else {
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
       console.log(JSON.stringify(action.payload.data));
       
      state.isLoading = false;
      state.error = null;
    })
    builder.addCase(getUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || null;
    })
    
    builder.addCase(getRoles.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getRoles.fulfilled, (state, action) => {
      state.roles = action.payload;
      state.isLoading = false;
      state.error = null;
    })
    builder.addCase(getRoles.rejected, (state, action) => {
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
    builder.addCase(setTokenUser.fulfilled, (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user; // Add user details to the state
    });
  },
});

export const { setToken, clearSuccessMessage } = user.actions;
export default user.reducer;

