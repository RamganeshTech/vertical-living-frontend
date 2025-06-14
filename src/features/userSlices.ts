import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: "",
    userName: "",
    email: "",
    role:"",
    phoneNo: "",
    isauthenticated: false
}

const userSlice = createSlice({
    name: "ownerprofile",
    initialState,
    reducers: {
        setOwnerProfileData: (state, action) => {
            const { userId, userName, email, phoneNo, isauthenticated, role } = action.payload

            return {
                ...state,
                userId,
                userName,
                email,
                phoneNo,
                role,
                isauthenticated
            };
        },
        setAuth: (state, action) => {
            return { ...state, isauthenticated: action.payload }
        },
        resetOwnerProfile: () => initialState
    }
})

export const { setOwnerProfileData, setAuth, resetOwnerProfile } = userSlice.actions

export default userSlice.reducer