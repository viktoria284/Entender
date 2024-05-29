import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserProfileToken } from '../Models/User';
import { loginAPI, registerAPI } from '../Services/AuthService';
import { RootState } from './Store';

interface AuthState {
  user: {
    userName: string;
    email: string;
    token: string;
    userId: string;
  } | null;
  status: 'succeeded' | 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }: { username: string; password: string }) => {
    const response = await loginAPI(username, password);
    if (!response || !response.data) {
      throw new Error('No response data');
    }
    return response.data;
  }
);

export const registerUser = createAsyncThunk<
  UserProfileToken,
  { email: string; username: string; password: string },
  { rejectValue: string }>(
    'auth/registerUser', 
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerAPI(userData.email, userData.username, userData.password);
      return response.data;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
});


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      localStorage.removeItem('user');
    },
    loadUserFromStorage(state) {
      const user = localStorage.getItem('user');
      if (user) {
        state.user = JSON.parse(user);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to login';
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to register';
      });
  },
});

export const { logout, loadUserFromStorage } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
