import { useState, useRef, useLayoutEffect } from "react"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryState, setDetailOption, setLoginOption } from "../redux/slices/userSlice";
import { RiArrowDropDownLine, RiArrowDropUpLine, RiTwitterXLine } from "react-icons/ri";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { HiHeart, HiOutlineMail } from "react-icons/hi";
import { FaPhoneAlt, FaRegHeart, FaUser } from "react-icons/fa";
import { IoIosContact } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { setHeaderHight } from "../redux/slices/layoutSlice";
import { setPets, setTypeFilter } from "../redux/slices/filterSlice";
import axios from "axios";
import { CART_ENDPOINTS, USER_ENDPOINTS } from "./endpoints.js";
import { useGetAllFeedBack } from "../hooks/useGetAllFeedBack.js";
import { FaChevronLeft, FaChevronRight, FaPaperPlane } from "react-icons/fa";


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
                <div className="h-[100%] w-[30%] flex flex-row justify-center items-center text-[#212121]"><span className="xs:text-md md:text-lg lg:text-2xl">{props.info}</span></div>
            </div>
        </div>
    )
}


function AutoBrandSlider() {
    const [activeSlide, setActiveSlide] = useState(0);

    const slides = [
        <Brands brand="pedigree" info="Pedigree is not just about origin, it’s about the excellence that carries forward." color="yellow" />,
        <Brands brand="whiskas" info="Whiskas: Because every cat deserves a taste of joy." color="purple" />,
        <Brands brand="smartheart" info="SmartHeart: Smart food for a happy heart." color="blue" />,
    ];

    //////// automatic slider logic
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % slides.length);
        }, 4000); // change every 4 seconds

        // cleanup on unmount
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div
            className="
                relative w-full h-[600px] select-none overflow-x-hidden
                bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                shadow-[0_20px_50px_rgba(29,78,216,0.35)]
                rounded-xl overflow-hidden
            "
        >
            {/* Soft glass reflection overlay */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_60%)]"></div>

            <div
                className="
                    flex h-full w-full
                    transition-transform duration-[900ms]
                    ease-[cubic-bezier(0.22,0.61,0.36,1)]
                "
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`
                            w-full flex-shrink-0 
                            transform transition-all duration-[1200ms]
                            ${index === activeSlide ? "scale-[1.04]" : "scale-100 opacity-80"}
                        `}
                    >
                        {slide}
                    </div>
                ))}
            </div>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-10">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveSlide(index)}
                        className={`
                            w-3 h-3 rounded-full cursor-pointer transition-all duration-500 
                            ${index === activeSlide
                                ? "bg-white scale-150 shadow-[0_0_12px_4px_rgba(255,255,255,0.7)]"
                                : "bg-blue-300 hover:bg-blue-200"}
                        `}
                    />
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
        <>
            <div ref={myRef} className={`owner_details ${isVisible ? "visible" : ""} overflow-hidden h-[400px] w-full box-border flex flex-row justify-center items-center gap-6`}>
                <div className="sm:h-[300px] sm:w-[300px] xs:h-[150px] xs:w-[150px] rounded-full bg-emerald-400 border-4 border-[#00ACC1] ">
                    <img className="h-[100%] w-[100%] object-cover rounded-full" src="/photo_21.jpg" alt="my_photo" />
                </div>
                <div className="w-[40%] text-justify xs:text-sm md:text-md lg:text-lg text-[#212121]">
                    <h1 className="font-bold text-2xl">About Us</h1>
                    <span className="">With over 15 years of hands-on experience in the pet care industry, we bring trusted expertise to every pet and pet parent we serve. From quality nutrition to personalized care, our passion is keeping pets happy and healthy. At our shop, every tail wag and purr reflects years of dedication and love for animals.</span>
                </div>
            </div>
        </>
    )
}

function SmoothUnderline() {
    return (
        <>
            <span
                className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-700 ease-in-out group-hover:w-full pointer-events-none"
            ></span>
        </>
    )
}


