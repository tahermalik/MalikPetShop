///// this is been created for user who havent logged in
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products:[] // this will be array of objects
  },
  reducers: {
    /// action.payload will be object

    //// when the user clicks on add to cart button && when the user tries to increment the item
    addProduct:(state,action)=>{
      /// if the product is already present then it will be simply skipped
      const exists=state.products.some((item)=> item["productId"]===action.payload.productId && item["productVariation"]===action.payload.productVariation)
      if(!exists) state.products.push(action.payload)
    },

    removeProduct:(state,action)=>{
      const exists=state.products.some((item)=> item["productId"]===action.payload.productId && item["productVariation"]===action.payload.productVariation)
      if(exists) state.products.push(action.payload)
    },  
  }
})

export const { addProduct,removeProduct} = cartSlice.actions;
export default cartSlice.reducer;