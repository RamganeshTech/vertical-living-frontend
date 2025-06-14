import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    workerId:"",
    workerName:"",
    email:"",
    role:"",
    phoneNo:"",
    isauthenticated:false
}

const workerSlice = createSlice({
    name:"workerprofile",
    initialState,
    reducers:{
        setWorkerProfileData:(state, action)=>{
            const { workerId, workerName, email, phoneNo, isauthenticated, role } = action.payload

            return {
                ...state,
                workerId,
                workerName,
                email,
                phoneNo,
                role,
                isauthenticated
            };        
        },
        setAuth:(state, action)=>{
            return {...state, isauthenticated:action.payload}
        }, 
        resetWorkerProfile: ()=> initialState
    }
})

export const {setWorkerProfileData, setAuth, resetWorkerProfile} = workerSlice.actions

export default workerSlice.reducer