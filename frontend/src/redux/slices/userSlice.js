import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData:null,categoryState:false, upperHeader:false
  },
  reducers: {
    setCategoryState:(state)=>{
        state.categoryState=!state.categoryState
    },
    setUpperHeader:(state)=>{
      state.upperHeader=!state.upperHeader
    }
  }
})

export const { setCategoryState ,setUpperHeader} = userSlice.actions;
export default userSlice.reducer;