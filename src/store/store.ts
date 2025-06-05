import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlices'

export const store = configureStore({
    reducer:{
        userProfileStore:userReducer,
    },
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;