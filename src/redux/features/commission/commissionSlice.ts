import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { commissionURL } from "../../api/API";

interface CustomerState {
  commissions: [];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
}

const initialState: CustomerState = {
    commissions: [],
  isLoading: false,
  error: null,
  searchTerm: "",
};

export const getCommissions = createAsyncThunk("commission/getCommissions", async () => {
  try {
    const response = await axios.get(commissionURL);
    return response.data;
  } catch (error) {
    console.error("Error fetching commissions:", error);
    throw error;
  }
});

export const createCommission = createAsyncThunk("commission/createCommission", async (customerData)=>{
  try {
    const response = await axios.post(commissionURL, customerData);
    return response.data;
  } catch (error) {
    console.error("Error registering commission:", error);
    throw error;
  }
})


export const commissionSlice = createSlice({
  name: "commission",
  initialState,
  reducers: {
    searchUsers: (state, action) => {
      const searchTerm = action.payload.toLowerCase();
      state.searchTerm = searchTerm;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getCommissions.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCommissions.fulfilled, (state, action) => {
      state.commissions = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getCommissions.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? null;
    });
    builder.addCase(createCommission.pending, (state, action)=>{
      state.isLoading = true;
      state.error = null;
    })
    builder.addCase(createCommission.fulfilled, (state, action)=>{
      state.isLoading = false;
      const data = action.payload;
      state.commissions = [...state.commissions, data]
    })
    builder.addCase(createCommission.rejected, (state, action)=>{
      state.isLoading = false;
      state.error = action.error.message ?? null
    })
  },
});

export default commissionSlice.reducer;
export const { searchUsers } = commissionSlice.actions;
