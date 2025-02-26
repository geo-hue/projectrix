// app/store/features/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserData } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import api from '@/app/utils/api';

// Types
interface UserState {
  user: UserData | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunks
export const loginWithGithub = createAsyncThunk(
  'user/loginWithGithub',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/github', { token });
      return { user: response.data.user, token };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Authentication failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue, getState }) => {
    try {
      await api.post('/auth/logout');
      return null;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Logout failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const refreshUserData = createAsyncThunk(
  'user/refreshData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/refresh');
      return response.data.user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to refresh user data';
      return rejectWithValue(message);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginWithGithub.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginWithGithub.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(loginWithGithub.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Refresh user data
    builder.addCase(refreshUserData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(refreshUserData.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(refreshUserData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, setToken, clearUser } = userSlice.actions;
export default userSlice.reducer;