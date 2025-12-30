import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData:null,categoryState:false, loginOption:false,detailOption:false,

    /// object is created by considering future expansion
    userDataNotLoggedIn:{
      "wishList":[] /// it is going to array of objects 1. productId 2. productVariation
    },
  },
  reducers: {
    setUserData:(state,action)=>{
      state.userData=action.payload
    },
    setCategoryState:(state)=>{
      state.categoryState=!state.categoryState
    },
    setLoginOption:(state)=>{
      state.loginOption=!state.loginOption
    },
    setDetailOption:(state)=>{
      state.detailOption=!state.detailOption
    },
    setProductIdInUserWishList:(state,action)=>{
      if(state?.userData){
        const productId = action.payload["productId"];
        const productVariation=action.payload["productVariation"] || 0
        const index = state.userData.wishList.findIndex(
          (obj) => obj.productId === productId && obj.productVariation===productVariation
        );

        if (index !== -1) {
          // If already exists → remove it
          state.userData.wishList.splice(index, 1);
        } else {
          // If not exists → add it
          state.userData.wishList.push({ productId :productId,productVariation:productVariation});
        }
      }
    },

    setFavouriteNotLoggedIn:(state,action)=>{
      if(!state?.userData){
        const userWishList=state?.userDataNotLoggedIn?.wishList

        const exists = userWishList.some(
          (item) => item.productId === action.payload.productId && item.productVariation===action.payload.productVariation
        );

        if(!exists){
          // console.log("Hola",action.payload)
          userWishList.push(action.payload)
        }
        else{ // as we are now removing it
          // console.log("Helo")
          state.userDataNotLoggedIn.wishList=state.userDataNotLoggedIn.wishList.filter((item)=>!(item.productId === action.payload.productId && item.productVariation===action.payload.productVariation))
        }
      }

    }



  }
})

export const { setCategoryState ,setLoginOption,setDetailOption,setUserData,setProductIdInUserWishList,setFavouriteNotLoggedIn} = userSlice.actions;
export default userSlice.reducer;