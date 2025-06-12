import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    workerId:"",
    workerName:"",
    email:"",
    phoneNo:"",
    isauthenticated:false
}

const workerSlice = createSlice({
    name:"workerprofile",
    initialState,
    reducers:{
        setProfileData:(_, action)=>{
            return action.payload
        },
        setAuth:(state, action)=>{
            return {...state, isauthenticated:action.payload}
        }
    }
})

export const {setProfileData, setAuth} = workerSlice.actions

export default workerSlice.reducer