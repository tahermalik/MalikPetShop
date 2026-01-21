import React, { useEffect, useState } from "react";
import { Gift, Sparkles, Tag } from "lucide-react";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useGetOffer } from "../hooks/useGetOffers";
import { Breadcrumbs } from "./Breadcrumbs";


export default function OfferSection() {
  let offerDetails = "Expired"

  function fetchCurrentTime(expiry, startDate) {
    //// expiry time will be in date and time
    const now = new Date();
    // const futureDate = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes later
    // const exp = futureDate.toISOString();
    const exp = new Date(expiry);
    const start = new Date(startDate)

    let timeLeftMs
    if (now >= exp) return 0;
    else if (now <= start) {
      timeLeftMs = start - now
      offerDetails = "Not Started"
    } else {
      timeLeftMs = exp - now;
      offerDetails = "Started"
    }

    const seconds = Math.floor(timeLeftMs / 1000) % 60;
    const minutes = Math.floor(timeLeftMs / (1000 * 60)) % 60;
    const hours = Math.floor(timeLeftMs / (1000 * 60 * 60)) % 24;
    const days = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));

    if (days !== 0) return days >= 2 ? `${days} Days` : `${days} Day`
    else if (hours !== 0) return `${hours} Hour`
    else return `${minutes} Minute : ${seconds} Seconds`
  }
  // Sample offers (you can fetch dynamically from backend later)

  const [checkTime, setCheckTime] = useState(true)
  // const offers = [
  //   {
  //     id: 1,
  //     title: "Festive Bonanza 🎉",
  //     description: "Get flat 10% off on all electronics till Diwali!",
  //     color: "from-blue-500 to-blue-400",
  //     expiry:"2025-10-22T19:00:00.000Z"
  //   },
  //   {
  //     id: 2,
  //     title: "Free Shipping 🚚",
  //     description: "Enjoy free shipping on orders above ₹999.",
  //     color: "from-blue-400 to-blue-300",
  //     expiry:"2025-10-20T15:00:00.000Z"
  //   },
  //   {
  //     id: 3,
  //     title: "Combo Offer 💥",
  //     description: "Buy any 2 accessories and get 1 absolutely free!",
  //     color: "from-blue-600 to-blue-500",
  //     expiry:"2025-10-20T11:35:00.000Z"
  //   },
  //   {
  //     id: 4,
  //     title: "Combo Offer 💥",
  //     description: "Buy any 2 accessories and get 1 absolutely free!",
  //     color: "from-blue-600 to-blue-500",
  //     expiry:"2025-10-20T10:00:00.000Z"
  //   },
  //   {
  //     id: 5,
  //     title: "Combo Offer 💥",
  //     description: "Buy any 2 accessories and get 1 absolutely free!",
  //     color: "from-blue-600 to-blue-500",
  //     expiry:"2025-10-20T14:30:00.000Z"
  //   },

  // ];

  const offers = useGetOffer()


  //// written for time counter
  useEffect(() => {
    const a = setInterval(() => {
      setCheckTime(prev => !prev)
    }, 1000)
    return () => clearInterval(a)
  }, [])

  const colors = {
    0: "from-blue-500 to-blue-400",
    1: "from-blue-400 to-blue-300",
    2: "from-blue-600 to-blue-500"
  }

  if (!offers) {
    return (
      <div>Loading...</div>
    )
  } else {

    console.log("offer", offers)
    return (
      <>
        <Breadcrumbs/>
        <div className="bg-blue-50 rounded-2xl shadow-md p-5 h-[100%] mb-6 overflow-auto scrollbar-hide relative">
          <div className="flex flex-row items-center gap-2 mb-3">
            <Sparkles className="text-blue-600" size={22} />
            <h2 className="text-2xl font-semibold text-blue-700">Special Offers</h2>
          </div>

          <div className="flex flex-col gap-4">
            {offers.map((offer, index) => (
              <div
                key={offer.id}
                className={`bg-gradient-to-r ${colors[index % 3]} text-white rounded-xl p-4 flex flex-row justify-between items-center hover:shadow-lg transition-all duration-200`}
              >
                <div>
                  <h3 className="font-bold text-lg">{offer.offerName}</h3>
                  <p className="text-sm">{offer.offerDesc}</p>
                </div>
                <div className="flex flex-col gap-2 justify-center items-end font-sans">
                  <Tag className="text-white opacity-90" size={28} />
                  <div>{fetchCurrentTime(offer.offerEndDate, offer.offerStartDate) === 0 ? "Offer Expired" : offerDetails === "Started" ? `Ends in ${fetchCurrentTime(offer.offerEndDate, offer.offerStartDate)}` : `Starts in ${fetchCurrentTime(offer.offerEndDate, offer.offerStartDate)}`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

