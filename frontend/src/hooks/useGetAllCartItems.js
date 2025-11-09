import axios from "axios";
import { useEffect, useState } from "react";
import { CART_ENDPOINTS, PRODUCT_ENDPOINTS } from "../pages/endpoints";
import { useDispatch, useSelector } from "react-redux";

export function useGetAllCartItems(userId,refresh){
    const [cartData,setCartData]=useState([])
    const [productVariationData,setProductVariationData]=useState([])
    let reduxCartData=useSelector((state)=>state?.cart?.products)

    useEffect(()=>{
        async function getAllCartItems(){
            try{
                let result;
                let cartData;
                if(userId!==undefined){  /// if the user is loggedIn
                    result=await axios.get(`${CART_ENDPOINTS}/getCartItems/${userId}`)
                    cartData=result?.data?.cartData
                }else{          //// if the user is not loggedIn
                    console.log("helllo")
                    cartData=reduxCartData
                }

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