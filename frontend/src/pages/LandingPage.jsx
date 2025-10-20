import { useState, useRef, useLayoutEffect } from "react"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryState, setUpperHeader } from "../redux/slices/userSlice";
import { RiArrowDropDownLine, RiArrowDropUpLine, RiTwitterXLine } from "react-icons/ri";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { HiHeart, HiOutlineMail } from "react-icons/hi";
import { FaPhoneAlt, FaRegHeart, FaUser } from "react-icons/fa";
import { IoIosContact } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { setHeaderHight } from "../redux/slices/layoutSlice";


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

//////
function ManualBrandSlider() {
    const [activeSlide, setActiveSlide] = useState(0);
    const startX = useRef(0);
    const isDragging = useRef(false);

    const slides = [
        <Brands brand="pedigree" info="Pedigree is not just about origin, it’s about the excellence that carries forward." color="yellow" />,
        <Brands brand="whiskas" info="Whiskas: Because every cat deserves a taste of joy." color="purple" />,
        <Brands brand="smartheart" info="SmartHeart: Smart food for a happy heart." color="blue" />,
    ];


    //////// syntax for manual slider
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

    //  syntax for automatic slider



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
      className="relative w-full h-[600px] select-none overflow-x-hidden bg-blue-300"
    >
      <div
        className="flex transition-transform duration-700 ease-in-out h-full w-full"
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {slide}
          </div>
        ))}
      </div>

      {/* Optional: Dots for navigation */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              index === activeSlide ? "bg-white scale-125" : "bg-gray-400"
            }`}
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

        <div ref={myRef} className={`owner_details ${isVisible ? "visible" : ""} overflow-hidden h-[400px] w-full box-border flex flex-row justify-center items-center gap-6`}>
            <div className="sm:h-[300px] sm:w-[300px] xs:h-[150px] xs:w-[150px] rounded-full bg-emerald-400 border-4 border-[#00ACC1] ">
                <img className="h-[100%] w-[100%] object-cover rounded-full" src="/photo_21.jpg" alt="my_photo" />
            </div>
            <div className="w-[40%] text-justify xs:text-sm md:text-md lg:text-lg text-[#212121]">
                <span className="">With over 15 years of hands-on experience in the pet care industry, we bring trusted expertise to every pet and owner we serve. From quality nutrition to personalized care, our passion is keeping pets happy and healthy. At our shop, every tail wag and purr reflects years of dedication and love for animals.</span>
            </div>
        </div>
    )
}

function SmoothUnderline(){
    return(
        <>
            <span
                className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-700 ease-in-out group-hover:w-full pointer-events-none"
            ></span>
        </>
    )
}

function CatStuff() {
    return (
        <div className="flex flex-row gap-10 justify-center w-[100%]">
            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Cat Food</span></div>
                <div className="sm:text-sm">
                    <div><Link to="/product/cat"><span className="relative group">Dry Food {<SmoothUnderline/>}</span></Link></div>
                    <div><span className="relative group">Wet Food {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Kitten Food {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Veterinary Food {<SmoothUnderline/>}</span></div>
                </div>
            </div>
            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Treats</span></div>
                <div className="sm:text-sm">
                    <div><span className="relative group">Biscuits {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Meat Treats {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group"> Creamy Treats {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Wet Treats {<SmoothUnderline/>}</span></div>
                </div>
            </div>
            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Clothing</span></div>
                <div className="sm:text-sm">
                    <div><span className="relative group">Fancy Accessories{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Occassion Wears{<SmoothUnderline/>}</span></div>
                </div>
            </div>

            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Litter & Accessories</span></div>
                <div className="sm:text-sm">
                    <div><span className="relative group">Ball Shaped Litters{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Cat Litter Trays{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Sand Litter{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Scoopers{<SmoothUnderline/>}</span></div>
                </div>
            </div>

            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Toys</span></div>
                <div className="sm:text-sm">
                    <div><span className="relative group">Cat Nip Toys{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Interactive Toys{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Squeaky Toys{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Steaky Toys{<SmoothUnderline/>}</span></div>
                </div>
            </div>

            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Grooming</span></div>
                <div className="sm:text-sm">
                    <div><span className="relative group">Brushes & Combs{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Deodrants{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Gloves{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Nail Cutters{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Powders{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Shampoo & Soaps{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Towels & Wipes{<SmoothUnderline/>}</span></div>
                </div>
            </div>

        </div>
    )
}

function DogStuff() {
    return (
        <div className="flex flex-row gap-10 justify-center w-[100%]">
            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Dog Food</span></div>
                <div className="sm:text-sm">
                    <div><span className="relative group">Dry Food {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Wet Food {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Puppy Food {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Veterinary Food {<SmoothUnderline/>}</span></div>
                </div>
            </div>
            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Treats</span></div>
                <div className="sm:text-sm">
                    <div><span className="relative group">Biscuits{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Meat Treats{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Creamy Treats {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Wet Treats{<SmoothUnderline/>}</span></div>
                </div>
            </div>
            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Clothing</span></div>
                <div className="sm:text-sm">
                    <div><span className="relative group">T-Shirts{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Occassion Wears {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Winter Wears{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Shoes{<SmoothUnderline/>}</span></div>
                </div>
            </div>

            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Bedding</span></div>
                <div className="sm:text-sm">
                    <div><span className="relative group">Beds {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Blankets {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Cooling Mats{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Cushions{<SmoothUnderline/>}</span></div>
                </div>
            </div>

            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Toys</span></div>
                <div className="sm:text-sm">
                    <div><span className="relative group">Leather Toys{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Interactive Toys{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Squeaky Toys {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Rope Toys{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Flush Toys {<SmoothUnderline/>}</span></div>
                </div>
            </div>

            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Grooming</span></div>
                <div className="sm:text-sm">
                    <div><span className="relative group">Brushes & Combs{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Deodrants{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Gloves{<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Nail Cutters {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Powders {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Shampoo & Soaps {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Towels & Wipes {<SmoothUnderline/>}</span></div>
                </div>
            </div>

        </div>
    )
}

function SmallPetStuff() {
    return (
        <div className="flex flex-row gap-10 justify-center w-[100%]">
            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Bird</span></div>
                <div className="sm:text-sm">
                    <div><span className="relative group">Bowls {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Cage {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Food {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Health Supplements {<SmoothUnderline/>}</span></div>
                </div>
            </div>
            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Hamster</span></div>
                <div className="sm:text-sm">
                    <div><span className="relative group">Ball {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Cage {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Food {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Toys {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Cage {<SmoothUnderline/>}</span></div>
                </div>
            </div>
            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Rabbit</span></div>
                <div className="sm:text-sm">
                    <div><span className="relative group">Food {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Cage {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Health Supplements {<SmoothUnderline/>}</span></div>
                </div>
            </div>

            <div>
                <div className="font-semibold sm:text-md md:text-lg"><span>Turtle</span></div>
                <div className="sm:text-sm">
                    <div><span className="relative group">Food {<SmoothUnderline/>}</span></div>
                    <div><span className="relative group">Health Supplements {<SmoothUnderline/>}</span></div>
                </div>
            </div>
        </div>
    )
}


export function Header() {
    const dispatch = useDispatch();
    const show = useSelector((state) => state?.user?.categoryState)
    const showUpperHeader = useSelector((state) => state?.user?.upperHeader) // initally going to be false
    const [data, setData] = useState("cat")
    const [showDetails,setShowDetails]=useState("user")

    const headerRef = useRef(null);

    function categoriesHandler(e) {
        const parentDiv=e.currentTarget;
        const firstChildDiv=parentDiv.querySelector("div:first-child")
        setData(firstChildDiv.textContent.toLowerCase())
        if (!show) dispatch(setCategoryState())
    }

    function detailsHandler(e){
        const parentDiv=e.currentTarget;
        const firstChildDiv=parentDiv.querySelector("div:first-child")
        setShowDetails(firstChildDiv.dataset.details.toLowerCase())
        if (!showUpperHeader) dispatch(setUpperHeader())
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

    const headerHeight=useSelector((state)=>state?.layout?.headerHeight)

    /// whenever clicked outside of down scroll set toggle in the redux as false
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (show) {
                    dispatch(setCategoryState());
                }
            }
            if (loginRef.current && !loginRef.current.contains(event.target)) {
                if (showUpperHeader) {
                    dispatch(setUpperHeader());
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [show, dispatch, showUpperHeader]);

    return (
        <>
            <div ref={headerRef} className="header flex flex-col h-[100px]  w-[100%] gap-0 sticky top-0 z-2 bg-[#E3F2FD]">
                <div className="upper_header flex flex-row justify-evenly h-[60%] items-center gap-3 w-[100%] bg-[#E3F2FD] text-[#0D47A1]">
                    <div className="l-upper-header flex flex-row gap-1">
                        <div className="flex flex-row justify-center items-center"><img src="/header_logo.svg" alt="paws_img" /></div>
                        <div className="flex flex-col text-[#212121] leading-3 p-1">
                            <span className="font-semibold xs:text-md lg:text-xl">Malik</span>
                            <span>Pet Shop</span>
                        </div>
                    </div>
                    <div className="m-upper-header bg-white w-[50%] flex flex-row gap-2 p-2 rounded-2xl border border-[#1976D2]">
                        <div className="search_logo">
                            <img src="/search_logo.svg" alt="search_icon" />
                        </div>
                        <div className="search_bar w-[100%]">
                            <input className="w-[100%] h-[100%] outline-0 placeholder: xs:text-xs placeholder:sm:text-sm placeholder:md:text-md placeholder:lg:text-lg" type="text" placeholder="Search for more then 100 products" />
                        </div>
                    </div>
                    <div className="r-upper-header flex flex-row justify-evenly items-center gap-4">
                        <div className="flex flex-row gap-1">
                            <div ref={contactRef} className="cursor-pointer hover:rounded-2xl relative flex flex-row items-center w-fit ">
                                <div className="flex flex-row justify-center items-center" onMouseEnter={(e) => detailsHandler(e)}>
                                    <div className="" data-details="details"><IoIosContact color="#00ACC1" size={30} /></div>
                                    {(!showUpperHeader || showDetails!=="details") && <div><RiArrowDropDownLine size={20} /></div>}
                                    {showUpperHeader && showDetails==="details" && <div><RiArrowDropUpLine size={20} /></div>}
                                </div>
                                {showDetails==="details" && showUpperHeader &&
                                    <div className="h-auto backdrop-blur absolute top-[30px] flex flex-col gap-1 pt-1 bg-[#1565C0] pl-1 pr-1">
                                        <Link to="/Login">
                                            <div className=" flex flex-row items-center gap-2 pl-1">
                                                <div><HiOutlineMail color="white" /></div>
                                                <div className="text-white"><span>tahermalik2002@gmail.com</span></div>
                                            </div>
                                        </Link>
                                        <div className=" flex flex-row items-center gap-2 pl-1">
                                            <div><FaPhoneAlt color="white" /></div>
                                            <div className="font-sans text-white"><span className="">9152760580</span></div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div ref={loginRef} className="cursor-pointer hover:rounded-2xl flex flex-row items-center">
                                <div className="flex flex-row" onMouseEnter={(e) => detailsHandler(e)}>
                                    <div className="flex flex-row justify-center items-center" data-details="user"><FaUser color="#00ACC1" size={20} /></div>
                                    {(!showUpperHeader || showDetails!=="user")&& <div><RiArrowDropDownLine size={20} /></div>}
                                    {showUpperHeader && showDetails==="user" && <div><RiArrowDropUpLine size={20} /></div>}
                                </div>
                                {showDetails==="user" && showUpperHeader &&
                                    <div className="w-fit h-auto backdrop-blur absolute top-[50px] flex flex-col gap-1 pt-1 bg-[#1565C0] pl-1 pr-1">
                                        <Link to="/Login" state={{user:"user"}}><div className=" hover:bg-[#1976D2]"><span className="hover:bg-gray-300 hover:rounded-2xl px-2 py-1 cursor-pointer text-white hover:text-black">User Login</span></div></Link>
                                        <Link to="/Login" state={{user:"admin"}}><div className=" hover:bg-[#1976D2]"><span className="hover:bg-gray-300 hover:rounded-2xl px-2 py-1 cursor-pointer text-white hover:text-black">Admin Login</span></div></Link>
                                        <div className=" hover:bg-[#1976D2]"><span className="hover:bg-gray-300 hover:rounded-2xl px-2 py-1 cursor-pointer text-white hover:text-black">Logout</span></div>
                                    </div>
                                }
                            </div>
                            <div className="cursor-pointer hover:rounded-full hover:bg-[#0288D1] p-2 flex flex-row justify-center items-center ml-2"><FaRegHeart color="#00ACC1" size={20} /></div>
                            <Link to="/cart"><div className="cursor-pointer hover:rounded-full hover:bg-[#0288D1] p-2 flex flex-row justify-center items-center pl-2"><MdOutlineShoppingCart color="#00ACC1" size={25} /></div></Link>
                        </div>
                    </div>
                </div>

                <div className="lower_header flex flex-row justify-evenly items-center gap-3 w-[100%] h-[40%] bg-[#51a2ff8a] text-white">
                    <div className="flex flex-row justify-evenly items-center w-[100%]">
                        <div onMouseEnter={(e) => categoriesHandler(e)} className="xs:text-xs sm:text-sm md:text-lg flex flex-row justify-center items-center hover:underline hover:decoration-black cursor-pointer">
                            <div className="text-black">Cat</div>
                            {(!show || data!=="cat") && <div><RiArrowDropDownLine size={20} color="black" /></div>}
                            {show && data === "cat" && <div><RiArrowDropUpLine size={20} color="black" /></div>}
                        </div>
                        <div onMouseEnter={(e) => categoriesHandler(e)} className="xs:text-xs sm:text-sm md:text-lg flex flex-row justify-center items-center hover:underline hover:decoration-black cursor-pointer">
                            <div className="text-black">Dog</div>
                            {(!show || data!=="dog") && <div><RiArrowDropDownLine size={20} color="black"/></div>}
                            {show && data === "dog" && <div><RiArrowDropUpLine size={20} color="black" /></div>}
                        </div>
                        <div onMouseEnter={(e) => categoriesHandler(e)} className="xs:text-xs sm:text-sm md:text-lg flex flex-row justify-center items-center hover:underline hover:decoration-black cursor-pointer">
                            <div className="text-black">Small Pets</div>
                            {(!show || data!=="small pets") && <div><RiArrowDropDownLine size={20} color="black" /></div>}
                            {show && data === "small pets" && <div><RiArrowDropUpLine size={20} color="black"/></div>}
                        </div>
                        <div onMouseEnter={(e) => categoriesHandler(e)} className="xs:text-xs sm:text-sm md:text-lg flex flex-row justify-center items-center hover:underline hover:decoration-black cursor-pointer">
                            <div className="text-black">Brands</div>
                            {(!show || data!=="brands") && <div><RiArrowDropDownLine size={20} color="black"/></div>}
                            {show && data === "brands" && <div><RiArrowDropUpLine size={20} color="black" /></div>}
                        </div>
                        <Link to="/offer"><div className="xs:text-xs sm:text-sm md:text-lg flex flex-row justify-center items-center hover:underline text-black cursor-pointer"><span>Offer</span></div></Link>
                    </div>
                </div>
                {show && <div ref={dropdownRef} className={`scoll-lower-header h-auto w-[100%] bg-white ${show ? "category" : ""}  flex flex-row flex-wrap`} style={{ top: `${headerHeight}px` }}>
                    {data === "cat" && <CatStuff />}

                    {data === "dog" && <DogStuff />}

                    {data === "small pets" && <SmallPetStuff />}


                </div>}
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
            <div className="h-[300px] w-[100%] border border-t-2 flex flex-row gap-30 justify-center items-stretch bg-[#00ACC1]">
                <div className="flex flex-col items-center justify-center gap-3 w-[30%]">
                    <div className="w-[100%] rounded-2xl border-2 border-[#E0E0E0] bg-[#FFFFFF]"><textarea ref={myRef} name="" id="" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter you FeedBack" className="outline-0 p-2 max-h-[200px] min-h-[100px] w-[100%] overflow-y-scroll scrollbar-hide placeholder:xs:text-sm placeholder:lg:text-lg xs:text-sm lg:text-lg placeholder:text-[#555555] text-[#212121]"></textarea></div>
                    <div className="flex flex-row justify-center items-center w-[80%] self-center border-2 border-[#0288D1] rounded-2xl cursor-pointer bg-[white] hover:bg-[#E1F5FE] text-[#0288D1] shadow-[0_4px_20px_rgba(2,136,209,0.3)]"><button className="xs:text-sm sm:text-md lg:text-xl text-white bg-[#0288D1] hover:bg-[#03A9F4] active:bg-[#0277BD] w-[100%] rounded-2xl">Submit</button></div>
                </div>

                <div className="flex flex-row justify-center items-center xs:text-xl lg:text-2xl text-[#FFFFFF]">
                    <span>FeedBack</span>
                </div>
            </div>
        </form>
    )
}

function ShowFeedBack() {
    const heightRef = useRef(null);
    const outerHeightRef = useRef(null)
    const [numLines, setNumLines] = useState(0);
    const [numBlock, setNumBlock] = useState(0);
    const [counter, setCounter] = useState(0)

    /// this useEffect should only be rendered once
    useLayoutEffect(() => {
        if (outerHeightRef.current) {
            const blockWidth = outerHeightRef.current.offsetWidth;
            setNumBlock(Math.ceil(blockWidth / 200) - 1);
        }
    }, []);

    // Measure line height after the blocks exist
    useLayoutEffect(() => {
        if (heightRef.current) {
            const style = window.getComputedStyle(heightRef.current);
            const lineHeight = parseFloat(style.lineHeight);
            const height = heightRef.current.clientHeight;
            const numberOfLines = Math.ceil(height / lineHeight);
            setNumLines(numberOfLines);
        }
    }, [numBlock]); // wait until blocks are rendered


    ///// this array we will get by using custom hooks
    let usernames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    let messages = [
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, quo voluptatibus nesciunt laboriosam cum illo pariatur placeat quia ab corporis quidem. Odio sequi eveniet illum soluta alias ipsam dolorum optio",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt animi in deserunt ducimus eligendi beatae est, voluptatum facere porro cum, voluptatem aspernatur at officia illum quo nam neque unde perferendis",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet cum dolores sit suscipit consequuntur accusamus explicabo totam corrupti voluptatum natus. Recusandae totam aliquid et, excepturi cum soluta magni mollitia! Dolore",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio distinctio voluptatum aliquam deleniti. Ullam cumque error animi tempora esse cupiditate corporis, id expedita tenetur repellat quo? Perspiciatis optio amet iure?",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam magnam deleniti temporibus eveniet quae quos praesentium fuga iure nisi reprehenderit aliquid sed, quasi iusto cum unde non consectetur adipisci. Mollitia.",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, non autem voluptatem voluptates praesentium facere enim aut rem veniam sed quia vel aliquam quidem nemo! Iusto ea esse odio ad.",
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, quo voluptatibus nesciunt laboriosam cum illo pariatur placeat quia ab corporis quidem. Odio sequi eveniet illum soluta alias ipsam dolorum optio",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt animi in deserunt ducimus eligendi beatae est, voluptatum facere porro cum, voluptatem aspernatur at officia illum quo nam neque unde perferendis",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet cum dolores sit suscipit consequuntur accusamus explicabo totam corrupti voluptatum natus. Recusandae totam aliquid et, excepturi cum soluta magni mollitia! Dolore",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio distinctio voluptatum aliquam deleniti. Ullam cumque error animi tempora esse cupiditate corporis, id expedita tenetur repellat quo? Perspiciatis optio amet iure?",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam magnam deleniti temporibus eveniet quae quos praesentium fuga iure nisi reprehenderit aliquid sed, quasi iusto cum unde non consectetur adipisci. Mollitia.",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, non autem voluptatem voluptates praesentium facere enim aut rem veniam sed quia vel aliquam quidem nemo! Iusto ea esse odio ad.",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum nam voluptatibus, est quo quia qui, ea autem vitae enim totam eligendi quod, consequuntur eius sequi fuga rerum doloribus ullam. Ut!"
    ]
    useEffect(() => {
        const a = setInterval(() => {
            setCounter(counter => (counter + numBlock) % usernames.length);
        }, 3000);
        return () => clearInterval(a);
    }, [numBlock, usernames])

    const divs = []
    for (let i = 0; i < numBlock; i++) {
        divs.push(
            <div key={i} className="feedback h-[90%] w-[200px] bg-[#E1F5FE] hover:bg-[#B3E5FC] hover:shadow-lg flex flex-col p-2 flex-shrink-0 border border-[#0288D1] rounded-2xl">
                <div className="font-semibold xs:text-sm md:text-lg h-[10%]"><span>{`${usernames[(counter + i) % usernames.length]}`}</span></div>
                {/* <div ref={heightRef} className={`text-justify xs:text-sm h-[90%]`} style={{WebkitLineClamp:numLines,display:'-webkit-box',WebkitBoxOrient: 'vertical',overflow: 'hidden'}}><span className="">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus, ullam aspernatur. Quod et accusamus cumque eos recusandae blanditiis! Tenetur at consectetur mollitia molestiae. Explicabo doloribus culpa eveniet officiis, molestiae quisquam harum sapiente a ullam quis cum aliquam temporibus sunt quibusdam atque dicta aliquid magni labore magnam quidem tempora! Praesentium, a!</span></div> */}
                <div ref={heightRef} className={`text-justify xs:text-sm h-[90%] text-[#212121]`} style={{ WebkitLineClamp: numLines, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}><span className="">{`${messages[(counter + i) % usernames.length]}`}</span></div>
            </div>

        )
    }




    return (
        <>
            <div className="border-t-black border flex flex-col pt-2">

                <div className="font-semibold sm:text-xl pl-2 underline text-blue-500">Customer FeedBacks</div>
                <div ref={outerHeightRef} className="outside-container h-[300px] w-[100%]">
                    <div className="scrollable-container h-[100%] w-[100%] flex flex-row items-center justify-evenly p-2 relative flex-nowrap ">
                        {divs}
                    </div>
                </div>
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
    return (
        <>
            <Header />
            <AutoBrandSlider />
            <Owner />
            <ShowFeedBack />
            <FeedBack />
            <Footer />
        </>
    )
}