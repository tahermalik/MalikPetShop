import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData:null,categoryState:false, loginLogout:false
  },
  reducers: {
    setCategoryState:(state)=>{
        state.categoryState=!state.categoryState
    },
    setLoginLogoutState:(state)=>{
        state.loginLogout=!state.loginLogout
    }
  }
})

export const { setCategoryState ,setLoginLogoutState} = userSlice.actions;
export default userSlice.reducer;