import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { salesPartnersURL } from '../api/API'


interface SalesPartnerState {
  salesPartners: [];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
}

const initialState: SalesPartnerState = {
  salesPartners: [],
  isLoading: false,
  error: null,
  searchTerm: "",
};

export const getSalesPartners = createAsyncThunk("salesPartner/getSalesPartners", async () => {
  try {
    const response = await axios.get(salesPartnersURL);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales partners:", error);
    throw error;
  }
});

export const createSalesPartner = createAsyncThunk("salesPartner/createSalesPartner", async (salesPartnerData) => {
  try {
    const response = await axios.post(salesPartnersURL, salesPartnerData);
    return response.data;
  } catch (error) {
    console.error("Error creating sales partner:", error);
    throw error;
  }
});

export const updateSalesPartner = createAsyncThunk("salesPartner/updateSalesPartner", async (salesPartnerData) => {
  try {
    const response = await axios.put(salesPartnersURL, salesPartnerData);
    return response.data;
  } catch (error) {
    console.error("Error updating sales partner:", error);
    throw error;
  }
});

export const deleteSalesPartner = createAsyncThunk("salesPartner/deleteSalesPartner", async (salesPartnerId) => {
  try {
    const response = await axios.delete(`${salesPartnersURL}/${salesPartnerId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting sales partner:", error);
    throw error;
  }
});

const salesPartnerSlice = createSlice({
  name: "salesPartner",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
        const searchTerm = action.payload.toLowerCase();
      state.searchTerm = searchTerm;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSalesPartners.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getSalesPartners.fulfilled, (state, action) => {
      state.salesPartners = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getSalesPartners.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || null;
    });

    builder.addCase(createSalesPartner.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createSalesPartner.fulfilled, (state, action) => {
      state.salesPartners.push(action.payload);
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(createSalesPartner.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || null;
    });

    builder.addCase(updateSalesPartner.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateSalesPartner.fulfilled, (state, action) => {
      const updatedSalesPartner = action.payload;
      const index = state.salesPartners.findIndex((salesPartner) => salesPartner.id === updatedSalesPartner.id);
      state.salesPartners[index] = updatedSalesPartner;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(updateSalesPartner.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || null;
    });

    builder.addCase(deleteSalesPartner.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteSalesPartner.fulfilled, (state, action) => {
      state.salesPartners = state.salesPartners.filter((salesPartner) => salesPartner.id !== action.payload);
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(deleteSalesPartner.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || null;
    });
  },
}); 

export const { setSearchTerm } = salesPartnerSlice.actions;
export default salesPartnerSlice.reducer;
