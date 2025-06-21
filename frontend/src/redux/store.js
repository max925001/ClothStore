import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../redux/slices/user.slice'
import clothReducer from '../redux/slices/clothing.slice'
const store = configureStore({
    reducer: {
        auth: authReducer,
        clothing: clothReducer
    }
})

export default store