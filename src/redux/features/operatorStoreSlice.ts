import axios from "axios";
import { operatorStoreURL } from "../api/API";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    operatorStore: [],
    singleOperatorStore: {},
    isLoading: false,
    error: null,
}

export const getOPeratorStore = createAsyncThunk("stock/getStock", async () => {
    try {
        const response = await axios.get(operatorStoreURL);
        return response.data;
    } catch (error) {
        console.error("Error fetching stock:", error);
        throw error;
    }
});

export const getOPeratorStoreById = createAsyncThunk("stock/getStockById", async (stockId) => {
    try {
        const response = await axios.get(`${operatorStoreURL}/${stockId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching stock by id:", error);
        throw error;
    }
});

export const createOperatorStore = createAsyncThunk("stock/createStock", async (stockData) => {
    try {
        const response = await axios.post(operatorStoreURL, stockData);
        return response.data;
    } catch (error) {
        console.error("Error creating stock:", error);
        throw error;
    }
});

export const updateOperatorStore = createAsyncThunk("stock/updateStock", async (stockData) => {
    try {
        const response = await axios.put(`${operatorStoreURL}/${stockData.id}`, stockData);
        return response.data;
    } catch (error) {
        console.error("Error updating stock:", error);
        throw error;
    }
});

export const deleteOperatorStock = createAsyncThunk("stock/deleteStock", async (stockId) => {
    try {
        const response = await axios.delete(`${operatorStoreURL}/${stockId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting stock:", error);
        throw error;
    }
});

const operatorStoreSlice = createSlice({
    name: "stock",
    initialState,
    reducers: {},
    extraReducers:  (builder) => {
        builder.addCase(getOPeratorStore.pending, (state)=>{
            state.isLoading = true;
        });
        builder.addCase(getOPeratorStore.fulfilled, (state, {payload})=>{
            state.operatorStore = payload;
            state.isLoading = false;
        });
        builder.addCase(getOPeratorStore.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(getOPeratorStoreById.pending, (state)=>{
            state.isLoading = true;
        });
        builder.addCase(getOPeratorStoreById.fulfilled, (state, {payload})=>{
            state.singleOperatorStore = payload;
            state.isLoading = false;
        });
        builder.addCase(getOPeratorStoreById.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(createOperatorStore.pending, (state)=>{
            state.isLoading = true;
        });
        builder.addCase(createOperatorStore.fulfilled, (state, {payload})=>{
            state.operatorStore.push(payload);
            state.isLoading = false;
        });
        builder.addCase(createOperatorStore.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(updateOperatorStore.pending, (state)=>{
            state.isLoading = true;
        });
        builder.addCase(updateOperatorStore.fulfilled, (state, {payload})=>{
            state.operatorStore = state.operatorStore.map(stock => stock.id === payload.id ? payload : stock);
            state.isLoading = false;
        });
        builder.addCase(updateOperatorStore.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(deleteOperatorStock.pending, (state)=>{
            state.isLoading = true;
        });
        builder.addCase(deleteOperatorStock.fulfilled, (state, {payload})=>{
            state.operatorStore = state.operatorStore.filter(stock => stock.id !== payload.id);
            state.isLoading = false;
        });
        builder.addCase(deleteOperatorStock.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.error.message;
        });
    }
});

export default operatorStoreSlice.reducer;