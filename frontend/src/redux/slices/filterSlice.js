import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filter",
  initialState: {
    flavorFilter:[],breedFilter:[],diet:[],pets:[],brands:[]
  },
  reducers: {
    setFlavor:(state,action)=>{
        if(state.flavorFilter.includes(action.payload)){
          state.flavorFilter=state.flavorFilter.filter(item=>item!==action.payload)
        }else state.flavorFilter.push(action.payload)
    },
    setBreed:(state,action)=>{
        if(state.breedFilter.includes(action.payload)){
          state.breedFilter=state.breedFilter.filter(item=>item!==action.payload)
        }else state.breedFilter.push(action.payload)
    },
    setDiet:(state,action)=>{
      if(state.diet.includes(action.payload)){
        state.diet=state.diet.filter(item=>item!==action.payload)
      }else state.diet.push(action.payload)
    },
    setPets:(state,action)=>{
      if(state.pets.includes(action.payload)){
        state.pets=state.pets.filter(item=>item!==action.payload)
      }else state.pets.push(action.payload)
    },
    setBrands:(state,action)=>{
      if(state.brands.includes(action.payload)){
        state.brands=state.brands.filter(item=>item!==action.payload)
      }else state.brands.push(action.payload)
    }
  }
})

export const { setFlavor,setBreed,setDiet,setPets,setBrands} = filterSlice.actions;
export default filterSlice.reducer;