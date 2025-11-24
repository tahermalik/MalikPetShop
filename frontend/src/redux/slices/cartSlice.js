///// this is been created for user who havent logged in
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products:[], // this will be array of objects
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
      if(exists){
        state.products=state.products.filter((item)=>!(item["productId"]===action.payload.productId && item["productVariation"]===action.payload.productVariation))
      }
    },  

    incrementQuantity:(state,action)=>{
      for(let i=0;i<state.products.length;i++){
        if(state.products[i].productId===action.payload.productId && state.products[i].productVariation===action.payload.productVariation){
          if(state.products[i].productQuantity<action.payload.stock-1) state.products[i].productQuantity+=1;
          break;
        }
      }
    },

    decrementQuantity:(state,action)=>{
      for(let i=0;i<state.products.length;i++){
        if(state.products[i].productId===action.payload.productId && state.products[i].productVariation===action.payload.productVariation){
          if(state.products[i].productQuantity>=2) state.products[i].productQuantity-=1;
          break;
        }
      }
    },

    setProducts:(state,action)=>{
      state.products=action.payload;
    }

  }
})

export const { addProduct,removeProduct,incrementQuantity,decrementQuantity,setProducts} = cartSlice.actions;
export default cartSlice.reducer;