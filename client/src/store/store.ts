import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice'; // Import the user reducer
import projectReducer from './slices/projectSlice';
import authReducer from './slices/authSlice'; // Import the auth reducer

// Configure the store
const store = configureStore({
  reducer: {
    user: userReducer, // Keep the user slice
    project: projectReducer,
    auth: authReducer, // Add auth reducer to the store
  },
});

// Automatically infer the RootState type
export type RootState = ReturnType<typeof store.getState>;

// Define app dispatch type
export type AppDispatch = typeof store.dispatch;

export default store;
