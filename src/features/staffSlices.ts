import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    staffId: "",
    staffName: "",
    email: "",
    role: "",
    phoneNo: "",
    isauthenticated: false,
    permission: {} as Record<string, Record<string, boolean>>,
    isGuideRequired: undefined,


}

const staffSlice = createSlice({
    name: "staffprofile",
    initialState,
    reducers: {
        setStaffProfileData: (state, action) => {
            const { staffId, staffName, email, phoneNo, isauthenticated, role, permission,
                isGuideRequired
             } = action.payload

            return {
                ...state,
                staffId,
                staffName,
                email,
                phoneNo,
                role,
                isauthenticated,
                permission,
                isGuideRequired
            };
        },
            updateStaffGuideStatus: (state, action) => {
            state.isGuideRequired = action.payload;
        },
        setAuth: (state, action) => {
            return { ...state, isauthenticated: action.payload }
        },
        resetStaffProfile: () => initialState
    }
})

export const { setStaffProfileData, setAuth, resetStaffProfile, updateStaffGuideStatus } = staffSlice.actions

export default staffSlice.reducer