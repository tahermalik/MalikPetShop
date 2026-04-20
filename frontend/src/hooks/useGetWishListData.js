import axios from "axios";
import { useEffect, useState } from "react";
import { PRODUCT_ENDPOINTS, USER_ENDPOINTS } from "../pages/endpoints";
import { useSelector,useDispatch } from "react-redux";
import { removeMissingFromWishlist ,replaceEntireWishList} from "../redux/slices/wishListSlice";
import toast from "react-hot-toast";
import store from "../redux/store";

export default function useGetWishListData(userId,refresh){
    const [productData,setProductData]=useState([])
    const [productVariationData,setProductVaraitionData]=useState([])
    const dispatch=useDispatch()
    let wishListData=useSelector((state)=>state?.wishList?.wishList);
    useEffect(()=>{
        async function getWishListData(){
            try{
                // if the user is logged in
                const wishList_result=await axios.post(`${USER_ENDPOINTS}/viewWishList`,{},{withCredentials:true})
                
                // simply fetch from the redux
                if(wishList_result?.data?.comment==="GUEST"){

                }else{  // data will come from redis if it is a hit otherwise from DB and populate redis
                    wishListData=wishList_result?.data?.wishListData
                    dispatch(replaceEntireWishList(wishListData))

                }

                if (!wishListData || wishListData.length === 0) {
                    setProductData([]);
                    setProductVaraitionData([]);
                    return;
                }
                
                const productIds=wishListData.map((item)=>item["productId"])
                const productVariationArray=wishListData.map((item)=>item["productVariation"])
                const result= await axios.post(`${PRODUCT_ENDPOINTS}/getProductsViaId`,{productIds:productIds,productVariationArray:productVariationArray})
                // console.log("missing :- ",result?.data?.missingIds)
                const missingIds=result?.data?.missingIds
                if (missingIds.length > 0) {
                    dispatch(removeMissingFromWishlist(missingIds));
                }
                setProductData(result?.data?.productData)
                setProductVaraitionData(productVariationArray)   
                
            }catch(error){
                console.log("error in custom hook wishList",error)
                toast.error(error?.response?.data?.message || "Something went wrong")
            }
        }

        getWishListData()
    },[refresh,userId])
    return {productData,productVariationData};
}