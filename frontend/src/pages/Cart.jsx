import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import axios from "axios"
import { CART_ENDPOINTS, COUPON_ENDPOINT } from "./endpoints";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllCartItems } from "../hooks/useGetAllCartItems";
import { decrementQuantity, incrementQuantity, removeProduct, setProducts } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function CartCardSkeleton() {
  return (
    <div
      className="
        relative overflow-hidden
        grid grid-cols-2 grid-rows-[1.5fr_0.5fr]
        sm:grid-cols-[2fr_0fr_0.5fr_0.5fr]
        sm:grid-rows-1
        border-b border-gray-200 pb-4
      "
    >
      {/* SHIMMER OVERLAY */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.4s_infinite]" />

      {/* IMAGE + TEXT */}
      <div className="flex items-center gap-4 p-2 col-span-2">
        <div className="w-24 h-24 rounded-lg bg-gray-200 shrink-0" />

        <div className="flex flex-col gap-3 w-full">
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
          <div className="h-3 w-1/4 bg-gray-200 rounded" />
        </div>
      </div>

      {/* QUANTITY */}
      <div className="flex items-center justify-start sm:justify-center gap-3 pl-2 sm:p-2">
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <div className="h-4 w-6 bg-gray-200 rounded" />
        <div className="w-8 h-8 rounded-full bg-gray-200" />
      </div>

      {/* PRICE + REMOVE */}
      <div className="flex flex-col items-end sm:justify-center gap-2 pr-2 sm:p-2">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-3 w-14 bg-gray-200 rounded" />
      </div>
    </div>
  );
}


