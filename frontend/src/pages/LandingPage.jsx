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
import { setHeaderHight, setSideBarLength } from "../redux/slices/layoutSlice";
import { setPets, setTypeFilter } from "../redux/slices/filterSlice";
import axios from "axios";
import { CART_ENDPOINTS, USER_ENDPOINTS } from "./endpoints.js";
import { useGetAllFeedBack } from "../hooks/useGetAllFeedBack.js";
import { FaChevronLeft, FaChevronRight, FaPaperPlane } from "react-icons/fa";
import { Breadcrumbs } from "./Breadcrumbs.jsx";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { PawPrint, Tag, Package } from "lucide-react";
import toast from "react-hot-toast";


function Brands(props) {
    const colorClasses = {
        yellow: "from-amber-200 to-amber-400",
        purple: "from-purple-400 to-purple-700",
        blue: "from-blue-400 to-blue-700",
    };

    return (
        <div
            className={`
                relative
                sm:h-[600px] h-[800px] w-full
                flex items-center justify-center
                bg-gradient-to-br ${colorClasses[props.color]}
                overflow-hidden
            `}
        >
            {/* Background Image */}
            <img
                src={`/${props.brand}.jpg`}
                alt={`${props.brand}_img`}
                className="
                    absolute inset-0
                    h-full w-full
                    object-cover
                    scale-105
                "
            />

            {/* Dark Gradient Overlay */}
            <div
                className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/70 via-black/30 to-transparent
                "
            />

            {/* Text Content */}
            <div
                className="
                    relative z-10
                    max-w-5xl w-full
                    px-6
                    flex flex-col
                    justify-end
                    h-full
                    pb-16
                "
            >
                <h1
                    className="
                        text-white
                        text-3xl sm:text-5xl
                        font-bold
                        tracking-wide
                        drop-shadow-lg
                        capitalize
                    "
                >
                    {props.brand}
                </h1>

                <p
                    className="
                        mt-3
                        text-white/90
                        text-sm sm:text-lg
                        max-w-xl
                        leading-relaxed
                    "
                >
                    Premium products crafted for comfort, care, and happiness of your pets.
                </p>
            </div>
        </div>
    );
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
                relative w-full sm:h-[600px] h-[800px] select-none overflow-x-hidden
                bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                shadow-[0_20px_50px_rgba(29,78,216,0.35)]
                overflow-hidden
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
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.5 } // triggers when 50% of the component is visible
        );

        if (myRef.current) observer.observe(myRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={myRef}
            className={`owner_details ${isVisible ? "visible" : ""} 
        overflow-hidden w-full box-border flex flex-col md:flex-row justify-center items-center gap-6 px-4 py-6`}
        >
            {/* Image */}
            <div className="w-[90vw] max-w-[300px] h-[90vw] max-h-[300px] md:w-[300px] md:h-[300px] rounded-full bg-emerald-400 border-4 border-[#00ACC1] flex-shrink-0 overflow-hidden">
                <img
                    className="w-full h-full object-cover"
                    src="/photo_21.jpg"
                    alt="my_photo"
                />
            </div>

            {/* Text */}
            <div className="w-full md:w-[40%] text-justify text-sm sm:text-base md:text-md lg:text-lg text-[#212121]">
                <h1 className="font-bold text-xl sm:text-2xl mb-2">About Us</h1>
                <p>
                    With over 15 years of hands-on experience in the pet care industry, we bring trusted expertise to every pet and pet parent we serve. From quality nutrition to personalized care, our passion is keeping pets happy and healthy. At our shop, every tail wag and purr reflects years of dedication and love for animals.
                </p>
            </div>
        </div>
    );
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
        <div className="flex sm:flex-row sm:gap-10 sm:justify-center sm:w-[100%]">
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

