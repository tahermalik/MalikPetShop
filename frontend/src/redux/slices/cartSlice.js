///// this is been created for user who havent logged in
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products:[], // this will be array of objects
  },
  reducers: {
    /// required for the breadcrumbs stuff so that single product can be displayed
    setProducts:(state,action)=>{
      state.products=action.payload;
    }

  }
})

export const {setProducts} = cartSlice.actions;
export default cartSlice.reducer;