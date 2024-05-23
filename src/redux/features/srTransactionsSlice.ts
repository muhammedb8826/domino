import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { srTransactionsURL } from "../api/API";

const initialState = {
    srTransactions: [],
    singleSRTransaction: {},
    isLoading: false,
    error: null,
}

export const getSrTransactions = createAsyncThunk("srTransactions/getSrTransactions", async () => {
    try {
        const response = await axios.get(srTransactionsURL);
        return response.data;
    } catch (error) {
        console.error("Error fetching printed transactions:", error);
        throw error;
    }
});

export const getSRTransactionById = createAsyncThunk("srTransactions/getSRTransactionById", async (printedTransactionId) => {
    try {
        const response = await axios.get(`${srTransactionsURL}/${printedTransactionId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching printed transaction by id:", error);
        throw error;
    }
});

export const createSRTransaction = createAsyncThunk("srTransactions/createSRTransaction", async (printedTransactionData) => {
    try {
        const response = await axios.post(srTransactionsURL, printedTransactionData);
        return response.data;
    } catch (error) {
        console.error("Error creating printed transaction:", error);
        throw error;
    }
});

export const updateSRTransaction = createAsyncThunk("srTransactions/updateSRTransaction", async (printedTransactionData) => {
    try {
        const response = await axios.put(`${srTransactionsURL}/${printedTransactionData.id}`, printedTransactionData);
        return response.data;
    } catch (error) {
        console.error("Error updating printed transaction:", error);
        throw error;
    }
});

export const deleteSRTransaction = createAsyncThunk("srTransactions/deleteSRTransaction", async (printedTransactionId) => {
    try {
        const response = await axios.delete(`${srTransactionsURL}/${printedTransactionId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting printed transaction:", error);
        throw error;
    }
});

export const srTransactionsSlice = createSlice({
    name: "srTransactions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSrTransactions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getSrTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.srTransactions = action.payload;
            })
            .addCase(getSrTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(getSRTransactionById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getSRTransactionById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.singleSRTransaction = action.payload;
            })
            .addCase(getSRTransactionById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(createSRTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createSRTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.srTransactions.push(action.payload);
            })
            .addCase(createSRTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(updateSRTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateSRTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.srTransactions = state.srTransactions.map((printedTransaction) => {
                    if (printedTransaction.id === action.payload.id) {
                        return action.payload;
                    }
                    return printedTransaction;
                });
            })
            .addCase(updateSRTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(deleteSRTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteSRTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.srTransactions = state.srTransactions.filter((printedTransaction) => printedTransaction.id !== action.payload.id);
            })
            .addCase(deleteSRTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
});

export default srTransactionsSlice.reducer;