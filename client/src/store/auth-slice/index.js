import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk('/auth/register', async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', formData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
});

// Async thunk for user login
export const loginUser = createAsyncThunk('/auth/login', async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', formData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

// Async thunk for checking authentication
export const checkAuth = createAsyncThunk('/auth/checkauth', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('http://localhost:5000/api/auth/check-auth', {
            withCredentials: true,
        });

        // Optionally handle token refresh logic here

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Authentication check failed');
    }
});

// Async thunk for user logout
export const logoutUser = createAsyncThunk('/auth/logout', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/logout', {}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
});

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.isLoading = false;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload?.success) {
                    state.user = action.payload.user;
                    state.isAuthenticated = true;
                } else {
                    state.error = 'Unexpected response format';
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'An unexpected error occurred during login';
            })
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || 'Authentication check failed';
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.error = action.payload || 'Logout failed';
            });
    },
});

export const { setUser, setLoading, clearError } = authSlice.actions;
export default authSlice.reducer;
