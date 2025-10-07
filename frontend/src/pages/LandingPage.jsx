import { useState, useRef } from "react"

function Brands(props) {
    const colorClasses = {
        yellow: "bg-amber-200",
        purple: "bg-purple-500",
        blue: "bg-blue-500",
    };

    return (
        <div className={`body h-[600px] w-[100%] ${colorClasses[props.color]} flex flex-row justify-center items-center`}>
            <div className="h-[80%] w-[80%] flex flex-row gap-2">
                <div className="flex flex-row justify-center items-center rounded-2xl h-[100%] w-[70%]"><img className="h-[400px] w-[900px] object-contain rounded-2xl" src={`/${props.brand}.jpg`} alt={`${props.brand}_img`} /></div>
                <div className="h-[100%] w-[30%] flex flex-row justify-center items-center"><span className="xs:text-md md:text-lg lg:text-2xl">{props.info}</span></div>
            </div>
        </div>
    )
}

function BrandSlider() {
    const [activeSlide, setActiveSlide] = useState(0);
    const startX = useRef(0);
    const isDragging = useRef(false);

    const slides = [
        <Brands brand="pedigree" info="Pedigree is not just about origin, it’s about the excellence that carries forward." color="yellow" />,
        <Brands brand="whiskas" info="Whiskas: Because every cat deserves a taste of joy." color="purple" />,
        <Brands brand="smartheart" info="SmartHeart: Smart food for a happy heart." color="blue" />,
    ];

    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.clientX;
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        const diff = e.clientX - startX.current;

        if (Math.abs(diff) > 50) {
            if (diff < 0) setActiveSlide((prev) => (prev + 1) % slides.length); // drag left -> next
            else setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length); // drag right -> prev
            startX.current = e.clientX; // reset for continuous drag
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    return (
        <div
            className="w-full h-[600px] flex justify-center items-center select-none cursor-grab overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // handle case where mouse leaves the div
        >
            <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                        {slide}
                    </div>
                ))}
            </div>
        </div>
    );
}

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
                            <div className="w-[100%] h-auto backdrop-blur absolute xs:top-[20px] md:top-[25px] lg:top-[25px] flex flex-col gap-1 pt-1 pl-1 ">
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

            <BrandSlider />


        </>
    )
}