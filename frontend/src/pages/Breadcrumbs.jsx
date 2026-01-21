import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";


export function Breadcrumbs() {
    const navigate=useNavigate()
    const location = useLocation();
    const pathString = location.pathname;
    const pathArray = pathString.split("/");
    const pathArrayLength=pathArray.length;

    if(pathArray[pathArrayLength-1]==="") pathArray.pop()
    pathArray[0]="Home"

    // to set the product name
    
    
    const product=useSelector((state)=>state?.product?.completeProductInfo)
    for(let i=0;i<pathArray.length;i++) {
        if(pathArray[i]==="SingleProductDisplay") pathArray[i]=product?.cleanProductName
    }

    function itemClicked(e,index,pathArray){
        try{
            e.preventDefault();
            let requestedPath="";
            if(index===0){
                navigate("/");
            }else{
                requestedPath=""
                for(let i=1;i<index;i++) requestedPath+=(pathArray[i]+"/")
                // console.log(index, requestedPath,"   Taher")
                if(pathArray[index]==="Wish_List") navigate(`/${requestedPath}${pathArray[index]}`, { state: { userId: userId } })
                else if(pathArray[index]==="Cart") navigate(`/${requestedPath}${pathArray[index]}`, { state: { userId: userId } })
                else if(pathArray[index]===product?.cleanProductName) navigate(`/${requestedPath}SingleProductDisplay`, { state:product  })
                else navigate(`/${requestedPath}${pathArray[index]}`)
            }
        }catch(error){
            console.log("Sorry some error occurred",error)

        }
    }

    return (
        <div className="w-full px-6 py-4">
            <div
                className="
          flex items-center gap-2
          bg-white
          px-5 py-3
          shadow-md hover:shadow-lg
          transition-all duration-300
          animate-breadcrumb
        "
            >
                {pathArray.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {/* Breadcrumb Item */}
                        {index === pathArrayLength - 1 ? (
                            <div
                                className="text-sm font-semibold text-blue-700 cursor-default"
                            >
                                {item}
                            </div>
                        ) : (
                            <div
                                onClick={(e)=>itemClicked(e,index,pathArray)}
                                className="text-sm font-medium text-blue-500 cursor-pointer
                                hover:text-blue-700 transition-colors duration-200"
                            >
                                {item}
                            </div>
                        )}

                        {/* Separator */}
                        {index !== pathArrayLength - 1 && (
                            <span className="text-blue-300 text-sm">&gt;</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
