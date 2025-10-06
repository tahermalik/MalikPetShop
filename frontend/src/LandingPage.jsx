import { useState } from "react"

export default function LandingPage() {
    const [show, setShow] = useState(false)
    function categoriesHandler() {
        setShow(!show)
    }
    return (
        <>
            <div className="header flex flex-col h-[100px] bg-white w-[100%] gap-2">
                <div className="upper_header flex flex-row justify-evenly items-center gap-3 w-[100%] bg-white">
                    <div className="l-upper-header flex flex-row gap-1">
                        <div className="flex flex-row justify-center items-center"><img src="/header_logo.svg" alt="paws_img" /></div>
                        <div className="flex flex-col">
                            <div><span className="sm:text-lg md:text-xl lg:text-2xl font-semibold">Malik</span></div>
                            <div><span className="sm:text-md md:text-lg">Pet Shop</span></div>
                        </div>
                    </div>
                    <div className="m-upper-header bg-white w-[30%] flex flex-row gap-2 p-2 rounded-2xl border-1 border-[rgb(97,94,100)]">
                        <div className="search_logo">
                            <img src="/search_logo.svg" alt="search_icon" />
                        </div>
                        <div className="search_bar w-[100%]">
                            <input className="w-[100%] h-[100%] outline-0 placeholder: xs:text-xs placeholder:sm:text-sm placeholder:md:text-md placeholder:lg:text-lg" type="text" placeholder="Search for more then 100 products" />
                        </div>
                    </div>
                    <div className="r-upper-header flex flex-row justify-evenly items-center gap-4">
                        <div className="flex flex-col">
                            <div className="text-right"><span className="sm:text-xs">Phone</span></div>
                            <div><span className="font-semibold sm:text-sm">9152760580</span></div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-right"><span className="sm:text-xs">Email</span></div>
                            <div><span className="font-semibold sm:text-sm">tahermalik2002@gmail.com</span></div>
                        </div>
                    </div>
                </div>

                <div className="lower_header flex flex-row justify-evenly items-center gap-3 w-[100%] bg-white">
                    <div className="relative ">
                        <div className="" onMouseEnter={(e) => categoriesHandler(e)}><span className="xs:text-sm md:text-lg lg:text-xl">Shop By Categories</span></div>
                        {show &&
                            <div className="w-[100%] h-auto backdrop-blur absolute xs:top-[20px] md:top-[25px] lg:top-[30px] flex flex-col gap-1 pt-1 pl-1">
                                <div className=""><span className="hover:bg-gray-300 hover:rounded-2xl px-2 py-1 cursor-pointer">Pet Foods</span></div>
                                <div><span className="hover:bg-gray-300 hover:rounded-2xl px-2 py-1 cursor-pointer">Pet Cloths</span></div>
                                <div><span className="hover:bg-gray-300 hover:rounded-2xl px-2 py-1 cursor-pointer">Pet Snacks</span></div>
                                <div><span className="hover:bg-gray-300 hover:rounded-2xl px-2 py-1 cursor-pointer">Cages</span></div>
                                <div><span className="hover:bg-gray-300 hover:rounded-2xl px-2 py-1 cursor-pointer">Pet Accessories</span></div>
                            </div>
                        }
                    </div>


                    <div className="flex flex-row gap-3">
                        <div className="xs:text-xs sm:text-sm md:text-md flex flex-row justify-center items-center hover:underline"><a href="">Home</a></div>
                        <div className="xs:text-xs sm:text-sm md:text-md flex flex-row justify-center items-center hover:underline"><a href="">Shop</a></div>
                        <div className="xs:text-xs sm:text-sm md:text-md flex flex-row justify-center items-center hover:underline"><a href="">Blog</a></div>
                        <div className="xs:text-xs sm:text-sm md:text-md flex flex-row justify-center items-center hover:underline"><a href="">Offer</a></div>
                    </div>

                    <div className="flex flex-row gap-1">
                        <div className="cursor-pointer hover:rounded-2xl hover:bg-[rgb(205,205,219)] p-1"><img src="/person_logo.svg" alt="person_img" /></div>
                        <div className="cursor-pointer hover:rounded-2xl hover:bg-red-300 p-1"><img src="/fav_logo.svg" alt="fav_img" /></div>
                        <div className="cursor-pointer hover:rounded-2xl hover:bg-emerald-300 p-1"><img src="/shop_logo.svg" alt="shop_img" /></div>

                    </div>
                </div>
            </div>

            <div className="body h-[600px] w-[100%] bg-amber-200" onClick={()=>categoriesHandler()}>

            </div>

        </>
    )
}