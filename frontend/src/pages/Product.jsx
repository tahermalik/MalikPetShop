import { Outlet } from "react-router-dom"
import { Header ,Footer} from "./LandingPage"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setBrands, setBreed, setDiet, setFlavor, setPets } from "../redux/slices/filterSlice"
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md"
import { Range } from "react-range";

function CheckBoxes(props) {
    const dispatch = useDispatch();
    function handleChange(item) {
        if (props.type === "flavor") dispatch(setFlavor(item))
        else if (props.type === "breed") dispatch(setBreed(item))
        else if (props.type === "diet") dispatch(setDiet(item))
        else if (props.type === "pettypes") dispatch(setPets(item))
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
export const items_pets = ["cat", "dog", "bird", "hamster", "other"]
export const items_brands = ["grain zero", "pedigree", "smart heart", "whiskas", "meo", "purepet", "drools", "chappi", "sense", "royal canin", "maxi"]
function Filter() {

    const chekcedList = useSelector((state) => state?.filter?.flavorFilter)
    const checkedListBreed = useSelector((state) => state?.filter?.breedFilter)
    const checkedListDiet = useSelector((state) => state?.filter?.diet)
    const checkedListPets = useSelector((state) => state?.filter?.pets)
    const checkedListBrands = useSelector((state) => state?.filter?.brands)


    const [showFilter,setShowFilter]=useState("flavor")
    const [filterToggle,setFilterToggle]=useState(false)

    function toggle(type) {
        if(filterToggle || type!==showFilter){
            if (type === "flavor") setShowFilter("flavor")
            else if (type === "breed") setShowFilter("breed")
            else if (type === "diet") setShowFilter("diet")
            else if (type === "pettypes") setShowFilter("pettypes")
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

                    {/* PET TYPES */}
                    <div onClick={() => toggle("pettypes")} className="flex flex-row justify-between items-center mt-2">
                        <div>Pet Types</div>
                        {showFilter!=="pettypes" && <MdArrowDropDown />}
                        {showFilter==="pettypes" && <MdArrowDropUp />}
                    </div>
                    <div className={`bg-blue-200 p-2 h-auto rounded-2xl overflow-auto scrollbar-hide ${showFilter==="pettypes" ? "relative" : "absolute top-0 z-[-10]"} `}>
                        <CheckBoxes type="pettypes" chekcedList={checkedListPets} items={items_pets} />
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

export default function Product() {
    const headerHeight = useSelector((state) => state?.layout?.headerHeight)
    const [productHeight, setProductHeight] = useState(0);
    useLayoutEffect(() => {
        const windowHeight = window.innerHeight
        setProductHeight(windowHeight - headerHeight)
    }, [headerHeight])
    return (
        <>
            <Header />
            <div className={`w-[100%] flex flex-row`} style={{ height: `${productHeight}px` }}>
                <div className="bg-blue-100  sm:w-[300px] md:w-[350px] h-[100%] overflow-auto scrollbar-hide"><Filter productHeight={productHeight} /></div>
                <div className="h-auto p-2 flex flex-row flex-wrap justify-evenly gap-x-2 gap-y-10 overflow-auto scrollbar-hide"><Outlet /></div>
            </div>
            <Footer/>

        </>
    )
}