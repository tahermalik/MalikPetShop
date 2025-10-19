import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    originalPrices:[],discounts:[],images:[],netQuantity:[],productName:null,nutrition:"null",calories:"null",skinHealth:"null",digestion:"null",dentalHealth:"null",manufacturerDetails:null,productDescription:null
  },
  reducers: {
    setOriginalPrice:(state,action)=>{
        state.originalPrices.includes(action.payload)
    },
    setDiscount:(state,action)=>{
        state.discounts.includes(action.payload)
    },
    setImage:(state,action)=>{
        state.images.includes(action.payload)
    },
    setNetQuantity:(state,action)=>{
        state.netQuantity.includes(action.payload)
    },
    setProductName:(state,action)=>{
        state.productName.includes(action.payload)
    },
    setNutrition:(state,action)=>{
        state.nutrition.includes(action.payload)
    },
    setCalories:(state,action)=>{
        state.calories.includes(action.payload)
    },
    setSkinHealth:(state,action)=>{
        state.skinHealth.includes(action.payload)
    },
    setDigestion:(state,action)=>{
        state.digestion.includes(action.payload)
    },
    setDentalHealth:(state,action)=>{
        state.dentalHealth.includes(action.payload)
    },
    setManufacturerDetails:(state,action)=>{
        state.manufacturerDetails.includes(action.payload)
    },
    setProductDescription:(state,action)=>{
        state.productDescription.includes(action.payload)
    }
  }
})

export const { setOriginalPrice,setDiscount,setImage,setProductName,setNetQuantity,setNutrition,setCalories,setSkinHealth,setDigestion,setDentalHealth,setManufacturerDetails,setProductDescription} = productSlice.actions;
export default productSlice.reducer;