export const cat = {
    "cat food": ["dry food", "wet food", "kitten food", "veterinary food"],
    "treats": ["biscuits", "meat treats", "creamy treats", "wet treats"],
    "clothing": ["fancy accessories", "occassion wears"],
    "litter & accessories": ["ball shaped litters", "cat litter trays", "sand litter", "scoopers"],
    "toys": ["cat nip toys", "interactive toys", "squeaky toys", "steaky toys"],
    "grooming": ["brushes & combs", "ceodrants", "cloves", "nail cutters", "powders", "shampoo & soaps", "towels & wipes"],
    "cage": ["cage"]
}

function CatStuff() {
    const dispatch = useDispatch()
    return (
        <div className="flex flex-row gap-10 justify-center w-[100%]">
            {Object.keys(cat).map((categories) => (
                <div>
                    <div className="font-semibold sm:text-md md:text-lg" key={categories}><span>{categories}</span></div>
                    <div className="sm:text-sm">
                        {
                            cat[categories].map((item) => (
                                <div key={item}><Link to="/product"><span className="relative group" onClick={() => { dispatch(setTypeFilter(item.toLowerCase())) }}>{item} {<SmoothUnderline />}</span></Link></div>
                            ))
                        }
                    </div>
                </div>
            ))}

        </div>
    )
}


export const dog = {
    "dog food": ["dry food", "wet food", "puppy food", "veterinary food"],
    "treats": ["biscuits", "meat treats", "creamy treats", "wet treats"],
    "clothing": ["t-shirts", "occassion wears", "winter wears", "shoes"],
    "bedding": ["beds", "blankets", "cooling mats", "cushions"],
    "toys": ["leather toys", "interactive toys", "squeaky toys", "rope toys", "flush toys"],
    "grooming": ["brushes & combs", "deodrants", "gloves", "nail cutters", "powders", "shampoo & soaps", "towels & wipes"],
    "cage": ["cage"]
};
function DogStuff() {
    return (
        <div className="flex flex-row gap-10 justify-center w-[100%]">
            {Object.keys(dog).map((categories) => (
                <div>
                    <div className="font-semibold sm:text-md md:text-lg" key={categories}><span>{categories}</span></div>
                    <div className="sm:text-sm">
                        {
                            dog[categories].map((item) => (
                                <div key={item}><Link to="/product"><span className="relative group" onClick={() => { dispatch(setTypeFilter(item.toLowerCase())) }}>{item} {<SmoothUnderline />}</span></Link></div>
                            ))
                        }
                    </div>
                </div>
            ))}
        </div>
    )
}

export const birds = ["bowls", "cage", "food", "health supplements"];
export const hamster = ["ball", "cage", "food", "toys"];
export const rabbit = ["cage", "food", "health supplements"];
export const turtle = ["food", "health supplements"];


