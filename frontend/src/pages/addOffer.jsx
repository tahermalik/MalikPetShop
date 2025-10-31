import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag, FileText, Send } from "lucide-react";
import axios from "axios";
import { OFFER_ENDPOINTS } from "./endpoints";

export default function CreateOffer() {
  const [offerData, setOfferData] = useState({
    offerName: "",
    offerDesc: "",
    offerStartDate: "",
    offerEndDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfferData({ ...offerData, [name]: value });
  };

  async function handleSubmit(e){
    try{
        const res=await axios.post(`${OFFER_ENDPOINTS}/createOffer`,{offerData},{withCredentials:true})

    }catch(error){
        console.log("error in creating offers")
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-8 border border-blue-200"
      >
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">
          Create New Offer
        </h1>

        <form className="space-y-5">
          {/* Offer Name */}
          <div>
            <label className="flex items-center text-blue-600 font-medium mb-1">
              <Tag size={18} className="mr-2" /> Offer Name
            </label>
            <input
              type="text"
              name="offerName"
              value={offerData.offerName}
              onChange={handleChange}
              placeholder="Enter offer name"
              required
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Offer Description */}
          <div>
            <label className="flex items-center text-blue-600 font-medium mb-1">
              <FileText size={18} className="mr-2" /> Description
            </label>
            <textarea
              name="offerDesc"
              value={offerData.offerDesc}
              onChange={handleChange}
              placeholder="Write offer details..."
              rows={3}
              required
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="flex items-center text-blue-600 font-medium mb-1">
              <Calendar size={18} className="mr-2" /> Start Date
            </label>
            <input
              type="date"
              name="offerStartDate"
              value={offerData.offerStartDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="flex items-center text-blue-600 font-medium mb-1">
              <Calendar size={18} className="mr-2" /> End Date
            </label>
            <input
              type="date"
              name="offerEndDate"
              value={offerData.offerEndDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={(e)=>handleSubmit(e)}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <div className="flex items-center justify-center gap-2">
              <Send size={18} /> Create Offer
            </div>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
