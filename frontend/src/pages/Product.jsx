import { Header, Footer } from "./LandingPage"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setBrands, setBreed, setDiet, setFlavor, setPets } from "../redux/slices/filterSlice"
import { MdArrowDropDown, MdArrowDropUp, MdOutlineDeleteOutline } from "react-icons/md"
import { Range } from "react-range";
import { useGetAllProduct } from "../hooks/useGetAllProducts"
import axios from "axios"
import { CART_ENDPOINTS, PRODUCT_ENDPOINTS, USER_ENDPOINTS } from "./endpoints"
import { useLocation, useNavigate } from "react-router-dom"
import { useMemo } from "react"
import { IoIosHeart } from "react-icons/io";
import { setFavouriteNotLoggedIn, setProductIdInUserWishList } from "../redux/slices/userSlice"
import { setImageCounter } from "../redux/slices/activeSlice"
import { addProduct } from "../redux/slices/cartSlice"
import toast from "react-hot-toast"
import { FiFilter } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";

function CheckBoxes(props) {
    const dispatch = useDispatch();
    function handleChange(item) {
        if (props.type === "flavor") dispatch(setFlavor(item))
        else if (props.type === "breed") dispatch(setBreed(item))
        else if (props.type === "diet") dispatch(setDiet(item))
        else if (props.type === "brands") dispatch(setBrands(item))
    }

    return (
        <>
            {props.items.map((item) => {
                const id = `${props.type}-${item}`;

                return (
                    <div
                        key={id}
                        className="
                            relative z-10
                            flex flex-row items-center
                            gap-3
                            px-3 py-2
                            rounded-lg
                            bg-blue-800/40
                            hover:bg-blue-700/50
                            transition
                        "
                    >
                        <input
                            id={id}
                            type="checkbox"
                            checked={props.chekcedList.includes(item)}
                            onChange={() => handleChange(item)}
                            className="
                                peer
                                w-4 h-4
                                accent-blue-600
                                pointer-events-auto
                                touch-manipulation
                            "
                        />

                        <label
                            htmlFor={id}
                            className="
                                ml-2
                                text-blue-100 text-sm
                                cursor-pointer
                                touch-manipulation
                                select-none
                            "
                        >
                            {item}
                        </label>
                    </div>
                );
            })}
        </>
    );
}

const PriceRange = () => {
    const [values, setValues] = useState([0, 6000]);

    return (
        <div className="w-[100%] p-4">
            <Range
                step={100}
                min={0}
                max={6000}
                values={values}
                onChange={(vals) => setValues(vals)}
                renderTrack={({ props, children }) => (
                    <div
                        {...props}
                        className="h-2 w-[100%] bg-gray-200 rounded"
                    >
                        <div
                            className="h-2 bg-gray-800 rounded"
                            style={{
                                left: `${((values[0] / 6000) * 100).toFixed(2)}%`,
                                right: `${(100 - (values[1] / 6000) * 100).toFixed(2)}%`,
                                position: "absolute",
                            }}
                        />
                        {children}
                    </div>
                )}
                renderThumb={({ props }) => (
                    <div
                        {...props}
                        className="w-[15px] h-[15px] bg-gray-800 rounded-full"
                    />
                )}
            />
            <div className="flex justify-between mt-2 text-gray-700 font-sans">
                <span>₹ {values[0]}</span>
                <span>₹ {values[1]}</span>
            </div>
        </div>
    );
};

export const items_flavor = ["tuna", "vegetables", "salmon", "meat", "mackerel", "seafood", "a", "f", "r", "w"]
export const items_breed = ["mini", "medium", "maxi"]
export const items_diet = ["veg", "non-veg"]
export const items_brands = ["grain zero", "pedigree", "smart heart", "whiskas", "meo", "purepet", "drools", "chappi", "sense", "royal canin", "maxi"]

