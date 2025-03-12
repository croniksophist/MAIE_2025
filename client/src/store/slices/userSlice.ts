import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for user state
interface UserState {
  id: string | null;
  name: string;
  email: string;
}

const initialState: UserState = {
  id: null,
  name: "",
  email: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    clearUser: (state) => {
      state.id = null;
      state.name = "";
      state.email = "";
    },
  },
});

// Export the action creators
export const { setUser, clearUser } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
