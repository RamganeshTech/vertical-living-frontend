import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    staffId:"",
    staffName:"",
    email:"",
    phoneNo:"",
    isauthenticated:false
}

const staffSlice = createSlice({
    name:"staffprofile",
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

export const {setProfileData, setAuth} = staffSlice.actions

export default staffSlice.reducer