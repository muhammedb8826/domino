import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { materialURL} from "../../api/API";


const initialState= {
    materials: [],
    isLoading: false,
    error: "",
}


export const getMaterials = createAsyncThunk(
    "material/getMaterials",
    async () => {
        try{
        const response = await axios.get(materialURL);
        console.log(response.data);
        
        return response.data;
        } catch (error) {
            console.log(error);
            throw error
        }
    }
);

export const createMaterial = createAsyncThunk(
    "material/createMaterial",
    async (data) => {
        const response = await axios.post(materialURL, data);
        return response.data;
    }
);

export const updateMaterial = createAsyncThunk(
    "material/updateMaterial",
    async (data) => {
        const response = await axios.put(`${materialURL}/${data.id}`, data);
        return response.data;
    }
);

export const deleteMaterial = createAsyncThunk(
    "material/deleteMaterial",
    async (id: string) => {
        const response = await axios.delete(`${materialURL}/${id}`);
        return response.data;
    }
);

const materialSlice = createSlice({
    name: "materials",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getMaterials.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(getMaterials.fulfilled, (state, action) => {
            state.isLoading = false;
            state.materials = action.payload;
        });
        builder.addCase(getMaterials.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(createMaterial.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(createMaterial.fulfilled, (state, action) => {
            state.isLoading = false;
            state.materials.push(action.payload);
        });
        builder.addCase(createMaterial.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(updateMaterial.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(updateMaterial.fulfilled, (state, action) => {
            state.isLoading = false;
            state.materials = state.materials.map((material) => {
                if (material.id === action.payload.id) {
                    return action.payload;
                }
                return material;
            });
        });
        builder.addCase(updateMaterial.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });

        builder.addCase(deleteMaterial.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(deleteMaterial.fulfilled, (state, action) => {
            state.isLoading = false;
            state.materials = state.materials.filter((material) => material.id !== action.payload.id);
        });
        builder.addCase(deleteMaterial.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message!;
        });
    },
    });

    export default materialSlice.reducer;