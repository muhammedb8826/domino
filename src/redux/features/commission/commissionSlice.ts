import { commissionTransactionURL } from './../../api/API';
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { commissionURL } from "../../api/API";

interface CustomerState {
  commissions: [];
  singleCommission: null ;
  commissionTransactions: [];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
}

const initialState: CustomerState = {
    commissions: [],
    singleCommission: null,
    commissionTransactions: [],
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

export const getCommissionTransactions = createAsyncThunk("commission/getCommissionTransactions", async () => {
  try {
    const response = await axios.get(commissionTransactionURL);
    return response.data;
  } catch (error) {
    console.error("Error fetching commission transactions:", error);
    throw error;
  }
});

export const createCommissionTransaction = createAsyncThunk("commission/createCommissionTransaction", async (transactionData)=> {
  try {
    const response = await axios.post(commissionTransactionURL, transactionData);
    return response.data;
  } catch (error) {
    console.error("Error creating commission transaction:", error);
    throw error;
  }
});

export const updateCommissionTranscation = createAsyncThunk("commission/updateCommissionTransaction", async (transactionData)=> {
  try {
    const response = await axios.put(`${commissionTransactionURL}/${transactionData.id}`, transactionData);
    return response.data;
  } catch (error) {
    console.error("Error updating commission transaction:", error);
    throw error;
  }
});

export const updateCommission = createAsyncThunk("commission/updateCommission", async (transactions)=> {
  try {
    const response = await axios.put(`${commissionURL}/${transactions.id}`, transactions);
    return response.data;
  } catch (error) {
    console.error("Error updating commission transaction:", error);
    throw error;
  }
});


export const getCommissionById = createAsyncThunk("commission/getCommissionById", async (id: string) => {
  try {
    const response = await axios.get(`${commissionURL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching commission by id:", error);
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
    builder.addCase(getCommissionById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCommissionById.fulfilled, (state, action) => {
      state.singleCommission = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getCommissionById.rejected, (state, action) => {
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
    builder.addCase(updateCommission.pending, (state, action)=>{
      state.isLoading = true;
      state.error = null;
    })
    builder.addCase(updateCommission.fulfilled, (state, action)=>{
      state.isLoading = false;
      const index = state.commissions.findIndex((commission)=> commission.id === action.payload.id);
      state.commissions[index] = action.payload
    })
    builder.addCase(updateCommission.rejected, (state, action)=>{
      state.isLoading = false;
      state.error = action.error.message ?? null
    })
    builder.addCase(getCommissionTransactions.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCommissionTransactions.fulfilled, (state, action) => {
      state.commissionTransactions = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getCommissionTransactions.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? null;
    });
    builder.addCase(createCommissionTransaction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createCommissionTransaction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(createCommissionTransaction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? null;
    });
    builder.addCase(updateCommissionTranscation.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateCommissionTranscation.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.commissionTransactions.findIndex((transaction) => transaction.id === action.payload.id);
      state.commissionTransactions[index] = action.payload;
    });
    builder.addCase(updateCommissionTranscation.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? null;
    });
  },
});

export default commissionSlice.reducer;
export const { searchUsers } = commissionSlice.actions;
