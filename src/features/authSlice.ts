import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  role: string | null;
  isauthenticated:boolean,
  _id:string | null,
  userName:string | null,
}

const initialState: AuthState = {
  role: null,
  isauthenticated:false,
  _id:null,
  userName:null,
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
      state._id = null
      state.userName = null
    },
  },
});

export const { setRole, logout } = authSlice.actions;
export default authSlice.reducer;
