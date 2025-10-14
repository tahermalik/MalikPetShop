import { Outlet } from "react-router-dom"
import { Header } from "./LandingPage"
import { useLayoutEffect } from "react"

function Filter(){
    return(
        <>
        This is the filer component
        </>
    )
}
export default function Product(){
    return(
        <>
            <Header/>
            <div className="w-[100%] h-auto flex flex-row">
                <div className="bg-emerald-400 w-[20%] h-auto"><Filter/></div>
                <div className="bg-blue-300 w-[80%] h-auto p-2 flex flex-row flex-wrap justify-evenly gap-y-10"><Outlet/></div>
            </div>
            
            
        </>
    )
}