import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { orderURL } from "../../api/API";

interface OrderState {
  orders: [];
  isLoading: boolean;
  error: string | null;
  message: string | null;
  errors: string[] | null;
}

const initialState: OrderState = {
  orders: [],
  isLoading: false,
  error: null,
  errors: [],
  message: null,
};

export const getOrders = createAsyncThunk("order/getOrders", async () => {
  try {
    const response = await axios.get(orderURL);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
});

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (newOrderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(orderURL, newOrderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async (order) => {
    try {
      const response = await axios.put(`${orderURL}/${order.id}`, order);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (orderId) => {
    try {
      const response = await axios.delete(`${orderURL}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrders.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    });
    builder.addCase(getOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(createOrder.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = [...state.orders, action.payload];
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateOrder.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(updateOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = state.orders.map((order) =>
        order.id === action.payload.id ? action.payload : order
      );
    });
    builder.addCase(updateOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(deleteOrder.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(deleteOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload
      );
    });
    builder.addCase(deleteOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});