function Filter() {
    ///// checked list is maintained in order to find out which all filters are been selected by the user 
    const chekcedList = useSelector((state) => state?.filter?.flavorFilter);
    const checkedListBreed = useSelector((state) => state?.filter?.breedFilter);
    const checkedListDiet = useSelector((state) => state?.filter?.diet);
    const checkedListBrands = useSelector((state) => state?.filter?.brandsFilter);

    const [showFilter, setShowFilter] = useState("flavor");
    const [filterToggle, setFilterToggle] = useState(false);

    function toggle(type) {
        if (filterToggle || type !== showFilter) {
            setShowFilter(type);
            setFilterToggle(false);
        } else {
            setShowFilter("");
            setFilterToggle(true);
        }
    }

    return (
        <>
            <div className="flex flex-col p-3 h-full gap-3 bg-white shadow-lg border-r border-black">
                <div className="sm:text-lg lg:text-xl font-semibold underline text-gray-800">
                    Filter
                </div>
                <div className="flex flex-col h-full overflow-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200 rounded-lg">
                    {/* FLAVOR */}
                    <div
                        onClick={() => toggle("flavor")}
                        className="flex flex-row justify-between items-center p-2 cursor-pointer hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                        <div className="font-medium text-gray-700">Flavor</div>
                        {showFilter !== "flavor" ? (
                            <MdArrowDropDown className="text-gray-600" />
                        ) : (
                            <MdArrowDropUp className="text-gray-600" />
                        )}
                    </div>
                    <div
                        className={`bg-blue-100 p-3 flex flex-col gap-1 rounded-xl overflow-auto transition-all duration-300 ease-in-out ${showFilter === "flavor"
                            ? "relative max-h-60 opacity-100"
                            : "absolute top-0 z-[-10] max-h-0 opacity-0"
                            }`}
                        data-lenis-prevent
                    >
                        <CheckBoxes type="flavor" chekcedList={chekcedList} items={items_flavor} />
                    </div>

                    {/* BREED */}
                    <div
                        onClick={() => toggle("breed")}
                        className="flex flex-row justify-between items-center mt-2 p-2 cursor-pointer hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                        <div className="font-medium text-gray-700">Breed Size</div>
                        {showFilter !== "breed" ? (
                            <MdArrowDropDown className="text-gray-600" />
                        ) : (
                            <MdArrowDropUp className="text-gray-600" />
                        )}
                    </div>
                    <div
                        className={`flex flex-col gap-1 bg-blue-100 p-3 rounded-xl overflow-auto transition-all duration-300 ease-in-out ${showFilter === "breed"
                            ? "relative max-h-60 opacity-100"
                            : "absolute top-0 z-[-10] max-h-0 opacity-0"
                            }`}
                        data-lenis-prevent
                    >
                        <CheckBoxes type="breed" chekcedList={checkedListBreed} items={items_breed} />
                    </div>

                    {/* DIET */}
                    <div
                        onClick={() => toggle("diet")}
                        className="flex flex-row justify-between items-center mt-2 p-2 cursor-pointer hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                        <div className="font-medium text-gray-700">Veg/Non-Veg</div>
                        {showFilter !== "diet" ? (
                            <MdArrowDropDown className="text-gray-600" />
                        ) : (
                            <MdArrowDropUp className="text-gray-600" />
                        )}
                    </div>
                    <div
                        className={`flex flex-col gap-1 bg-blue-100 p-3 rounded-xl overflow-auto transition-all duration-300 ease-in-out ${showFilter === "diet"
                            ? "relative max-h-60 opacity-100"
                            : "absolute top-0 z-[-10] max-h-0 opacity-0"
                            }`}
                        data-lenis-prevent
                    >
                        <CheckBoxes type="diet" chekcedList={checkedListDiet} items={items_diet} />
                    </div>

                    {/* BRANDS */}
                    <div
                        onClick={() => toggle("brands")}
                        className="flex flex-row justify-between items-center mt-2 p-2 cursor-pointer hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                        <div className="font-medium text-gray-700">Brands</div>
                        {showFilter !== "brands" ? (
                            <MdArrowDropDown className="text-gray-600" />
                        ) : (
                            <MdArrowDropUp className="text-gray-600" />
                        )}
                    </div>
                    <div
                        className={`flex flex-col gap-1 bg-blue-100 p-3 rounded-xl overflow-auto transition-all duration-300 ease-in-out ${showFilter === "brands"
                            ? "relative max-h-60 opacity-100"
                            : "absolute top-0 z-[-10] max-h-0 opacity-0"
                            }`}
                        data-lenis-prevent
                    >
                        <CheckBoxes type="brands" chekcedList={checkedListBrands} items={items_brands} />
                    </div>

                    {/* Price Slider */}
                    <div
                        onClick={() => toggle("priceslider")}
                        className="flex flex-row justify-between items-center mt-2 p-2 cursor-pointer hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                        <div className="font-medium text-gray-700">Price Slider</div>
                        {showFilter !== "priceslider" ? (
                            <MdArrowDropDown className="text-gray-600" />
                        ) : (
                            <MdArrowDropUp className="text-gray-600" />
                        )}
                    </div>
                    <div
                        className={`bg-blue-100 p-3 rounded-xl overflow-auto transition-all duration-300 ease-in-out ${showFilter === "priceslider"
                            ? "relative max-h-60 opacity-100"
                            : "absolute top-0 z-[-10] max-h-0 opacity-0"
                            }`}
                    >
                        <PriceRange />
                    </div>
                </div>
            </div>
        </>
    );
}

