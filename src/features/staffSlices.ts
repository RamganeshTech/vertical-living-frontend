import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    staffId: "",
    staffName: "",
    email: "",
    role: "",
    phoneNo: "",
    isauthenticated: false
}

const staffSlice = createSlice({
    name: "staffprofile",
    initialState,
    reducers: {
        setStaffProfileData: (state, action) => {
            const { staffId, staffName, email, phoneNo, isauthenticated, role } = action.payload

            return {
                ...state,
                staffId,
                staffName,
                email,
                phoneNo,
                role,
                isauthenticated
            };
        },
        setAuth: (state, action) => {
            return { ...state, isauthenticated: action.payload }
        }, 
         resetStaffProfile: () => initialState
    }
})

export const { setStaffProfileData, setAuth, resetStaffProfile } = staffSlice.actions

export default staffSlice.reducer