import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./slices/userSlice.js"
import layoutReducer from "./slices/layoutSlice.js"
import filterReducer from "./slices/filterSlice.js"
import activeReducer from "./slices/activeSlice.js"
import productReducer from "./slices/productSlice.js"
import cartReducer from "./slices/cartSlice.js"
import chatReducer from "./slices/chatSlice.js"
import wishListReducer from "./slices/wishListSlice.js"
import { enableMapSet } from "immer";
import {persistStore, persistReducer} from "redux-persist";

import storage from "redux-persist/lib/storage"; // localStorage

enableMapSet(); // so that in the redux map can be used

// persist ONLY wishlist
const wishListPersistConfig = {
  key: "wishList",
  storage
};

const persistedWishListReducer = persistReducer(
  wishListPersistConfig,
  wishListReducer
);

const store=configureStore({
    reducer:{
        user:userReducer,
        layout:layoutReducer,
        filter:filterReducer,
        active:activeReducer,
        product:productReducer,
        cart:cartReducer,
        chat:chatReducer,
        wishList:persistedWishListReducer,
    }
})

export default store

export const persistor = persistStore(store);