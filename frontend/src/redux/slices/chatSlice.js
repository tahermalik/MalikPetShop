import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages:[
        {
            role: "bot",
            text: "Hi 👋 I’m MalikPetShop Assistant. I am here to recommend you the best possible products depending upon your requirements",
        }
    ]
  },
  reducers: {
    setMessages:(state,action)=>{
        // action.payload will be an object
        state?.messages.push(action.payload)
    }
  }
})

export const {setMessages} = chatSlice.actions;
export default chatSlice.reducer;