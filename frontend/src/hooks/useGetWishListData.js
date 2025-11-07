import axios from "axios";
import { useEffect, useState } from "react";
import { USER_ENDPOINTS } from "../pages/endpoints";

export default function useGetWishListData(userId,refresh){
    const [productData,setProductData]=useState([])
    useEffect(()=>{
        async function getWishListData(){
            try{
                const result=await axios.get(`${USER_ENDPOINTS}/viewWishList/${userId}`)
                // console.log(result?.data?.productData)
                setProductData(result?.data?.productData)

            }catch(error){
                console.log("error in custom hook wishList",error)
            }
        }

        getWishListData()
    },[refresh])
    return productData;
}