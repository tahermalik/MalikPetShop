import { createSlice } from "@reduxjs/toolkit";

const activeSlice = createSlice({
  name: "active",
  initialState: {
    imgCounter:0
  },
  reducers: {
    setImageCounter:(state,action)=>{
        state.imgCounter=action.payload
    },
    setDetailsCounter:(state,action)=>{
        state.detailsCounter=action.payload
    }
  }
})

export const { setImageCounter} = activeSlice.actions;
export default activeSlice.reducer;