function SmallPetStuff() {
    const dispatch = useDispatch()
    return (
        <div className="flex flex-row gap-10 justify-center w-[100%]">
            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Bird</span></div>
                <div className="sm:text-sm">
                    {
                        birds.map((item) => (
                            <div><span className="relative group" onClick={() => { dispatch(setPets("bird")); dispatch(setTypeFilter(item.toLowerCase())) }}>{item} {<SmoothUnderline />}</span></div>
                        ))
                    }
                </div>
            </div>
            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Hamster</span></div>
                <div className="sm:text-sm">
                    {
                        hamster.map((item) => (
                            <div><span className="relative group" onClick={() => { dispatch(setPets("hamster")); dispatch(setTypeFilter(item.toLowerCase())) }}>{item} {<SmoothUnderline />}</span></div>
                        ))
                    }
                </div>
            </div>
            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Rabbit</span></div>
                <div className="sm:text-sm">
                    {
                        rabbit.map((item) => (
                            <div><span className="relative group" onClick={() => { dispatch(setPets("rabbit")); dispatch(setTypeFilter(item.toLowerCase())) }}>{item} {<SmoothUnderline />}</span></div>
                        ))
                    }
                </div>
            </div>

            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Turtle</span></div>
                <div className="sm:text-sm">
                    {
                        turtle.map((item) => (
                            <div><span className="relative group" onClick={() => { dispatch(setPets("turtle")); dispatch(setTypeFilter(item.toLowerCase())) }}>{item} {<SmoothUnderline />}</span></div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export function Header() {
    const dispatch = useDispatch();
    const show = useSelector((state) => state?.user?.categoryState)
    const showLoginOption = useSelector((state) => state?.user?.loginOption) // initally going to be false
    const showDetailOption = useSelector((state) => state?.user?.detailOption)  // initially false
    const [data, setData] = useState("cat")
    const navigate = useNavigate()
    let clicked = "user"

    const headerRef = useRef(null);

    function categoriesHandler(e) {
        const parentDiv = e.currentTarget;
        const firstChildDiv = parentDiv.querySelector("div:first-child")
        setData(firstChildDiv.textContent.toLowerCase())
        dispatch(setPets(firstChildDiv.textContent.toLowerCase()))
        if (!show) dispatch(setCategoryState())
    }

    function detailsHandler(e) {
        const parentDiv = e.currentTarget;
        const firstChildDiv = parentDiv.querySelector("div:first-child")
        clicked = firstChildDiv.dataset.details.toLowerCase()

        if (clicked === "user") {
            if (!showLoginOption) {
                dispatch(setLoginOption())
                if (showDetailOption) dispatch(setDetailOption())
            }

        } else {
            if (!showDetailOption) {
                // console.log("heello",showDetailOption)
                dispatch(setDetailOption())
                if (showLoginOption) dispatch(setLoginOption())
            }
        }
    }

    const dropdownRef = useRef(null)
    const loginRef = useRef(null)
    const contactRef = useRef(null)

    useLayoutEffect(() => {
        if (headerRef.current) {
            console.log(headerRef.current.offsetHeight)
            dispatch(setHeaderHight(headerRef.current.offsetHeight))
        }
    }, [])

    const headerHeight = useSelector((state) => state?.layout?.headerHeight)

    /// whenever clicked outside of down scroll set toggle in the redux as false
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (show) {
                    dispatch(setCategoryState());
                }
            }
            if (loginRef.current && !loginRef.current.contains(event.target)) {
                if (showLoginOption) {
                    dispatch(setLoginOption());
                }
            }

            if (contactRef.current && !contactRef.current.contains(event.target)) {
                if (showDetailOption) {
                    dispatch(setDetailOption());
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [show, dispatch, showDetailOption, showLoginOption]);

    const [query, setQuery] = useState("");

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            navigate("/product", { state: { query: query, data: "search" } });
        }
    }

    //// getting user role and id
    const role = useSelector((state) => state?.user?.userData?.role)
    const userId = useSelector((state) => state?.user?.userData?._id)

    async function viewWishList(e) {
        try {
            e.stopPropagation();
            e.preventDefault();

            navigate("/WishListUI", { state: { userId: userId } })

        } catch (error) {
            console.log("wrong in viewWishist frontend", error);
        }
    }

    const reduxCartData = useSelector((state) => state?.cart?.products)
    async function viewCart(e) {
        try {
            e.stopPropagation();
            e.preventDefault();

            //// when the user is logged in
            if (userId) {
                await axios.post(`${CART_ENDPOINTS}/mergeCartItemsAppCall`, { userId: userId, reduxCartData: reduxCartData })
            }
            navigate("/cart", { state: { userId: userId } })

        } catch (error) {
            console.log("wrong in viewCart frontend" + error);
        }
    }

    return (
        <>
            <div
                ref={headerRef}
                className="header flex flex-col w-full sticky top-0 z-20 bg-gradient-to-b from-[#DFF3FF] to-[#B4E1FF] shadow-md backdrop-blur-sm"
            >
                {/* Upper Header */}
                <div className="upper_header flex flex-col sm:flex-row justify-center sm:justify-evenly items-center gap-3 py-3 w-full text-[#0A3D62]">
                    <div className="l-upper-header flex flex-row gap-2 items-center">
                        <div className="hidden sm:flex justify-center items-center">
                            <img
                                src="/header_logo.svg"
                                alt="paws_img"
                                className="w-10 h-10 sm:w-auto sm:h-auto drop-shadow-md"
                            />
                        </div>
                        <div className="hidden sm:flex flex-col text-[#0A3D62] leading-3 p-1">
                            <span className="font-bold text-xl">Malik</span>
                            <span className="text-sm opacity-80">Pet Shop</span>
                        </div>
                    </div>

                    <div className="flex flex-row gap-2 w-[90%] sm:w-[50%]">
                        {/* Hamburger for mobile */}
                        <div className="sm:hidden flex items-center text-[#0A3D62] text-3xl cursor-pointer">
                            ☰
                        </div>
                        <div className="m-upper-header bg-white/80 backdrop-blur-md w-full flex flex-row gap-2 p-2 rounded-2xl border border-[#9AD3FF] shadow-sm">
                            <div className="search_logo opacity-80">
                                <img src="/search_logo.svg" alt="search_icon" />
                            </div>
                            <div className="search_bar w-full">
                                <input
                                    className="w-full h-full outline-0 bg-transparent placeholder:text-sm placeholder:text-[#5A7890] text-[#0A3D62]"
                                    type="text"
                                    placeholder="Search for more than 100 products"
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Upper Header */}
                    <div className="r-upper-header flex flex-row justify-center sm:justify-evenly items-center gap-3 sm:gap-4 sm:mt-0 w-[90%] sm:w-[20%] h-fit">
                        <div className="flex flex-row gap-1 w-full justify-evenly items-center">

                            {/* Contact */}
                            <div ref={contactRef} className="cursor-pointer hover:rounded-2xl relative flex flex-row items-center w-fit transition-all duration-200 hover:bg-[#A8DAFF]/40 p-2 rounded-xl">
                                <div className="flex flex-row justify-center items-center" onMouseEnter={(e) => detailsHandler(e)}>
                                    <div className="" data-details="details"><IoIosContact color="#4AA9F7" size={40} /></div>
                                    {(!showDetailOption) && <div><RiArrowDropDownLine size={20} /></div>}
                                    {showDetailOption && <div><RiArrowDropUpLine size={20} /></div>}
                                </div>
                                {showDetailOption &&
                                    <div className="h-auto backdrop-blur-xl absolute top-[30px] flex flex-col gap-1 bg-white/90 p-3 shadow-lg rounded-2xl">
                                        <div className="flex flex-row items-center gap-2 pl-1">
                                            <div><HiOutlineMail color="#054873" /></div>
                                            <div className="text-[#054873] text-sm"><span>tahermalik2002@gmail.com</span></div>
                                        </div>
                                        <div className="flex flex-row items-center gap-2 pl-1">
                                            <div><FaPhoneAlt color="#054873" /></div>
                                            <div className="text-[#054873] text-sm"><span>9152760580</span></div>
                                        </div>
                                        {role === "admin" && <Link to="/adminSetting"><div className="hover:bg-[#DFF3FF] hover:rounded-xl px-3 py-1 cursor-pointer text-[#054873]">Admin Settings</div></Link>}
                                    </div>
                                }
                            </div>

                            {/* Login */}
                            <div ref={loginRef} className="cursor-pointer hover:rounded-2xl flex flex-row justify-center items-center transition-all duration-200 hover:bg-[#A8DAFF]/40 p-2 rounded-xl">
                                <div className="flex flex-row items-center justify-center" onMouseEnter={(e) => detailsHandler(e)}>
                                    <div className="flex flex-row justify-center items-center" data-details="user"><FaUser color="#4AA9F7" size={30} /></div>
                                    {(!showLoginOption || clicked !== "user") && <div><RiArrowDropDownLine size={20} /></div>}
                                    {showLoginOption && clicked === "user" && <div><RiArrowDropUpLine size={20} /></div>}
                                </div>
                                {showLoginOption &&
                                    <div className="w-fit h-auto backdrop-blur-xl absolute top-[50px] flex flex-col gap-1 bg-white/90 p-3 shadow-lg rounded-2xl">
                                        <Link to="/Login" state={{ user: "user" }}><div className="hover:bg-[#DFF3FF] hover:rounded-xl px-3 py-1 cursor-pointer text-[#054873]">User Login</div></Link>
                                        <Link to="/Login" state={{ user: "admin" }}><div className="hover:bg-[#DFF3FF] hover:rounded-xl px-3 py-1 cursor-pointer text-[#054873]">Admin Login</div></Link>
                                        <div className="hover:bg-[#DFF3FF] hover:rounded-xl px-3 py-1 cursor-pointer text-[#054873]">Logout</div>
                                    </div>
                                }
                            </div>

                            {/* Wishlist */}
                            <div className="cursor-pointer hover:bg-[#7DC6FF]/50 p-2 flex flex-row justify-center items-center rounded-full transition-all duration-200" onClick={(e) => viewWishList(e)}>
                                <FaRegHeart color="#4AA9F7" size={30} />
                            </div>

                            {/* Cart */}
                            <div className="cursor-pointer hover:bg-[#7DC6FF]/50 p-2 flex flex-row justify-center items-center rounded-full transition-all duration-200" onClick={(e) => viewCart(e)}>
                                <MdOutlineShoppingCart color="#4AA9F7" size={35} />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Lower Header */}
                <div className="lower_header flex flex-row justify-evenly items-center gap-3 w-full h-[40%] bg-gradient-to-r from-[#7DC6FF] to-[#4AA9F7] text-white shadow-inner">
                    <div className="flex flex-row justify-evenly items-center w-full">
                        <div onMouseEnter={categoriesHandler} className="xs:text-xs sm:text-sm md:text-lg flex flex-row justify-center items-center hover:underline hover:decoration-white cursor-pointer px-4 py-1 rounded-xl transition-all duration-200">
                            <div className="text-black">Cat</div>
                            {(!show || data !== "cat") && <div><RiArrowDropDownLine size={20} color="black" /></div>}
                            {show && data === "cat" && <div><RiArrowDropUpLine size={20} color="black" /></div>}
                        </div>
                        <div onMouseEnter={categoriesHandler} className="xs:text-xs sm:text-sm md:text-lg flex flex-row justify-center items-center hover:underline hover:decoration-white cursor-pointer px-4 py-1 rounded-xl transition-all duration-200">
                            <div className="text-black">Dog</div>
                            {(!show || data !== "dog") && <div><RiArrowDropDownLine size={20} color="black" /></div>}
                            {show && data === "dog" && <div><RiArrowDropUpLine size={20} color="black" /></div>}
                        </div>
                        <div onMouseEnter={categoriesHandler} className="xs:text-xs sm:text-sm md:text-lg flex flex-row justify-center items-center hover:underline hover:decoration-white cursor-pointer px-4 py-1 rounded-xl transition-all duration-200">
                            <div className="text-black">Small Pets</div>
                            {(!show || data !== "small pets") && <div><RiArrowDropDownLine size={20} color="black" /></div>}
                            {show && data === "small pets" && <div><RiArrowDropUpLine size={20} color="black" /></div>}
                        </div>
                        <div onMouseEnter={categoriesHandler} className="xs:text-xs sm:text-sm md:text-lg flex flex-row justify-center items-center hover:underline hover:decoration-white cursor-pointer px-4 py-1 rounded-xl transition-all duration-200">
                            <div className="text-black">Brands</div>
                            {(!show || data !== "brands") && <div><RiArrowDropDownLine size={20} color="black" /></div>}
                            {show && data === "brands" && <div><RiArrowDropUpLine size={20} color="black" /></div>}
                        </div>
                        <Link to="/offer">
                            <div className="xs:text-xs sm:text-sm md:text-lg flex flex-row justify-center items-center hover:underline text-black cursor-pointer px-4 py-1 rounded-xl transition-all duration-200">
                                <span>Offer</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {show && <div
                    ref={dropdownRef}
                    className={`scoll-lower-header absolute left-0 h-auto w-full bg-white/95 shadow-xl backdrop-blur-lg flex flex-row flex-wrap p-3
               transition-all duration-300 ease-out transform origin-top scale-y-100`}
                    style={{ top: `${headerHeight}px` }}
                >
                    {data === "cat" && <CatStuff />}
                    {data === "dog" && <DogStuff />}
                    {data === "small pets" && <SmallPetStuff />}
                </div>}
            </div>
        </>
    )
}

function FeedBack(props) {
    const myRef = useRef(null)
    const [text, setText] = useState("")
    const [rating, setRating] = useState(5);

    useEffect(() => {
        const el = myRef.current;
        if (el) {
            //// min height by default will be 50px and max height will be 200px
            if (el.scrollHeight <= 200 && el.scrollHeight >= 50) {
                el.style.height = "auto"; // reset
                el.style.height = el.scrollHeight + "px"; // resize
            }
        }
    }, [text])

    const user = useSelector((state) => state?.user?.userData)
    async function submitFeedBack() {

        if (!user) console.log("user need to login first")
        else if (text.trim().length === 0) console.log("FeedBack can't be empty")
        else {
            const res = await axios.post(`${USER_ENDPOINTS}/createFeedBack/${user?._id}`, { message: text, rating: rating }, { withCredentials: true })

            if (res?.data?.bool) {
                console.log("feedback created successfully")
            } else {
                console.log("fucked up in feedback creation")
            }
            setText("")
            setRating(0)
        }

        props.setRefresh(prev => prev + 1)

    }

    return (
        <div className="h-[300px] w-[100%] flex flex-row gap-3 justify-center bg-blue-500 relative items-center">
            {/* Avatar */}
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-blue-400 shadow-lg">
                <img
                    src="/photo_21.jpg"
                    alt="user"
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="flex flex-row items-center justify-center gap-3 w-[30%] relative">
                <textarea ref={myRef} name="" id="" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter you FeedBack" className="outline-0 p-2 max-h-[200px] min-h-[100px] overflow-y-scroll scrollbar-hide w-full bg-blue-50 text-gray-800 px-4 py-3 rounded-2xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md transition-all duration-300">
                </textarea>
                <div className=" absolute bottom-2 right-2 h-10 w-10 flex justify-center items-center bg-blue-600 text-white 
                    rounded-full hover:bg-blue-700 active:scale-90 shadow-lg transition-all duration-300"
                    onClick={() => submitFeedBack()}>
                    <FaPaperPlane className="text-sm" />
                </div>
            </div>
        </div>
    )
}

export function ReviewCardSkeleton() {
    return (
        <div className="w-[400px] h-[300px] bg-blue-50 rounded-2xl shadow-md p-4 flex flex-col gap-3 animate-pulse">

            {/* User section */}
            <div className="flex items-center gap-3">

                {/* Avatar */}
                <div className="h-12 w-12 rounded-full bg-blue-200"></div>

                {/* Name + stars */}
                <div className="flex flex-col gap-2">

                    {/* Name */}
                    <div className="h-4 w-24 bg-blue-200 rounded"></div>

                    {/* Stars */}
                    <div className="flex gap-1">
                        <div className="h-4 w-4 bg-blue-200 rounded"></div>
                        <div className="h-4 w-4 bg-blue-200 rounded"></div>
                        <div className="h-4 w-4 bg-blue-200 rounded"></div>
                        <div className="h-4 w-4 bg-blue-200 rounded"></div>
                        <div className="h-4 w-4 bg-blue-200 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Message lines */}
            <div className="flex flex-col gap-2 mt-1">
                <div className="h-3 w-[90%] bg-blue-200 rounded"></div>
                <div className="h-3 w-[80%] bg-blue-200 rounded"></div>
                <div className="h-3 w-[70%] bg-blue-200 rounded"></div>
                <div className="h-3 w-[60%] bg-blue-200 rounded"></div>
            </div>

        </div>
    );
}


export function ReviewCard(props) {
    return (
        <div className="w-[400px] bg-blue-50 rounded-2xl shadow-md flex flex-col gap-3 hover:shadow-lg transition h-[300px] p-4">

            {/* User Info */}
            <div className="flex items-center gap-3">
                {/* User Avatar */}
                <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-semibold text-lg">

                </div>

                {/* User Name */}
                <div className="flex flex-col">

                    <h3 className="text-blue-900 font-semibold text-sm sm:text-base">
                        {props?.username || "Anonymous"}
                    </h3>

                    {/*Rating */}
                    <div className="flex items-center gap-1 mt-2">
                        {/* Example: 5-star rating */}
                        <div className="flex gap-0.5">
                            {Array(5)
                                .fill(0)
                                .map((_, idx) => (
                                    <svg
                                        key={idx}
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-blue-500"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.21c.969 0 1.371 1.24.588 1.81l-3.404 2.473a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.404-2.473a1 1 0 00-1.175 0l-3.404 2.473c-.784.57-1.838-.197-1.539-1.118l1.285-3.97a1 1 0 00-.364-1.118L2.025 9.397c-.783-.57-.38-1.81.588-1.81h4.21a1 1 0 00.95-.69l1.286-3.97z" />
                                    </svg>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Message */}
            <p className="text-blue-700 text-sm sm:text-[14px] line-clamp-4">
                {props?.message}
            </p>

        </div>
    );
}


function ShowFeedBack(props) {

    const [currentIndex, setCurrentIndex] = useState([0, ""]);

    const total = props?.feedBack.length;

    // Handle previous button
    const handlePrev = () => {
        setCurrentIndex((prev) => {
            const oldArr = [...prev];
            oldArr[0] = (oldArr[0] - 1 + total) % total;
            oldArr[1] = "RIGHT";
            return oldArr;
        })
    };

    // Handle next button
    const handleNext = () => {
        setCurrentIndex((prev) => {
            const oldArr = [...prev];
            oldArr[0] = (oldArr[0] + 1) % total;
            oldArr[1] = "LEFT";
            return oldArr;
        })

    };


    // Get 4 reviews to display
    const getDisplayIndexes = () => {
        if (total <= 3) return Array.from({ length: total }, (_, i) => i);
        // Two focused in center
        const left = (currentIndex[0] - 1 + total) % total;
        const center = currentIndex[0];
        const right = (currentIndex[0] + 1) % total;

        return [left, center, right];
    };

    const displayIndexes = getDisplayIndexes();


    useEffect(() => {
        setTimeout(() => {
            setCurrentIndex((prev) => {
                const oldArr = [...prev];
                oldArr[1] = "";
                return oldArr;
            })
        }, 1000)
    })

    // console.log("usernames",usernames)
    // console.log("messages",messages)

    return (
        <>
            <div className="border-t-black border flex flex-row justify-around gap-2 p-2 items-center relative  bg-blue-100">
                {/* Left Button */}
                <button
                    onClick={handlePrev}
                    className="absolute left-2 z-10 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                    <FaChevronLeft />
                </button>

                {/* Reviews */}
                <div className="flex items-center justify-between w-[90%]">
                    {displayIndexes.map((idx, i) => {
                        const review = props?.feedBack[idx];
                        let scale = 0.8;
                        let opacity = 0.6;

                        // center two cards focused
                        if (i === 1) {
                            scale = 1;
                            opacity = 1;
                        }


                        return (
                            <div
                                key={idx}
                                className="transition-all duration-200 flex-shrink-0"
                                style={{
                                    transform: `scale(${scale})`,
                                    opacity: opacity,
                                    width: "33%", // all 3 cards spaced equally
                                }}
                            >
                                {currentIndex[1] === "LEFT" ? i === 2 ? <ReviewCardSkeleton /> : <ReviewCard
                                    username={review.username}
                                    message={review.message}
                                /> : currentIndex[1] === "RIGHT" ? i === 0 ? <ReviewCardSkeleton /> : <ReviewCard
                                    username={review.username}
                                    message={review.message}
                                /> : <ReviewCard
                                    username={review.username}
                                    message={review.message} />}
                            </div>
                        );
                    })}
                </div>

                {/* Right Button */}
                <button
                    onClick={handleNext}
                    className="absolute right-2 z-10 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                    <FaChevronRight />
                </button>
            </div>

        </>
    )
}

export function Footer() {
    return (
        <>
            <div className="footer h-[300px] w-[100%] bg-[#0D47A1] flex flex-row justify-center gap-10 items-center border-t-[#00ACC1]">
                <div className="flex flex-col h-[90%] w-fit gap-4 p-2 rounded-2xl text-white">
                    <div className="flex flex-row gap-2">
                        <div className="flex flex-row justify-center items-center"><img src="/header_logo.svg" alt="paws_img" /></div>
                        <div className="flex flex-col text-white font-extrabold ">
                            <div><span className="sm:text-lg md:text-xl lg:text-2xl font-semibold">Malik</span></div>
                            <div><span className="sm:text-md md:text-lg">Pet Shop</span></div>
                        </div>
                    </div>
                    <div><span>Where every pet feels at home.</span></div>

                    <div className="flex flex-row items-center justify-evenly gap-2 ">
                        <div className="rounded-full border border-blue-400 p-1 flex flex-row justify-center items-center hover:bg-[#29B6F6] hover:cursor-pointer"><FaWhatsapp size={20} color="#81D4FA" /></div>
                        <div className="rounded-full border border-blue-400 p-1 flex flex-row justify-center items-center hover:bg-[#29B6F6] hover:cursor-pointer"><FaInstagram size={20} color="#81D4FA" /></div>
                        <div className="rounded-full border border-blue-400 p-1 flex flex-row justify-center items-center hover:bg-[#29B6F6] hover:cursor-pointer"><RiTwitterXLine size={20} color="#81D4FA" /></div>
                        <div className="rounded-full border border-blue-400 p-1 flex flex-row justify-center items-center hover:bg-[#29B6F6] hover:cursor-pointer"><FaFacebook size={20} color="#81D4FA" /></div>

                    </div>
                </div>

                <div className="flex flex-col h-[90%] w-fit gap-4 p-2 rounded-2xl text-white">
                    <div className="xs:text-lg lg:text-xl text-white"><span>Quick Links</span></div>
                    <div className="flex flex-col ">
                        <Link to="/"><div className="hover:underline hover:decoration-[#03A9F4] hover:cursor-pointer hover:text-[#4FC3F7] text-[#BBDEFB]"><a>Home</a></div></Link>
                        <div className="hover:underline hover:decoration-[#03A9F4] hover:cursor-pointer text-[#BBDEFB] hover:text-[#4FC3F7]"><a>About Us</a></div>
                        <div className="hover:underline hover:decoration-[#03A9F4] hover:cursor-pointer text-[#BBDEFB] hover:text-[#4FC3F7]"><a>Offers</a></div>
                        <div className="hover:underline hover:decoration-[#03A9F4] hover:cursor-pointer text-[#BBDEFB] hover:text-[#4FC3F7]"><a>Contact Us</a></div>
                    </div>
                </div>


                <div className="flex flex-col h-[90%] w-fit gap-4 p-2 rounded-2xl text-white">
                    <div className="xs:text-lg lg:text-xl text-white"><span>Help Centers</span></div>
                    <div className="flex flex-col ">
                        <div className="hover:underline  hover:decoration-[#03A9F4] hover:cursor-pointer hover:text-[#4FC3F7] text-[#BBDEFB]"><a>Payments</a></div>
                        <div className="hover:underline  hover:decoration-[#03A9F4] hover:cursor-pointer hover:text-[#4FC3F7] text-[#BBDEFB]"><a>Shipping</a></div>
                        <div className="hover:underline  hover:decoration-[#03A9F4] hover:cursor-pointer hover:text-[#4FC3F7] text-[#BBDEFB]"><a>Product Return Policy</a></div>
                        <div className="hover:underline  hover:decoration-[#03A9F4] hover:cursor-pointer hover:text-[#4FC3F7] text-[#BBDEFB]"><a>Logout</a></div>
                    </div>
                </div>


            </div>
        </>
    )
}

export default function LandingPage() {
    const [feedBackRefresh, setFeedBackRefresh] = useState(0)
    const feedBack = useGetAllFeedBack(feedBackRefresh);
    if (!feedBack) {
        return (
            <div>Loading...</div>
        )
    }


    return (
        <>
            {/* {console.log("Hey taher",feedBack)} */}
            <Header />
            <AutoBrandSlider />
            <Owner />
            <ShowFeedBack feedBack={feedBack} />
            <FeedBack refresh={feedBackRefresh} setRefresh={setFeedBackRefresh} />
            <Footer />
        </>
    )
}