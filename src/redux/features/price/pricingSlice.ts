import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { priceURL } from "../../api/API";


const initialState= {
    prices: [],
    isLoading: false,
    error: "",
}


export const getprice = createAsyncThunk(
    "price/getprice",
    async () => {
        try{
        const response = await axios.get(priceURL);
        return response.data;
        } catch (error) {
            console.log(error);
            throw error
        }
    }
);

export const createprice = createAsyncThunk(
    "prices/createPrice",
    async (data) => {
        const response = await axios.post(priceURL, data);
        return response.data;
    }
);

export const updateprice = createAsyncThunk(
    "prices/updatePrice",
    async (data) => {
        const response = await axios.put(`${priceURL}/${data.id}`, data);
        return response.data;
    }
);

export const deleteprice = createAsyncThunk(
    "prices/deletePrice",
    async (id: string) => {
        const response = await axios.delete(`${priceURL}/${id}`);
        return response.data;
    }
);

const priceSlice = createSlice({
    name: "prices",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getprice.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(getprice.fulfilled, (state, action) => {
            state.isLoading = false;
            state.prices = action.payload;
        });
        builder.addCase(getprice.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(createprice.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(createprice.fulfilled, (state, action) => {
            state.isLoading = false;
            state.prices.push(action.payload);
        });
        builder.addCase(createprice.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(updateprice.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(updateprice.fulfilled, (state, action) => {
            state.isLoading = false;
            state.prices = state.prices.map((price) => {
                if (price.id === action.payload.id) {
                    return action.payload;
                }
                return price;
            });
        });
        builder.addCase(updateprice.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(deleteprice.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(deleteprice.fulfilled, (state, action) => {
            state.isLoading = false;
            state.prices = state.prices.filter((price) => price.id !== action.payload.id);
        });
        builder.addCase(deleteprice.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });
    },
    });

    export default priceSlice.reducer;