function MobileFilter({ mobFilterVisible, setMobFilterVisible }) {
    const [mobFilterData, setMobFilterData] = useState(null);
    ///// checked list is maintained in order to find out which all filters are been selected by the user 
    const checkedListFlavor = useSelector((state) => state?.filter?.flavorFilter);
    const checkedListBreed = useSelector((state) => state?.filter?.breedFilter);
    const checkedListDiet = useSelector((state) => state?.filter?.diet);
    const checkedListBrands = useSelector((state) => state?.filter?.brandsFilter);

    const filterHeading = [
        "Flavor",
        "Breed Size",
        "Diet",
        "Brands",
        "Price",
    ];

    return (
        <div
            className="
                absolute top-[100%] left-0
                w-full
                rounded-b-2xl
                bg-gradient-to-br from-blue-900/40 via-blue-800/40 to-blue-700/30
                backdrop-blur-2xl
                border border-blue-400/20
                shadow-[0_30px_70px_rgba(0,20,80,0.5)]
                px-5 pt-2
                z-2         
                animate-fadeIn
                flex flex-col gap-2
            "
            // this is written here in order to avoid filter option close when its body is clicked
            onClick={(e) => { e.stopPropagation() }}
        >
            <div className="flex flex-row justify-between items-center">
                <div onClick={(e)=>{e.stopPropagation(); setMobFilterData(null)}} className={`${mobFilterData===null ? "hidden":"block"}`}>
                    <FaArrowLeftLong/>
                </div>
                <div>
                    {mobFilterData === null ? "Filters" : mobFilterData}
                </div>
                <div onClick={(e) => { e.stopPropagation(); setMobFilterVisible(false) }}>
                    <IoMdClose />
                </div>
            </div>
            {mobFilterData === null &&
                <div className="flex flex-col gap-3 p-2 ">
                    {filterHeading.map((item, idx) => (
                        <div
                            key={idx}
                            className="
                        group
                        flex items-center justify-between
                        px-4 py-3
                        rounded-b-xl
                        bg-blue-800/40
                        border border-blue-300/20
                        text-blue-50
                        text-sm font-medium
                        cursor-pointer
                        transition-all duration-300 ease-out
                        hover:bg-blue-700/50
                        hover:shadow-[0_12px_35px_rgba(0,90,200,0.45)]
                        hover:translate-x-1
                        "

                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMobFilterData(item) }}
                        >
                            <span>{item}</span>

                            {/* subtle arrow */}
                            <span className="text-blue-200/60 group-hover:text-blue-100 transition">
                                →
                            </span>
                        </div>
                    ))}
                </div>
            }

            {mobFilterData === "Flavor" &&
                <div className="flex flex-row flex-wrap gap-2 justify-evenly items-center p-2">
                    <CheckBoxes type="flavor" chekcedList={checkedListFlavor} items={items_flavor} />
                </div>
            }

            {mobFilterData==="Breed Size" &&
                <div className="flex flex-row flex-wrap gap-2 justify-evenly items-center p-2">
                    <CheckBoxes type="breed" chekcedList={checkedListBreed} items={items_breed} />
                </div>
            }

            {mobFilterData==="Diet" &&
                <div className="flex flex-row flex-wrap gap-2 justify-evenly items-center p-2">
                    <CheckBoxes type="diet" chekcedList={checkedListDiet} items={items_diet} />
                </div>
            }

            {mobFilterData==="Brands" &&
                <div className="flex flex-row flex-wrap gap-2 justify-evenly items-center p-2">
                    <CheckBoxes type="brands" chekcedList={checkedListBrands} items={items_brands} />
                </div>
            }

            {mobFilterData==="Price" &&
                <div className="flex flex-row flex-wrap gap-2 justify-evenly items-center p-2">
                    <PriceRange />
                </div>
            }


        </div>
    );
}


