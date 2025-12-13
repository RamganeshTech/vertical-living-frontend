import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    workerId: "",
    workerName: "",
    email: "",
    role: "",
    phoneNo: "",
    isauthenticated: false,
    permission: {} as Record<string, Record<string, boolean>>,
    isGuideRequired: undefined,


}

const workerSlice = createSlice({
    name: "workerprofile",
    initialState,
    reducers: {
        setWorkerProfileData: (state, action) => {
            const { workerId, workerName, email, phoneNo, isauthenticated, role, permission, isGuideRequired } = action.payload

            return {
                ...state,
                workerId,
                workerName,
                email,
                phoneNo,
                role,
                isauthenticated,
                permission,
                isGuideRequired,

            };
        },
        updateWorkerGuideStatus: (state, action) => {
            state.isGuideRequired = action.payload;
        },
        setAuth: (state, action) => {
            return { ...state, isauthenticated: action.payload }
        },
        resetWorkerProfile: () => initialState
    }
})

export const { setWorkerProfileData, setAuth, resetWorkerProfile, updateWorkerGuideStatus } = workerSlice.actions

export default workerSlice.reducer