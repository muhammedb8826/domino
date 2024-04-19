import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { printedTransactionsURL } from "../api/API";

const initialState = {
    printedTransactions: [],
    singlePrintedTransaction: {},
    isLoading: false,
    error: null,
}

export const getPrintedTransactions = createAsyncThunk("printedTransaction/getPrintedTransactions", async () => {
    try {
        const response = await axios.get(printedTransactionsURL);
        return response.data;
    } catch (error) {
        console.error("Error fetching printed transactions:", error);
        throw error;
    }
});

export const getPrintedTransactionById = createAsyncThunk("printedTransaction/getPrintedTransactionById", async (printedTransactionId) => {
    try {
        const response = await axios.get(`${printedTransactionsURL}/${printedTransactionId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching printed transaction by id:", error);
        throw error;
    }
});

export const createPrintedTransaction = createAsyncThunk("printedTransaction/createPrintedTransaction", async (printedTransactionData) => {
    try {
        const response = await axios.post(printedTransactionsURL, printedTransactionData);
        return response.data;
    } catch (error) {
        console.error("Error creating printed transaction:", error);
        throw error;
    }
});

export const updatePrintedTransaction = createAsyncThunk("printedTransaction/updatePrintedTransaction", async (printedTransactionData) => {
    try {
        const response = await axios.put(`${printedTransactionsURL}/${printedTransactionData.id}`, printedTransactionData);
        return response.data;
    } catch (error) {
        console.error("Error updating printed transaction:", error);
        throw error;
    }
});

export const deletePrintedTransaction = createAsyncThunk("printedTransaction/deletePrintedTransaction", async (printedTransactionId) => {
    try {
        const response = await axios.delete(`${printedTransactionsURL}/${printedTransactionId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting printed transaction:", error);
        throw error;
    }
});

export const printedTransactionsSlice = createSlice({
    name: "printedTransaction",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPrintedTransactions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPrintedTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.printedTransactions = action.payload;
            })
            .addCase(getPrintedTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(getPrintedTransactionById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPrintedTransactionById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.singlePrintedTransaction = action.payload;
            })
            .addCase(getPrintedTransactionById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(createPrintedTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createPrintedTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.printedTransactions.push(action.payload);
            })
            .addCase(createPrintedTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(updatePrintedTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatePrintedTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.printedTransactions = state.printedTransactions.map((printedTransaction) => {
                    if (printedTransaction.id === action.payload.id) {
                        return action.payload;
                    }
                    return printedTransaction;
                });
            })
            .addCase(updatePrintedTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(deletePrintedTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deletePrintedTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.printedTransactions = state.printedTransactions.filter((printedTransaction) => printedTransaction.id !== action.payload.id);
            })
            .addCase(deletePrintedTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
});

export default printedTransactionsSlice.reducer;