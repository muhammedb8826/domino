import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { commissionURL } from "../../api/API";

interface CustomerState {
  commissions: [];
  singleCommission: null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  commissions: [],
  singleCommission: null,
  isLoading: false,
  error: null,
};

export const getCommissions = createAsyncThunk(
  "commission/getCommissions",
  async () => {
    try {
      const response = await axios.get(commissionURL);
      return response.data;
    } catch (error) {
      console.error("Error fetching commissions:", error);
      throw error;
    }
  }
);

export const updateCommission = createAsyncThunk(
  "commission/updateCommission",
  async (transactions) => {
    try {
      const response = await axios.put(
        `${commissionURL}/${transactions.id}`,
        transactions
      );
      return response.data;
    } catch (error) {
      console.error("Error updating commission transaction:", error);
      throw error;
    }
  }
);

export const getCommissionById = createAsyncThunk(
  "commission/getCommissionById",
  async (id: string) => {
    try {
      const response = await axios.get(`${commissionURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching commission by id:", error);
      throw error;
    }
  }
);

export const createCommission = createAsyncThunk(
  "commission/createCommission",
  async (customerData) => {
    try {
      const response = await axios.post(commissionURL, customerData);
      return response.data;
    } catch (error) {
      console.error("Error registering commission:", error);
      throw error;
    }
  }
);

export const deletCommission = createAsyncThunk(
  "commission/deleteCommission",
  async (id: string) => {
    try {
      const response = await axios.delete(`${commissionURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting commission:", error);
      throw error;
    }
  }
);

export const commissionSlice = createSlice({
  name: "commission",
  initialState,
  reducers: {},
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
    builder.addCase(createCommission.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createCommission.fulfilled, (state, action) => {
      state.isLoading = false;
      const data = action.payload;
      state.commissions = [...state.commissions, data];
    });
    builder.addCase(createCommission.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? null;
    });
    builder.addCase(updateCommission.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateCommission.fulfilled, (state, action) => {
      state.isLoading = false;
      state.commissions = state.commissions.map((commission) => {
        if (commission.id === action.payload.id) {
          return action.payload;
        }
        return commission;
      });
    });
    builder.addCase(updateCommission.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? null;
    });
    builder.addCase(deletCommission.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deletCommission.fulfilled, (state, action) => {
      state.isLoading = false;
      state.commissions = state.commissions.filter(
        (commission) => commission.id !== action.payload.id
      );
    });
    builder.addCase(deletCommission.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? null;
    });
  },
});

export default commissionSlice.reducer;