function MobileCatStuff() {
    const dispatch = useDispatch();

    return (
        <div className="flex flex-col gap-2 px-4 py-2 w-[100%]">
            {Object.keys(cat).map((category) => (
                <div
                    key={category}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-md"
                >
                    {/* Category title */}
                    <div className="mb-3">
                        <h2 className="font-semibold text-base sm:text-md md:text-lg text-white tracking-wide underline ">
                            {category}
                        </h2>
                    </div>

                    {/* Category items */}
                    <div className="flex flex-col gap-2">
                        {cat[category].map((item) => (
                            <Link to="/product" key={item}>
                                <span
                                    onClick={() =>
                                        dispatch(setTypeFilter(item.toLowerCase()))
                                    }
                                    className="group relative block px-2 py-1 text-sm sm:text-base
                                               text-white/90 rounded-md
                                               transition-all duration-200
                                               hover:bg-blue-500/20 hover:text-white"
                                >
                                    {item}
                                    <SmoothUnderline />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
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

function MobileDogStuff() {
    const dispatch = useDispatch();

    return (
        <div className="flex flex-col gap-2 px-4 py-2 w-[100%]">
            {Object.keys(dog).map((category) => (
                <div
                    key={category}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-md"
                >
                    {/* Category title */}
                    <div className="mb-3">
                        <h2 className="font-semibold text-base sm:text-md md:text-lg text-white tracking-wide underline">
                            {category}
                        </h2>

                    </div>

                    {/* Category items */}
                    <div className="flex flex-col gap-2">
                        {dog[category].map((item) => (
                            <Link to="/product" key={item}>
                                <span
                                    onClick={() =>
                                        dispatch(setTypeFilter(item.toLowerCase()))
                                    }
                                    className="group relative block px-2 py-1 text-sm sm:text-base
                                               text-white/90 rounded-md
                                               transition-all duration-200
                                               hover:bg-blue-500/20 hover:text-white"
                                >
                                    {item}
                                    <SmoothUnderline />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
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

function MobileSmallPetStuff() {
    const dispatch = useDispatch();
    const smallPetsObj = {
        "Birds": birds,
        "Hamster": hamster,
        "Rabbit": rabbit,
        "Turtle": turtle
    }

    return (
        <div className="flex flex-col gap-2 px-4 py-2 w-[100%]">
            {Object.keys(smallPetsObj).map((types) => {
                return(

                    <div
                        key={types}
                        className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-md"
                    >
                        {/* Category title */}
                        <div className="mb-3">
                            <h2 className="font-semibold text-base sm:text-md md:text-lg text-white tracking-wide underline">
                                {types}
                            </h2>
                        </div>
    
                        {/* Category items */}
                        <div className="flex flex-col gap-2">
                            {smallPetsObj[types].map((item) => (
                                <Link to="/product" key={item}>
                                    <span
                                        onClick={() =>
                                            dispatch(setTypeFilter(item.toLowerCase()))
                                        }
                                        className="group relative block px-2 py-1 text-sm sm:text-base
                                                text-white/90 rounded-md
                                                transition-all duration-200
                                                hover:bg-blue-500/20 hover:text-white"
                                    >
                                        {item}
                                        <SmoothUnderline />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )})}
        </div>
    );
}



function SideBar({ open, setOpen, setAnimal }) {
    const menu = [
        { label: "Cat", icon: PawPrint },
        { label: "Dog", icon: PawPrint },
        { label: "Small Pets", icon: PawPrint },
        { label: "Brands", icon: Package },
        { label: "Offer", icon: Tag, link: "/offer" },
    ];
    const sideBarRef = useRef(null);
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        if (sideBarRef.current) {
            console.log(sideBarRef.current.offsetWidth)
            dispatch(setSideBarLength(sideBarRef.current.offsetWidth))
        }
    }, [])

    const sideBarWidth = useSelector((state) => state?.layout?.sideBarLength)
    console.log(sideBarWidth)

    return (
        <div ref={sideBarRef}
            className={`fixed top-0 left-0 z-[999] h-screen w-[50%] 
            sm:hidden flex flex-col 
            bg-gradient-to-br from-blue-700/40 to-blue-900/40
            backdrop-blur-xl
            shadow-2xl
            border-r border-white/20
            transform transition-transform duration-700 ease-in-out
            ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
                <div className="flex items-center gap-2">
                    <img
                        src="/header_logo.svg"
                        alt="logo"
                        className="w-10 h-10 drop-shadow-md"
                    />
                    <div className="leading-tight">
                        <h1 className="text-white font-semibold text-lg">
                            Malik
                        </h1>
                        <p className="text-white/70 text-sm">
                            Pet Shop
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => { setOpen(false), setAnimal("") }}
                    className="p-2 rounded-full hover:bg-white/20 transition"
                >
                    <AiOutlineClose size={20} className="text-white" />
                </button>
            </div>

            {/* Menu */}
            <div className="flex flex-col gap-2 px-4 py-6">
                {menu.map((item, idx) => {
                    const Icon = item.icon;

                    return item.link ? (
                        <Link
                            key={idx}
                            to={item.link}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-3
                            rounded-xl
                            text-white/90
                            hover:bg-white/15
                            hover:text-white
                            transition"
                        >
                            <Icon size={18} />
                            <span className="font-medium text-xl">
                                {item.label}
                            </span>
                        </Link>
                    ) : (
                        <div
                            key={idx}
                            className="flex items-center gap-3 px-4 py-3
                            rounded-xl
                            text-white/90
                            hover:bg-white/15
                            hover:text-white
                            transition cursor-pointer"
                            onClick={() => setAnimal(item.label)}
                        >
                            <Icon size={18} />
                            <span className="text-xl font-medium">
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function SubMenu({ animal }) {
    const sideBarLength = useSelector(
        (state) => state?.layout?.sideBarLength
    );

    const [visibleAnimal, setVisibleAnimal] = useState(animal);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        if (animal === visibleAnimal) return;

        setFade(true);

        const timer = setTimeout(() => {
            setVisibleAnimal(animal);
            setFade(false);
        }, 200);

        return () => clearTimeout(timer);
    }, [animal]);

    if (!visibleAnimal) return null;

    return (
        <div
            className={`
                h-[50vh] w-fit
                fixed top-4
                z-[999]

                bg-blue-600/30
                backdrop-blur-xl

                border border-white/15
                rounded-2xl

                shadow-xl shadow-black/30

                overflow-y-auto overscroll-contain

                transition-all duration-200 ease-out
                ${fade
                    ? "opacity-0 translate-x-[-6px]"
                    : "opacity-100 translate-x-0"
                }
            `}
            style={{ left: `${sideBarLength}px` }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
        >
            {visibleAnimal === "Cat" && <MobileCatStuff />}
            {visibleAnimal === "Dog" && <MobileDogStuff />}
            {visibleAnimal === "Small Pets" && <MobileSmallPetStuff />}
        </div>
    );
}




export function Header({ open, setOpen }) {
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
                <div className="upper_header grid grid-cols-[0.2fr_1.8fr] grid-rows-2 sm:flex sm:flex-row justify-center sm:justify-evenly items-center gap-3 py-3 w-[100vw] text-[#0A3D62]">
                    <div className="l-upper-header flex flex-row gap-2 items-center justify-center">
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

                        <div className="sm:hidden" onClick={() => setOpen(true)}>
                            <GiHamburgerMenu size={20} color={"#2563EB"} />
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex flex-row gap-2 w-[90%] sm:w-[40%] md:w-[45%] lg:w-[50%]">
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
                    <div className="r-upper-header col-span-2 flex flex-row justify-evenly items-center gap-3 w-[100vw] sm:gap-4 sm:mt-0 sm:w-fit h-fit">
                        <div className="flex flex-row gap-1 w-full justify-evenly items-center">

                            {/* Contact */}
                            <div ref={contactRef} className="cursor-pointer hover:rounded-2xl relative flex flex-row items-center w-fit transition-all duration-200 hover:bg-[#A8DAFF]/40 p-2 rounded-xl">
                                <div className="flex flex-row justify-center items-center" onMouseEnter={(e) => detailsHandler(e)}>
                                    <div className="" data-details="details"><IoIosContact color="#4AA9F7" className="text-3xl md:text-4xl" /></div>
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
                                    <div className="flex flex-row justify-center items-center" data-details="user"><FaUser color="#4AA9F7" className="text-2xl" /></div>
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
                                <FaRegHeart color="#4AA9F7" className="text-2xl md:text-3xl" />
                            </div>

                            {/* Cart */}
                            <div className="cursor-pointer hover:bg-[#7DC6FF]/50 p-2 flex flex-row justify-center items-center rounded-full transition-all duration-200" onClick={(e) => viewCart(e)}>
                                <MdOutlineShoppingCart color="#4AA9F7" className="text-2xl md:text-3xl" />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Lower Header */}
                <div className="lower_header hidden sm:flex flex-row justify-evenly items-center gap-3 w-full h-[40%] bg-gradient-to-r from-[#7DC6FF] to-[#4AA9F7] text-white shadow-inner">
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
    const myRef = useRef(null);
    const [text, setText] = useState("");
    const [rating, setRating] = useState(5);

    useEffect(() => {
        const el = myRef.current;
        if (el) {
            // min height 50px, max height 200px
            if (el.scrollHeight <= 200 && el.scrollHeight >= 50) {
                el.style.height = "auto"; // reset
                el.style.height = el.scrollHeight + "px"; // resize
            }
        }
    }, [text]);

    const user = useSelector((state) => state?.user?.userData);

    async function submitFeedBack() {
        if (!user){
            toast.error("User needs to login first")
        }
        else if (text.trim().length === 0) toast.error("Feedback can't be empty")
        else {
            const res = await axios.post(
                `${USER_ENDPOINTS}/createFeedBack/${user?._id}`,
                { message: text, rating: rating },
                { withCredentials: true }
            );

            if (res?.data?.bool) toast.success("Feedback added successfully")
            else toast.error("Error in feedback creation");

            setText("");
            setRating(0);
        }

        props.setRefresh((prev) => prev + 1);
    }

    return (
        <div className="w-full flex flex-col sm:flex-row gap-3 justify-center items-start sm:items-center bg-white p-4 sm:p-6 rounded-xl shadow-md md:py-20">
            {/* Avatar */}
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-blue-600 shadow-md flex-shrink-0">
                <img
                    src="/photo_21.jpg"
                    alt="user"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Textarea + Button */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start w-full sm:w-[60%] relative gap-3">
                <textarea
                    ref={myRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your feedback"
                    className="outline-0 p-2 max-h-[200px] min-h-[100px] overflow-y-auto scrollbar-hide w-full bg-white text-black rounded-2xl border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition-all duration-300 resize-none"
                ></textarea>

                <div
                    className="absolute sm:static bottom-2 right-2 h-10 w-10 flex justify-center items-center bg-blue-700 text-white rounded-full hover:bg-gray-800 active:scale-90 shadow-md transition-all duration-300 cursor-pointer"
                    onClick={submitFeedBack}
                >
                    <FaPaperPlane className="text-sm" />
                </div>
            </div>
        </div>
    );
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
        <div className="w-[90%] bg-blue-50 rounded-2xl shadow-md flex flex-col gap-3 hover:shadow-lg transition h-[300px] p-4">

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
            <p className="text-blue-700 text-sm sm:text-[14px] line-clamp-10 text-justify">
                {props?.message}
            </p>

        </div>
    );
}


function ShowFeedBack({ feedBack = [] }) {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false); // track animation
    const [direction, setDirection] = useState("next"); // "next" or "prev"
    const total = feedBack.length;

    if (total === 0) {
        return (
            <div className="relative bg-blue-50 py-10 px-2 md:px-6 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    What Our Customers Say 💬
                </h2>
                <p className="text-gray-500 mt-4">No feedback available yet.</p>
            </div>
        );
    }

    const prevIndex = (current - 1 + total) % total;
    const nextIndex = (current + 1) % total;

    const handlePrev = () => {
        if (animating) return;
        setDirection("prev");
        setAnimating(true);
        setTimeout(() => {
            setCurrent(prev => (prev - 1 + total) % total);
            setAnimating(false);
        }, 300); // match duration of animation
    };

    const handleNext = () => {
        if (animating) return;
        setDirection("next");
        setAnimating(true);
        setTimeout(() => {
            setCurrent(prev => (prev + 1) % total);
            setAnimating(false);
        }, 300);
    };

    return (
        <div className="relative bg-blue-50 py-10 px-2 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
                What Our Customers Say 💬
            </h2>

            <div className="relative flex items-center justify-center">
                {/* Left Button */}
                <button
                    onClick={handlePrev}
                    className="absolute left-2 md:left-4 z-10 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition"
                >
                    <FaChevronLeft />
                </button>

                {/* Cards */}
                <div className="flex items-center gap-4 w-full justify-center">
                    {/* Left Card */}
                    <div className="hidden md:block w-1/3 scale-90 opacity-60 transition-all duration-300">
                        <Card review={feedBack[prevIndex]} />
                    </div>

                    {/* Center Card with animation */}
                    <div
                        key={current}
                        className={`
                            w-full md:w-1/3
                            transition-all duration-300
                            ${animating
                                ? direction === "next"
                                    ? "md:translate-x-4 opacity-0"
                                    : "md:-translate-x-4 opacity-0"
                                : "translate-x-0 opacity-100"}
                        `}
                    >
                        <Card review={feedBack[current]} />
                    </div>

                    {/* Right Card */}
                    <div className="hidden md:block w-1/3 scale-90 opacity-60 transition-all duration-300">
                        <Card review={feedBack[nextIndex]} />
                    </div>
                </div>

                {/* Right Button */}
                <button
                    onClick={handleNext}
                    className="absolute right-2 md:right-4 z-10 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition"
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
}

function Card({ review }) {
    if (!review) return null;
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex justify-center">
            <ReviewCard username={review.username} message={review.message} />
        </div>
    );
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
    const [open, setOpen] = useState(false);
    const [animal, setAnimal] = useState("");
    if (!feedBack) {
        return (
            <div>Loading...</div>
        )
    }

    useEffect(() => {
        const root = document.getElementById("root");

        if (animal !== "") {
            root.style.height = "100vh";
            root.style.overflow = "hidden";
        } else {
            root.style.height = "";
            root.style.overflow = "";
        }

        return () => {
            root.style.height = "";
            root.style.overflow = "";
        };
    }, [animal]);


    return (
        <div className="root-conatiner relative">
            {/* {console.log("Hey taher",feedBack)} */}
            <Header open={open} setOpen={setOpen} />
            <SideBar open={open} setOpen={setOpen} setAnimal={setAnimal} />
            <SubMenu animal={animal} />

            {/* This feature is currently under development */}
            {/* <Breadcrumbs/> */}
            <AutoBrandSlider />
            <Owner />
            <ShowFeedBack feedBack={feedBack} />
            <FeedBack refresh={feedBackRefresh} setRefresh={setFeedBackRefresh} />
            <Footer />
        </div>
    )
}