import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { purchasesURL } from "../api/API";


const initialState = {
    purchases: [],
    singlePurchase: {},
    isLoading: false,
    error: null,
}

export const getPurchases = createAsyncThunk("purchase/getPurchases", async () => {
    try {
        const response = await axios.get(purchasesURL);
        return response.data;
    } catch (error) {
        console.error("Error fetching purchases:", error);
        throw error;
    }
});

export const getPurchasesById = createAsyncThunk("purchase/getPurchasesById", async (purchaseId) => {
    try {
        const response = await axios.get(`${purchasesURL}/${purchaseId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching purchase by id:", error);
        throw error;
    }
});

export const createPurchase = createAsyncThunk("purchase/createPurchase", async (purchaseData) => {
    try {
        const response = await axios.post(purchasesURL, purchaseData);
        return response.data;
    } catch (error) {
        console.error("Error creating purchase:", error);
        throw error;
    }
});

export const updatePurchase = createAsyncThunk("purchase/updatePurchase", async (purchaseData) => {
    try {
        const response = await axios.put(`${purchasesURL}/${purchaseData.id}`, purchaseData);
        return response.data;
    } catch (error) {
        console.error("Error updating purchase:", error);
        throw error;
    }
});

export const deletePurchase = createAsyncThunk("purchase/deletePurchase", async (purchaseId) => {
    try {
        const response = await axios.delete(`${purchasesURL}/${purchaseId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting purchase:", error);
        throw error;
    }
});

export const purchasesSlice = createSlice({
    name: "purchase",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getPurchases.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getPurchases.fulfilled, (state, action) => {
            state.isLoading = false;
            state.purchases = action.payload;
        });
        builder.addCase(getPurchases.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(getPurchasesById.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getPurchasesById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.singlePurchase = action.payload;
        });
        builder.addCase(getPurchasesById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(createPurchase.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createPurchase.fulfilled, (state, action) => {
            state.isLoading = false;
            state.purchases.push(action.payload);
        });
        builder.addCase(createPurchase.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });

        builder.addCase(updatePurchase.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updatePurchase.fulfilled, (state, action) => {
            state.isLoading = false;
            state.purchases = state.purchases.map((purchase) => {
                if (purchase.id === action.payload.id) {
                    return action.payload;
                }
                return purchase;
            });
        });
        builder.addCase(updatePurchase.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });

        builder.addCase(deletePurchase.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deletePurchase.fulfilled, (state, action) => {
            state.isLoading = false;
            state.purchases = state.purchases.filter((purchase) => purchase.id !== action.payload.id);
        });
        builder.addCase(deletePurchase.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
    }
});

export default purchasesSlice.reducer;