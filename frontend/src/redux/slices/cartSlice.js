///// this is been created for user who havent logged in
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products:{}
  },
  reducers: {
    /// action.payload will be object

    //// when the user clicks on add to cart button && when the user tries to increment the item
    addProduct:(state,action)=>{
        if(action.payload in state.products){
            state.products[action.payload]+=1;
        }else state.products[action.payload]=1;
    },

    removeProduct:(state,action)=>{
        if(action.payload in state.products) delete state.products[action.payload]
    },

    subProduct:(state,action)=>{
        if(action.payload in state.products){
            state.products[action.payload]-=1;
            if(state.products[action.payload]===0) delete state.products[action.payload]
        }
    }    
  }
})

export const { addProduct,removeProduct,subProduct} = cartSlice.actions;
export default cartSlice.reducer;