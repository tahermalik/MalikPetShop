import { useEffect, useState } from "react";
import { useGetOrderPlaced } from "../hooks/useGetOrderPlaced";

export function OrderPlaced() {
    const [placedOrderData, setPlacedOrderData] = useState([]);
    const orderData = useGetOrderPlaced();

    useEffect(() => {
        setPlacedOrderData(orderData || []);
    }, [orderData]);

    const statusStyles = {
        Pending: "text-yellow-800 bg-yellow-50 border-yellow-200",
        Processing: "text-blue-800 bg-blue-50 border-blue-200",
        Shipped: "text-purple-800 bg-purple-50 border-purple-200",
        Delivered: "text-green-800 bg-green-50 border-green-200",
        Cancelled: "text-red-800 bg-red-50 border-red-200",
    };

    // ✅ Case 1: No Orders (Improved UI)
    if (placedOrderData.length === 0) {
        return (
            <div className="p-4">
                <h1 className="pb-3 text-blue-800 font-bold text-xl sm:text-2xl">
                    Order History
                </h1>

                <div className="flex flex-col gap-2 w-full h-full">
                    <div className="relative flex flex-col items-center justify-center gap-3 w-full bg-white border border-blue-200 rounded-xl px-5 py-10 shadow-[0_2px_12px_rgba(55,138,221,0.10)] overflow-hidden">

                        {/* left accent bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500 rounded-l-xl" />

                        {/* icon */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="#185FA5" strokeWidth="2" />
                                <line x1="8" y1="12" x2="16" y2="12" stroke="#185FA5" strokeWidth="2" />
                            </svg>
                        </div>

                        {/* text */}
                        <p className="text-blue-800 font-medium text-sm sm:text-base">
                            No orders placed yet
                        </p>

                        <p className="text-gray-500 text-xs sm:text-sm">
                            Your orders will appear here once you place them
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Case 2: Orders exist (UNCHANGED UI)
    return (
        <div className="p-4">
            <h1 className="pb-3 text-blue-800 font-bold text-xl sm:text-2xl">
                Order History
            </h1>

            <div className="flex flex-col gap-2 w-full h-full">
                {placedOrderData.map((item, idx) => (
                    <div
                        key={item?.orderId || idx}
                        className="relative flex flex-col sm:flex-row sm:items-center gap-3 w-full bg-white border border-blue-200 rounded-xl px-5 py-4 shadow-[0_2px_12px_rgba(55,138,221,0.10)] overflow-hidden"
                    >

                        {/* left accent bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500 rounded-l-xl" />

                        {/* check icon */}
                        <div className="hidden sm:flex items-center justify-center w-10 h-10 min-w-[40px] rounded-full bg-blue-50">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <polyline
                                    points="5,13 10,18 19,7"
                                    stroke="#185FA5"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        {/* info block */}
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                            {/* row 1 */}
                            <div className="flex flex-row items-center gap-2 flex-wrap">
                                <span className="text-[13px] font-medium text-blue-800 bg-blue-50 border border-blue-200 rounded-full px-3 py-0.5 truncate max-w-[180px]">
                                    {item?.orderId}
                                </span>

                                <span className={`flex items-center gap-1.5 text-[13px] font-medium border rounded-full px-3 py-0.5 whitespace-nowrap ${
                                    statusStyles[item?.status]} || "text-gray-800 bg-gray-50 border-gray-200"
                                    `}
                                >{item?.status}</span>
                            </div>

                            {/* row 2 */}
                            <div className="flex flex-row items-center gap-3 flex-wrap text-[13px] text-gray-500">
                                <span className="whitespace-nowrap">
                                    Coupon{" "}
                                    <span className="font-medium text-gray-800">
                                        {item?.couponId === null ? "NA" : item?.couponId}
                                    </span>
                                </span>

                                <span className="w-px h-3 bg-gray-200 hidden sm:block" />

                                <span className="whitespace-nowrap">
                                    Total{" "}
                                    <span className="font-medium text-gray-800">
                                        {item?.finalAmount}
                                    </span>
                                </span>
                            </div>
                        </div>

                        {/* button */}
                        <button className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 active:scale-95 text-blue-50 text-[13px] font-medium rounded-lg transition-all whitespace-nowrap">
                            View items
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}