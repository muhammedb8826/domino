import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { serviceURL } from "../../api/API";


const initialState= {
    services: [],
    isLoading: false,
    error: "",
}


export const getServices = createAsyncThunk(
    "services/getServices",
    async () => {
        try{
        const response = await axios.get(serviceURL);
        console.log(response.data);
        
        return response.data;
        } catch (error) {
            console.log(error);
            throw error
        }
    }
);

export const createService = createAsyncThunk(
    "services/createService",
    async (data) => {
        const response = await axios.post(serviceURL, data);
        return response.data;
    }
);

export const updateService = createAsyncThunk(
    "services/updateService",
    async (data) => {
        const response = await axios.put(`${serviceURL}/${data.id}`, data);
        return response.data;
    }
);

export const deleteService = createAsyncThunk(
    "services/deleteService",
    async (id: string) => {
        const response = await axios.delete(`${serviceURL}/${id}`);
        return response.data;
    }
);



const servicesSlice = createSlice({
    name: "services",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getServices.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(getServices.fulfilled, (state, action) => {
            state.isLoading = false;
            state.services = action.payload;
        });
        builder.addCase(getServices.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(createService.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(createService.fulfilled, (state, action) => {
            state.isLoading = false;
            state.services.push(action.payload);
        });
        builder.addCase(createService.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(updateService.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(updateService.fulfilled, (state, action) => {
            state.isLoading = false;
            state.services = state.services.map((service) => {
                if (service.id === action.payload.id) {
                    return action.payload;
                }
                return service;
            });
        });
        builder.addCase(updateService.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(deleteService.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(deleteService.fulfilled, (state, action) => {
            state.isLoading = false;
            state.services = state.services.filter((service) => service.id !== action.payload.id);
        });
        builder.addCase(deleteService.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });
    },
    });

    export default servicesSlice.reducer;