import { Header,Footer } from "./LandingPage";
import { useDispatch, useSelector } from "react-redux";
import { useLayoutEffect, useState } from "react";
import { setImageCounter } from "../redux/slices/activeSlice";
import { useLocation } from "react-router-dom";

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
            <div className={`flex flex-col border border-black rounded-2xl p-2 flex-shrink-0 ${counter === props.index ? "border-orange-400 border-2" : ""} cursor-pointer`} onClick={() => dispath(setImageCounter(props.index))}>
                <div className="font-sans sm:text-lg lg:text-xl font-semibold border-b border-black flex flex-row justify-center items-center w-[100%]"><span>{props.netQuantity} Kg</span></div>
                <div>
                    <div className="font-sans"><span className="sm:text-md lg:text-lg">&#8377;{discountCalc(props.originalPrice, props.discount)}</span> <span className="sm:text-sm">MRP&nbsp;</span><span className="line-through sm:text-sm">{props.originalPrice}</span></div>
                    <div className="font-sans sm:text-sm"><span>&#40; &#8377;{gramAmountCalc(props.originalPrice, props.discount, props.netQuantity)}/100g &#41;</span> <span className="bg-emerald-300">{props.discount}% OFF</span></div>
                </div>
            </div>
        </>
    )
}

function ProductInfo(props) {
    const nutrition = useSelector((state) => state?.product?.nutrition)
    const calories = useSelector((state) => state?.product?.calories)
    const skinHealth = useSelector((state) => state?.product?.skinHealth)
    const digestion = useSelector((state) => state?.product?.digestion)
    const dentalHealth = useSelector((state) => state?.product?.dentalHealth)

    /// this is the array which we are going to recevice via backend
    // const netQuantityArray = ["2", "4", "7", "15", "20"]; /// receving in Kg
    // const originalPriceArray = ["200", "300", "400", "500", "600"];
    // const discountArray = ["10", "5", "15", "20", "10"]

    const netQuantityArray=props.netQuantityArray
    const originalPriceArray = props.originalPriceArray;
    const discountValueArray = props.discountValueArray


    const details = [
        { title: "nutrition", value: nutrition },
        { title: "calories", value: calories },
        { title: "Skin Health", value: skinHealth },
        { title: "digestion", value: digestion },
        { title: "Dental Health", value: dentalHealth },
    ]


    return (
        <div className="flex flex-col gap-4 w-[100%] items-center overflow-auto scrollbar-hide">
            <div className="line-clamp-3 w-[100%] sm:text-md md:text-xl lg:text-2xl"><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem quaerat molestias, non quo neque iure quia sequi! Recusandae, tempora possimus!</span></div>
            <div className="flex flex-row gap-4 w-[100%] overflow-x-auto scrollbar-hide">
                {netQuantityArray.map((offer, index) => (
                    <OfferComponent index={index} netQuantity={netQuantityArray[index]} originalPrice={originalPriceArray[index]} discount={discountValueArray[index]} />
                ))}
            </div>
            <div className="flex flex-row items-center w-[100%] rounded-2xl py-2 px-2 border-2 border-black sm:text-lg lg:text-2xl cursor-pointer"><span className="hover:underline">Offers</span></div>
            <div className="flex flex-row items-center justify-center w-[100%] rounded-2xl py-2 px-2 border-2 border-black sm:text-lg lg:text-2xl cursor-pointer bg-blue-700 hover:bg-blue-600 hover:text-white">
                <span className="hover:underline">Add to Cart</span>
            </div>
            <div className="border-black border-2 rounded-2xl p-2 flex flex-col gap-2 w-[100%]">
                <div className="sm:text-lg lg:text-x; font-semibold underline">Product Details</div>
                <div className="product-details grid grid-cols-2 w-[100%] gap-2">
                    {details.map((item, index) => (
                        <div key={index} className="rounded-xl p-4 bg-white shadow hover:shadow-lg transition">
                            <div className="font-semibold text-lg">{item.title}</div>
                            <div className="text-sm mt-1">{item.value}</div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

function ProductImg(props) {
    let counter = Number(useSelector((state) => state?.active?.imgCounter))
    console.log(counter, typeof (counter), "hello")
    return (
        <>
            <div className="w-[500px] h-[500px] flex flex-col">
                <img className="w-[100%] h-[100%] object-contain" src={`http://localhost:3000/${props.imagesArray[counter]}`} alt={`${props.imagesArray[counter]}`} />
            </div>
        </>
    )
}

function ManufacturerDetails(){
    return(
        <div>
            Manufacturer
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus doloremque et cum nesciunt ad minima! Harum enim iure beatae? Modi necessitatibus facere ea, accusamus qui laborum enim similique temporibus cumque doloribus quam cum, alias a aliquid quasi. Illum, aut nihil voluptates autem perferendis quisquam tenetur mollitia recusandae deserunt esse in doloremque quam dolorem vel ipsum optio incidunt soluta repudiandae harum voluptatum? Molestias, eaque veniam! Alias esse tenetur libero accusantium nihil. Ducimus ex dolores suscipit modi magni minima, provident animi, numquam nobis voluptate, rerum sapiente error fugit delectus possimus optio praesentium consequatur commodi? Ipsam minima nemo similique dolores quo, ducimus quidem.
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi deserunt sunt similique earum quas itaque quam, provident voluptas delectus quaerat exercitationem fuga nihil, minima libero quisquam cupiditate aperiam quae expedita, quasi ullam. Dignissimos sapiente fugit architecto dolorem, iure hic aliquam praesentium delectus porro accusantium, commodi id eaque, vel nam fuga veniam. Ut mollitia possimus deleniti unde quae dolores! Repudiandae eaque maxime animi eligendi, nisi illum dicta suscipit labore veniam! Iusto pariatur magnam optio maxime, aperiam ipsum et cumque, quidem impedit quia provident sint odit ea tempore cum, aspernatur itaque sit tenetur similique illo eius corrupti facere saepe nisi! Laudantium culpa, animi neque velit voluptatum accusamus error ipsum tenetur, repellendus praesentium nihil. Quasi sequi incidunt, error deleniti reprehenderit odit reiciendis minus, quisquam eaque odio dolorum a, recusandae voluptatum modi possimus accusamus. Blanditiis ipsa exercitationem beatae nesciunt, et tempora recusandae at quam, eveniet voluptatibus minus magnam iusto in deleniti. Exercitationem sunt explicabo cupiditate omnis corporis rem dolor animi sed ex aut, suscipit iste saepe nihil laborum maiores porro itaque optio numquam sint illum repellat quaerat delectus. Inventore, illo. Deserunt deleniti, natus modi distinctio, commodi ex fuga voluptatum tempore unde quam iure eaque aliquid. Praesentium nobis, rerum harum at tenetur neque quo amet!
            </div>
    )
}

function ProductDesc(){
    return(
        <div>
            Product
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus doloremque et cum nesciunt ad minima! Harum enim iure beatae? Modi necessitatibus facere ea, accusamus qui laborum enim similique temporibus cumque doloribus quam cum, alias a aliquid quasi. Illum, aut nihil voluptates autem perferendis quisquam tenetur mollitia recusandae deserunt esse in doloremque quam dolorem vel ipsum optio incidunt soluta repudiandae harum voluptatum? Molestias, eaque veniam! Alias esse tenetur libero accusantium nihil. Ducimus ex dolores suscipit modi magni minima, provident animi, numquam nobis voluptate, rerum sapiente error fugit delectus possimus optio praesentium consequatur commodi? Ipsam minima nemo similique dolores quo, ducimus quidem.
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim suscipit fuga laborum rem, adipisci cupiditate natus ullam dolorem officia ea omnis similique consectetur consequuntur quam. Architecto culpa ipsa quos facilis nostrum, fugit labore quam, excepturi iste ipsam maxime voluptatum asperiores modi sed voluptas sunt vel temporibus laborum. Nobis quo eaque eius iste in cum commodi eveniet nulla corporis, eum odit suscipit ut modi! Labore aliquam nemo reiciendis repellendus accusantium magni modi debitis, voluptas culpa adipisci cupiditate ea, numquam, quasi fugit. Est perspiciatis animi eaque similique dolore ex iste libero earum veritatis pariatur ad voluptas facilis, explicabo aperiam. Reprehenderit quam, odit consequuntur eaque fuga, accusamus alias recusandae sint porro velit atque? Porro exercitationem neque vitae expedita maxime? Vero illum dolore laboriosam natus sint, consequatur esse accusamus cumque quo accusantium unde aspernatur nam facilis itaque quia aliquid cupiditate tenetur sapiente! Dolorum enim, provident consequuntur consequatur reprehenderit quibusdam eos excepturi commodi ratione perferendis rem itaque odio nulla cumque dignissimos labore voluptatem pariatur recusandae hic, soluta eligendi adipisci quo fugit corrupti. Explicabo earum, non quis similique sequi, voluptatum inventore dolores hic nihil officia natus modi et vel. Quis rem laboriosam fuga ipsa. Similique amet eligendi fuga quod illo vitae eos sunt accusamus. Dolores, at!
            </div>
    )
}

function SecondaryDetails(){
    const [detailsCounter,setDetailsCounter]=useState(0);
    return(
        <>
            <div className="w-[100%] h-auto bg-white pb-2">
                <div className="w-[100%] h-[50px] bg-white flex flex-row items-center justify-center pb-2">
                    <div className={`w-1/2 h-[100%] flex flex-row justify-center items-center ${!detailsCounter ? "bg-blue-400 text-white":"bg-blue-200"} cursor-pointer shadow hover:shadow-lg transition`} onClick={()=>setDetailsCounter(0)}>Product Description</div>
                    <div className={`w-1/2 h-[100%] flex flex-row justify-center items-center ${detailsCounter ? "bg-blue-400 text-white":"bg-blue-200"} cursor-pointer shadow hover:shadow-lg transition`} onClick={()=>setDetailsCounter(1)}>Manufacturer Details</div>
                </div>
                {detailsCounter && <ManufacturerDetails/>}
                {!detailsCounter && <ProductDesc/>}
            </div>
        </>
    )
}

export default function SingleProductDisplay() {
    const headerHeight = useSelector((state) => state?.layout?.headerHeight)
    const [productHeight, setProductHeight] = useState(0);
    const dispatch=useDispatch()
    const location=useLocation()

    const productData=location?.state;

    useLayoutEffect(() => {
        const windowHeight = window.innerHeight
        setProductHeight(windowHeight - headerHeight)
        dispatch(setImageCounter(0))
    }, [headerHeight])


    /// herebackend call will be done with the help of product id to get all the information about a product
    // all the infomation will be stored in the product slice and then from there this information will be used further
    // const imagesArray = ["pedigree.jpg", "photo_21.jpg", "smartheart.jpg", "whiskas_product.jpg", "whiskas.jpg"]

    if(!productData){
        return(
            <div>Loading...</div>
        )
    }

    return (
        <>
            <Header />
            <div className={`w-[100%] flex flex-row`} style={{ height: `${productHeight}px` }}>
                <div className="bg-blue-100 w-[40%] h-[100%] overflow-auto scrollbar-hide flex flex-col items-center justify-center"><ProductImg productHeight={productHeight} imagesArray={productData?.image} /></div>
                <div className="w-[60%] h-auto p-2 flex flex-row flex-wrap justify-evenly gap-x-2 gap-y-10 overflow-auto scrollbar-hide"><ProductInfo netQuantityArray={productData.netWeight} originalPriceArray={productData.originalPrice} discountValueArray={productData.discountValue}/></div>
            </div>
            <SecondaryDetails/>
            <Footer/>
        </>
    )
}