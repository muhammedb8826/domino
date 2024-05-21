import axios from "axios";
import { purchaseNotesURL } from "../api/API";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    purchaseNotes: [],
    singleNote: {},
    isLoading: false,
    error: null
}

export const getNotes = createAsyncThunk("note/getNotes", async () => {
    try {
        const response = await axios.get(purchaseNotesURL);
        return response.data;
    } catch (error) {
        console.error("Error fetching notes:", error);
        throw error;
    }
});

export const getNoteById = createAsyncThunk("note/getNoteById", async (noteId) => {
    try {
        const response = await axios.get(`${purchaseNotesURL}/${noteId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching note by id:", error);
        throw error;
    }
});

export const createNote = createAsyncThunk("note/createNote", async (noteData) => {
    try {
        const response = await axios.post(purchaseNotesURL, noteData);
        return response.data;
    } catch (error) {
        console.error("Error creating note:", error);
        throw error;
    }
});

export const updateNote = createAsyncThunk("note/updateNote", async (noteData) => {
    try {
        const response = await axios.put(`${purchaseNotesURL}/${noteData.id}`, noteData);
        return response.data;
    } catch (error) {
        console.error("Error updating note:", error);
        throw error;
    }
});

export const deleteNote = createAsyncThunk("note/deleteNote", async (noteId) => {
    try {
        const response = await axios.delete(`${purchaseNotesURL}/${noteId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting note:", error);
        throw error;
    }
});

export const purchaseNotesSlice = createSlice({
    name: "note",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getNotes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getNotes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.purchaseNotes = action.payload;
            })
            .addCase(getNotes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(getNoteById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getNoteById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.singleNote = action.payload;
            })
            .addCase(getNoteById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(createNote.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createNote.fulfilled, (state, action) => {
                state.isLoading = false;
                state.purchaseNotes.push(action.payload);
            })
            .addCase(createNote.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(updateNote.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                state.isLoading = false;
                const { id, title, content } = action.payload;
                const existingNote = state.purchaseNotes.find((note) => note.id === id);
                if (existingNote) {
                    existingNote.title = title;
                    existingNote.content = content;
                }
            })
            .addCase(updateNote.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(deleteNote.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.isLoading = false;
                const noteId = action.payload;
                state.notes = state.purchaseNotes.filter((note) => note.id !== noteId);
            })
            .addCase(deleteNote.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
});

export default purchaseNotesSlice.reducer