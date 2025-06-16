import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    CTOId: "",
    CTOName: "",
    email: "",
    role: "",
    phoneNo: "",
    isauthenticated: false
}

const CTOSlice = createSlice({
    name: "CTOprofile",
    initialState,
    reducers: {
        setCTOProfileData: (state, action) => {
            const { CTOId, CTOName, email, phoneNo, isauthenticated, role } = action.payload

            return {
                ...state,
                CTOId,
                CTOName,
                email,
                phoneNo,
                role,
                isauthenticated
            };
        },
        setAuth: (state, action) => {
            return { ...state, isauthenticated: action.payload }
        }, 
         resetCTOProfile: () => initialState
    }
})

export const { setCTOProfileData, setAuth, resetCTOProfile } = CTOSlice.actions

export default CTOSlice.reducer