import { Header, Footer } from "./LandingPage";
import { useDispatch, useSelector } from "react-redux";
import { useLayoutEffect, useState } from "react";
import { setImageCounter } from "../redux/slices/activeSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { addToCart } from "./Product";
import { SideBar,SubMenu } from "./LandingPage";
import { Breadcrumbs } from "./Breadcrumbs";

function OfferComponent(props) {
    const dispath = useDispatch();
    let counter = Number(useSelector((state) => state?.active?.imgCounter))
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

    return (
        <>
            <div
                className={`flex flex-col flex-shrink-0 rounded-2xl p-3 cursor-pointer transition-all duration-300 backdrop-blur-xl
                ${counter === props.index
                            ? "border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-white shadow-[0_15px_40px_rgba(37,99,235,0.45)] scale-[1.03]"
                            : "border border-blue-200/50 bg-white/60 shadow-[0_8px_25px_rgba(37,99,235,0.18)] hover:shadow-[0_12px_35px_rgba(37,99,235,0.28)] hover:-translate-y-1"
                }`}
                onClick={() => dispath(setImageCounter(props.index))}
            >
                {/* Quantity */}
                <div
                    className="font-sans sm:text-lg lg:text-xl font-semibold text-blue-900 border-b border-blue-200/60 pb-1 mb-2 flex flex-row justify-center items-center w-full"
                >
                    <span>{props.netQuantity} Kg</span>
                </div>

                {/* Pricing */}
                <div className="flex flex-col gap-1">
                    <div className="font-sans flex flex-row items-center gap-2">
                        <span className="sm:text-md lg:text-lg font-semibold text-slate-900">
                            &#8377;{discountCalc(props.originalPrice, props.discount)}
                        </span>

                        <span className="sm:text-sm text-slate-500">
                            MRP
                        </span>

                        <span className="line-through sm:text-sm text-slate-400">
                            {props.originalPrice}
                        </span>
                    </div>

                    <div className="font-sans sm:text-sm text-slate-700 flex flex-row items-center gap-2">
                        <span>
                            ( &#8377;{gramAmountCalc(props.originalPrice, props.discount, props.netQuantity)}/100g )
                        </span>

                        <span
                            className="px-2 py-[2px] rounded-full
                   bg-emerald-400/90 text-white
                   text-xs font-semibold tracking-wide
                   shadow-[0_4px_10px_rgba(16,185,129,0.45)]"
                        >
                            {props.discount}% OFF
                        </span>
                    </div>
                </div>
            </div>

        </>
    )
}

function ProductInfo(props) {
    const dispatch = useDispatch()
    const nutrition = useSelector((state) => state?.product?.nutrition)
    const calories = useSelector((state) => state?.product?.calories)
    const skinHealth = useSelector((state) => state?.product?.skinHealth)
    const digestion = useSelector((state) => state?.product?.digestion)
    const dentalHealth = useSelector((state) => state?.product?.dentalHealth)
    const navigate = useNavigate()

    /// this is the array which we are going to recevice via backend
    // const netQuantityArray = ["2", "4", "7", "15", "20"]; /// receving in Kg
    // const originalPriceArray = ["200", "300", "400", "500", "600"];
    // const discountArray = ["10", "5", "15", "20", "10"]

    const netQuantityArray = props.netQuantityArray
    const originalPriceArray = props.originalPriceArray;
    const discountValueArray = props.discountValueArray

    const userId = useSelector((state) => state?.user?.userData?._id)
    const productVariation = useSelector((state) => state?.active?.imgCounter)


    const details = [
        { title: "nutrition", value: nutrition },
        { title: "calories", value: calories },
        { title: "Skin Health", value: skinHealth },
        { title: "digestion", value: digestion },
        { title: "Dental Health", value: dentalHealth },
    ]


    return (
        <div className="flex flex-col gap-6 w-full items-center overflow-auto scrollbar-hide rounded-3xl p-2 " data-lenis-prevent >

            {/* Product Title / Description */}
            <div className="line-clamp-3 w-full sm:text-lg md:text-xl lg:text-2xl
                  font-medium text-slate-800
                  leading-relaxed tracking-wide">
                <span>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem quaerat
                    molestias, non quo neque iure quia sequi! Recusandae, tempora possimus!
                </span>
            </div>

            {/* Offers */}
            <div className="flex flex-row gap-4 w-full overflow-x-auto scrollbar-hide p-2 rounded-2xl">
                {netQuantityArray.map((offer, index) => (
                    <OfferComponent
                        index={index}
                        netQuantity={netQuantityArray[index]}
                        originalPrice={originalPriceArray[index]}
                        discount={discountValueArray[index]}
                    />
                ))}
            </div>

            {/* offer button and add to cart button */}
            <div className="w-[100%] flex sm:flex-col sm:gap-5 gap-3">
                <div
                    onClick={(e) => { e.stopPropagation(); navigate("/Product_Page/SingleProductDisplay/Offer") }}
                    className="flex flex-row items-center justify-center w-full rounded-2xl py-3 px-4 border border-blue-300/40 bg-white/50 backdrop-blur-lg sm:text-lg lg:text-xl font-medium text-blue-900 shadow-[0_8px_25px_rgba(37,99,235,0.15)]
                    cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:shadow-[0_12px_35px_rgba(37,99,235,0.25)]"
                >
                    <span className="hover:underline">Offers</span>
                </div>

                {/* Add to Cart */}
                <div
                    className="flex flex-row items-center justify-center w-full rounded-2xl py-3 px-4 sm:text-lg lg:text-xl font-semibold tracking-wide cursor-pointer text-white
                    bg-gradient-to-r from-blue-600 to-blue-700 shadow-[0_12px_30px_rgba(37,99,235,0.35)] transition-all duration-300 hover:from-blue-500 hover:to-blue-600
                    hover:shadow-[0_18px_45px_rgba(37,99,235,0.45)] active:scale-[0.98]"

                    // sending the default quantity as 1 from SingleProductDisplay
                    onClick={(e) =>
                        addToCart(
                            e,
                            1,
                            userId,
                            props.productId,
                            productVariation,
                            !(userId === null),
                            dispatch
                        )
                    }
                >
                    <span className="hover:underline">Add to Cart</span>
                </div>
            </div>


            {/* Product Details */}
            <div
                className="border border-blue-300/40 rounded-3xl p-4
               flex flex-col gap-4 w-full
               bg-white/60 backdrop-blur-xl
               shadow-[0_15px_40px_rgba(37,99,235,0.18)]"
            >
                <div className="sm:text-lg lg:text-xl font-semibold text-blue-900 underline">
                    Product Details
                </div>

                <div className="product-details grid grid-cols-2 w-full gap-4">
                    {details.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-2xl p-4 bg-white/70 backdrop-blur-md border border-blue-200/40 shadow-[0_6px_20px_rgba(37,99,235,0.12)]transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(37,99,235,0.25)]"
                        >
                            <div className="font-semibold text-blue-900 text-lg tracking-wide">
                                {item.title}
                            </div>
                            <div className="text-sm mt-1 text-slate-700 leading-relaxed">
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>

    )
}

function ProductImg({ imagesArray = [], productHeight }) {
    const counter = useSelector((state) => state?.active?.imgCounter) ?? 0;
    const imageSrc = imagesArray[counter];

    if (!imageSrc) return null;

    return (
        <div
            className="w-[500px] h-[500px] flex items-center justify-center
                 rounded-2xl bg-white/40 backdrop-blur-xl
                 shadow-[0_15px_40px_rgba(37,99,235,0.25)]
                 transition-all duration-500"
        >
            <img
                src={`http://localhost:3000/${imageSrc}`}
                alt="Product image"
                className="w-full h-full object-contain
                   rounded-xl
                   transition-transform duration-500 ease-out
                   hover:scale-105
                   animate-imageFade"
            />
        </div>
    );
}


function ManufacturerDetails() {
    return (
        <div>
            Manufacturer
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus doloremque et cum nesciunt ad minima! Harum enim iure beatae? Modi necessitatibus facere ea, accusamus qui laborum enim similique temporibus cumque doloribus quam cum, alias a aliquid quasi. Illum, aut nihil voluptates autem perferendis quisquam tenetur mollitia recusandae deserunt esse in doloremque quam dolorem vel ipsum optio incidunt soluta repudiandae harum voluptatum? Molestias, eaque veniam! Alias esse tenetur libero accusantium nihil. Ducimus ex dolores suscipit modi magni minima, provident animi, numquam nobis voluptate, rerum sapiente error fugit delectus possimus optio praesentium consequatur commodi? Ipsam minima nemo similique dolores quo, ducimus quidem.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi deserunt sunt similique earum quas itaque quam, provident voluptas delectus quaerat exercitationem fuga nihil, minima libero quisquam cupiditate aperiam quae expedita, quasi ullam. Dignissimos sapiente fugit architecto dolorem, iure hic aliquam praesentium delectus porro accusantium, commodi id eaque, vel nam fuga veniam. Ut mollitia possimus deleniti unde quae dolores! Repudiandae eaque maxime animi eligendi, nisi illum dicta suscipit labore veniam! Iusto pariatur magnam optio maxime, aperiam ipsum et cumque, quidem impedit quia provident sint odit ea tempore cum, aspernatur itaque sit tenetur similique illo eius corrupti facere saepe nisi! Laudantium culpa, animi neque velit voluptatum accusamus error ipsum tenetur, repellendus praesentium nihil. Quasi sequi incidunt, error deleniti reprehenderit odit reiciendis minus, quisquam eaque odio dolorum a, recusandae voluptatum modi possimus accusamus. Blanditiis ipsa exercitationem beatae nesciunt, et tempora recusandae at quam, eveniet voluptatibus minus magnam iusto in deleniti. Exercitationem sunt explicabo cupiditate omnis corporis rem dolor animi sed ex aut, suscipit iste saepe nihil laborum maiores porro itaque optio numquam sint illum repellat quaerat delectus. Inventore, illo. Deserunt deleniti, natus modi distinctio, commodi ex fuga voluptatum tempore unde quam iure eaque aliquid. Praesentium nobis, rerum harum at tenetur neque quo amet!
        </div>
    )
}

function ProductDesc() {
    return (
        <div>
            Product
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus doloremque et cum nesciunt ad minima! Harum enim iure beatae? Modi necessitatibus facere ea, accusamus qui laborum enim similique temporibus cumque doloribus quam cum, alias a aliquid quasi. Illum, aut nihil voluptates autem perferendis quisquam tenetur mollitia recusandae deserunt esse in doloremque quam dolorem vel ipsum optio incidunt soluta repudiandae harum voluptatum? Molestias, eaque veniam! Alias esse tenetur libero accusantium nihil. Ducimus ex dolores suscipit modi magni minima, provident animi, numquam nobis voluptate, rerum sapiente error fugit delectus possimus optio praesentium consequatur commodi? Ipsam minima nemo similique dolores quo, ducimus quidem.
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim suscipit fuga laborum rem, adipisci cupiditate natus ullam dolorem officia ea omnis similique consectetur consequuntur quam. Architecto culpa ipsa quos facilis nostrum, fugit labore quam, excepturi iste ipsam maxime voluptatum asperiores modi sed voluptas sunt vel temporibus laborum. Nobis quo eaque eius iste in cum commodi eveniet nulla corporis, eum odit suscipit ut modi! Labore aliquam nemo reiciendis repellendus accusantium magni modi debitis, voluptas culpa adipisci cupiditate ea, numquam, quasi fugit. Est perspiciatis animi eaque similique dolore ex iste libero earum veritatis pariatur ad voluptas facilis, explicabo aperiam. Reprehenderit quam, odit consequuntur eaque fuga, accusamus alias recusandae sint porro velit atque? Porro exercitationem neque vitae expedita maxime? Vero illum dolore laboriosam natus sint, consequatur esse accusamus cumque quo accusantium unde aspernatur nam facilis itaque quia aliquid cupiditate tenetur sapiente! Dolorum enim, provident consequuntur consequatur reprehenderit quibusdam eos excepturi commodi ratione perferendis rem itaque odio nulla cumque dignissimos labore voluptatem pariatur recusandae hic, soluta eligendi adipisci quo fugit corrupti. Explicabo earum, non quis similique sequi, voluptatum inventore dolores hic nihil officia natus modi et vel. Quis rem laboriosam fuga ipsa. Similique amet eligendi fuga quod illo vitae eos sunt accusamus. Dolores, at!
        </div>
    )
}

function SecondaryDetails() {
    const [detailsCounter, setDetailsCounter] = useState(0);

    return (
        <>
            <div className="w-full h-auto
                      bg-gradient-to-br from-blue-50/60 to-white
                      border border-blue-200/40
                      shadow-[0_20px_50px_rgba(37,99,235,0.18)]
                      backdrop-blur-xl
                      pb-4">

                {/* Tabs */}
                <div className="w-full h-[56px]
                        flex flex-row items-center justify-center
                        p-2 gap-2">

                    <div
                        className={`w-1/2 h-full flex flex-row justify-center items-center
                        rounded-2xl
                        text-sm sm:text-base lg:text-lg
                        font-semibold tracking-wide
                        transition-all duration-300
                        cursor-pointer
                        ${!detailsCounter
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-[0_10px_30px_rgba(37,99,235,0.45)]"
                                : "bg-blue-100/70 text-blue-900 hover:bg-blue-200"
                            }`}
                        onClick={() => setDetailsCounter(0)}
                    >
                        Product Description
                    </div>

                    <div
                        className={`w-1/2 h-full flex flex-row justify-center items-center
                        rounded-2xl
                        text-sm sm:text-base lg:text-lg
                        font-semibold tracking-wide
                        transition-all duration-300
                        cursor-pointer
                        ${detailsCounter
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-[0_10px_30px_rgba(37,99,235,0.45)]"
                                : "bg-blue-100/70 text-blue-900 hover:bg-blue-200"
                            }`}
                        onClick={() => setDetailsCounter(1)}
                    >
                        Manufacturer Details
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 pt-2">
                    {detailsCounter && <ManufacturerDetails />}
                    {!detailsCounter && <ProductDesc />}
                </div>

            </div>
        </>
    );
}

export default function SingleProductDisplay() {
    const headerHeight = useSelector((state) => state?.layout?.headerHeight)
    const [productHeight, setProductHeight] = useState(0);
    const dispatch = useDispatch()
    const location = useLocation()

    const productData = location?.state;

    useLayoutEffect(() => {
        const windowHeight = window.innerHeight
        setProductHeight(windowHeight - headerHeight)
    }, [headerHeight])

    const [open, setOpen] = useState(false);
    const [animal, setAnimal] = useState("");


    /// herebackend call will be done with the help of product id to get all the information about a product
    // all the infomation will be stored in the product slice and then from there this information will be used further
    // const imagesArray = ["pedigree.jpg", "photo_21.jpg", "smartheart.jpg", "whiskas_product.jpg", "whiskas.jpg"]

    if (!productData) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            <Header open={open} setOpen={setOpen} approachedFrom={"SingleProductDisplay"}/>
            <SideBar open={open} setOpen={setOpen} setAnimal={setAnimal} />
            <SubMenu animal={animal} />
            <Breadcrumbs/>
            <div
                className="w-full flex sm:flex-row flex-col gap-0 bg-gradient-to-br from-blue-50/60 via-blue-100/50 to-blue-200/40 backdrop-blur-xl border border-blue-200/40
                shadow-[0_20px_60px_rgba(37,99,235,0.25)] animate-fadeInProductDisplay"
                style={{ height: `${productHeight}px` }}
            >
                {/* LEFT: Product Images */}
                <div
                    className="sm:w-[40%] w-[100%] h-full overflow-auto scrollbar-hide flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-blue-600/20
                    shadow-inner transition-all duration-500 ease-out hover:bg-blue-500/20"
                >
                    <ProductImg
                        productHeight={productHeight}
                        imagesArray={productData?.image}
                    />
                </div>

                {/* RIGHT: Product Info */}
                <div
                    className="sm:w-[60%] w-[100%] sm:h-auto sm:p-4 p-2 flex flex-row flex-wrap justify-evenly gap-x-4 gap-y-10 overflow-auto sm:scrollbar-hide
                    bg-white/40 shadow-[inset_0_0_30px_rgba(37,99,235,0.08)]
                    transition-all duration-500 h-fit"
                >
                    <ProductInfo
                        netQuantityArray={productData.netWeight}
                        originalPriceArray={productData.originalPrice}
                        discountValueArray={productData.discountValue}
                        productId={productData._id}
                    />
                </div>
            </div>

            <SecondaryDetails />
            <Footer />
        </>
    )
}