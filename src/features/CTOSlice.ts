import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    CTOId: "",
    CTOName: "",
    email: "",
    role: "",
    phoneNo: "",
    isauthenticated: false,
    permission: {} as Record<string, Record<string, boolean>>,
    isGuideRequired: undefined,
    ownerId:"",

    // <-- add this

}

const CTOSlice = createSlice({
    name: "CTOprofile",
    initialState,
    reducers: {
        setCTOProfileData: (state, action) => {
            const { CTOId, CTOName, email, phoneNo, isauthenticated, role, permission, isGuideRequired, ownerId } = action.payload

            return {
                ...state,
                CTOId,
                CTOName,
                email,
                phoneNo,
                role,
                isauthenticated,
                permission, isGuideRequired,
                ownerId
            };
        },
        updateCTOGuideStatus: (state, action) => {
            state.isGuideRequired = action.payload;
        },
        setAuth: (state, action) => {
            return { ...state, isauthenticated: action.payload }
        },
        resetCTOProfile: () => initialState
    }
})

export const { setCTOProfileData, setAuth, resetCTOProfile, updateCTOGuideStatus } = CTOSlice.actions

export default CTOSlice.reducer