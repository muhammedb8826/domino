import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { machineURL} from "../../api/API";


const initialState= {
    machines: [],
    isLoading: false,
    error: "",
}


export const getMachines = createAsyncThunk(
    "machines/getMachines",
    async () => {
        try{
        const response = await axios.get(machineURL);
        console.log(response.data);
        
        return response.data;
        } catch (error) {
            console.log(error);
            throw error
        }
    }
);

export const createMachines = createAsyncThunk(
    "services/createService",
    async (data) => {
        const response = await axios.post(machineURL, data);
        return response.data;
    }
);

export const updateMachines = createAsyncThunk(
    "services/updateService",
    async (data) => {
        const response = await axios.put(`${machineURL}/${data.id}`, data);
        return response.data;
    }
);

export const deleteMachines = createAsyncThunk(
    "services/deleteService",
    async (id: string) => {
        const response = await axios.delete(`${machineURL}/${id}`);
        return response.data;
    }
);

const machineSlice = createSlice({
    name: "services",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getMachines.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(getMachines.fulfilled, (state, action) => {
            state.isLoading = false;
            state.machines = action.payload;
        });
        builder.addCase(getMachines.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(createMachines.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(createMachines.fulfilled, (state, action) => {
            state.isLoading = false;
            state.machines.push(action.payload);
        });
        builder.addCase(createMachines.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(updateMachines.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(updateMachines.fulfilled, (state, action) => {
            state.isLoading = false;
            state.machines = state.machines.map((machine) => {
                if (machine.id === action.payload.id) {
                    return action.payload;
                }
                return machine;
            });
        });
        builder.addCase(updateMachines.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(deleteMachines.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(deleteMachines.fulfilled, (state, action) => {
            state.isLoading = false;
            state.machines = state.machines.filter((machine) => machine.id !== action.payload.id);
        });
        builder.addCase(deleteMachines.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });
    },
    });

    export default machineSlice.reducer;