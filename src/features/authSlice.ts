import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  role: string | null;
  isauthenticated:boolean
}

const initialState: AuthState = {
  role: null,
  isauthenticated:false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRole: (_, action) => {
      return action.payload
    },
    logout: (state) => {
      state.role = null;
      state.isauthenticated = false
    },
  },
});

export const { setRole, logout } = authSlice.actions;
export default authSlice.reducer;
