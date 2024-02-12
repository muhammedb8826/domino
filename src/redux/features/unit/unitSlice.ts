import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { unitURL} from "../../api/API";


const initialState= {
    units: [],
    isLoading: false,
    error: "",
}


export const getUnits = createAsyncThunk(
    "machines/getUnits",
    async () => {
        try{
        const response = await axios.get(unitURL);
        console.log(response.data);
        
        return response.data;
        } catch (error) {
            console.log(error);
            throw error
        }
    }
);

export const createUnits = createAsyncThunk(
    "units/createUnits",
    async (data) => {
        const response = await axios.post(unitURL, data);
        return response.data;
    }
);

export const updateUnits = createAsyncThunk(
    "units/updateUnits",
    async (data) => {
        const response = await axios.put(`${unitURL}/${data.id}`, data);
        return response.data;
    }
);

export const deleteUnits = createAsyncThunk(
    "units/deleteUnits",
    async (id: string) => {
        const response = await axios.delete(`${unitURL}/${id}`);
        return response.data;
    }
);

const unitSlice = createSlice({
    name: "units",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUnits.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(getUnits.fulfilled, (state, action) => {
            state.isLoading = false;
            state.units = action.payload;
        });
        builder.addCase(getUnits.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(createUnits.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(createUnits.fulfilled, (state, action) => {
            state.isLoading = false;
            state.units.push(action.payload);
        });
        builder.addCase(createUnits.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(updateUnits.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(updateUnits.fulfilled, (state, action) => {
            state.isLoading = false;
            state.units = state.units.map((unit) => {
                if (unit.id === action.payload.id) {
                    return action.payload;
                }
                return unit;
            });
        });
        builder.addCase(updateUnits.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(deleteUnits.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(deleteUnits.fulfilled, (state, action) => {
            state.isLoading = false;
            state.units = state.units.filter((unit) => unit.id !== action.payload.id);
        });
        builder.addCase(deleteUnits.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });
    },
    });

    export default unitSlice.reducer;