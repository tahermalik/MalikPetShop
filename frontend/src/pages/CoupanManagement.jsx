import axios from "axios";
import React, { useRef, useState } from "react";
import { COUPON_ENDPOINT } from "./endpoints";
import toast from "react-hot-toast";
import Select from "react-select";

export default function CouponRuleCreator() {
  /// in future this will be comming from DB
  let brandsName=[
    { _id: "1", name: "Smart Heart" },
    { _id: "2", name: "Pedigree" },
    { _id: "3", name: "Whiskas" },
    { _id: "4", name: "Purepet" }
  ]
  const brandOptions = brandsName.map(b => ({
    value: b.name.toLowerCase(),
    label: b.name
  }));

  const [coupon, setCoupon] = useState({
    couponCode: "",
    couponDesc: "",
    couponDiscountType: "percentage",
    couponDiscountValue: "",
    couponMaxDiscount: "",
    couponMinOrderAmount: "",
    couponMaxUses: "",
    newUser: false,
    couponStartDate: "",
    couponEndDate: "",
    brands: []
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(e.target.checked)
    setCoupon({ ...coupon, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${COUPON_ENDPOINT}/setCoupons`, coupon, { withCredentials: true })

    // console.log("Coupon Rule Saved:", coupon);
    // console.log(res)
    toast.success(res?.data?.message)
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
                  name="couponCode"
                  value={coupon.couponCode}
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
                  name="couponDesc"
                  value={coupon.couponDesc}
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
                  name="couponDiscountType"
                  value={coupon.couponDiscountType}
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
                  name="couponDiscountValue"
                  value={coupon.couponDiscountValue}
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
                  name="couponMaxDiscount"
                  value={coupon.couponMaxDiscount}
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
                  name="couponMinOrderAmount"
                  value={coupon.couponMinOrderAmount}
                  onChange={handleChange}
                  placeholder="999"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium">Max Uses of the Coupon</label>
                <input
                  type="number"
                  name="couponMaxUses"
                  value={coupon.couponMaxUses}
                  onChange={handleChange}
                  placeholder="1"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center mt-3 space-x-2">
              <input
                type="checkbox"
                name="newUser"
                checked={coupon.newUser}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <label className="font-medium">New Users Only</label>
            </div>
          </section>


          {/* Product on which discount need to be applied */}
          <section>
            <h2 className="text-lg font-semibold text-blue-600 mb-3 border-b pb-1">
              Brands on which Coupon Can be applied
            </h2>
            <Select
              isMulti
              options={brandOptions}
              placeholder="Select brands..."
              className="text-sm"
              value={brandOptions.filter(option =>
                coupon.brands.includes(option.value)
              )}
              onChange={(selected) => {
                setCoupon(prev => ({
                  ...prev,
                  brands: selected.map(item => item.value)
                }));
              }}
            />

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
                  name="couponStartDate"
                  value={coupon.couponStartDate}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium">End Date</label>
                <input
                  type="date"
                  name="couponEndDate"
                  value={coupon.couponEndDate}
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
              Code: <strong>{coupon.couponCode || "—"}</strong> <br />
              Type: {coupon.couponDiscountType} ({coupon.couponDiscountValue || 0})
              {coupon.couponDiscountType === "percentage" ? "%" : "₹"} <br />
              Max Discount: ₹{coupon.couponMaxDiscount || "—"} <br />
              Min Order: ₹{coupon.couponMinOrderAmount || "—"} <br />
              Valid: {coupon.couponStartDate || "—"} to {coupon.couponEndDate || "—"} <br />
              {coupon.newUser && (
                <span className="text-blue-600 font-medium">
                  (New users only)
                </span>
              )}
              Brands : {coupon.brands.length > 0 ? coupon.brands.join(", "): "All Brands"}
            </p>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="reset"
              className="border border-blue-400 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-100"
              onClick={() =>
                setCoupon({
                  couponCode: "",
                  couponDesc: "",
                  couponDiscountType: "percentage",
                  couponDiscountValue: "",
                  couponMaxDiscount: "",
                  couponMinOrderAmount: "",
                  couponMaxUses: "",
                  newUser: false,
                  couponStartDate: "",
                  couponEndDate: "",
                  brands: []
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
