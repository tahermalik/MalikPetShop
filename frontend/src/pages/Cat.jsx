import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useState } from "react";


function CatProduct(props) {
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

    return (
        // initially setting 0th product to be displayed whicle clicking on the product
        <div className="w-[250px] h-[450px] bg-white flex flex-col rounded-2xl hover:shadow-lg">
            <div className="sm:text-[13px] bg-emerald-100 h-[5%] w-[100%] rounded-t-2xl p-1">Extra <span className="font-sans">5%</span> discount , use the code <span className="font-semibold">MPSCH</span></div>
            <div className="h-[40%] w-[100%]"><img className="h-[100%] w-[100%] object-contain" src={`/${props.imagesArray[imgCounter]}`} alt={`${props.imagesArray[imgCounter]}`} /></div>
            <div className="flex flex-col justify-evenly h-[40%] w-[100%]">
                <div className="product-data line-clamp-3 w-[100%]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, dolores.</div>
                <div className="price font-sans"><span className="font-sans sm:text-lg lg:text-xl">&#8377;</span>{discountCalc(props.originalPriceArray[imgCounter],props.discountArray[imgCounter])} <span className="font-sans sm:text-sm">(&#8377;{gramAmountCalc(props.originalPriceArray[imgCounter],props.discountArray[imgCounter],props.netQuantityArray[imgCounter])}/100g)</span> <p><span className="line-through font-sans sm:text-sm">&#8377;{props.originalPriceArray[imgCounter]}</span> <span className="sm:text-sm">Discount {props.discountArray[imgCounter]}%</span></p></div>
                <div className="flex flex-row gap-1 font-sans text-[10px]">
                    {props.netQuantityArray.map((offer, index) => (
                        <div className={`border border-black flex flex-row justify-center items-center px-1 py-0.2 font-semibold cursor-pointer hover:underline ${imgCounter===index? "border-2 border-orange-400":""}`} onClick={(e)=>{
                            setImgCounter(index);
                            e.stopPropagation();
                            e.preventDefault()}}>{props.netQuantityArray[index]} kg</div>
                    ))}
                </div>
            </div>

            <div className="flex flex-row justify-center items-center h-[15%] w-[100%] rounded-2xl">
                <button className="flex flex-row justify-center items-center w-[100%] h-[100%] bg-orange-600 rounded-b-2xl cursor-pointer text-white hover:underline" onClick={(e)=>{e.stopPropagation();e.preventDefault();addToCart()}}>Add to Cart</button>
            </div>

        </div>
    )
}
export default function Cat() {

    /// this is the array which we are going to recevice via backend by using axios
    const netQuantityArray = ["2", "4", "7", "15", "20"]; /// receving in Kg
    const originalPriceArray = ["200", "300", "400", "500", "600"];
    const discountArray = ["10", "5", "15", "20", "10"]
    const imagesArray = ["pedigree.jpg", "photo_21.jpg", "smartheart.jpg", "whiskas_product.jpg", "whiskas.jpg"]


    return (
        <>
            <Link to="/ProductDisplay"><CatProduct imagesArray={imagesArray} netQuantityArray={netQuantityArray} originalPriceArray={originalPriceArray} discountArray={discountArray}/></Link>
            <CatProduct imagesArray={imagesArray} netQuantityArray={netQuantityArray} originalPriceArray={originalPriceArray} discountArray={discountArray}/>
            <CatProduct imagesArray={imagesArray} netQuantityArray={netQuantityArray} originalPriceArray={originalPriceArray} discountArray={discountArray}/>
            <CatProduct imagesArray={imagesArray} netQuantityArray={netQuantityArray} originalPriceArray={originalPriceArray} discountArray={discountArray}/>
            <CatProduct imagesArray={imagesArray} netQuantityArray={netQuantityArray} originalPriceArray={originalPriceArray} discountArray={discountArray}/>
            <CatProduct imagesArray={imagesArray} netQuantityArray={netQuantityArray} originalPriceArray={originalPriceArray} discountArray={discountArray}/>
            <CatProduct imagesArray={imagesArray} netQuantityArray={netQuantityArray} originalPriceArray={originalPriceArray} discountArray={discountArray}/>
            <CatProduct imagesArray={imagesArray} netQuantityArray={netQuantityArray} originalPriceArray={originalPriceArray} discountArray={discountArray}/>
        </>
    )
}