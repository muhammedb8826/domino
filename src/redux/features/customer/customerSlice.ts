import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { customerURL } from "../../api/API";

interface CustomerState {
  customers: [];
  singleCustomer: null;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
}

const initialState: CustomerState = {
  customers: [],
  singleCustomer: null,
  isLoading: false,
  error: null,
  searchTerm: "",
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

export const updateCustomer = createAsyncThunk("customer/updateCustomer", async (customerData)=>{
  try {
    const response = await axios.put(`${customerURL}/${customerData.id}`, customerData);
    return response.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
})

export const deleteCustomer = createAsyncThunk("customer/deleteCustomer", async (id: string)=>{
  try {
    const response = await axios.delete(`${customerURL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
})


export const getCustomerById = createAsyncThunk("customer/getCustomerById", async (customerId: string) => {
  try {
    const response = await axios.get(`${customerURL}/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
});


export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    searchUsers: (state, action) => {
      const searchTerm = action.payload.toLowerCase();
      state.searchTerm = searchTerm;
    }
  },
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
    builder.addCase(updateCustomer.pending, (state, action)=>{
      state.isLoading = true;
      state.error = null;
    })
    builder.addCase(updateCustomer.fulfilled, (state, action)=>{
      state.isLoading = false;
      state.customers = state.customers.map((customer: any)=>{
        if(customer.id === action.payload.id){
          return action.payload
        }
        return customer
      })
    })
    builder.addCase(updateCustomer.rejected, (state, action)=>{
      state.isLoading = false;
      state.error = action.error.message ?? null
    })
    builder.addCase(deleteCustomer.pending, (state, action)=>{
      state.isLoading = true;
      state.error = null;
    })
    builder.addCase(deleteCustomer.fulfilled, (state, action)=>{
      state.isLoading = false;
      state.customers = state.customers.filter((customer: any)=> customer.id !== action.payload.id)
    })
    builder.addCase(deleteCustomer.rejected, (state, action)=>{
      state.isLoading = false;
      state.error = action.error.message ?? null
    })
    builder.addCase(getCustomerById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCustomerById.fulfilled, (state, action) => {
      state.singleCustomer = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getCustomerById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? null;
    });
  },
});

export default customerSlice.reducer;
export const { searchUsers } = customerSlice.actions;
