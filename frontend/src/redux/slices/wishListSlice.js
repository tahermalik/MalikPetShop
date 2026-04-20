import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const wishListSlice = createSlice({
  name: "wishList",
  initialState: {
    wishList:[],    // it will be the array of objects
  },
  reducers: {
    setFavourite:(state,action)=>{
      if(!state?.userData){
        const userWishList=state?.wishList

        const exists = userWishList.some(
          (item) => item.productId === action.payload.productId && item.productVariation===action.payload.productVariation
        );

        if(!exists){
          // console.log("Hola",action.payload)
          userWishList.push(action.payload)
          toast.success("Product added to the wishList")
        }
        else{ // as we are now removing it
          // console.log("Helo")
          state.wishList=state.wishList.filter((item)=>!(item.productId === action.payload.productId && item.productVariation===action.payload.productVariation))
          toast.success("Product removed from wishList")
        }
      }
    },
    removeMissingFromWishlist:(state,action)=>{
        // action.paylod is the list of missing ids
        const missingSet = new Set(action.payload || []);

        state.wishList = (state?.wishList || []).filter(
            obj => !missingSet.has(obj.productId)
        );
    },
    removeFavourite:(state,action)=>{
      console.log(action.payload)
      const isPresent=state?.wishList.some((obj)=>
        obj.productId.toString()===action.payload.productId && obj.productVariation===action.payload.productVariation
      )
      if(!isPresent){
        toast.error("Product is not there in the wish list")
      }else{
        state.wishList=state?.wishList?.filter((obj)=>{
          if(!(obj.productId.toString()===action.payload.productId.toString() && obj.productVariation===action.payload.productVariation)){
            return true;
          }
        })

        toast.success("Product removed from the wishlist")
      }
    },
    replaceEntireWishList:(state,action)=>{
      state.wishList=action.payload
    }
  }
})

export const { setFavourite,removeMissingFromWishlist,removeFavourite,replaceEntireWishList} = wishListSlice.actions;
export default wishListSlice.reducer;