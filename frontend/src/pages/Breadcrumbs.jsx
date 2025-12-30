import { useLocation } from "react-router-dom";
import { BASE_URL } from "./endpoints";

export function Breadcrumbs() {
    const linksObj = {
        "Home":`${BASE_URL}`,
    }

    const location = useLocation();
    const pathString = location.pathname;
    const pathArray = pathString.split("/");
    let pathArrayLength = pathArray.length;

    if (pathArray[pathArrayLength - 1] === "") {
        pathArray.pop();
        pathArrayLength -= 1;
    }
    pathArray[0] = "Home";

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
                                onClick={(e)=>{linksObj[item]}}
                                className="
                                text-sm font-semibold
                                text-blue-700
                                cursor-default
                                "
                            >
                                {item}
                            </div>
                        ) : (
                            <div
                                className="
                  text-sm font-medium
                  text-blue-500
                  cursor-pointer
                  hover:text-blue-700
                  transition-colors duration-200
                "
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
