import React from "react";
import { IoIosHeart } from "react-icons/io";
import useGetWishListData from "../hooks/useGetWishListData";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { USER_ENDPOINTS } from "./endpoints";
import { useDispatch } from "react-redux";
import { setFavouriteNotLoggedIn, setProductIdInUserWishList } from "../redux/slices/userSlice";
import toast from "react-hot-toast";
import { Breadcrumbs } from "./Breadcrumbs";

export function EmptyWishlist() {
    const navigate = useNavigate();
    function browseProduct(e) {
        try {
            e.preventDefault();
            e.stopPropagation();
            navigate("/Product_Page")
        } catch (error) {
            console.log(error + "error in browsing the product")
        }
    }
    return (
        <div className="w-full h-[300px] flex flex-col justify-center items-center bg-blue-50 rounded-2xl shadow-md p-6 animate-fadeIn">

            {/* Icon */}
            <div className="text-blue-400 mb-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>

            {/* Message */}
            <h2 className="text-blue-800 text-xl font-semibold mb-2 text-center">
                Your wishlist is empty!
            </h2>
            <p className="text-blue-600 text-center text-sm mb-4">
                Add your favorite products here to keep track of them.
            </p>

            {/* Button (optional) */}
            <div onClick={(e) => browseProduct(e)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                Browse Products
            </div>
        </div>
    );
}


export default function WishListUI() {
    const location = useLocation()
    const userId = location?.state?.userId

    const [refresh, setRefresh] = useState(0)
    const { productData, productVariationData } = useGetWishListData(userId, refresh)

    const dispatch = useDispatch()

    console.log("example", productData)
    if (!productData || productData.length === 0) {
        return (
            <div className="flex h-[100vh] w-full justify-center items-center">
                <EmptyWishlist />
            </div>
        )
    }

    async function removeFavourite(e, productId, productVariation) {
        try {
            e.stopPropagation();
            e.preventDefault();

            console.log("inside remove btn", userId, productId)

            /// if the user is logged in then directly remove the product from the wishlist from the backend itself
            if (userId !== undefined) {
                dispatch(setProductIdInUserWishList({ productId: productId, productVariation: productVariation }))
                console.log("holaaaaaa")
                const result = await axios.post(`${USER_ENDPOINTS}/favourite`, { userId: userId, productId: productId, toAdd: false, productVariation: productVariation }, { withCredentials: true })
                toast.success(result?.data?.message)
            } else {
                const obj = {
                    productId: productId,
                    productVariation: productVariation
                }
                dispatch(setFavouriteNotLoggedIn(obj))
            }
            setRefresh(prev => prev + 1)
        } catch (error) {
            console.log("wrong in remove favourite", error)
            setRefresh(prev => prev + 1) // fallback refetch if something failed
        }
    }

    return (
        <>
            <Breadcrumbs/>
            <div className="flex flex-col gap-2 ">
                {true===false && <div className="sticky top-0 z-30">
                    <div
                        className="
                    flex items-center gap-4
                    px-4 py-3
                    rounded-2xl
                    bg-white/70 backdrop-blur-xl
                    shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                    border border-white/40
                    transition-all duration-300
                    "
                    >
                        {/* Back Button */}
                        <Link
                            to="/product"
                            className="
            group
            flex items-center justify-center
            h-10 w-10
            rounded-full
            bg-white/80
            shadow-md
            hover:shadow-lg
            hover:bg-gray-100
            active:scale-95
            transition-all duration-300
          "
                        >
                            <FaArrowLeft
                                size={18}
                                className="text-gray-700 group-hover:-translate-x-1 transition-transform duration-300"
                            />
                        </Link>

                        {/* Title */}
                        <span className="text-lg font-semibold tracking-wide text-gray-800">
                            Wishlist
                        </span>
                    </div>
                </div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {productData.map((product, index) => (
                        <div className="w-full bg-blue-50 flex flex-col rounded-2xl shadow hover:shadow-lg hover:bg-blue-100 transition duration-200">
                            <div className="h-[200px] w-full p-2 flex justify-center items-center">
                                <img
                                    src={`http://localhost:3000/${product.image[productVariationData[index]]}`}
                                    alt={product.productName}
                                    className="h-full w-full object-contain rounded-xl"
                                />
                            </div>
                            <div className="flex flex-col justify-between h-[180px] p-2">
                                <div className="font-semibold line-clamp-2 text-blue-900">{product.productName}</div>
                                <div className="flex flex-col gap-1 text-blue-800">
                                    <span className="text-lg font-sans">
                                        &#8377;{product.originalPrice[productVariationData[index]] - Math.floor((product.originalPrice[productVariationData[index]] * product.discountValue[productVariationData[index]]) / 100)}
                                    </span>
                                    <span className="line-through text-sm">&#8377;{product.originalPrice[productVariationData[index]]}</span>
                                    <span className="text-sm">Discount {product.discountValue[productVariationData[index]]}%</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200" onClick={(e) => removeFavourite(e, product._id, productVariationData[index])}>
                                        <IoIosHeart size={18} className="mr-1" /> Remove
                                    </div>
                                    <span className="text-sm text-blue-700">{product.netWeight[productVariationData[index]]} kg</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>

    );

}
