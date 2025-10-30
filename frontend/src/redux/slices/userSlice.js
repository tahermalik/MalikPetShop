import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData:null,categoryState:false, upperHeader:false
  },
  reducers: {
    setUserData:(state,action)=>{
      state.userData=action.payload
    },
    setCategoryState:(state)=>{
        state.categoryState=!state.categoryState
    },
    setUpperHeader:(state)=>{
      state.upperHeader=!state.upperHeader
    }
  }
})

export const { setCategoryState ,setUpperHeader,setUserData} = userSlice.actions;
export default userSlice.reducer;