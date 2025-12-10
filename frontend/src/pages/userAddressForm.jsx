import axios from "axios";
import React, { useState } from "react";
import Select from "react-select";
import { USER_ENDPOINTS } from "./endpoints";
import { useSelector } from "react-redux";


export default function UserAddressForm() {
    const cityOptions = [
        { value: "Mumbai", label: "Mumbai" },
    ];

    const [userAddress,setUserAddress]=useState(["","","",""])
    const [userName,setUserName]=useState("");
    const [userPhoneNumber,setUserPhoneNumber]=useState("");

    const userId=useSelector((state)=>state?.user?.userData?._id);
    async function setAddressFunc(e){
        try{
            e.preventDefault();
            e.stopPropagation();
            const result=await axios.post(`${USER_ENDPOINTS}/setAddress`,{userAddress:userAddress,userName:userName,userPhoneNumber:userPhoneNumber,userId:userId},{withCredentials:true})

        }catch{
            console.log("something went wrong in the set address function in the front end")
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 p-6">
            <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-xl border border-white/20">
                <h1 className="text-3xl font-semibold text-blue-100 mb-6 text-center">
                    Enter Your Address
                </h1>

                <div className="space-y-5">
                    <div>
                        <label className="block text-blue-100 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e)=>setUserName(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-blue-100 mb-1">Address Line 1</label>
                        <input
                            type="text"
                            value={userAddress[0]}
                            onChange={(e)=>setUserAddress(prev=>{
                                const copy=[...prev]
                                copy[0]=e.target.value
                                return copy
                            })}
                            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            placeholder="Street, House No."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-blue-100 mb-1">Address Line 2</label>
                        <input
                            type="text"
                            value={userAddress[1]}
                            onChange={(e)=>setUserAddress(prev=>{
                                const copy=[...prev]
                                copy[1]=e.target.value
                                return copy
                            })}
                            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            placeholder="Apartment, Landmark, etc."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-blue-100 mb-1">City</label>
                            <Select
                                options={cityOptions}
                                placeholder="Select City"
                                onChange={(e)=>setUserAddress(prev=>{
                                    const copy=[...prev]
                                    copy[2]=e.value
                                    return copy
                                })}
                                className="rounded-xl"
                                styles={{
                                    placeholder: (base) => ({
                                        ...base,
                                        color: "#dbeafe",
                                    }),
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: "12px",
                                        padding: "4px",
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        borderColor: "#60a5fa",
                                        color: "red",
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        borderRadius: "12px",
                                        padding: "2px",
                                        backgroundColor: "#3b82f6",
                                        color: "black",
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: "white",
                                    }),
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-blue-100 mb-1">Pincode</label>
                            <input
                                type="number"
                                value={userAddress[3]}
                                onChange={(e)=>setUserAddress(prev=>{
                                    const copy=[...prev]
                                    copy[3]=e.target.value
                                    return copy
                                })}
                                className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="Pincode"
                                required
                            />
                        </div>

                    </div>
                    <div>
                        <label className="block text-blue-100 mb-1">Enter Phone Number :- </label>
                        <div className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 flex gap-3">
                            <div>+91 </div>
                            <input
                                value={userPhoneNumber}
                                onChange={(e)=>setUserPhoneNumber(e.target.value)}
                                htmlFor="phoneNumberField" type="text" minLength={10} maxLength={10} placeholder="Enter Phone Number" className="w-full outline-0"
                                required
                            />
                        </div>
                    </div>

                    <div
                        onClick={(e)=>setAddressFunc(e)}
                        className="w-full bg-blue-500 hover:bg-blue-600 transition-all p-3 rounded-xl text-white font-medium shadow-lg"
                    >
                        Submit Address
                    </div>
                </div>
            </div>
        </div>
    );
}
