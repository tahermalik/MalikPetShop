import React, { useRef, useState } from "react";

export default function CouponRuleCreator() {
  const [coupon, setCoupon] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    maxDiscount: "",
    minOrder: "",
    maxUsesPerUser: "",
    totalUsageLimit: "",
    newUsersOnly: false,
    startDate: "",
    endDate: "",
    productID:[]
  });

  const idRef=useRef(null)
  const [productID,setProductID]=useState("")

  function submitID(){
    if(idRef.current){
        // console.log(idRef.current?.value)
        setCoupon({...coupon,productID:[...coupon.productID,idRef.current?.value]})
        setProductID("") // resetting after succesfull submission
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(e.target.checked)
    setCoupon({ ...coupon, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Coupon Rule Saved:", coupon);
    alert("Coupon rule saved!");
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-4 text-center">
          🎟️ Create Coupon Rules
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <section>
            <h2 className="text-lg font-semibold text-blue-600 mb-3 border-b pb-1">
              Basic Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Coupon Code *</label>
                <input
                  type="text"
                  name="code"
                  value={coupon.code}
                  onChange={handleChange}
                  placeholder="FESTIVE50"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Description *</label>
                <input
                  type="text"
                  name="description"
                  value={coupon.description}
                  onChange={handleChange}
                  placeholder="50% off on festive items"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                  required
                />
              </div>
            </div>
          </section>

          {/* Discount Settings */}
          <section>
            <h2 className="text-lg font-semibold text-blue-600 mb-3 border-b pb-1">
              Discount Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium">Discount Type</label>
                <select
                  name="discountType"
                  value={coupon.discountType}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                >
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat</option>
                </select>
              </div>
              <div>
                <label className="block font-medium">Discount Value *</label>
                <input
                  type="number"
                  name="discountValue"
                  value={coupon.discountValue}
                  onChange={handleChange}
                  placeholder="50"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Max Discount</label>
                <input
                  type="number"
                  name="maxDiscount"
                  value={coupon.maxDiscount}
                  onChange={handleChange}
                  placeholder="500"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Usage Rules */}
          <section>
            <h2 className="text-lg font-semibold text-blue-600 mb-3 border-b pb-1">
              Usage Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium">Minimum Order Amount</label>
                <input
                  type="number"
                  name="minOrder"
                  value={coupon.minOrder}
                  onChange={handleChange}
                  placeholder="999"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium">Max Uses per User</label>
                <input
                  type="number"
                  name="maxUsesPerUser"
                  value={coupon.maxUsesPerUser}
                  onChange={handleChange}
                  placeholder="1"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium">Total Usage Limit</label>
                <input
                  type="number"
                  name="totalUsageLimit"
                  value={coupon.totalUsageLimit}
                  onChange={handleChange}
                  placeholder="100"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center mt-3 space-x-2">
              <input
                type="checkbox"
                name="newUsersOnly"
                checked={coupon.newUsersOnly}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <label className="font-medium">New Users Only</label>
            </div>
          </section>


          {/* Product on which discount need to be applied */}
          <section>
            <h2 className="text-lg font-semibold text-blue-600 mb-3 border-b pb-1">
              Product ID
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="flex flex-row items-center justify-between mb-2">
                    <label className="block font-medium">Enter the Product ID </label>
                    <div onClick={()=>submitID()} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">Submit Product ID</div>
                </div>
                <input
                  ref={idRef}
                  type="text"
                  name="productID"
                  value={productID}
                  onChange={(e)=>setProductID(e.currentTarget.value)}
                  placeholder="Enter the Product ID"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                />
              </div>
            </div>

          </section>

          {/* Validity Period */}
          <section>
            <h2 className="text-lg font-semibold text-blue-600 mb-3 border-b pb-1">
              Validity Period
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={coupon.startDate}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={coupon.endDate}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="bg-blue-100 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              Coupon Summary
            </h2>
            <p className="text-sm text-gray-700">
              Code: <strong>{coupon.code || "—"}</strong> <br />
              Type: {coupon.discountType} ({coupon.discountValue || 0})
              {coupon.discountType === "percentage" ? "%" : "₹"} <br />
              Max Discount: ₹{coupon.maxDiscount || "—"} <br />
              Min Order: ₹{coupon.minOrder || "—"} <br />
              Valid: {coupon.startDate || "—"} to {coupon.endDate || "—"} <br />
              {coupon.newUsersOnly && (
                <span className="text-blue-600 font-medium">
                  (New users only)
                </span>
              )}
              Product ID's : {coupon.productID.join(", ") || "—"}
            </p>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="reset"
              className="border border-blue-400 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-100"
              onClick={() =>
                setCoupon({
                  code: "",
                  description: "",
                  discountType: "percentage",
                  discountValue: "",
                  maxDiscount: "",
                  minOrder: "",
                  maxUsesPerUser: "",
                  totalUsageLimit: "",
                  newUsersOnly: false,
                  startDate: "",
                  endDate: "",
                  productID:[]
                })
              }
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Save Coupon Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
