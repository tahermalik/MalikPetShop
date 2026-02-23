import axios from "axios";
import React, { useState } from "react";
import Select from "react-select";
import { USER_ENDPOINTS } from "./endpoints";
import { useSelector } from "react-redux";


export default function UserAddressForm() {
    const cityOptions = [
        { value: "Mumbai", label: "Mumbai" },
    ];

    const [userAddress, setUserAddress] = useState(["", "", "", ""])
    const [userName, setUserName] = useState("");
    const [userPhoneNumber, setUserPhoneNumber] = useState("");

    const userId = useSelector((state) => state?.user?.userData?._id);
    async function setAddressFunc(e) {
        try {
            e.preventDefault();
            e.stopPropagation();
            const result = await axios.post(`${USER_ENDPOINTS}/setAddress`, { userAddress: userAddress, userName: userName, userPhoneNumber: userPhoneNumber, userId: userId }, { withCredentials: true })

        } catch {
            console.log("something went wrong in the set address function in the front end")
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-6">

            <div className="bg-white shadow-2xl shadow-blue-300/40 rounded-3xl p-10 w-full max-w-xl border border-blue-200 transition-all duration-300 hover:shadow-blue-400/50">

                <h1 className="text-3xl font-semibold text-blue-700 mb-8 text-center tracking-wide">
                    Enter Your Address
                </h1>

                <div className="space-y-6">

                    <div>
                        <label className="block text-blue-700 mb-2 font-medium">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full p-3 rounded-xl bg-blue-50 text-black placeholder-blue-400 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition-all duration-200"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-blue-700 mb-2 font-medium">
                            Address Line 1
                        </label>
                        <input
                            type="text"
                            value={userAddress[0]}
                            onChange={(e) => setUserAddress(prev => {
                                const copy = [...prev]
                                copy[0] = e.target.value
                                return copy
                            })}
                            className="w-full p-3 rounded-xl bg-blue-50 text-black placeholder-blue-400 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition-all duration-200"
                            placeholder="Street, House No."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-blue-700 mb-2 font-medium">
                            Address Line 2
                        </label>
                        <input
                            type="text"
                            value={userAddress[1]}
                            onChange={(e) => setUserAddress(prev => {
                                const copy = [...prev]
                                copy[1] = e.target.value
                                return copy
                            })}
                            className="w-full p-3 rounded-xl bg-blue-50 text-black placeholder-blue-400 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition-all duration-200"
                            placeholder="Apartment, Landmark, etc."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="block text-blue-700 mb-2 font-medium">
                                City
                            </label>
                            <Select
                                options={cityOptions}
                                placeholder="Select City"
                                onChange={(e) => setUserAddress(prev => {
                                    const copy = [...prev]
                                    copy[2] = e.value
                                    return copy
                                })}
                                className="rounded-xl shadow-sm"
                                styles={{
                                    placeholder: (base) => ({
                                        ...base,
                                        color: "#60a5fa",
                                    }),
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: "12px",
                                        padding: "4px",
                                        backgroundColor: "#eff6ff",
                                        borderColor: "#93c5fd",
                                        color: "black",
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        borderRadius: "12px",
                                        padding: "2px",
                                        backgroundColor: "white",
                                        color: "black",
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: "black",
                                    }),
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-blue-700 mb-2 font-medium">
                                Pincode
                            </label>
                            <input
                                type="number"
                                value={userAddress[3]}
                                onChange={(e) => setUserAddress(prev => {
                                    const copy = [...prev]
                                    copy[3] = e.target.value
                                    return copy
                                })}
                                className="w-full p-3 rounded-xl bg-blue-50 text-black placeholder-blue-400 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition-all duration-200"
                                placeholder="Pincode"
                                required
                            />
                        </div>

                    </div>

                    <div>
                        <label className="block text-blue-700 mb-2 font-medium">
                            Enter Phone Number :-
                        </label>

                        <div className="w-full p-3 rounded-xl bg-blue-50 text-black border border-blue-200 focus-within:ring-2 focus-within:ring-blue-400 shadow-sm flex gap-3 transition-all duration-200">
                            <div className="text-blue-600 font-medium">
                                +91
                            </div>
                            <input
                                value={userPhoneNumber}
                                onChange={(e) => setUserPhoneNumber(e.target.value)}
                                htmlFor="phoneNumberField"
                                type="text"
                                minLength={10}
                                maxLength={10}
                                placeholder="Enter Phone Number"
                                className="w-full outline-none bg-transparent text-black placeholder-blue-400"
                                required
                            />
                        </div>
                    </div>

                    <div
                        onClick={(e) => setAddressFunc(e)}
                        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 p-3 rounded-xl text-white font-semibold shadow-lg shadow-blue-300 flex justify-center items-center cursor-pointer"
                    >
                        Submit Address
                    </div>

                </div>
            </div>
        </div>
    );
}
