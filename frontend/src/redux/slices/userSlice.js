import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData:null,categoryState:false, loginLogout:false,contactState:false
  },
  reducers: {
    setCategoryState:(state)=>{
        state.categoryState=!state.categoryState
    },
    setLoginLogoutState:(state)=>{
        state.loginLogout=!state.loginLogout
    },
    setContactState:(state)=>{
      state.contactState=!state.contactState
    }
  }
})

export const { setCategoryState ,setLoginLogoutState,setContactState} = userSlice.actions;
export default userSlice.reducer;