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
        if(!state?.userData?.wishList.includes(action.payload)) state?.userData?.wishList.push(action.payload)
        else state.userData.wishList = state?.userData?.wishList.filter((productId)=>productId!==action.payload)
      }
    }

  }
})

export const { setCategoryState ,setLoginOption,setDetailOption,setUserData,setProductIdInUserWishList} = userSlice.actions;
export default userSlice.reducer;