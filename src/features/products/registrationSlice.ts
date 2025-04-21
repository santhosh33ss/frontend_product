// src/redux/slices/authSlice.ts
import { createAsyncThunk, createSlice, 
    // PayloadAction 
} from '@reduxjs/toolkit';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  success: boolean;
  token: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  success: false,
  token: localStorage.getItem('token') || null,
};

// Register thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.message || 'Registration failed');
      }

      return await res.json();
    } catch (error) {
      return rejectWithValue('Something went wrong. Please try again later.');
    }
  }
);

// Login thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || 'Login failed');
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      return rejectWithValue('Something went wrong. Please try again later.');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    logoutUser: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAuthState, logoutUser } = authSlice.actions;
export default authSlice.reducer;


