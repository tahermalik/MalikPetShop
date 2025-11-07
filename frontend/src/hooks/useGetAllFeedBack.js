import axios from "axios";
import { useEffect, useState } from "react";
import { USER_ENDPOINTS } from "../pages/endpoints";

export function useGetAllFeedBack(feedBackRefresh){
    const [feedBackData,setFeedBackData]=useState([])
    useEffect(()=>{
        async function getAllFeedBack(){
            const res=await axios.get(`${USER_ENDPOINTS}/displayFeedBack`)
            setFeedBackData(res?.data?.feedBackData)
        }
        getAllFeedBack();

    },[feedBackRefresh])
    return feedBackData
}