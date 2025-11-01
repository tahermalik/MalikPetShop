import { useState } from "react";
import { Link, Outlet } from "react-router-dom";


export default function AdminSetting() {
    const [active, setActive] = useState(0);

    const adminFunctions = ["Product Management", "Coupon Management", "Offer Management", "Order Management"];
    const routes=["addProduct","createCoupon","createOffer","orderPlaced"]

    return (
        <>
            <div className="flex gap-4 w-full bg-blue-100 justify-evenly p-1 flex-wrap">
                {adminFunctions.map((func, index) => (
                    <Link to={`/adminSetting/${routes[index]}`}
                        key={index}
                        onClick={() => setActive(index)}
                        className={`
                        relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex justify-center items-center
                        ${active === index
                                ? "bg-blue-700 text-white shadow-lg scale-105"
                                : "bg-blue-500 text-white hover:bg-blue-600"}
                        focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95
                    `}
                    >
                        {func}
                    </Link>
                ))}
            </div>
            <div>
                {<Outlet/>}
            </div>
        </>
    );
}