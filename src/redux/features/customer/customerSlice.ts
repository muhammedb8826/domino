import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { customerURL } from "../../api/API";

interface CustomerState {
  customers: [];
  isLoading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  isLoading: false,
  error: null,
};

export const getCustomers = createAsyncThunk("customer/getCustomers", async () => {
  try {
    const response = await axios.get(customerURL);
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
});

export const createCustomer = createAsyncThunk("customer/createCustomer", async (customerData)=>{
  try {
    const response = await axios.post(customerURL, customerData);
    return response.data;
  } catch (error) {
    console.error("Error registering customer:", error);
    throw error;
  }
})

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCustomers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCustomers.fulfilled, (state, action) => {
      state.customers = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getCustomers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? null;
    });
    builder.addCase(createCustomer.pending, (state, action)=>{
      state.isLoading = true;
      state.error = null;
    })
    builder.addCase(createCustomer.fulfilled, (state, action)=>{
      state.isLoading = false;
      const data = action.payload;
      state.customers = [...state.customers, data]
    })
    builder.addCase(createCustomer.rejected, (state, action)=>{
      state.isLoading = false;
      state.error = action.error.message ?? null
    })
  },
});

export default customerSlice.reducer;