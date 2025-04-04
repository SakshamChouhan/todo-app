import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials } from '../types';
import axios from 'axios';

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('authToken'),
  user: localStorage.getItem('userEmail'),
  token: localStorage.getItem('authToken'),
  error: null,
  loading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: string; token: string }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      
      // Save auth data to localStorage
      localStorage.setItem('userEmail', action.payload.user);
      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('tokenTimestamp', Date.now().toString());
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      
      // Clear auth data from localStorage
      localStorage.removeItem('userEmail');
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenTimestamp');
    }
  }
});

// Action creators
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// Thunk for handling login
export const login = (credentials: LoginCredentials) => async (dispatch: any) => {
  try {
    dispatch(loginStart());
    
    // Call the login API endpoint
    const response = await axios.post('/api/auth/login', credentials);
    const { name, email, token } = response.data;
    
    dispatch(loginSuccess({ user: email || name, token }));
  } catch (error) {
    let errorMessage = 'Login failed. Please try again.';
    
    if (axios.isAxiosError(error) && error.response) {
      // Use server error message if available
      errorMessage = error.response.data.message || errorMessage;
    }
    
    dispatch(loginFailure(errorMessage));
  }
};

export default authSlice.reducer;
