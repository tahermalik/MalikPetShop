import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filter",
  initialState: {
    flavorFilter:[],breedFilter:[],diet:[],pet:"",brandsFilter:[],typeFilter:"",
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
      state.pet=action.payload
    },
    setBrands:(state,action)=>{
      if(state.brandsFilter.includes(action.payload)){
        state.brandsFilter=state.brandsFilter.filter(item=>item!==action.payload)
      }else state.brandsFilter.push(action.payload)
    },
    setTypeFilter:(state,action)=>{
      state.typeFilter=action.payload
    }
  }
})

export const { setFlavor,setBreed,setDiet,setPets,setBrands,setTypeFilter} = filterSlice.actions;
export default filterSlice.reducer;