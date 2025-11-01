import { Header ,Footer} from "./LandingPage"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setBrands, setBreed, setDiet, setFlavor, setPets } from "../redux/slices/filterSlice"
import { MdArrowDropDown, MdArrowDropUp , MdOutlineDeleteOutline} from "react-icons/md"
import { Range } from "react-range";
import { useGetAllProduct } from "../hooks/useGetAllProducts"
import axios from "axios"
import { PRODUCT_ENDPOINTS } from "./endpoints"
import { useLocation, useNavigate } from "react-router-dom"
import { useMemo } from "react"

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
            {props.items.map((item) => (
                <label key={item} className="flex items-center gap-2 mb-1">
                    <input
                        type="checkbox"
                        checked={props.chekcedList.includes(item)}
                        onChange={() => handleChange(item)}
                        className="w-4 h-4 bg-blue-400 border-amber-700"
                    />
                    {item}
                </label>
            ))}
        </>
    )

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

    const chekcedList = useSelector((state) => state?.filter?.flavorFilter)
    const checkedListBreed = useSelector((state) => state?.filter?.breedFilter)
    const checkedListDiet = useSelector((state) => state?.filter?.diet)
    const checkedListBrands = useSelector((state) => state?.filter?.brandsFilter)


    const [showFilter,setShowFilter]=useState("flavor")
    const [filterToggle,setFilterToggle]=useState(false)

    function toggle(type) {
        if(filterToggle || type!==showFilter){
            if (type === "flavor") setShowFilter("flavor")
            else if (type === "breed") setShowFilter("breed")
            else if (type === "diet") setShowFilter("diet")
            else if (type === "brands") setShowFilter("brands")
            else if (type==="priceslider") setShowFilter("priceslider")
            setFilterToggle(false)
        }else{
            setShowFilter("")
            setFilterToggle(true)
        }
    }

    return (
        <>
            <div className="flex flex-col p-2 h-[100%] gap-2">
                <div className="sm:text-lg lg:text-xl font-semibold underline">Filter</div>
                <div className="flex flex-col h-[100%] overflow-auto scrollbar-hide">
                    {/* FLAVOR */}
                    <div onClick={() => toggle("flavor")} className="flex flex-row justify-between items-center">
                        <div>Flavor</div>
                        {showFilter!=="flavor" && <MdArrowDropDown />}
                        {showFilter==="flavor" && <MdArrowDropUp />}
                    </div>
                    <div className={`bg-blue-200 p-2 h-[30%] rounded-2xl overflow-auto scrollbar-hide ${showFilter==="flavor" ? "relative" : "absolute top-0 z-[-10]"} `}>
                        <CheckBoxes type="flavor" chekcedList={chekcedList} items={items_flavor} />
                    </div>

                    {/* BREED */}
                    <div onClick={() => toggle("breed")} className="flex flex-row justify-between items-center mt-2">
                        <div>Breed Size</div>
                        {showFilter!=="breed" && <MdArrowDropDown />}
                        {showFilter==="breed" && <MdArrowDropUp />}
                    </div>
                    <div className={`bg-blue-200 p-2 h-auto rounded-2xl overflow-auto scrollbar-hide ${showFilter==="breed" ? "relative" : "absolute top-0 z-[-10]"} `}>
                        <CheckBoxes type="breed" chekcedList={checkedListBreed} items={items_breed} />
                    </div>

                    {/* DIET */}
                    <div onClick={() => toggle("diet")} className="flex flex-row justify-between items-center mt-2">
                        <div>Veg/Non-Veg</div>
                        {showFilter!=="diet" && <MdArrowDropDown />}
                        {showFilter==="diet" && <MdArrowDropUp />}
                    </div>
                    <div className={`bg-blue-200 p-2 h-auto rounded-2xl overflow-auto scrollbar-hide ${showFilter==="diet" ? "relative" : "absolute top-0 z-[-10]"} `}>
                        <CheckBoxes type="diet" chekcedList={checkedListDiet} items={items_diet} />
                    </div>

                    
                    {/* Brands */}
                    <div onClick={() => toggle("brands")} className="flex flex-row justify-between items-center mt-2">
                        <div>Brands</div>
                        {showFilter!=="brands" && <MdArrowDropDown />}
                        {showFilter==="brands" && <MdArrowDropUp />}
                    </div>
                    <div className={`bg-blue-200 p-2 h-[30%] rounded-2xl overflow-auto scrollbar-hide ${showFilter==="brands" ? "relative" : "absolute top-0 z-[-10]"} `}>
                        <CheckBoxes type="brands" chekcedList={checkedListBrands} items={items_brands} />
                    </div>

                    {/* Price Slider */}
                    <div onClick={()=>toggle("priceslider")} className="flex flex-row justify-between items-center mt-2">
                        <div>Price Slider</div>
                        {(showFilter!=="priceslider") && <MdArrowDropDown />}
                        {(showFilter==="priceslider") && <MdArrowDropUp />}
                    </div>
                    <div className={`bg-blue-200 p-2 h-auto rounded-2xl overflow-auto scrollbar-hide ${showFilter==="priceslider" ? "relative" : "absolute top-0 z-[-10]"} `}>
                        <PriceRange/>
                    </div>
                </div>
            </div>
        </>
    )
}

