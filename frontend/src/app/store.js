import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authReducers'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})