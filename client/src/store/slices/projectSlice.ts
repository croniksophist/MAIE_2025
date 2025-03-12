import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProjects } from '../../services/api'; // This import now works

// Define the type for a single project
interface Project {
  id: string;
  name: string;
  status: string;
  lastModified: string;
}

// Define the state shape
interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

// Define initial state with loading and error properties
const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

// Async thunk to load projects from the API
export const loadProjects = createAsyncThunk('projects/loadProjects', async () => {
  const response = await fetchProjects(); // Fetch projects from the API
  return response; // Assumes the response is an array of projects
});

// Create the slice
const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload; // Store the fetched projects
      })
      .addCase(loadProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load projects';
      });
  },
});

export default projectSlice.reducer;
