import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the types for the user
interface User {
  id: string;
  email: string;
  name?: string;
}

// Define the shape of the authentication state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Define the initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set the user and mark as authenticated
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // Action to log out and reset the state
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Export actions
export const { setUser, logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
