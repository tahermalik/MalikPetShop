import { useState, useRef } from "react"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryState, setLoginLogoutState } from "../redux/slices/userSlice";
import { RiArrowDropDownLine,RiArrowDropUpLine } from "react-icons/ri";
import { Link } from "react-router-dom";

function Brands(props) {
    const colorClasses = {
        yellow: "bg-amber-300",
        purple: "bg-purple-500",
        blue: "bg-blue-500",
    };

    return (
        <div className={`body h-[600px] w-full ${colorClasses[props.color]} flex flex-row justify-center items-center`}>
            <div className="h-[80%] w-[80%] flex flex-row gap-2">
                <div className="flex flex-row justify-center items-center rounded-2xl h-[100%] w-[70%]"><img className="h-[400px] w-[100%] object-contain rounded-2xl" src={`/${props.brand}.jpg`} alt={`${props.brand}_img`} /></div>
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
            if (diff < 0)
                setActiveSlide((prev) => (prev + 1) % slides.length);
            else
                setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
            startX.current = e.clientX;
        }
    };

    const handleMouseUp = () => (isDragging.current = false);

    return (
        <div
            className="relative w-full h-[600px] select-none cursor-grab overflow-x-hidden bg-blue-300"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div
                className="flex transition-transform duration-500 ease-in-out h-full w-[100%] bg-orange-500"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div key={index} className="w-[100%] flex-shrink-0 bg-purple-500">
                        {slide}
                    </div>
                ))}
            </div>
        </div>
    );
}

function Owner() {
    const myRef = useRef();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else setIsVisible(false)
            },
            { threshold: 0.5 } // triggers when 50% of the component is visible
        );

        if (myRef.current) observer.observe(myRef.current);

        return () => observer.disconnect();
    }, []);
    return (

        <div ref={myRef} className={`owner_details ${isVisible ? "visible" : ""} overflow-hidden h-[400px] w-full box-border flex flex-row justify-center items-center gap-6`}>
            <div className="sm:h-[300px] sm:w-[300px] xs:h-[150px] xs:w-[150px] rounded-full bg-emerald-400 border-4 border-black ">
                <img className="h-[100%] w-[100%] object-cover rounded-full" src="/photo_21.jpg" alt="my_photo" />
            </div>
            <div className="w-[40%] text-justify xs:text-sm md:text-md lg:text-lg">
                <span className="">With over 15 years of hands-on experience in the pet care industry, we bring trusted expertise to every pet and owner we serve. From quality nutrition to personalized care, our passion is keeping pets happy and healthy. At our shop, every tail wag and purr reflects years of dedication and love for animals.</span>
            </div>
        </div>
    )
}

function Header() {
    const dispatch=useDispatch();
    const show=useSelector((state)=>state?.user?.categoryState)
    const showLoginLogout=useSelector((state)=>state?.user?.loginLogout)

    function categoriesHandler() {
        dispatch(setCategoryState())
    }

    function loginLogoutHandler(){
        dispatch(setLoginLogoutState())
    }

    const dropdownRef=useRef(null)
    const loginRef=useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (show) {
                    dispatch(setCategoryState());
                }
            }
            if (loginRef.current && !loginRef.current.contains(event.target)) {
                if (showLoginLogout) {
                    dispatch(setLoginLogoutState());
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [show, dispatch,showLoginLogout]);

    return (
        <>
            <div className="header flex flex-col h-[100px]  w-[100%] gap-2 sticky top-0 z-2 bg-white">
                <div className="upper_header flex flex-row justify-evenly items-center gap-3 w-[100%] bg-white">
                    <div className="l-upper-header flex flex-row gap-1">
                        <div className="flex flex-row justify-center items-center"><img src="/header_logo.svg" alt="paws_img" /></div>
                        <div className="flex flex-col">
                            <div><span className="sm:text-lg md:text-xl lg:text-2xl font-semibold">Malik</span></div>
                            <div><span className="sm:text-md md:text-lg">Pet Shop</span></div>
                        </div>
                    </div>
                    <div className="m-upper-header bg-white w-[30%] flex flex-row gap-2 p-2 rounded-2xl border border-[rgb(97,94,100)]">
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
                    <div ref={dropdownRef} className="relative">
                        <div className="flex flex-row justify-center items-center" onMouseEnter={() => categoriesHandler()}>
                            <div><span className="xs:text-sm md:text-lg lg:text-xl">Shop By Categories</span></div>
                            {!show && <div><RiArrowDropDownLine size={30}/></div>}
                            {show && <div><RiArrowDropUpLine size={30}/></div>}
                        </div>
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
                        <div ref={loginRef} className="cursor-pointer hover:rounded-2xl hover:bg-[rgb(205,205,219)] p-1 relative" onMouseEnter={()=>loginLogoutHandler()}>
                            <div className="flex flex-row">
                                <div><img src="/person_logo.svg" alt="person_img" /></div>
                                {!showLoginLogout && <div><RiArrowDropDownLine size={30}/></div>}
                                {showLoginLogout && <div><RiArrowDropUpLine size={30}/></div>}
                            </div>
                            {showLoginLogout &&
                                <div className="w-[100%] h-auto backdrop-blur absolute xs:top-[25px] md:top-[27px] lg:top-[30px] flex flex-col gap-1 pt-1 ">
                                    <Link to="/Login"><div><span className="hover:bg-gray-300 hover:rounded-2xl px-2 py-1 cursor-pointer">Login</span></div></Link>
                                    <div><span className="hover:bg-gray-300 hover:rounded-2xl px-2 py-1 cursor-pointer">Logout</span></div>
                                </div>
                            }
                        </div>
                        <div className="cursor-pointer hover:rounded-2xl hover:bg-red-300 p-1"><img src="/fav_logo.svg" alt="fav_img" /></div>
                        <div className="cursor-pointer hover:rounded-2xl hover:bg-emerald-300 p-1"><img src="/shop_logo.svg" alt="shop_img" /></div>

                    </div>
                </div>
            </div>
        </>
    )
}

function FeedBack() {
    const myRef = useRef(null)
    const [text, setText] = useState("")

    useEffect(() => {
        const el = myRef.current;
        if (el) {
            if (el.scrollHeight <= 200 && el.scrollHeight >= 50) {
                el.style.height = "auto"; // reset
                el.style.height = el.scrollHeight + "px"; // resize
            }
        }
    }, [text])

    return (
        <form action="post">
            <div className="h-[300px] w-[100%] border-b-2 border-t-2 border-black flex flex-row gap-30 justify-center items-stretch bg-[#38bdf8]">
                <div className="flex flex-col items-center justify-center gap-3 w-[30%]">
                    <div className="w-[100%] rounded-2xl border-2 border-[rgb(173,169,189)]"><textarea ref={myRef} name="" id="" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter you FeedBack" className="outline-0 p-2 max-h-[200px] min-h-[100px] w-[100%] overflow-y-scroll scrollbar-hide placeholder:xs:text-sm placeholder:lg:text-lg xs:text-sm lg:text-lg"></textarea></div>
                    <div className="flex flex-row justify-center items-center w-[80%] self-center border-2 border-black rounded-2xl cursor-pointer hover:bg-blue-400"><button className="xs:text-sm sm:text-md lg:text-xl">Submit</button></div>
                </div>

                <div className="flex flex-row justify-center items-center xs:text-xl lg:text-2xl">
                    <span>FeedBack</span>
                </div>
            </div>
        </form>
    )
}

export default function LandingPage() {
    return (
        <>
            <Header />
            <BrandSlider />
            <Owner />
            <FeedBack />
        </>
    )
}