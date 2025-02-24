// app/store/features/generateSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'sonner';
import { RootState } from '../../store';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
});

interface GenerateProjectParams {
  technologies: string[];
  complexity: {
    level: string;
    percentage: number;
  };
  duration: string;
  teamSize: string;
  category: string;
}

export const generateProject = createAsyncThunk(
  'generate/project',
  async (params: GenerateProjectParams, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.post('/generate', params, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.project;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to generate project';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
export const generateAnother = createAsyncThunk(
    'generate/another',
    async (projectId: string, { getState, rejectWithValue }) => {
      try {
        const state = getState() as RootState;
        const token = state.user.token;
  
        if (!token) {
          throw new Error('No authentication token found');
        }
  
        const response = await api.post(`/projects/${projectId}/generate-another`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to generate another project');
        }
        
        return response.data.project;
      } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'Failed to generate another project';
        toast.error(message);
        return rejectWithValue(message);
      }
    }
  );

export const getGeneratedProjects = createAsyncThunk(
  'generate/getProjects',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.get('/projects', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.projects;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch projects';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const saveProject = createAsyncThunk(
  'generate/saveProject',
  async (projectId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.patch(`/projects/${projectId}/save`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Project saved successfully');
      return response.data.project;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to save project';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const startProject = createAsyncThunk(
    'generate/startProject',
    async (projectId: string, { getState, rejectWithValue }) => {
      try {
        const state = getState() as RootState;
        const token = state.user.token;
  
        if (!token) {
          throw new Error('No authentication token found');
        }
  
        const response = await api.post(`/projects/${projectId}/start`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success('Project started successfully!');
        return response.data;
      } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'Failed to start project';
        toast.error(message);
        return rejectWithValue(message);
      }
    }
  );
export const getUserSavedProjects = createAsyncThunk(
    'generate/getUserSavedProjects',
    async (_, { getState, rejectWithValue }) => {
      try {
        const state = getState() as RootState;
        const token = state.user.token;
  
        if (!token) {
          throw new Error('No authentication token found');
        }
  
        const response = await api.get('/user/saved-projects', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data.projects;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const publishProject = createAsyncThunk(
    'generate/publishProject',
    async (projectId: string, { getState, rejectWithValue }) => {
      try {
        const state = getState() as RootState;
        const token = state.user.token;
  
        if (!token) {
          throw new Error('No authentication token found');
        }
  
        const response = await api.post(`/projects/${projectId}/publish`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return { projectId, ...response.data };
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );
interface GenerateState {
  currentProject: any | null;
  projects: any[];
  loading: boolean;
  error: string | null;
  generating: boolean;
  saving: boolean;
  loadingProjects: boolean;
}

const initialState: GenerateState = {
  currentProject: null,
  projects: [],
  loading: false,
  error: null,
  generating: false,
  saving: false,
  loadingProjects: false,
};

const generateSlice = createSlice({
  name: 'generate',
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Generate Project
    builder.addCase(generateProject.pending, (state) => {
      state.generating = true;
      state.error = null;
    });
    builder.addCase(generateProject.fulfilled, (state, action) => {
      state.generating = false;
      state.currentProject = action.payload;
      state.projects = [action.payload, ...state.projects];
    });
    builder.addCase(generateProject.rejected, (state, action) => {
      state.generating = false;
      state.error = action.payload as string;
    });

    // Generate Another
    builder.addCase(generateAnother.pending, (state) => {
      state.generating = true;
      state.error = null;
    });
    builder.addCase(generateAnother.fulfilled, (state, action) => {
      state.generating = false;
      state.currentProject = action.payload;
      state.projects = [action.payload, ...state.projects];
    });
    builder.addCase(generateAnother.rejected, (state, action) => {
      state.generating = false;
      state.error = action.payload as string;
    });

    // Get Projects
    builder.addCase(getGeneratedProjects.pending, (state) => {
      state.loadingProjects = true;
      state.error = null;
    });
    builder.addCase(getGeneratedProjects.fulfilled, (state, action) => {
      state.loadingProjects = false;
      state.projects = action.payload;
    });
    builder.addCase(getGeneratedProjects.rejected, (state, action) => {
      state.loadingProjects = false;
      state.error = action.payload as string;
    });

    // Save Project
    builder.addCase(saveProject.pending, (state) => {
      state.saving = true;
      state.error = null;
    });
    builder.addCase(saveProject.fulfilled, (state, action) => {
      state.saving = false;
      state.projects = state.projects.map(project => 
        project._id === action.payload._id ? action.payload : project
      );
      if (state.currentProject?._id === action.payload._id) {
        state.currentProject = action.payload;
      }
    });
    builder.addCase(saveProject.rejected, (state, action) => {
      state.saving = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCurrentProject, clearError } = generateSlice.actions;
export default generateSlice.reducer;