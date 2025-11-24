import React from "react";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 text-center">
        
        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-5xl mb-4">
          ✓
        </div>

        <h2 className="text-2xl font-semibold text-blue-900 mb-2">
          Order Placed Successfully!
        </h2>

        <p className="text-blue-600 text-sm mb-5">
          Your order has been confirmed and is now being processed.  
          You will receive updates shortly.
        </p>

        {/* Order Details Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left mb-6">
          <div className="mb-2 text-blue-900 font-medium">
            Order ID: <span className="font-semibold">#123456</span>
          </div>
          <div className="mb-2 text-blue-900 font-medium">
            Total Amount: <span className="font-semibold">₹1499</span>
          </div>
          <div className="mb-2 text-blue-900 font-medium">
            Payment Status: <span className="font-semibold text-green-600">Success</span>
          </div>
          <div className="text-blue-900 font-medium">
            Estimated Delivery: <span className="font-semibold">3–5 Days</span>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => window.location.href = "/"}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-medium py-3 rounded-xl"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
