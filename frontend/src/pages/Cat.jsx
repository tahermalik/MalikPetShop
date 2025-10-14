function CatProduct() {
    return (
        <div className="w-[250px] h-[450px] bg-white flex flex-col rounded-2xl">
            <div className="sm:text-[13px] bg-blue-200 h-[5%] w-[100%] rounded-t-2xl p-1">Extra <span className="font-sans">5%</span> discount , use the code <span className="font-semibold">MPSCH</span></div>
            <div className="h-[40%] w-[100%] border-t border-b border-black"><img className="h-[100%] w-[100%] object-contain" src="/whiskas_product.jpg" alt="whiskas_img" /></div>
            <div className="flex flex-col justify-evenly h-[40%] w-[100%] border-b border-black p-1">
                <div className="product-data line-clamp-3 w-[100%]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, dolores.</div>
                <div className="price font-sans"><span className="font-sans sm:text-lg lg:text-xl">&#8377;1234</span> <span className="font-sans sm:text-sm">(&#8377;21/100g)</span> <p><span className="line-through font-sans sm:text-sm">&#8377;2000</span> <span className="sm:text-sm">Discount 10%</span></p></div>
                <div className="flex flex-row gap-1 font-sans text-[10px]">
                    <div className="border border-black flex flex-row justify-center items-center px-1 py-0.2 font-semibold cursor-pointer hover:underline">1 kg</div>
                    <div className="border border-black flex flex-row justify-center items-center px-1 py-0.2 font-semibold cursor-pointer hover:underline">2 kg</div>
                    <div className="border border-black flex flex-row justify-center items-center px-1 py-0.2 font-semibold cursor-pointer hover:underline">3 kg</div>
                </div>
            </div>

            <div className="flex flex-row justify-center items-center h-[15%] w-[100%] rounded-2xl">
                <button className="flex flex-row justify-center items-center w-[100%] h-[100%] bg-blue-800 rounded-b-2xl cursor-pointer text-white hover:underline">Add to Cart</button>
            </div>

        </div>
    )
}
export default function Cat() {
    return (
        <>
            <CatProduct/>
            <CatProduct/>
            <CatProduct/>
            <CatProduct/>
            <CatProduct/>
            <CatProduct/>
            <CatProduct/>
            <CatProduct/>
            <CatProduct/>

        </>
    )
}