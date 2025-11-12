import axios from "axios";
import { useEffect, useState } from "react";
import { PRODUCT_ENDPOINTS, USER_ENDPOINTS } from "../pages/endpoints";
import { useSelector } from "react-redux";

export default function useGetWishListData(userId,refresh){
    const [productData,setProductData]=useState([])
    const [productVariationData,setProductVaraitionData]=useState([])
    const wishListData=useSelector((state)=>state?.user?.userDataNotLoggedIn?.wishList)
    useEffect(()=>{
        async function getWishListData(){
            try{
                if(userId){
                    const result=await axios.get(`${USER_ENDPOINTS}/viewWishList/${userId}`)
                    console.log("inside the wishlist UI & the user is logged in")
                    setProductData(result?.data?.productData)
                    setProductVaraitionData(result?.data?.productVariationArray)
                }else{
                    const productIds=wishListData.map((item)=>item["productId"])
                    const productVariationArray=wishListData.map((item)=>item["productVariation"])
                    const result= await axios.post(`${PRODUCT_ENDPOINTS}/getProductsViaId`,{productIds:productIds})
                    setProductData(result?.data?.productData)
                    setProductVaraitionData(productVariationArray)   
                }

            }catch(error){
                console.log("error in custom hook wishList",error)
            }
        }

        getWishListData()
    },[refresh,userId])
    return {productData,productVariationData};
}