export default function CartPage() {
  const navigate = useNavigate();
  const [coupanAmount, setCoupanAmount] = useState(0);
  const [coupanVisible, setCoupanVisible] = useState(false);
  const [coupanIndex, setCoupanIndex] = useState(-1) /// none of the coupans are applied initially
  const [coupons, setCoupons] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state?.user?.userData)
  const hadfetched = useRef(false);
  const [checkTime, setCheckTime] = useState(0)
  const dispatch = useDispatch()
  const [skeleton, setSkeleton] = useState(true);

  const [shouldCallDB, setShouldCallDB] = useState(true)
  const [refresh, setRefresh] = useState(0) /// specially when item is removed from the cart
  const [cartItems, setCartItems] = useState([])
  const { cartData, productVariationData, productQuantityData } = useGetAllCartItems(userData?._id, refresh, shouldCallDB)


  if (!cartData) {
    return (
      <div>Loading...</div>
    )
  }

  useEffect(() => {
    setCartItems(cartData);
  }, [cartData])


  const increaseQty = (stock, productId, productVariation) => {
    dispatch(incrementQuantity({ productId: productId, productVariation: productVariation, stock: stock }))
    setShouldCallDB(false);
    console.log("on increse btn clicked" + shouldCallDB)
    setRefresh(prev => prev + 1);
  };

  const decreaseQty = (productId, productVariation) => {
    dispatch(decrementQuantity({ productId: productId, productVariation: productVariation }))
    setShouldCallDB(false)
    setRefresh(prev => prev + 1);
  };

  /// when the user is loggedIn and when the user is not loggedIn
  async function removeItem(e, productId, userId, productVariation) {
    e.preventDefault()
    e.stopPropagation()
    const obj = {
      productId: productId,
      productVariation: productVariation
    }
    console.log("fucking removing the product")
    dispatch(removeProduct(obj))
    if (userData) {
      const result = await axios.post(`${CART_ENDPOINTS}/removeCartItem`, { userId, productId, productVariation }, { withCredentials: true })
    }
    setShouldCallDB(false);
    setRefresh(prev => prev + 1)
  };

  function discountAmount(price, discount) {
    return Math.floor(discount * (price / 100))
  }
  const subtotal = cartItems.reduce(
    (acc, item, index) => acc + (item.originalPrice[productVariationData[index]] - discountAmount(item.originalPrice[productVariationData[index]], item.discountValue[productVariationData[index]])) * productQuantityData[index],
    0
  );

  const shipping = subtotal > 5000 ? 0 : 99;
  const total = subtotal + shipping;

  useEffect(() => {
    if (coupanIndex !== -1) {
      setCoupanAmount(discountAmount(total - shipping, coupons[coupanIndex]["couponDiscountValue"]))
      console.log("coupan amount changed")
    }

    if (cartItems.length === 0) {
      setCoupanIndex(-1);
      setCoupanAmount(0);
    }
  }, [cartItems, coupanIndex, total])


  //// dealing with Pagination
  const fetchCoupons = async () => {
    if (loading) return;
    setLoading(true);

    const res = await axios.post(`${COUPON_ENDPOINT}/viewCoupons`, { limit: 10, lastId: nextCursor }, { withCredentials: true });
    console.log("Taher Malik", res.data.coupons.length)
    setCoupons(prev => [...prev, ...res.data.coupons]);
    setNextCursor(res.data.nextCursor);
    setLoading(false);
  };

  useEffect(() => {
    if (!hadfetched.current) {
      fetchCoupons();
      hadfetched.current = true
    }
  }, []);

  // Infinite scroll
  const scrollHandle = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // console.log("Measurements",scrollTop,scrollHeight,clientHeight)

    // Check if user reached bottom (or within small threshold)
    if ((scrollTop + clientHeight >= scrollHeight - 10) && hadfetched.current) {
      console.log("🎯 Reached bottom!");
      fetchCoupons(); // for example
      hadfetched.current = false;
    }
  };

  function fetchCurrentTime(time) {
    //// expiry time will be in date and time
    if (typeof time === "undefined") return "lifetime" ///// endDate can be undefined so for it it is lifetime
    const now = new Date();
    time = new Date(time);
    const timeLeftMs = time - now;
    if (timeLeftMs < 0) return -1;
    const seconds = Math.floor(timeLeftMs / 1000) % 60;
    const minutes = Math.floor(timeLeftMs / (1000 * 60)) % 60;
    const hours = Math.floor(timeLeftMs / (1000 * 60 * 60)) % 24;
    const days = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));

    if (days !== 0) return days >= 2 ? `${days} Days` : `${days} Day`
    else if (hours !== 0) return `${hours} Hour`
    else return `${minutes} Minute : ${seconds} Seconds`
  }

  /// just to force re rendering of the components in every second
  useEffect(() => {
    const a = setInterval(() => {
      setCheckTime(prev => !prev)
    }, 1000)

    return () => clearInterval(a)
  }, [])

  //// function to check whether the coupon can be applied or not
  function checkCoupon(start, end) {
    const now = new Date();
    start = new Date(start);

    if (typeof end !== "undefined") {
      end = new Date(end);
      if (now >= end) return false;
    }

    if (start >= now) return false;
    return true;

  }

  const user = useSelector((state) => state?.user?.userData)
  const reduxCartData = useSelector((state) => state?.cart?.products)
  const userId = user?._id;
  async function placeOrder(e, totalAmount) {
    try {
      e.preventDefault();
      e.stopPropagation();
      if (totalAmount <= 1000 && user != null) toast.error("Order cant be placed for amount less then 1000")
      else if (user === null) navigate("/Login", { state: { user: "user" } })
      else {
        await axios.post(`${CART_ENDPOINTS}/mergeCartItemsAppCall`, { userId: userId, reduxCartData: reduxCartData })
        navigate("/addressForm")
      }
    } catch (error) {
      console.log("Somwthing went wrong in place order in the front end");
    }
  }

  //// hook used in order to implement skeleton effect
  useEffect(() => {
    setTimeout(() => {
      setSkeleton(false);
    }, 800)
  })



  return (
    <div className=" relative min-h-screen bg-blue-50 py-10 px-4 flex flex-col items-center md:items-start md:flex-row justify-center gap-10">
      {/* Left - Cart Items */}
      <div className="bg-white w-[90%] md:w-[70%] md:max-w-3xl rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Your Cart</h2>
        {cartItems.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            🛒 Your cart is empty
          </div>
        ) : (
          <div className="space-y-6">

            {/* Cart Items */}
            {cartItems.map((item, index) => (

              //// written in order to implement skeleton effect
              skeleton ? <CartCardSkeleton /> :
                <div
                  className="grid grid-cols-2 grid-rows-[1.5fr_0.5fr] sm:grid-cols-[2fr_0fr_0.5fr_0.5fr] sm:grid-rows-1 border-b border-gray-200 pb-4"
                >
                  <div className="flex items-center gap-4 p-2 col-span-2">
                    <img
                      src={`http://localhost:3000/${item.image[productVariationData[index]]}`}
                      alt={item.productName}
                      className="w-25 h-25 object-cover rounded-lg "
                    />
                    <div className="w-full">
                      <h3 className="font-medium text-gray-800">{item.productName}</h3>
                      <p className="text-sm text-gray-500">₹{item.originalPrice[productVariationData[index]] - discountAmount(item.originalPrice[productVariationData[index]], item.discountValue[productVariationData[index]])}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-start sm:justify-center gap-3 pl-2 sm:p-2">
                    <div
                      onClick={() => decreaseQty(item._id, productVariationData[index])}
                      className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 flex items-center justify-center"
                    >
                      −
                    </div>
                    <span className="font-semibold font-sans">{productQuantityData[index]}</span>  {/* This need to change*/}
                    <div
                      onClick={() => increaseQty(item.stock[productVariationData[index]] - 1, item._id, productVariationData[index])}    ///want at least one product to stay
                      className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 flex items-center justify-center"
                    >
                      +
                    </div>
                  </div>

                  <div className="text-right pr-2 flex flex-col items-end sm:p-2 sm:justify-center">
                    <p className="font-semibold text-gray-700 font-sans">
                      ₹{(item.originalPrice[productVariationData[index]] - discountAmount(item.originalPrice[productVariationData[index]], item.discountValue[productVariationData[index]])) * Number(productQuantityData[index])}
                    </p>
                    <button
                      onClick={(e) => removeItem(e, item._id, userData?._id, productVariationData[index])}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>


      {/* Right - Order Summary */}
      <div className="flex flex-col gap-3 md:w-[30%] w-[90%]">
        <div className="flex justify-center items-center bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 hover:from-blue-600 hover:via-blue-500 hover:to-blue-400 cursor-pointer rounded-2xl py-2 px-1 hover:text-white" onClick={() => setCoupanVisible(!coupanVisible)}>
          <span>Apply Coupans for Extra discount!!!</span>
        </div>
        <div className="bg-white w-full h-fit rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">
            Order Summary
          </h3>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-sans">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Coupan</span>
              <span className="font-sans">₹{coupanAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-sans">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            <div className="border-t border-gray-200 my-3"></div>
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span className="font-sans">₹{total - coupanAmount}</span>
            </div>
          </div>

          <div onClick={(e) => { placeOrder(e, total - coupanAmount) }} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center">
            Proceed to Checkout
          </div>

          <p className="text-sm text-center text-gray-500 mt-3 font-sans">
            You’re ₹{5000 - subtotal > 0 ? 5000 - subtotal : 0} away from free
            shipping!
          </p>
        </div>
      </div>



      {/* Coupan Window */}
      {coupanVisible && (
        <div
          className="
      fixed inset-0 z-[999]
      bg-black/30 backdrop-blur-sm
      flex justify-center items-end sm:items-center
      animate-fadeIn
    "
        >
          <div
            className="
        relative
        w-full h-full
        sm:top-0 sm:w-[420px] sm:h-[620px]
        bg-white/80 backdrop-blur-xl
        sm:rounded-3xl
        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        flex flex-col
        overflow-auto scrollbar-hide
        p-4 gap-4
        animate-slideUp sm:animate-scaleIn
      "
            onScroll={(e) => scrollHandle(e)}
          >

            {/* Header */}
            <div className="flex items-center rounded-3xl gap-3 sticky top-0 bg-white/70 backdrop-blur-md py-2 px-2 z-10 w-[100%]">
              <div
                className="
                cursor-pointer
                p-2 rounded-full
                hover:bg-blue-100
                active:scale-95
                transition
              "
                onClick={() => { setCoupanVisible(false); }}
              >
                <FiArrowLeft size={18} />
              </div>

              <div className="font-semibold tracking-wide text-lg sm:text-xl underline">
                Coupons
              </div>
            </div>

            {/* Coupon Cards */}
            {coupons.map((_, index) => (
              <div
                key={index}
                className="
            w-full
            bg-white
            rounded-2xl
            p-4
            flex flex-col gap-2
            shadow-sm
            hover:shadow-lg
            transition-all duration-300
            cursor-pointer
            border border-gray-100
          "
              >
                <div className="flex justify-between items-center gap-2">
                  <div
                    className="
                border-2 border-dashed border-gray-800
                px-3 py-1
                rounded-lg
                font-semibold
                tracking-widest
                text-sm sm:text-lg
              "
                  >
                    {coupons[index]["couponCode"]}
                  </div>

                  {coupanIndex !== index && (
                    <div
                      className={`
                  px-4 py-1.5
                  rounded-full
                  text-sm font-medium text-white
                  transition-all duration-300
                  ${checkCoupon(
                        coupons[index]["couponStartDate"],
                        coupons[index]["couponEndDate"]
                      )
                          ? "bg-blue-500 hover:bg-blue-600 active:scale-95"
                          : "bg-blue-400 opacity-50 pointer-events-none"}
                `}
                      onClick={() => { setCoupanIndex(index); }}
                    >
                      Apply
                    </div>
                  )}

                  {coupanIndex === index && (
                    <div className="flex items-center gap-1 text-emerald-500 font-medium text-sm">
                      <IoCheckmarkDoneOutline size={16} />
                      Applied
                    </div>
                  )}
                </div>

                <div className="text-emerald-600 text-sm sm:text-base font-medium">
                  Save upto ₹
                  <span className="font-semibold">
                    {discountAmount(
                      total - shipping,
                      Number(coupons[index]["couponDiscountValue"])
                    )}{" "}
                    ; {coupons[index]["couponDiscountValue"]}%
                  </span>
                </div>

                <div className="text-[11px] sm:text-sm flex justify-between text-gray-500">
                  <div>*T&C Applied</div>
                  <div>
                    {fetchCurrentTime(coupons[index]["couponStartDate"]) === -1
                      ? fetchCurrentTime(coupons[index]["couponEndDate"]) !== -1
                        ? `Ends in ${fetchCurrentTime(coupons[index]["couponEndDate"])}`
                        : "Expired"
                      : `Starts in ${fetchCurrentTime(coupons[index]["couponStartDate"])}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