/// function written for both loggedIn user & user who is not loggedIn
export async function addToCart(e, userId, productId, productVariation, logInFlag, dispatch) {
    try {
        e.stopPropagation();
        e.preventDefault();
        const obj = {
            productId: productId,
            productVariation: productVariation,
            productQuantity: 1
        }

        //// this will done in both scenerio when the user is logged iN and when the user is not logged in
        dispatch(addProduct(obj))   /// just adding an product to the redux cart

        if (logInFlag) {      // user is logged in so backend stuff will be called
            const result = await axios.post(`${CART_ENDPOINTS}/addToCart`, { userId: userId, productId: productId, productVariation: productVariation }, { withCredentials: true })
            if (result?.data?.comment === "Already Present") toast.success("Product Already Present")
            else if (result?.data?.bool === false) toast.error("Some problem in product addition to cart")
            else toast.success(`Product added successfully`)
        }
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message)
    }
}


function ProductCardSkeleton() {
    return (
        <div
            className="
                w-[100%] h-[450px]
                bg-white rounded-2xl
                border border-blue-100
                shadow-md
                flex flex-col
            "
        >
            {/* Offer bar */}
            <div className="h-[5%] w-full bg-blue-100 rounded-t-2xl shimmer" />

            {/* Image */}
            <div className="h-[40%] w-full bg-blue-50 flex items-center justify-center shimmer">
                <div className="h-[80%] w-[80%] bg-blue-200 rounded-lg" />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-evenly h-[40%] px-2">
                {/* Title */}
                <div className="space-y-2 shimmer">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                </div>

                {/* Price */}
                <div className="space-y-2 shimmer">
                    <div className="h-5 w-1/2 bg-blue-200 rounded" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                </div>

                {/* Weight pills */}
                <div className="flex gap-2 flex-wrap shimmer">
                    {[1, 2, 3].map((_, i) => (
                        <div
                            key={i}
                            className="h-6 w-14 bg-blue-200 rounded-full"
                        />
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="h-[15%] w-full shimmer">
                <div className="h-full w-full bg-blue-300 rounded-b-2xl" />
            </div>
        </div>
    );
}

function ProductCard(props) {
    const dispatch = useDispatch();
    const [isPresent, setIsPresent] = useState(false)

    const userData = useSelector((state) => state?.user?.userData)
    const userDataNotLoggedIn = useSelector((state) => state?.user?.userDataNotLoggedIn)
    const userId = userData?._id; //// here i will get the user id
    // const imgCounter=useSelector((state)=>state?.active?.imgCounter)
    const [imgCounter, setImgCounter] = useState(0)

    useLayoutEffect(() => {
        let userWishList

        /// for the loggedIn user
        if (userData) userWishList = userData?.wishList
        else userWishList = userDataNotLoggedIn["wishList"]   /// for the user who is not loggedIn 

        const userWishListIds = userWishList.map((obj) => { return obj["productId"] })
        console.log("loading wishList", userWishList)
        //// product is there present in the wishList
        if (userWishListIds.includes(props?.productId)) {

            //// implementing this so that the user can add variation of prouct in the wishList
            const productVariationData = userWishList.map((obj) => {
                if (obj["productId"] === props?.productId) return obj["productVariation"]
            })

            //// now need to check for the variation
            if (productVariationData.includes(imgCounter)) setIsPresent(true)
            else setIsPresent(false)
        }
    }, [isPresent, imgCounter])

    function discountCalc(price, discount) {
        price = Number(price)
        discount = Number(discount)
        return price - Math.floor((price * discount) / 100);
    }

    function gramAmountCalc(price, discount, netQuantity) {
        price = Number(price)
        discount = Number(discount)
        netQuantity = Number(netQuantity)
        let discuntedPrice = discountCalc(price, discount);
        let totalGrams = netQuantity * 1000;
        return (100 * (discuntedPrice / totalGrams)).toFixed(2)
    }

    async function deleteProduct(e) {
        try {
            e.stopPropagation();
            e.preventDefault()
            const res = await axios.post(`${PRODUCT_ENDPOINTS}/deleteProduct/${props.productId}`, { imgCounter: imgCounter }, { withCredentials: true })
            console.log(res)

            if (imgCounter !== 0) setImgCounter(imgCounter - 1)
            props.setRefresh((prev) => !prev)
        } catch (error) {
            console.log("wrong in delete product", error)
        }
    }


    //// fetching the wishList for the user who is not logged in
    const wishList = useSelector((state) => state?.user?.userDataNotLoggedIn?.wishList)
    async function favProduct(e) {
        try {
            e.stopPropagation();
            e.preventDefault()
            const newIsPresent = !isPresent
            setIsPresent(newIsPresent) /// toggling is done over here

            if (userData) {
                dispatch(setProductIdInUserWishList({ productId: props?.productId, productVariation: imgCounter }))
                const res = axios.post(`${USER_ENDPOINTS}/favourite`, { userId: userId, productId: props.productId, toAdd: newIsPresent, productVariation: imgCounter }, { withCredentials: true })

                toast.success(res?.data?.message);
            } else {
                const obj = {
                    productId: props?.productId,
                    productVariation: imgCounter
                }
                //// to get the proper toast message for the same
                const exists = wishList.some(
                    (obj) => obj.productId === props?.productId && obj.productVariation === imgCounter
                );
                if (!exists) {
                    toast.success("Product added in the wish list")
                } else {
                    toast.success("Product removed from the wish list")
                }

                //// this line is written at end as dispatch is asynchronous in nature
                dispatch(setFavouriteNotLoggedIn(obj))
            }

        } catch (error) {
            console.log("wrong in favourite product", error)
            toast.error(error?.response?.data?.message)
        }
    }


    const [skeleton, setSkeleton] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setSkeleton(false);
        }, 500)
    }, [])
    return (
        <>
            {skeleton ? <ProductCardSkeleton /> :

                // initially setting 0th product to be displayed whicle clicking on the product
                <div className="w-[100%] h-[450px] bg-white flex flex-col rounded-2xl 
                shadow-md hover:shadow-xl transition-all duration-300 
                border border-blue-100 cursor-pointer">

                    <div className="sm:text-[13px] bg-blue-50 text-blue-700 
                    h-[5%] w-[100%] rounded-t-2xl p-1 
                    font-medium tracking-wide">
                        Extra <span className="font-semibold">5%</span> discount , use the code
                        <span className="font-semibold"> MPSCH</span>
                    </div>

                    <div className="h-[40%] w-[100%] pl-0.5 pr-0.5 
                    bg-blue-50 flex items-center justify-center">
                        <img
                            className="h-[100%] w-[100%] object-contain 
                       transition-transform duration-300 hover:scale-105"
                            src={`http://localhost:3000/${props.imagesArray[imgCounter]}`}
                            alt={`${props.imagesArray[imgCounter]}`}
                        />
                    </div>

                    <div className="flex flex-col justify-evenly h-[40%] w-[100%] pl-2 pr-2">
                        <div className="product-data line-clamp-3 w-[100%] 
                        text-gray-800 font-semibold">
                            {props.productName}
                        </div>

                        <div className="price font-sans text-gray-800">
                            <span className="font-sans sm:text-lg lg:text-xl text-blue-700 font-semibold">
                                &#8377;{discountCalc(props.originalPriceArray[imgCounter], props.discountArray[imgCounter])}
                            </span>

                            <span className="font-sans sm:text-sm text-blue-500 ml-1">
                                (&#8377;{gramAmountCalc(
                                    props.originalPriceArray[imgCounter],
                                    props.discountArray[imgCounter],
                                    props.netWeightArray[imgCounter]
                                )}/100g)
                            </span>

                            <p className="text-gray-500">
                                <span className="line-through font-sans sm:text-sm">
                                    &#8377;{props.originalPriceArray[imgCounter]}
                                </span>
                                <span className="sm:text-sm text-blue-600 ml-1 font-medium">
                                    Discount {props.discountArray[imgCounter]}%
                                </span>
                            </p>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex flex-row gap-1 font-sans text-[10px] flex-wrap">
                                {props.netWeightArray.map((offer, index) => (
                                    <div
                                        className={`border flex flex-row justify-center items-center 
                                    px-2 py-0.5 rounded-full font-semibold cursor-pointer 
                                    transition-all duration-200
                                    ${imgCounter === index
                                                ? "border-blue-600 bg-blue-600 text-white"
                                                : "border-blue-300 text-blue-700 hover:bg-blue-100"
                                            }`}
                                        onClick={(e) => {
                                            setImgCounter(index);
                                            dispatch(setImageCounter(index));
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }}
                                    >
                                        {props.netWeightArray[index]} kg
                                    </div>
                                ))}
                            </div>

                            {userData?.role === "admin" && (
                                <div
                                    onClick={(e) => deleteProduct(e)}
                                    className="p-1 cursor-pointer rounded-full 
                               hover:bg-red-100 transition-colors"
                                >
                                    <MdOutlineDeleteOutline size={20} className="text-red-600" />
                                </div>
                            )}

                            {userData?.role !== "admin" && (
                                <div
                                    onClick={(e) => favProduct(e)}
                                    className="p-1 cursor-pointer rounded-full 
                               hover:bg-blue-100 transition-colors"
                                >
                                    <IoIosHeart
                                        size={20}
                                        color={isPresent ? "red" : "white"}
                                        style={{ stroke: "red", strokeWidth: 20 }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-row justify-center items-center h-[15%] w-[100%] rounded-2xl">
                        <button className="flex flex-row justify-center items-center w-[100%] h-[100%] 
                        bg-blue-600 text-white font-semibold rounded-b-2xl cursor-pointer 
                        transition-all duration-300 hover:bg-blue-700 hover:tracking-wide"
                            onClick={(e) => {
                                addToCart(
                                    e,
                                    userId,
                                    props.productId,
                                    imgCounter,
                                    !(userData === null),
                                    dispatch
                                );
                            }}
                        >
                            Add to Cart
                        </button>
                    </div>

                </div>
            }
        </>
    )
}

