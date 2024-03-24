import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { roleURL } from "../../api/API";

interface RoleState {
  roles: [];
  isLoading: boolean;
  error: string | null;
  message: string | null;
  errors: string[] | null;
}

const initialState: RoleState = {
  roles: [],
  isLoading: false,
  error: null,
  errors: [],
  message: null,
};

export const getRoles = createAsyncThunk("role/getRoles", async () => {
  try {
    const response = await axios.get(roleURL);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
});

export const createRoles = createAsyncThunk(
  "role/createRoles",
  async (newRoleData, { rejectWithValue }) => {
    try {
      const response = await axios.post(roleURL, newRoleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateRoles = createAsyncThunk(
  "role/updateRoles",
  async (role) => {
    try {
      const response = await axios.put(`${roleURL}/${role.id}`, role);
      return response.data;
    } catch (error) {
      console.error("Error updating role:", error);
      throw error;
    }
  }
);

export const deleteRoles = createAsyncThunk(
  "role/deleteRoles",
  async (id: string) => {
    try {
      const response = await axios.delete(`${roleURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting role:", error);
      throw error;
    }
  }
);

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRoles.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getRoles.fulfilled, (state, action) => {
      state.roles = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getRoles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "something went wrong";
    });

    builder.addCase(createRoles.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createRoles.fulfilled, (state, action) => {
      state.roles = [...state.roles, action.payload];
      state.isLoading = false;
    });
    builder.addCase(createRoles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "something went wrong";
    });

    builder.addCase(updateRoles.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateRoles.fulfilled, (state, action) => {
      state.roles = state.roles.map((role: any) =>
        role.id === action.payload.id ? action.payload : role
      );
      state.isLoading = false;
    });
    builder.addCase(updateRoles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "something went wrong";
    });

    builder.addCase(deleteRoles.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteRoles.fulfilled, (state, action) => {
      state.roles = state.roles.filter(
        (role: any) => role.id !== action.payload.id
      );
      state.isLoading = false;
    });
    builder.addCase(deleteRoles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "something went wrong";
    });
  },
});

export default roleSlice.reducer;

