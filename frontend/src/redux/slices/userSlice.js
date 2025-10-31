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
    }

  }
})

export const { setCategoryState ,setLoginOption,setDetailOption,setUserData} = userSlice.actions;
export default userSlice.reducer;