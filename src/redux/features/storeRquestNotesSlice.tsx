import axios from "axios";
import { storeRequestNotesURL } from "../api/API";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    storeRequestNotes: [],
    singleNote: {},
    isLoading: false,
    error: null
}

export const getNotes = createAsyncThunk("note/getNotes", async () => {
    try {
        const response = await axios.get(storeRequestNotesURL);
        return response.data;
    } catch (error) {
        console.error("Error fetching notes:", error);
        throw error;
    }
});

export const getNoteById = createAsyncThunk("note/getNoteById", async (noteId) => {
    try {
        const response = await axios.get(`${storeRequestNotesURL}/${noteId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching note by id:", error);
        throw error;
    }
});

export const createNote = createAsyncThunk("note/createNote", async (noteData) => {
    try {
        const response = await axios.post(storeRequestNotesURL, noteData);
        return response.data;
    } catch (error) {
        console.error("Error creating note:", error);
        throw error;
    }
});

export const updateNote = createAsyncThunk("note/updateNote", async (noteData) => {
    try {
        const response = await axios.put(`${storeRequestNotesURL}/${noteData.id}`, noteData);
        return response.data;
    } catch (error) {
        console.error("Error updating note:", error);
        throw error;
    }
});

export const deleteNote = createAsyncThunk("note/deleteNote", async (noteId) => {
    try {
        const response = await axios.delete(`${storeRequestNotesURL}/${noteId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting note:", error);
        throw error;
    }
});

export const storeRequestNotesSlice = createSlice({
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
                state.storeRequestNotes = action.payload;
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
                state.storeRequestNotes.push(action.payload);
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
                const existingNote = state.storeRequestNotes.find((note) => note.id === id);
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
                state.storeRequestNotes = state.storeRequestNotes.filter((note) => note.id !== noteId);
            })
            .addCase(deleteNote.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
});

export default storeRequestNotesSlice.reducer