function ProductCard(props) {
    const dispatch=useDispatch();
    const userData=useSelector((state)=>state?.user?.userData)
    // const imgCounter=useSelector((state)=>state?.active?.imgCounter)
    const [imgCounter,setImgCounter]=useState(0)

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

    function addToCart(){
        /////// user is not logged in and still clicking the button add to cart
        if(!userData){ 
            //// redux add to cart will be called

        }else{      // user is logged in so backend stuff will be called
            /// backend add to cart API

        }

    }

    async function deleteProduct(){
        try{
            const res=await axios.post(`${PRODUCT_ENDPOINTS}/deleteProduct/${props.productId}`,{imgCounter:imgCounter},{withCredentials:true})
            console.log(res)

            if(imgCounter!==0) setImgCounter(imgCounter-1)
            props.setRefresh((prev) => !prev)
        }catch(error){
            console.log("wrong in delete product")
        }
    }

    return (
        // initially setting 0th product to be displayed whicle clicking on the product
        <div className="w-[250px] h-[450px] bg-white flex flex-col rounded-2xl hover:shadow-lg">
            <div className="sm:text-[13px] bg-emerald-100 h-[5%] w-[100%] rounded-t-2xl p-1">Extra <span className="font-sans">5%</span> discount , use the code <span className="font-semibold">MPSCH</span></div>
            <div className="h-[40%] w-[100%] pl-0.5 pr-0.5"><img className="h-[100%] w-[100%] object-contain" src={`http://localhost:3000/${props.imagesArray[imgCounter]}`} alt={`${props.imagesArray[imgCounter]}`} /></div>
            <div className="flex flex-col justify-evenly h-[40%] w-[100%] pl-1 pr-1">
                <div className="product-data line-clamp-3 w-[100%]">{props.productName}</div>
                <div className="price font-sans"><span className="font-sans sm:text-lg lg:text-xl">&#8377;</span>{discountCalc(props.originalPriceArray[imgCounter],props.discountArray[imgCounter])} <span className="font-sans sm:text-sm">(&#8377;{gramAmountCalc(props.originalPriceArray[imgCounter],props.discountArray[imgCounter],props.netWeightArray[imgCounter])}/100g)</span> <p><span className="line-through font-sans sm:text-sm">&#8377;{props.originalPriceArray[imgCounter]}</span> <span className="sm:text-sm">Discount {props.discountArray[imgCounter]}%</span></p></div>
                <div className="flex justify-between items-center">
                    <div className="flex flex-row gap-1 font-sans text-[10px] flex-wrap">
                        {props.netWeightArray.map((offer, index) => (
                            <div className={`border border-black flex flex-row justify-center items-center px-1 py-0.2 font-semibold cursor-pointer hover:underline ${imgCounter===index? "border-2 border-orange-400":""}`} onClick={(e)=>{
                                setImgCounter(index);
                                e.stopPropagation();
                                e.preventDefault()}}>{props.netWeightArray[index]} kg</div>
                        ))}
                    </div>
                    {userData?.email==="taher@gmail.com" && <div onClick={()=>(deleteProduct())} className="p-1 cursor-pointer hover:rounded-2xl hover:bg-gray-300"><MdOutlineDeleteOutline size={20} /></div>}
                </div>
            </div>

            <div className="flex flex-row justify-center items-center h-[15%] w-[100%] rounded-2xl">
                <button className="flex flex-row justify-center items-center w-[100%] h-[100%] bg-orange-600 rounded-b-2xl cursor-pointer text-white hover:underline" onClick={(e)=>{e.stopPropagation();e.preventDefault();addToCart()}}>Add to Cart</button>
            </div>

        </div>
    )
}

function DisplayProducts(props){
    let productDataFilter=useGetAllProduct(props.refresh,props.query,props.data);
    let productDataSearch=useGetAllProduct(props.refresh,props.query,"filter")
    const navigate=useNavigate()

    const productData = useMemo(() => {
        const combined = [...productDataFilter, ...productDataSearch];
        
        // remove duplicates (based on _id or productName)
        const unique = combined.filter(
            (item, index, self) =>
            index === self.findIndex((p) => p._id === item._id)
        );

        return unique;
    }, [productDataFilter, productDataSearch]);

    function productClicked(products){
        navigate("/singleProductDisplay",{state:products})
    }

    if(productData.length===0){
        return(
            <div>Loading...</div>
        )
    }else{
        // console.log(productData)
        // console.log(productData[0]["image"])
    
        return (
            <>
                {productData.map((products)=>{
                    return(
                        <div onClick={()=>productClicked(products)}>
                            <ProductCard imagesArray={products.image} netWeightArray={products.netWeight} originalPriceArray={products.originalPrice} discountArray={products.discountValue} productName={products.productName} productId={products._id} refresh={props.refresh} setRefresh={props.setRefresh}/>
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
    const [refresh,setRefresh]=useState(true)
    useLayoutEffect(() => {
        const windowHeight = window.innerHeight
        setProductHeight(windowHeight - headerHeight)
    }, [headerHeight])

    const location=useLocation()
    const {query,data}=location.state || {}

    return (
        <>
            <Header />
            <div className={`w-[100%] flex flex-row`} style={{ height: `${productHeight}px` }}>
                <div className="bg-blue-100  sm:w-[300px] md:w-[350px] h-[100%] overflow-auto scrollbar-hide"><Filter productHeight={productHeight} /></div>
                <div className="h-auto p-2 flex flex-row flex-wrap justify-evenly gap-x-2 gap-y-10 overflow-auto scrollbar-hide"><DisplayProducts refresh={refresh} setRefresh={setRefresh} query={query} data={data}/></div>
            </div>
            <Footer/>

        </>
    )
}