import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    clientId: "",
    clientName: "",
    email: "",
    role: "",
    phoneNo: "",
    isauthenticated: false
}

const clientSlice = createSlice({
    name: "clientprofile",
    initialState,
    reducers: {
        setClientProfileData: (state, action) => {
            const { clientId, clientName, email, phoneNo, isauthenticated, role } = action.payload

            return {
                ...state,
                clientId,
                clientName,
                email,
                phoneNo,
                role,
                isauthenticated
            };
        },
        setAuth: (state, action) => {
            return { ...state, isauthenticated: action.payload }
        }, 
         resetClientProfile: () => initialState
    }
})

export const { setClientProfileData, setAuth, resetClientProfile } = clientSlice.actions

export default clientSlice.reducer