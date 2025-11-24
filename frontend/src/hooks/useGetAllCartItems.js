import axios from "axios";
import { useEffect, useState } from "react";
import { CART_ENDPOINTS, PRODUCT_ENDPOINTS } from "../pages/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/slices/cartSlice";

export function useGetAllCartItems(userId,refresh,shouldCallDB){
    const [cartData,setCartData]=useState([])
    const [productVariationData,setProductVariationData]=useState([])
    const [productQuantityData,setProductQuantityData]=useState([])
    let reduxCartData=useSelector((state)=>state?.cart?.products)
    const dispatch=useDispatch()

    useEffect(()=>{
        async function getAllCartItems(){
            try{
                let result;
                let cartData;
                if(userId!==undefined && shouldCallDB){  /// if the user is loggedIn
                    console.log("DB called"+":"+shouldCallDB)
                    result=await axios.get(`${CART_ENDPOINTS}/getCartItems/${userId}`)
                    cartData=result?.data?.cartData
                    dispatch(setProducts(cartData))


                }else{          //// if the user is not loggedIn
                    console.log("DB not called")
                    console.log("helllo")
                    cartData=reduxCartData
                }

                const productIds=cartData.map((obj)=>{return obj["productId"]})
                const productVariationData=cartData.map((obj)=>{return obj["productVariation"]})
                const productQuantityData=cartData.map((obj)=>{return obj["productQuantity"]})
                const secondsCallResult=await axios.post(`${PRODUCT_ENDPOINTS}/getProductsViaId`,{productIds:productIds},{withCredentials:true})
                
                setCartData(secondsCallResult?.data?.productData)
                setProductVariationData(productVariationData)
                setProductQuantityData(productQuantityData)

            }catch(error){
                console.log("wrong in cart custom hook",error)
            }
        }

        getAllCartItems()
    },[refresh])

    return {cartData,productVariationData,productQuantityData}
}