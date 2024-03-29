import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { orderStatusURL, orderURL } from "../../api/API";

console.log(orderURL);


interface OrderState {
  orders: [];
  singleOrder:{},
  orderStatus: [];
  isLoading: boolean;
  error: string | null;
  message: string | null;
  errors: string[] | null;
}

const initialState: OrderState = {
  orders: [],
  orderStatus: [],
  singleOrder:{},
  isLoading: false,
  error: null,
  errors: [],
  message: null,
};

export const getOrdersById = createAsyncThunk(
  "order/getOrdersById",
  async (orderId) => {
    try {
      const response = await axios.get(`${orderURL}/${orderId}`);     
      return response.data;  // Return the response.data
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }
);

export const getOrderStatus = createAsyncThunk(
  "order/getOrderStatus",
  async () => {
    try {
      const response = await axios.get(`${orderStatusURL}`);     
      return response.data;  // Return the response.data
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }
);

export const getOrderStatusById = createAsyncThunk(
  "order/getOrderStatusById",
  async (orderStatusId) => {
    try {
      const response = await axios.get(`${orderStatusURL}/${orderStatusId}`);     
      return response.data;  // Return the response.data
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }
);

export const createOrderStatus = createAsyncThunk(
  "order/createOrderStatus",
  async (orderStatusData) => {
    try {
      const response = await axios.post(orderStatusURL, orderStatusData);
      return response.data;
    } catch (error) {
      console.error("Error creating order status:", error);
      throw error;
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async (orderStatusData) => {
    try {
      const response = await axios.put(`${orderStatusURL}/${orderStatusData.id}`, orderStatusData);
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }
);

export const deleteOrderStatus = createAsyncThunk(
  "order/deleteOrderStatus",
  async (orderStatusId) => {
    try {
      const response = await axios.delete(`${orderStatusURL}/${orderStatusId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting order status:", error);
      throw error;
    }
  }
);

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
      console.log(response.data+"response");
      
      return orderId;
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
    builder.addCase(getOrders.pending, (state) => {
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
    builder.addCase(createOrder.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = [action.payload,...state.orders];
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateOrder.pending, (state) => {
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
    builder.addCase(deleteOrder.pending, (state) => {
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
    builder.addCase(getOrdersById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrdersById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.singleOrder = action.payload;
    });
    builder.addCase(getOrdersById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(getOrderStatus.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrderStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orderStatus = action.payload;
    });
    builder.addCase(getOrderStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(getOrderStatusById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrderStatusById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.singleOrder = action.payload;
    });
    builder.addCase(getOrderStatusById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(createOrderStatus.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createOrderStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orderStatus = [action.payload,...state.orderStatus];
    });
    builder.addCase(createOrderStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateOrderStatus.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orderStatus = state.orderStatus.map((orderStatus) =>
        orderStatus.id === action.payload.id ? action.payload : orderStatus
      );
    });
    builder.addCase(updateOrderStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(deleteOrderStatus.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteOrderStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orderStatus = state.orderStatus.filter(
        (orderStatus) => orderStatus.id !== action.payload
      );
    });
    builder.addCase(deleteOrderStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export default orderSlice.reducer;