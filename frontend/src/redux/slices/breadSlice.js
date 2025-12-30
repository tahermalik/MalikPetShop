import { createSlice } from "@reduxjs/toolkit";

const breadSlice = createSlice({
  name: "bread",
  initialState: {
    pathArray:[],   //// this array is responsible for maintaining the order i.e in the breadcrumbs
    pathArray:[],   //// this is written so that when the user clicks forward button
    presenceObj:{   //// this is present in order to avoid linear search which is done always

    }
  },
  reducers: {
    addMemberPath:(state,action)=>{
        /// action.payload is the member
        if(action.payload in state?.presenceObj){
            ///// as we are dealing with the index position
            let numInArray=state?.presenceObj[action.payload];
            let pathArrayLength=state?.pathArray.length-1;

            while(pathArrayLength!=numInArray){
                state?.pathArray.pop();
                pathArrayLength-=1;
            }
        }else{
            state?.pathArray.push(action.payload);
            state?.presenceObj[action.payload]=state?.pathArray.length-1;
        }

    }
  }
})

export const { addMemberPath} = breadSlice.actions;
export default breadSlice.reducer;