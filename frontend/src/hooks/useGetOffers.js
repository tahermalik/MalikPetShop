import axios from "axios";
import { useEffect, useState } from "react";
import { OFFER_ENDPOINTS } from "../pages/endpoints";

export function useGetOffer(){
    const [offer,setOffer]=useState()

    useEffect(()=>{
        async function fetchOffer(){
            try{
                const res=await axios.get(`${OFFER_ENDPOINTS}/getOffer`)
                setOffer(res.data.offers)
            }catch(error){
                console.log("wrong in fetching the offers")
            }
        }
        fetchOffer()
    },[])

    return offer
} 