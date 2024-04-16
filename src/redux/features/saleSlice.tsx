import axios from "axios";
import { salesURL } from "../api/API";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    sales: [],
    singleSale: {},
    isLoading: false,
    error: null,
};

export const getSales = createAsyncThunk("sales/getSales", async () => {
    try {
        const response = await axios.get(salesURL);
        return response.data;
    } catch (error) {
        console.error("Error fetching sales:", error);
        throw error;
    }
});

export const getSaleById = createAsyncThunk("sales/getSaleById", async (saleId) => {
    console.log(saleId);
    
    try {
        const response = await axios.get(`${salesURL}/${saleId}`);
        console.log(response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error fetching sale by id:", error);
        throw error;
    }
});

export const createSale = createAsyncThunk("sales/createSale", async (saleData) => {
    try {
        const response = await axios.post(salesURL, saleData);
        return response.data;
    } catch (error) {
        console.error("Error creating sale:", error);
        throw error;
    }
});

export const updateSale = createAsyncThunk("sales/updateSale", async (saleData) => {
    try {
        const response = await axios.put(`${salesURL}/${saleData.id}`, saleData);
        return response.data;
    } catch (error) {
        console.error("Error updating sale:", error);
        throw error;
    }
});

export const deleteSale = createAsyncThunk("sales/deleteSale", async (saleId) => {
    try {
        const response = await axios.delete(`${salesURL}/${saleId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting sale:", error);
        throw error;
    }
});

export const salesSlice = createSlice({
    name: "sales",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSales.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getSales.fulfilled, (state, action) => {
            state.sales = action.payload;
            state.isLoading = false;
        });
        builder.addCase(getSales.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
        builder.addCase(getSaleById.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getSaleById.fulfilled, (state, action) => {
            state.singleSale = action.payload;
            state.isLoading = false;
        });
        builder.addCase(getSaleById.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
        builder.addCase(createSale.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createSale.fulfilled, (state, action) => {
            state.sales.push(action.payload);
            state.isLoading = false;
        });
        builder.addCase(createSale.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
        builder.addCase(updateSale.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateSale.fulfilled, (state, action) => {
            const index = state.sales.findIndex((sale) => sale.id === action.payload.id);
            state.sales[index] = action.payload;
            state.isLoading = false;
        });
        builder.addCase(updateSale.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
        builder.addCase(deleteSale.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteSale.fulfilled, (state, action) => {
            state.isLoading = false;
            state.sales = state.sales.filter((sale) => sale.id !== action.payload.id);
        });
        builder.addCase(deleteSale.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
    },
});

export default salesSlice.reducer;