import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { printingDataURL } from "../../api/API";

interface PrintingState {
  printingData: [];
  isLoading: boolean;
  error: string | null;
  message: string | null;
  errors: string[] | null;
}

const initialState: PrintingState = {
  printingData: [],
  isLoading: false,
  error: null,
  errors: [],
  message: null,
};

export const getPrintingData = createAsyncThunk(
  "printing/getPrintingData",
  async () => {
    try {
      const response = await axios.get(printingDataURL);
      return response.data;
    } catch (error) {
      console.error("Error fetching printing data:", error);
      throw error;
    }
  }
);

export const createPrintingData = createAsyncThunk(
    "printing/createPrintingData",
    async (newPrintingData, { rejectWithValue }) => {
        try {
        const response = await axios.post(printingDataURL, newPrintingData);
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data);
        }
    }
    );

export const updatePrintingData = createAsyncThunk(
    "printing/updatePrintingData",
    async (printingData) => {
        try {
        const response = await axios.put(`${printingDataURL}/${printingData.id}`, printingData);
        return response.data;
        } catch (error) {
        console.error("Error updating printing data:", error);
        throw error;
        }
    }
    );

export const deletePrintingData = createAsyncThunk(
    "printing/deletePrintingData",
    async (printingDataId) => {
        try {
        const response = await axios.delete(`${printingDataURL}/${printingDataId}`);
        return response.data;
        } catch (error) {
        console.error("Error deleting printing data:", error);
        throw error;
        }
    }
    );

export const printingSlice = createSlice({
    name: "printing",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getPrintingData.pending, (state, action) => {
        state.isLoading = true;
        });
        builder.addCase(getPrintingData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.printingData = action.payload;
        });
        builder.addCase(getPrintingData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        });
        builder.addCase(createPrintingData.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(createPrintingData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.printingData = action.payload;
        });
        builder.addCase(createPrintingData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(updatePrintingData.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(updatePrintingData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.printingData = action.payload;
        });
        builder.addCase(updatePrintingData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        builder.addCase(deletePrintingData.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(deletePrintingData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.printingData = action.payload;
        });
        builder.addCase(deletePrintingData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
    },
    });

    export default printingSlice.reducer;
    