import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlices'
import staffReducer from '../features/staffSlices'
import workerReducer from '../features/workerSlice'
import authReducer from '../features/authSlice'
import CTOReducer from '../features/CTOSlice'
import clientReducer from '../features/clientSlice'

export const store = configureStore({
    reducer:{
        userProfileStore:userReducer,
        workerProfileStore:workerReducer,
        staffProfileStore:staffReducer,
        CTOProfileStore:CTOReducer,
        clientProfileStore:clientReducer,
        authStore:authReducer
    },
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;