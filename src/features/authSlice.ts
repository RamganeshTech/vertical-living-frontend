import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  role: string | null;
  isauthenticated: boolean,
  _id: string | null,
  userName: string | null,
  permission: Record<string, Record<string, boolean>>, // <-- add this
  isGuideRequired: boolean | undefined

}

const initialState: AuthState = {
  role: null,
  isauthenticated: false,
  _id: null,
  userName: null,
  permission: {} as Record<string, Record<string, boolean>>,
  isGuideRequired: undefined // <-- add this
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRole: (_, action) => {
      return action.payload
    },
    updateAuthGuideStatus: (state, action) => {
      state.isGuideRequired = action.payload;
    },
    logout: (state) => {
      state.role = null;
      state.isauthenticated = false
      state._id = null
      state.userName = null,
        state.permission = {}
    },
  },
});

export const { setRole, logout,updateAuthGuideStatus } = authSlice.actions;
export default authSlice.reducer;
