import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: "",
    userName: "",
    email: "",
    role: "",
    phoneNo: "",
    isauthenticated: false,
    permission: {} as Record<string, Record<string, boolean>>, // <-- add this
    isGuideRequired: undefined,

}

const userSlice = createSlice({
    name: "ownerprofile",
    initialState,
    reducers: {
        setOwnerProfileData: (state, action) => {
            const { userId, userName, email, phoneNo, isauthenticated, role, permission, isGuideRequired } = action.payload

            return {
                ...state,
                userId,
                userName,
                email,
                phoneNo,
                role,
                isauthenticated,
                permission, isGuideRequired
            };
        },
         updateOwnerGuideStatus: (state, action) => {
            state.isGuideRequired = action.payload;
        },
        setAuth: (state, action) => {
            return { ...state, isauthenticated: action.payload }
        },
        resetOwnerProfile: () => initialState
    }
})

export const { setOwnerProfileData, setAuth, resetOwnerProfile, updateOwnerGuideStatus } = userSlice.actions

export default userSlice.reducer