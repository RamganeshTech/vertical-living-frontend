import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId:"",
    userName:"",
    email:"",
    phoneNo:"",
    isauthenticated:false
}

const userSlice = createSlice({
    name:"userprofile",
    initialState,
    reducers:{
        setProfileData:(state, action)=>{
            return action.payload
        },
        setAuth:(state, action)=>{
            return {...state, isauthenticated:action.payload}
        }
    }
})

export const {setProfileData, setAuth} = userSlice.actions

export default userSlice.reducer