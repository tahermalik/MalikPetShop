import { createSlice } from "@reduxjs/toolkit";

const layoutSlice = createSlice({
  name: "layout",
  initialState: {
    headerHeight:0
  },
  reducers: {
    setHeaderHight:(state,action)=>{
        state.headerHeight=action.payload
    }
  }
})

export const { setHeaderHight} = layoutSlice.actions;
export default layoutSlice.reducer;