function DisplayProducts(props) {

    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const { productData, hasMore, loading } = useGetAllProduct(props?.refresh, props?.query, page, setPage);
    function productClicked(products) {
        navigate("/singleProductDisplay", { state: products })
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // 👇 THIS IS WHERE YOUR LINE GOES
                if (entry.isIntersecting && hasMore && !loading) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );

        if (props?.loaderRef.current) {
            observer.observe(props?.loaderRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loading]);

    if (productData.length === 0) {
        return (
            <div>Loading...</div>
        )
    } else {
        // console.log(productData)
        // console.log(productData[0]["image"])

        return (
            <>
                {productData.map((products) => {
                    return (
                        <div onClick={() => productClicked(products)} className="h-fit w-[90%] sm:w-[250px] gap-2">
                            <ProductCard imagesArray={products.image} netWeightArray={products.netWeight} originalPriceArray={products.originalPrice} discountArray={products.discountValue} productName={products.productName} productId={products._id} refresh={props.refresh} setRefresh={props.setRefresh} />
                        </div>
                    )
                })}
            </>
        )
    }
}

export default function Product() {
    const headerHeight = useSelector((state) => state?.layout?.headerHeight)
    const [productHeight, setProductHeight] = useState(0);
    const [refresh, setRefresh] = useState(true)
    const [hasMore, setHasMore] = useState(true); /// written for pagination
    const loaderRef = useRef(null);
    useLayoutEffect(() => {
        const windowHeight = window.innerHeight
        setProductHeight(windowHeight - headerHeight)
    }, [headerHeight])

    const location = useLocation()
    const { query, data } = location.state || {}

    console.log("query :" + query + " data :" + data)

    const [mobFilterVisible, setMobFilterVisible] = useState(false);


    return (
        <>
            <Header />
            <div className={`w-[100%] flex flex-col sm:flex-row`} style={{ height: `${productHeight}px` }}>

                {/* Filter Display for Desktop */}
                <div className="hidden sm:block
                bg-blue-100  sm:w-[300px] md:w-[350px] h-[100%] overflow-auto scrollbar-hide"><Filter productHeight={productHeight} /></div>

                {/* Filter Display for Mobile */}
                <div
                    onClick={() => { setMobFilterVisible(!mobFilterVisible); console.log("holaaa") }}
                    className={`
                    sm:hidden flex justify-center items-center gap-2
                    px-5 py-2.5
                    ${mobFilterVisible ? "rounded-t-full" : "rounded-full"}
                    bg-gradient-to-r from-blue-500 to-blue-600
                    text-white font-medium text-sm
                    shadow-lg shadow-blue-500/30
                    active:scale-95
                    transition-all duration-300
                    hover:shadow-xl hover:shadow-blue-500/40
                    my-2 mx-2 relative 
                `}
                >
                    <FiFilter className="text-white/90" />
                    Filter

                    {mobFilterVisible && <MobileFilter mobFilterVisible={mobFilterVisible} setMobFilterVisible={setMobFilterVisible} />
                    }
                </div>



                <div className="h-auto p-2 flex flex-row flex-wrap justify-evenly items-center sm:items-start gap-x-2 gap-y-10 overflow-auto" data-lenis-prevent>
                    <DisplayProducts refresh={refresh} setRefresh={setRefresh} query={query} data={data} loaderRef={loaderRef} setHasMore={setHasMore} hasMore={hasMore} />
                </div>
                {/* Loader trigger */}
                {hasMore && (
                    <div
                        ref={loaderRef}
                        className="text-center py-4 text-gray-500 relative z-[-2]"
                    >
                    </div>
                )}
            </div>
            <Footer />

        </>
    )
}