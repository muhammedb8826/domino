
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState = {
//     inventories : [],
//     isLoading: false,
//     error: null,
// }

// export const getInventories = createAsyncThunk("inventory/getInventories", async () => {
//     try {
//         const response = await axios.get(inventoriesURL);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching inventory:", error);
//         throw error;
//     }
// });

// export const createInventory = createAsyncThunk("inventory/createInventory", async (inventoryData) => {
//     try {
//         const response = await axios.post(inventoriesURL, inventoryData);
//         return response.data;
//     } catch (error) {
//         console.error("Error creating inventory:", error);
//         throw error;
//     }
// });

// export const updateInventory = createAsyncThunk("inventory/updateInventory", async (inventoryData) => {
//     try {
//         const response = await axios.put(`${inventoriesURL}/${inventoryData.id}`, inventoryData);
//         return response.data;
//     } catch (error) {
//         console.error("Error updating inventory:", error);
//         throw error;
//     }
// });

// export const deleteInventory = createAsyncThunk("inventory/deleteInventory", async (inventoryId) => {
//     try {
//         const response = await axios.delete(`${inventoriesURL}/${inventoryId}`);
//         return response.data;
//     } catch (error) {
//         console.error("Error deleting inventory:", error);
//         throw error;
//     }
// });



// export const inventorySlice = createSlice({
//     name: "inventory",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder.addCase(getInventories.pending, (state) => {
//             state.isLoading = true;
//         });
//         builder.addCase(getInventories.fulfilled, (state, action) => {
//             state.inventories = action.payload;
//             state.isLoading = false;
//         });
//         builder.addCase(getInventories.rejected, (state, action) => {
//             state.isLoading = false;
//             state.error = action.error.message;
//         });
//         builder.addCase(createInventory.pending, (state) => {
//             state.isLoading = true;
//         });
//         builder.addCase(createInventory.fulfilled, (state, action) => {
//             state.inventories.push(action.payload);
//             state.isLoading = false;
//         });
//         builder.addCase(createInventory.rejected, (state, action) => {
//             state.error = action.error.message;
//             state.isLoading = false;
//         });
//         builder.addCase(updateInventory.pending, (state) => {
//             state.isLoading = true;
//         });
//         builder.addCase(updateInventory.fulfilled, (state, action) => {
//             state.isLoading = false;
//             state.inventories = state.inventories.map((inventory) => {
//                 if (inventory.id === action.payload.id) {
//                     return action.payload;
//                 }
//                 return inventory;
//             });
//         });
//         builder.addCase(updateInventory.rejected, (state, action) => {
//             state.error = action.error.message;
//             state.isLoading = false;
//         });
//         builder.addCase(deleteInventory.pending, (state) => {
//             state.isLoading = true;
//         });
//         builder.addCase(deleteInventory.fulfilled, (state, action) => {
//             state.isLoading = false;
//             state.inventories = state.inventories.filter((inventory) => inventory.id !== action.payload.id);
//         });
//         builder.addCase(deleteInventory.rejected, (state, action) => {
//             state.error = action.error.message;
//             state.isLoading = false;
//         });
//     }
// });

// export default inventorySlice.reducer;

