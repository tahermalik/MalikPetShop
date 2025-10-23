import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./slices/userSlice.js"
import layoutReducer from "./slices/layoutSlice.js"
import filterReducer from "./slices/filterSlice.js"
import activeReducer from "./slices/activeSlice.js"
import productReducer from "./slices/productSlice.js"
import cartReducer from "./slices/cartSlice.js"

const store=configureStore({
    reducer:{
        user:userReducer,
        layout:layoutReducer,
        filter:filterReducer,
        active:activeReducer,
        product:productReducer,
        cart:cartReducer
    }
})

export default store