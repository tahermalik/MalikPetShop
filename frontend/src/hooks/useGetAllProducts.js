import axios from "axios"
import { useEffect, useState } from "react"
import { PRODUCT_ENDPOINTS } from "../pages/endpoints"
import { shallowEqual, useSelector } from "react-redux"
import { useMemo } from "react"

export function useGetAllProduct(refresh,query,data){
    const [products,setProducts]=useState([])
    const flavorArray=useSelector((state)=>state?.filter?.flavorFilter,shallowEqual)
    const breedArray=useSelector((state)=>state?.filter?.breedFilter,shallowEqual)
    const dietArray=useSelector((state)=>state?.filter?.diet,shallowEqual)
    const pet=useSelector((state)=>state?.filter?.pet)
    const brandsArray=useSelector((state)=>state?.filter?.brandsFilter,shallowEqual)
    const type=useSelector((state)=>state?.filter?.typeFilter)

    const arrayFilter = useMemo(() => [
        { flavor: flavorArray },
        { breed: breedArray },
        { diet: dietArray },
        { pet },
        { brand: brandsArray },
        { type },
    ], [flavorArray, breedArray, dietArray, pet, brandsArray, type]);

    useEffect(()=>{
        async function fetchProducts(){
            try{
                const res = await axios.post(`${PRODUCT_ENDPOINTS}/displayProduct`,{arrayFilter},{withCredentials:true})
                // console.log("Product details res ",res.data.products)
                setProducts(res.data.products)
            }catch(error){

            }
        }

        fetchProducts()
    },[flavorArray, breedArray, dietArray,brandsArray, type,refresh,query])
    return products
}