import axios from "axios";
import { suppliersURL } from "@/redux/api/API";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    suppliers: [],
    isLoading: false,
    error: null,
}

export const getSuppliers = createAsyncThunk("supplier/getSuppliers", async () => {
    try {
        const response = await axios.get(suppliersURL);
        return response.data;
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        throw error;
    }
});

export const createSupplier = createAsyncThunk("supplier/createSupplier", async (supplierData) => {
    try {
        const response = await axios.post(suppliersURL, supplierData);
        return response.data;
    } catch (error) {
        console.error("Error creating supplier:", error);
        throw error;
    }
});

export const updateSupplier = createAsyncThunk("supplier/updateSupplier", async (supplierData) => {
    try {
        const response = await axios.put(`${suppliersURL}/${supplierData.id}`, supplierData);
        return response.data;
    } catch (error) {
        console.error("Error updating supplier:", error);
        throw error;
    }
});

export const deleteSupplier = createAsyncThunk("supplier/deleteSupplier", async (supplierId) => {
    try {
        const response = await axios.delete(`${suppliersURL}/${supplierId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting supplier:", error);
        throw error;
    }
});

export const suppliersSlice = createSlice({
    name: "supplier",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSuppliers.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getSuppliers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.suppliers = action.payload;
        });
        builder.addCase(getSuppliers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(createSupplier.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createSupplier.fulfilled, (state, action) => {
            state.suppliers.push(action.payload);
        });
        builder.addCase(createSupplier.rejected, (state, action) => {
            state.error = action.error.message;
        });
        builder.addCase(updateSupplier.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateSupplier.fulfilled, (state, action) => {
            state.suppliers = state.suppliers.map((supplier) => supplier.id === action.payload.id ? action.payload : supplier);
        });
        builder.addCase(updateSupplier.rejected, (state, action) => {
            state.error = action.error.message;
        });
        builder.addCase(deleteSupplier.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deleteSupplier.fulfilled, (state, action) => {
            state.suppliers = state.suppliers.filter((supplier) => supplier.id !== action.payload.id);
        });
        builder.addCase(deleteSupplier.rejected, (state, action) => {
            state.error = action.error.message;
        });
    }
});

export default suppliersSlice.reducer;