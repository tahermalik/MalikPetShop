import axios from "axios";
import { useEffect, useState } from "react";
import { CART_ENDPOINTS, PRODUCT_ENDPOINTS } from "../pages/endpoints";

export function useGetAllCartItems(userId,refresh){
    const [cartData,setCartData]=useState([])
    const [productVariationData,setProductVariationData]=useState([])

    useEffect(()=>{
        async function getAllCartItems(){
            try{
                const result=await axios.get(`${CART_ENDPOINTS}/getCartItems/${userId}`)

                const cartData=result?.data?.cartData
                const productIds=cartData.map((obj)=>{return obj["productId"]})
                const productVariationData=cartData.map((obj)=>{return obj["productVariation"]})

                const secondsCallResult=await axios.post(`${PRODUCT_ENDPOINTS}/getProductsViaId`,{productIds:productIds},{withCredentials:true})

                setCartData(secondsCallResult?.data?.productData)
                setProductVariationData(productVariationData)

            }catch(error){
                console.log("wrong in cart custom hook",error)
            }
        }

        getAllCartItems()
    },[refresh])

    return {cartData,productVariationData}
}