import axios from "axios";
import { useEffect, useState } from "react";
import { CART_ENDPOINTS, PRODUCT_ENDPOINTS } from "../pages/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/slices/cartSlice";

export function useGetAllCartItems(userId,refresh,shouldCallDB){
    const [productData,setProductData]=useState([])
    const [productVariationData,setProductVariationData]=useState([])
    const [productQuantityData,setProductQuantityData]=useState([])
    const [realCartData,setRealCartData]=useState([])

    useEffect(()=>{
        async function getAllCartItems(){
            
            try{
                let result;
                let cartData;
                if(userId!==undefined && shouldCallDB){  /// if the user is loggedIn
                    console.log("DB called"+":"+shouldCallDB)
                    result=await axios.get(`${CART_ENDPOINTS}/getCartItems/${userId}`,{withCredentials:true})
                    cartData=result?.data?.cartData
                }else{          //// if the user is not loggedIn
                    result=await axios.get(`${CART_ENDPOINTS}/getCartItems/${userId=undefined}`,{withCredentials:true})
                    cartData=result?.data?.cartData
                }

                console.log("hola",cartData)

                const productIds=cartData.map((obj)=>{return obj["productId"]})
                const productVariationData=cartData.map((obj)=>{return obj["productVariation"]})
                const productQuantityData=cartData.map((obj)=>{return obj["productQuantity"]})
                const secondsCallResult=await axios.post(`${PRODUCT_ENDPOINTS}/getProductsViaId`,{productIds:productIds},{withCredentials:true})
                
                setProductData(secondsCallResult?.data?.productData)
                setProductVariationData(productVariationData)
                setProductQuantityData(productQuantityData)
                setRealCartData(cartData)

            }catch(error){
                console.log("wrong in cart custom hook",error)
            }
        }

        getAllCartItems()
    },[refresh])

    return {productData,productVariationData,productQuantityData,realCartData}
}