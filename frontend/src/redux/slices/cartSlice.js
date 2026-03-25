///// this is been created for user who havent logged in
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products:[], // this will be array of objects
    addedBrands:new Map()    // this map is simply created in order to know whether the coupon can be used by the user or not 
  },
  reducers: {
    /// required for the breadcrumbs stuff so that single product can be displayed
    setProducts:(state,action)=>{
      state.products=action.payload;
    },
    addBrand:(state,action)=>{
      // simply adding brand into the array in order to avoid the complexity of fetching data from DB
      let result=state?.addedBrands.get(action.payload);
      if(result===undefined) state?.addedBrands.set(action.payload,1);
      else state?.addedBrands.set(action.payload,result+1); 
    
    },
    removeBrand:(state,action)=>{
      let result=state?.addedBrands.get(action.payload);
      if(result!==undefined){
        if(result===1) state?.addedBrands.delete(action.payload);
        else state?.addedBrands.set(action.payload,result-1); 
      }
    }

  }
})

export const {setProducts,addBrand,removeBrand} = cartSlice.actions;
export default cartSlice.reducer;