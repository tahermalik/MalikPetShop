import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData:null,categoryState:false, loginOption:false,detailOption:false
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
          (obj) => obj.productId === productId
        );

        if (index !== -1) {
          // If already exists → remove it
          state.userData.wishList.splice(index, 1);
        } else {
          // If not exists → add it
          state.userData.wishList.push({ productId :productId,productVariation:productVariation});
        }
      }
    }

  }
})

export const { setCategoryState ,setLoginOption,setDetailOption,setUserData,setProductIdInUserWishList} = userSlice.actions;
export default userSlice.reducer;