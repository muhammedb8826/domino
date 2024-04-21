import axios from "axios";
import { stockURL } from "../api/API";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    stock: [],
    singleStock: {},
    isLoading: false,
    error: null,
}

export const getStock = createAsyncThunk("stock/getStock", async () => {
    try {
        const response = await axios.get(stockURL);
        return response.data;
    } catch (error) {
        console.error("Error fetching stock:", error);
        throw error;
    }
});

export const getStockById = createAsyncThunk("stock/getStockById", async (stockId) => {
    try {
        const response = await axios.get(`${stockURL}/${stockId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching stock by id:", error);
        throw error;
    }
});

export const createStock = createAsyncThunk("stock/createStock", async (stockData) => {
    try {
        const response = await axios.post(stockURL, stockData);
        return response.data;
    } catch (error) {
        console.error("Error creating stock:", error);
        throw error;
    }
});

export const updateStock = createAsyncThunk("stock/updateStock", async (stockData) => {
    try {
        const response = await axios.put(`${stockURL}/${stockData.id}`, stockData);
        return response.data;
    } catch (error) {
        console.error("Error updating stock:", error);
        throw error;
    }
});

export const deleteStock = createAsyncThunk("stock/deleteStock", async (stockId) => {
    try {
        const response = await axios.delete(`${stockURL}/${stockId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting stock:", error);
        throw error;
    }
});

const stockSlice = createSlice({
    name: "stock",
    initialState,
    reducers: {},
    extraReducers:  (builder) => {
        builder.addCase(getStock.pending, (state)=>{
            state.isLoading = true;
        });
        builder.addCase(getStock.fulfilled, (state, {payload})=>{
            state.stock = payload;
            state.isLoading = false;
        });
        builder.addCase(getStock.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(getStockById.pending, (state)=>{
            state.isLoading = true;
        });
        builder.addCase(getStockById.fulfilled, (state, {payload})=>{
            state.singleStock = payload;
            state.isLoading = false;
        });
        builder.addCase(getStockById.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(createStock.pending, (state)=>{
            state.isLoading = true;
        });
        builder.addCase(createStock.fulfilled, (state, {payload})=>{
            state.stock.push(payload);
            state.isLoading = false;
        });
        builder.addCase(createStock.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(updateStock.pending, (state)=>{
            state.isLoading = true;
        });
        builder.addCase(updateStock.fulfilled, (state, {payload})=>{
            state.stock = state.stock.map(stock => stock.id === payload.id ? payload : stock);
            state.isLoading = false;
        });
        builder.addCase(updateStock.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(deleteStock.pending, (state)=>{
            state.isLoading = true;
        });
        builder.addCase(deleteStock.fulfilled, (state, {payload})=>{
            state.stock = state.stock.filter(stock => stock.id !== payload.id);
            state.isLoading = false;
        });
        builder.addCase(deleteStock.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.error.message;
        });
    }
});

export default stockSlice.reducer;