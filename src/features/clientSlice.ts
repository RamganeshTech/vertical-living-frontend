import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    clientId: "",
    clientName: "",
    email: "",
    role: "",
    phoneNo: "",
    isauthenticated: false,
    permission: {} as Record<string, Record<string, boolean>>,
    isGuideRequired: undefined // <-- add this

}

const clientSlice = createSlice({
    name: "clientprofile",
    initialState,
    reducers: {
        setClientProfileData: (state, action) => {
            const { clientId, clientName, email, phoneNo, isauthenticated, role, permission, isGuideRequired } = action.payload

            return {
                ...state,
                clientId,
                clientName,
                email,
                phoneNo,
                role,
                isauthenticated,
                permission, isGuideRequired
            };
        },
        updateClientGuideStatus: (state, action) => {
            state.isGuideRequired = action.payload;
        },
        setAuth: (state, action) => {
            return { ...state, isauthenticated: action.payload }
        },
        resetClientProfile: () => initialState
    }
})

export const { setClientProfileData, setAuth, resetClientProfile, updateClientGuideStatus } = clientSlice.actions

export default clientSlice.reducer