import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { discountURL } from "../../api/API";

const initialState = {
    discounts: [],
    isLoading: false,
    error: "",
}

export const getDiscounts = createAsyncThunk(
    "discounts/getDiscounts",
    async () => {
        try{
        const response = await axios.get(discountURL);
        return response.data;
        } catch (error) {
            console.log(error);
            throw error
        }
    }
);

export const createDiscounts = createAsyncThunk(
    "discounts/createDiscounts",
    async (data) => {
        console.log(data);
        
        const response = await axios.post(discountURL, data);
        return response.data;
    }
);

export const updateDiscounts = createAsyncThunk(
    "discounts/updateDiscounts",
    async (data) => {
        const response = await axios.put(`${discountURL}/${data.id}`, data);
        return response.data;
    }
);

export const deleteDiscounts = createAsyncThunk(
    "discounts/deleteDiscounts",
    async (id: string) => {
        const response = await axios.delete(`${discountURL}/${id}`);
        return response.data;
    }
);

const discountSlice = createSlice({
    name: "discounts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getDiscounts.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(getDiscounts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.discounts = action.payload;
        });
        builder.addCase(getDiscounts.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(createDiscounts.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(createDiscounts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.discounts.push(action.payload);
        });
        builder.addCase(createDiscounts.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(updateDiscounts.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(updateDiscounts.fulfilled, (state, action) => {
            state.isLoading = false;
            const index = state.discounts.findIndex((discount) => discount.id === action.payload.id);
            state.discounts[index] = action.payload;
        });
        builder.addCase(updateDiscounts.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(deleteDiscounts.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(deleteDiscounts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.discounts = state.discounts.filter((discount) => discount.id !== action.meta.arg);
        });
        builder.addCase(deleteDiscounts.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
    },
});

export default discountSlice.reducer;
