import { createSlice } from "@reduxjs/toolkit";

const layoutSlice = createSlice({
  name: "layout",
  initialState: {
    headerHeight:0,
    sideBarLength:0
  },
  reducers: {
    setHeaderHight:(state,action)=>{
      state.headerHeight=action.payload
    },
    setSideBarLength:(state,action)=>{
      state.sideBarLength=action.payload
    }
  }
})

export const { setHeaderHight,setSideBarLength} = layoutSlice.actions;
export default layoutSlice.reducer;