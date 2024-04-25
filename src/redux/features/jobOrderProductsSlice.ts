import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jobOrderProductsURL } from "../api/API";


const initialState= {
    jobOrderProducts: [],
    isLoading: false,
    error: "",
}


export const getJobOrdersProducts = createAsyncThunk(
    "material/getMaterials",
    async () => {
        try{
        const response = await axios.get(jobOrderProductsURL);    
        return response.data;
        } catch (error) {
            console.log(error);
            throw error
        }
    }
);

export const createJobOrderProduct = createAsyncThunk(
    "material/createMaterial",
    async (data) => {
        const response = await axios.post(jobOrderProductsURL, data);
        return response.data;
    }
);

export const updateJobOrderProduct = createAsyncThunk(
    "material/updateMaterial",
    async (data) => {
        const response = await axios.put(`${jobOrderProductsURL}/${data.id}`, data);
        return response.data;
    }
);

export const deleteJobOrderProduct = createAsyncThunk(
    "material/deleteMaterial",
    async (id: string) => {
        const response = await axios.delete(`${jobOrderProductsURL}/${id}`);
        return response.data;
    }
);

const jobOrderProductSlice = createSlice({
    name: "materials",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getJobOrdersProducts.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(getJobOrdersProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.jobOrderProducts = action.payload;
        });
        builder.addCase(getJobOrdersProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(createJobOrderProduct.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(createJobOrderProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.jobOrderProducts.push(action.payload);
        });
        builder.addCase(createJobOrderProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(updateJobOrderProduct.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(updateJobOrderProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.jobOrderProducts = state.jobOrderProducts.map((material) => {
                if (material.id === action.payload.id) {
                    return action.payload;
                }
                return material;
            });
        });
        builder.addCase(updateJobOrderProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(deleteJobOrderProduct.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(deleteJobOrderProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.jobOrderProducts = state.jobOrderProducts.filter((material) => material.id !== action.payload.id);
        });
        builder.addCase(deleteJobOrderProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });
    },
    });

    export default jobOrderProductSlice.reducer;