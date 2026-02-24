import { useState, useRef, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import { COUPON_ENDPOINT } from "./endpoints";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
export function Coupon({ setCoupanVisible, couponVisible, discountAmount, total, shipping, setCouponAmount }) {

    const [couponIndex, setCouponIndex] = useState(-1) /// none of the coupans are applied initially
    const [coupons, setCoupons] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const hadfetched = useRef(false);
    const [checkTime, setCheckTime] = useState(0)

    // console.log(couponIndex, "CouponIndex")
    /// just to force re rendering of the components in every second
    useEffect(() => {
        const a = setInterval(() => {
            setCheckTime(prev => !prev)
        }, 1000)

        return () => clearInterval(a)
    }, [])

    // Infinite scroll
    const scrollHandle = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        // console.log("Measurements",scrollTop,scrollHeight,clientHeight)

        // Check if user reached bottom (or within small threshold)
        if ((scrollTop + clientHeight >= scrollHeight - 10) && hadfetched.current) {
            console.log("🎯 Reached bottom!");
            fetchCoupons(); // for example
            hadfetched.current = false;
        }
    };

    function fetchCurrentTime(time) {
        //// expiry time will be in date and time
        if (typeof time === "undefined") return "lifetime" ///// endDate can be undefined so for it it is lifetime
        const now = new Date();
        time = new Date(time);
        const timeLeftMs = time - now;
        if (timeLeftMs < 0) return -1;
        const seconds = Math.floor(timeLeftMs / 1000) % 60;
        const minutes = Math.floor(timeLeftMs / (1000 * 60)) % 60;
        const hours = Math.floor(timeLeftMs / (1000 * 60 * 60)) % 24;
        const days = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));

        if (days !== 0) return days >= 2 ? `${days} Days` : `${days} Day`
        else if (hours !== 0) return `${hours} Hour`
        else return `${minutes} Minute : ${seconds} Seconds`
    }

    //// function to check whether the coupon can be applied or not
    function checkCoupon(start, end, validity) {
        const now = new Date();
        start = new Date(start);

        if (typeof end !== "undefined") {
            end = new Date(end);
            if (now >= end) return false;
        }

        if (start >= now) return false;

        return validity;
    }

    //// dealing with Pagination
    const userId = useSelector((state) => state?.user?.userData?._id)
    const fetchCoupons = async () => {
        if (loading) return;
        setLoading(true);

        const res = await axios.post(`${COUPON_ENDPOINT}/viewCoupons`, { limit: 10, lastId: nextCursor, userId: userId }, { withCredentials: true });
        // console.log("Taher Malik", res.data.coupons.length)
        setCoupons(prev => [...prev, ...res.data.coupons]);
        setNextCursor(res.data.nextCursor);
        setLoading(false);
    };

    useEffect(() => {
        if (!hadfetched.current) {
            fetchCoupons();
            hadfetched.current = true
        }
    }, []);

    
    async function coponClicked(e, couponSelected) {
        try {
            e.stopPropagation();
            console.log(couponSelected)
            const res = await axios.post(`${COUPON_ENDPOINT}/selectCoupon`, { couponSelected: couponSelected, total: total ,userId:userId}, { withCredentials: true })
            toast.success(res?.data?.message)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
    }


    const [showTC, setShowTC] = useState(null)
    function TCClicked(e, index) {
        try {
            e.stopPropagation();
            setShowTC(index)

        } catch (error) {
            console.log(error)
            toast.error("Cant Display Terms and Condition currently")
        }
    }


    return (
        <div
            className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm flex justify-center items-end sm:items-center animate-fadeIn"
        >
            <div
                className="relative w-full h-full sm:top-0 sm:w-[420px] sm:h-[620px] bg-white/80 backdrop-blur-xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] flex flex-col
                overflow-auto scrollbar-hide p-4 gap-4 animate-slideUp sm:animate-scaleIn"
                onScroll={(e) => scrollHandle(e)}
            >

                {/* Header */}
                <div className="flex items-center rounded-3xl gap-3 sticky top-0 bg-white/70 backdrop-blur-md py-2 px-2 z-10 w-[100%]">
                    <div
                        className="cursor-pointer p-2 rounded-full hover:bg-blue-100 active:scale-95
                        transition"
                        onClick={() => { setCoupanVisible(false); }}
                    >
                        <FiArrowLeft size={18} />
                    </div>

                    <div className="font-semibold tracking-wide text-lg sm:text-xl underline">
                        Coupons
                    </div>
                </div>

                {/* Coupon Cards */}
                {coupons.map((_, index) => (
                    <div
                        key={index}
                        className="w-full bg-white rounded-2xl p-4 flex flex-col gap-2 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100"
                    >
                        <div className="flex justify-between items-center gap-2">
                            <div
                                className="border-2 border-dashed border-gray-800 px-3 py-1 rounded-lg font-semibold tracking-widest text-sm sm:text-lg"
                            >
                                {coupons[index]["couponCode"]}
                            </div>

                            {(couponIndex !== index) && (
                                <div
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium text-white transition-all duration-300 ${checkCoupon(
                                        coupons[index]["couponStartDate"],
                                        coupons[index]["couponEndDate"], coupons[index]["isValid"]
                                    )
                                        ? "bg-blue-500 hover:bg-blue-600 active:scale-95"
                                        : "bg-blue-400 opacity-50 pointer-events-none"}
                                    `}
                                    onClick={(e) => { coponClicked(e, coupons[index]) }}
                                >
                                    Apply
                                </div>
                            )}

                            {couponIndex === index && (
                                <div className="flex items-center gap-1 text-emerald-500 font-medium text-sm">
                                    <IoCheckmarkDoneOutline size={16} />
                                    Applied
                                </div>
                            )}
                        </div>

                        <div className="text-emerald-600 text-sm sm:text-base font-medium">
                            Save upto ₹
                            <span className="font-semibold">
                                {discountAmount(
                                    total - shipping,
                                    Number(coupons[index]["couponDiscountValue"])
                                )}{" "}
                                ; {coupons[index]["couponDiscountValue"]}%
                            </span>
                        </div>

                        <div className="text-[11px] sm:text-sm flex justify-between text-gray-500">
                            <div onMouseEnter={(e) => TCClicked(e, index)}>
                                *T&C Applied
                            </div>
                            <div>
                                {fetchCurrentTime(coupons[index]["couponStartDate"]) === -1
                                    ? fetchCurrentTime(coupons[index]["couponEndDate"]) !== -1
                                        ? `Ends in ${fetchCurrentTime(coupons[index]["couponEndDate"])}`
                                        : "Expired"
                                    : `Starts in ${fetchCurrentTime(coupons[index]["couponStartDate"])}`}
                            </div>
                        </div>

                        {showTC === index && (
                            <div
                                className="mt-3 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700 animate-slideDown"
                            >
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                    Coupon applicable if
                                </h3>

                                <ul className="space-y-2 text-xs">
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-600 mt-[2px]">✔</span>
                                        Minimum order value:
                                        <span className="font-medium text-gray-900 ml-1">
                                            ₹{coupons[index]["couponMinOrderAmount"]}
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-[2px]">✔</span>
                                        Applicable brands:
                                    </li>

                                    <div className="flex flex-wrap gap-1 ml-6">
                                        {coupons[index]["brands"].map((brand, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-[2px] rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium"
                                            >
                                                {brand}
                                            </span>
                                        ))}
                                    </div>
                                </ul>
                            </div>
                        )}


                    </div>
                ))}
            </div>
        </div>
    )
}