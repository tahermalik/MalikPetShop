import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export default function Checkout() {
    const [text,setText]=useState("")
    const addressRef=useRef(null);
    const location=useLocation();
    const totalAmount=location?.state?.totalAmount
    useEffect(() => {
        const el = addressRef.current;
        if (el) {
            if (el.scrollHeight <= 200 && el.scrollHeight >= 50) {
                el.style.height = "auto"; // reset
                el.style.height = el.scrollHeight + "px"; // resize
            }
        }
    }, [text])
  return (
    <div className="min-h-screen bg-blue-50 p-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6">

        {/* Header */}
        <h1 className="text-2xl font-semibold text-blue-900 mb-4 text-center">
          Checkout & Payment
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Section: Order Summary */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex flex-col gap-2">
            <div className="address">
                <label htmlFor="addressField">Address :- </label>
                <div className="w-[100%] rounded-2xl border-2 border-[#E0E0E0] bg-[#FFFFFF]"><textarea ref={addressRef} name="" id="addressField" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter you address" className="outline-0 p-2 max-h-[200px] min-h-[100px] w-[100%] overflow-y-scroll scrollbar-hide placeholder:xs:text-sm placeholder:lg:text-lg xs:text-sm lg:text-lg placeholder:text-[#555555] text-[#212121]"></textarea></div>
            </div>
            <div>
                <label htmlFor="phoneNumberField">Phone Number :- </label>
                <div className="flex flex-row gap-1 bg-white items-center p-1 rounded-xl">
                    <div>+91 </div>
                    <div><input htmlFor="phoneNumberField" type="text" minLength={10} maxLength={10} placeholder="Enter Phone Number" className="outline-0 p-2 w-[100%]  placeholder:xs:text-sm placeholder:lg:text-lg xs:text-sm lg:text-lg placeholder:text-[#555555] text-[#212121]"/></div>
                </div>
            </div>
          </div>

          {/* Right Section: Payment */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Choose Payment Method</h2>

            {/* Payment Options */}
            <div className="space-y-3">

              <label className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow cursor-pointer">
                <input type="radio" name="payment" className="w-5 h-5" defaultChecked />
                <span className="text-blue-900 font-medium">UPI (Google Pay / PhonePe / Paytm)</span>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow cursor-pointer">
                <input type="radio" name="payment" className="w-5 h-5" />
                <span className="text-blue-900 font-medium">Credit / Debit Card</span>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow cursor-pointer">
                <input type="radio" name="payment" className="w-5 h-5" />
                <span className="text-blue-900 font-medium">Net Banking</span>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow cursor-pointer">
                <input type="radio" name="payment" className="w-5 h-5" />
                <span className="text-blue-900 font-medium">Cash on Delivery</span>
              </label>
            </div>

            {/* Button */}
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 mt-5 rounded-xl font-semibold"
              onClick={() => console.log("Proceed to Razorpay")}
            >
              Proceed to Pay ₹{totalAmount}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
