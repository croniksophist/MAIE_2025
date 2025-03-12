import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { signIn, setUpTOTP, verifyTOTPSetup } from "@aws-amplify/auth";

// Define user type
interface User {
  username: string;
  email: string;
  attributes?: Record<string, any>;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Enable MFA Setup
export const enableMFA = createAsyncThunk("auth/enableMFA", async (_, { rejectWithValue }) => {
  try {
    return await setUpTOTP();
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to enable MFA");
  }
});

// Verify MFA Code
export const verifyMFA = createAsyncThunk("auth/verifyMFA", async (code: string, { rejectWithValue }) => {
  try {
    return await verifyTOTPSetup({ code });  // Correct parameter name
  } catch (error: any) {
    return rejectWithValue(error.message || "MFA Verification failed");
  }
});

// Login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await signIn({ username: email, password });

      return {
        username: email,  // Use email as username if necessary
        email,
        attributes: user.nextStep || {},  // Store MFA steps if necessary
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

// Define the authSlice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(enableMFA.pending, (state) => { state.loading = true; })
      .addCase(enableMFA.fulfilled, (state) => { state.loading = false; state.error = null; })
      .addCase(enableMFA.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to enable MFA";
      })
      .addCase(verifyMFA.pending, (state) => { state.loading = true; })
      .addCase(verifyMFA.fulfilled, (state) => { state.loading = false; state.isAuthenticated = true; })
      .addCase(verifyMFA.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "MFA Verification failed";
      })
      .addCase(login.pending, (state) => { state.loading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
