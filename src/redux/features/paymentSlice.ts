import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { paymentURL } from "../api/API";

interface PaymentState {
  payments: [];
  singlePayment: null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  singlePayment: null,
  isLoading: false,
  error: null,
};

export const getPayments = createAsyncThunk("payment/getPayments", async () => {
  try {
    const response = await axios.get(paymentURL);
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
});

export const createPayment = createAsyncThunk("payment/createPayment", async (paymentData) => {
  try {
    const response = await axios.post(paymentURL, paymentData);
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
});

export const updatePayment = createAsyncThunk("payment/updatePayment", async (paymentData) => {
  try {
    const response = await axios.put(`${paymentURL}/${paymentData.id}`, paymentData);
    return response.data;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
});

export const deletePayment = createAsyncThunk("payment/deletePayment", async (paymentId) => {
  try {
    const response = await axios.delete(`${paymentURL}/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
});

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPayments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.payments = action.payload;
        state.isLoading = false;
      })
      .addCase(getPayments.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })
      .addCase(createPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payments.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })
      .addCase(updatePayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.payments = state.payments.map((payment) =>
          payment.id === action.payload.id ? action.payload : payment
        );
        state.isLoading = false;
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })
      .addCase(deletePayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter((payment) => payment.id !== action.payload);
        state.isLoading = false;
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      });
  },
});

export default paymentSlice.reducer;