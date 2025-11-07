import React from "react";
import { IoIosHeart } from "react-icons/io";
import useGetWishListData from "../hooks/useGetWishListData";
import { useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { USER_ENDPOINTS } from "./endpoints";
import { useDispatch } from "react-redux";
import { setProductIdInUserWishList } from "../redux/slices/userSlice";

export default function WishListUI() {
    const location=useLocation()
    const userId=location?.state?.userId
    const [refresh,setRefresh]=useState(0)
    const exampleProducts=useGetWishListData(userId,refresh)

    const dispatch=useDispatch()

    console.log("example",exampleProducts)
    if(!exampleProducts){
        return(
            <div>Loading...</div>
        )
    }

    async function removeFavourite(e,productId){
        try{
            e.stopPropagation();
            e.preventDefault();

            console.log("inside remove btn",userId,productId)
            dispatch(setProductIdInUserWishList(productId))
            setRefresh(prev=>prev+1)
            const result= await axios.post(`${USER_ENDPOINTS}/favourite`,{userId:userId,productId:productId,toAdd:false},{withCredentials:true})
        }catch(error){
            console.log("wrong in remove favourite",error)
            setRefresh(prev => prev + 1) // fallback refetch if something failed
        }
    }

    return (
        <div className="flex flex-col gap-2 ">
            <Link to="/product" className="p-2 hover:bg-gray-300 rounded-full w-fit ml-2 mt-2"><FaArrowLeft size={20} /></Link>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {exampleProducts.map((product) => (
                    <div key={product._id} className="w-full bg-blue-50 flex flex-col rounded-2xl shadow hover:shadow-lg hover:bg-blue-100 transition duration-200">
                        <div className="h-[200px] w-full p-2 flex justify-center items-center">
                            <img
                                src={`http://localhost:3000/${product.image[0]}`}
                                alt={product.productName}
                                className="h-full w-full object-contain rounded-xl"
                            />
                        </div>
                        <div className="flex flex-col justify-between h-[180px] p-2">
                            <div className="font-semibold line-clamp-2 text-blue-900">{product.productName}</div>
                            <div className="flex flex-col gap-1 text-blue-800">
                                <span className="text-lg font-sans">
                                    &#8377;{product.originalPrice[0] - Math.floor((product.originalPrice[0] * product.discountValue[0]) / 100)}
                                </span>
                                <span className="line-through text-sm">&#8377;{product.originalPrice[0]}</span>
                                <span className="text-sm">Discount {product.discountValue[0]}%</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200" onClick={(e)=>removeFavourite(e,product._id)}>
                                    <IoIosHeart size={18} className="mr-1" /> Remove
                                </div>
                                <span className="text-sm text-blue-700">{product.netWeight[0]} kg</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );

}
