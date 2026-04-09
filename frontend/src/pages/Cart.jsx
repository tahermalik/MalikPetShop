import React, { useEffect, useState } from "react";
import axios from "axios"
import { BASE_URL, CART_ENDPOINTS, COUPON_ENDPOINT, USER_ENDPOINTS } from "./endpoints";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllCartItems } from "../hooks/useGetAllCartItems";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Coupon } from "./Coupon.jsx";
import { Breadcrumbs } from "./Breadcrumbs.jsx";
import { removeBrand } from "../redux/slices/cartSlice.js";

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
  const [coupanVisible, setCoupanVisible] = useState(false);
  const userData = useSelector((state) => state?.user?.userData)
  const [skeleton, setSkeleton] = useState(true);
  const [shouldCallDB, setShouldCallDB] = useState(true)
  const [refresh, setRefresh] = useState(0) /// specially when item is removed from the cart
  const [cartData, setCartData] = useState([])
  const [couponId, setCouponId] = useState("")
  const [couponAmount, setCouponAmount] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState({})

  const dispatch = useDispatch();
  const { productData, productVariationData, productQuantityData, realCartData, brandData, getCouponId ,coupon} = useGetAllCartItems(userData?._id, refresh, shouldCallDB)
  // realCartData is an array of objects

  // to set the coupon amount when a coupon is selected
  function couponAmountFunction(couponAmount) {
    setCouponAmount(couponAmount)
  }


  useEffect(() => {
    setCouponId(getCouponId)
    setSelectedCoupon(coupon)
  }, [getCouponId,coupon])

  useEffect(() => {
    setCartData(realCartData)
  }, [realCartData])

  useEffect(() => {
    async function calculateCouponDiscountValue() {
      const currentDate = new Date()

      // ADD THIS CHECK FIRST
      if (!selectedCoupon || Object.keys(selectedCoupon).length === 0) {
        setCouponAmount(0);
        return;
      }

      console.log(selectedCoupon,"hola")

      if (total <= 0) {
        setCouponAmount(0)
        return;
      }


      if (selectedCoupon["couponMinOrderAmount"] > total) {
        setCouponAmount(0);
        return;
      }

      if (currentDate > selectedCoupon["couponEndDate"]) {
        setCouponAmount(0);
        return;
      }

      if (currentDate < selectedCoupon["couponStartDate"]) {
        setCouponAmount(0);
        return;
      }

      if (selectedCoupon["couponTotalUsage"] >= selectedCoupon["couponMaxUses"]) {
        setCouponAmount(0);
        return;
      }

      let discountValue = 0;
      if (selectedCoupon["couponDiscountType"] === "percentage") {
        discountValue = total * (selectedCoupon["couponDiscountValue"] / 100)
        // console.log("calculating the value inside the useEffect",selectedCoupon["couponMaxDiscount"])
        if (discountValue > selectedCoupon["couponMaxDiscount"]) discountValue = selectedCoupon["couponMaxDiscount"]
      }
      else discountValue = selectedCoupon["couponDiscountValue"]

      setCouponAmount(discountValue);

    }

    calculateCouponDiscountValue()

  }, [selectedCoupon, cartData])

  //// creating an object for faster lookup
  const productObj = useMemo(() => {
    const obj = {};
    for (let p of productData) {
      for (let i = 0; i < realCartData.length; i++) {
        if (p._id.toString() === realCartData[i].productId.toString()) {
          obj[`${realCartData[i].productId.toString()}_${realCartData[i].productVariation}`] = p
        }
      }
    }
    return obj;
  }, [realCartData]);



  /// when the user is loggedIn and when the user is not loggedIn

  async function removeItem(e, productId, userId, productVariation, brand) {
    try {
      e.preventDefault()
      e.stopPropagation()
      let result;

      result = result = await axios.post(`${CART_ENDPOINTS}/removeCartItem`, { productId, productVariation }, { withCredentials: true })

      setShouldCallDB(false);
      setRefresh(prev => prev + 1)

      dispatch(removeBrand(brand))
      toast.success(result?.data?.message)
    } catch (error) {
      toast.error(error?.response?.data?.message)
      console.log("error while removing item from the cart", error)
    }
  };

  function discountAmount(price, discount) {
    return Math.floor(discount * (price / 100))
  }

  const subtotal = cartData.reduce((acc, item) => {
    const product = productObj[`${item.productId.toString()}_${item.productVariation}`];

    if (!product) return acc;

    const price =
      product.originalPrice[item.productVariation] -
      discountAmount(
        product.originalPrice[item.productVariation],
        product.discountValue[item.productVariation]
      );

    return acc + price * Number(item.productQuantity);
  }, 0);

  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

  const user = useSelector((state) => state?.user?.userData)
  const userId = user?._id;

  async function placeOrder(e, totalAmount) {
    let result;
    try {
      e.preventDefault();
      e.stopPropagation();
      if (totalAmount <= 1000 && user != null) toast.error("Order cant be placed for amount less then 1000")
      else {
        result = await axios.post(`${USER_ENDPOINTS}/checkout`, {}, { withCredentials: true })

        // console.log(result)
        toast.success(`${result?.data?.message}\nYour total amount in ${result?.data?.totalAmount}`)
        navigate("/addressForm")
      }
    } catch (error) {
      toast.error(`${error?.response?.data?.message}`)
      console.log("Something went wrong in place order in the front end", error);
    }
  }

  //// hook used in order to implement skeleton effect
  useEffect(() => {
    setTimeout(() => {
      setSkeleton(false);
    }, 800)
  }, [])


  useEffect(() => {
    const timeout = setTimeout(async () => {
      await axios.post(
        `${CART_ENDPOINTS}/updateCart`,
        {
          cartItems: cartData
        },
        { withCredentials: true }
      );
    }, 800);

    return () => clearTimeout(timeout);
  }, [cartData]);

  function increaseQty(remainingStock, productId, productVariation) {
    try {
      if (remainingStock > 0) {
        setCartData(prev =>
          prev.map(item => item.productId.toString() === productId && item.productVariation === productVariation ?
            { ...item, productQuantity: item.productQuantity + 1 } : item
          )
        )
      } else {
        toast.error("Sorry but product is out of stock")
      }
    } catch (error) {
      console.log("Something went wrong in product increment", error);
    }
  }

  function decreaseQty(productId, productVariation) {
    setCartData(prev =>
      prev.map(item => {
        if (item.productId.toString() === productId && item.productVariation === productVariation) {
          if (item.productQuantity <= 1) {
            toast.error("Minimum quantity is 1");
            return item;
          }

          return {
            ...item,
            productQuantity: item.productQuantity - 1
          };
        }
        return item;
      })
    );
  }

  if (!cartData) {
    return (
      <div>Loading...</div>
    )
  }


  return (
    <>
      <Breadcrumbs />
      <div className=" relative min-h-screen bg-blue-50 py-10 px-4 flex flex-col items-center md:items-start md:flex-row justify-center gap-10">
        {/* Left - Cart Items */}
        <div className="bg-white w-[90%] md:w-[70%] md:max-w-3xl rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Your Cart</h2>
          {cartData.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              🛒 Your cart is empty
            </div>
          ) : (
            <div className="space-y-6">

              {/* Cart Items */}
              {cartData.map((item, index) => {
                const product = productObj[`${item.productId.toString()}_${item.productVariation}`];
                // ⛔ product data not loaded yet
                if (!product) return <></>
                //// written in order to implement skeleton effect
                return skeleton ? <CartCardSkeleton /> :
                  <div
                    className="grid grid-cols-2 grid-rows-[1.5fr_0.5fr] sm:grid-cols-[2fr_0fr_0.5fr_0.5fr] sm:grid-rows-1 border-b border-gray-200 pb-4"
                  >
                    <div className="flex items-center gap-4 p-2 col-span-2">
                      <img
                        src={`${BASE_URL}/${product.image[item.productVariation]}`}
                        alt={item.productName}
                        className="w-25 h-25 object-cover rounded-lg "
                      />
                      <div className="w-full">
                        <h3 className="font-medium text-gray-800">{product.productName}</h3>
                        <p className="text-sm text-gray-500">₹{product.originalPrice[item.productVariation] - discountAmount(product.originalPrice[item.productVariation], product.discountValue[item.productVariation])}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-start sm:justify-center gap-3 pl-2 sm:p-2">
                      <div
                        onClick={() => decreaseQty(item.productId.toString(), item.productVariation)}
                        className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 flex items-center justify-center"
                      >
                        −
                      </div>
                      <span className="font-semibold font-sans">{item.productQuantity}</span>  {/* This need to change*/}
                      <div
                        onClick={() => increaseQty(product.stock[item.productVariation] - product.reservedStock[item.productVariation], item.productId.toString(), item.productVariation)}    ///want at least one product to stay
                        className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 flex items-center justify-center"
                      >
                        +
                      </div>
                    </div>

                    <div className="text-right pr-2 flex flex-col items-end sm:p-2 sm:justify-center">
                      <p className="font-semibold text-gray-700 font-sans">
                        ₹{(product.originalPrice[item.productVariation] - discountAmount(product.originalPrice[item.productVariation], product.discountValue[item.productVariation])) * Number(item.productQuantity)}
                      </p>
                      <button
                        onClick={(e) => removeItem(e, item.productId.toString(), userData?._id, item.productVariation, brandData[index])}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
              })}
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
                <span className="font-sans">₹{couponAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-sans">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <div className="border-t border-gray-200 my-3"></div>
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span className="font-sans">₹{total - couponAmount}</span>
              </div>
            </div>

            <div onClick={(e) => { placeOrder(e, total - couponAmount) }} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition text-center cursor-pointer">
              Proceed to Checkout
            </div>

            <p className="text-sm text-center text-gray-500 mt-3 font-sans">
              You’re ₹{1000 - subtotal > 0 ? 1000 - subtotal : 0} away from free
              shipping!
            </p>
          </div>
        </div>



        {/* Coupan Window */}
        {coupanVisible && (
          <Coupon setCoupanVisible={setCoupanVisible} coupanVisible={coupanVisible} discountAmount={discountAmount} total={total} shipping={shipping} couponAmountFunction={couponAmountFunction} couponId={couponId} setCouponId={setCouponId} setSelectedCoupon={setSelectedCoupon} />
        )}

      </div>
    </>
  );
}
