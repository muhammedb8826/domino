import axios from "axios";
import { categoriesURL } from "@/redux/api/API";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    categories: [],
    singleCategory: {},
    isLoading: false,
    error: null
}


export const getCategories = createAsyncThunk("category/getCategories", async () => {
    try {
        const response = await axios.get(categoriesURL);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
});

export const getCategorieById = createAsyncThunk("category/getCategorieById", async (categoryId) => {
    try {
        const response = await axios.get(`${categoriesURL}/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching category by id:", error);
        throw error;
    }
});

export const createCategory = createAsyncThunk("category/createCategory", async (categoryData) => {
    try {
        const response = await axios.post(categoriesURL, categoryData);
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
});

export const updateCategory = createAsyncThunk("category/updateCategory", async (categoryData) => {
    try {
        const response = await axios.put(`${categoriesURL}/${categoryData.id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
});

export const deleteCategory = createAsyncThunk("category/deleteCategory", async (categoryId) => {
    try {
        const response = await axios.delete(`${categoriesURL}/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
});

export const categoriesSlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCategories.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.isLoading = false;
            state.categories = action.payload;
        });
        builder.addCase(getCategories.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(getCategorieById.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getCategorieById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.singleCategory = action.payload;
        });
        builder.addCase(getCategorieById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(createCategory.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createCategory.fulfilled, (state, action) => {
            state.isLoading = false;
            state.categories.push(action.payload);
        });
        builder.addCase(createCategory.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(updateCategory.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateCategory.fulfilled, (state, action) => {
            state.isLoading = false;
            state.categories = state.categories.map((category) => {
                if (category.id === action.payload.id) {
                    return action.payload;
                }
                return category;
            });
        });
        builder.addCase(updateCategory.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(deleteCategory.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteCategory.fulfilled, (state, action) => {
            state.isLoading = false;
            state.categories = state.categories.filter((category) => category.id !== action.payload.id);
        });
        builder.addCase(deleteCategory.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
    },
});

export default categoriesSlice.reducer;
