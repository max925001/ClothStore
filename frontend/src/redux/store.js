import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../redux/slices/user.slice'
import bookReducer from '../redux/slices/book.slice'
const store = configureStore({
    reducer: {
        auth: authReducer,
        books: bookReducer
    }
})

export default store