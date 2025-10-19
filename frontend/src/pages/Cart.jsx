import React, { useLayoutEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { IoCheckmarkDoneOutline } from "react-icons/io5";


export default function CartPage() {
  const [coupanAmount,setCoupanAmount]=useState(0);
  const [coupanVisible,setCoupanVisible]=useState(false);
  const [coupanIndex,setCoupanIndex]=useState(-1) /// none of the coupans are applied initially
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 2999,
      quantity: 1,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Smartwatch",
      price: 4999,
      quantity: 2,
      image: "https://via.placeholder.com/100",
    },
  ]);

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 5000 ? 0 : 99;
  const total = subtotal + shipping - coupanAmount;
  function discountAmount(price, discount){
    return Math.floor(discount*(price/100))
  }

  return (
    <div className=" relative min-h-screen bg-blue-50 py-10 px-4 flex flex-col lg:flex-row justify-center gap-10">
      {/* Left - Cart Items */}
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Your Cart</h2>
        {cartItems.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            🛒 Your cart is empty
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-gray-200 pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold hover:bg-blue-200"
                  >
                    −
                  </button>
                  <span className="font-semibold font-sans">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold hover:bg-blue-200"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-700 font-sans">
                    ₹{item.price * item.quantity}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
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

      {/* Coupans */}

      {/* Right - Order Summary */}
      <div className="flex flex-col gap-3">
        <div className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 hover:from-blue-600 hover:via-blue-500 hover:to-blue-400 cursor-pointer rounded-2xl py-2 px-1 hover:text-white" onClick={()=>setCoupanVisible(!coupanVisible)}>
          <span>Apply Coupans for Extra discount!!!</span>
        </div>
        <div className="bg-white w-full max-w-sm h-fit rounded-2xl shadow-md p-6">
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
              <span className="font-sans">₹{total}</span>
            </div>
          </div>

          <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
            Proceed to Checkout
          </button>

          <p className="text-sm text-center text-gray-500 mt-3 font-sans">
            You’re ₹{5000 - subtotal > 0 ? 5000 - subtotal : 0} away from free
            shipping!
          </p>
        </div>
      </div>



      {/* Coupan Window */}
      {coupanVisible && <div className=" absolute top-0 w-[100%] h-[100%] backdrop-blur flex flex-row justify-center items-center">
        <div className="sm:h-[80%] sm:w-[400px] bg-blue-100 flex flex-col overflow-auto scrollbar-hide p-2 gap-3">

          {/* Top of the Show Coupans */}
          <div className="flex flex-row gap-1 items-center ">
            <div className="cursor-pointer hover:bg-blue-200 hover:rounded-full p-1" onClick={()=>setCoupanVisible(false)}><FiArrowLeft size={18}/></div>
            <div className="underline font-semibold sm:text-md lg:text-xl">Coupans</div>
          </div>
          {[...Array(10)].map((_, index) => (
            <div className="w-[100%] h-auto bg-white rounded-2xl p-2 hover:shadow-md flex-shrink-0 cursor-pointer">
              <div className=" flex flex-row justify-between">
                <div className=" coupan-name sm:text-xl border-dashed border-2 border-black px-1 font-sans">TIGER5</div>
                { coupanIndex!==index &&
                  <div className="bg-blue-500 rounded-2xl flex flex-row justify-center items-center p-1 sm:text-md text-white" onClick={()=>{setCoupanAmount(discountAmount(total,5)); setCoupanIndex(index)}}>Apply</div>
                }
                { coupanIndex===index &&
                  <div className="sm:text-md text-emerald-500 flex flex-row items-center">
                    <div><IoCheckmarkDoneOutline color="emerald-500" size={15}/></div>
                    <div>Applied</div>
                  </div>
                }
                  </div>
              <div className="text-emerald-500 sm:text-md lg:text-lg"><span className="">Save upto ₹<span className="font-sans">{discountAmount(total,5)}</span></span></div>
              <div className="sm:text-sm">*T&C Applied</div>
            </div>
          ))}


        </div>

      </div>}
    </div>
  );
}
