import axios from "axios";
import { useEffect, useState } from "react";
import { CART_ENDPOINTS, COUPON_ENDPOINT, PRODUCT_ENDPOINTS } from "../pages/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { addBrand, setProducts } from "../redux/slices/cartSlice";

export function useGetAllCartItems(userId,refresh,shouldCallDB){
    const [productData,setProductData]=useState([])
    const [productVariationData,setProductVariationData]=useState([])
    const [productQuantityData,setProductQuantityData]=useState([])
    const [realCartData,setRealCartData]=useState([])
    const [brandData,setBrandData]=useState([])
    const [getCouponId,setCouponId]=useState("")
    const dispatch=useDispatch();

    useEffect(()=>{
        async function getAllCartItems(){
            
            try{
                let result;
                let cartData;
                if(userId!==undefined && shouldCallDB){  /// if the user is loggedIn
                    console.log("DB called"+":"+shouldCallDB)
                    result=await axios.get(`${CART_ENDPOINTS}/getCartItems`,{withCredentials:true})
                    cartData=result?.data?.cartData
                }else{          //// if the user is not loggedIn
                    result=await axios.get(`${CART_ENDPOINTS}/getCartItems`,{withCredentials:true})
                    cartData=result?.data?.cartData
                }


                console.log("hola",cartData)

                /// in order to know which coupon was selected by the user
                let couponIdResult=await axios.get(`${COUPON_ENDPOINT}/getCouponId`,{withCredentials:true})
                setCouponId(couponIdResult?.data?.couponId)

                /// addition of the brand for the coupon UI 
                for(let i=0;i<cartData.length;i++){
                    dispatch(addBrand(cartData[i]["brand"]))
                }

                const productIds=cartData.map((obj)=>{return obj["productId"]})
                const productVariationData=cartData.map((obj)=>{return obj["productVariation"]})
                const productQuantityData=cartData.map((obj)=>{return obj["productQuantity"]})
                const brands=cartData.map((obj)=>{return obj["brand"]})
                const secondsCallResult=await axios.post(`${PRODUCT_ENDPOINTS}/getProductsViaId`,{productIds:productIds},{withCredentials:true})
                
                setProductData(secondsCallResult?.data?.productData)
                setProductVariationData(productVariationData)
                setProductQuantityData(productQuantityData)
                setBrandData(brands)
                setRealCartData(cartData)

            }catch(error){
                console.log("wrong in cart custom hook",error)
            }
        }

        getAllCartItems()
    },[refresh])

    return {productData,productVariationData,productQuantityData,realCartData,brandData,getCouponId}
}