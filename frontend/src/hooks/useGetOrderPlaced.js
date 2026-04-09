import axios from "axios";
import { useEffect, useState } from "react";
import { ORDER_ENDPOINTS } from "../pages/endpoints";
import socket from "../socket";

export function useGetOrderPlaced(){
    const [orderData,setOrderData]=useState([])

    // console.log("inside custom hook")
    useEffect(()=>{
        async function getAllOrderPlaced(){
            try{
                const res=await axios.post(`${ORDER_ENDPOINTS}/getAllPlacedOrder`,{},{withCredentials:true})
                console.log("order",res)
                setOrderData(res?.data?.orderData)
            }catch(error){
                console.log("error in custom hook useGetOrderPlaced",error)
            }
        }
        getAllOrderPlaced();
        
        // console.log("Taher Malik",orderData)
        // ✅ Real-time updates (Socket)
        /// listens for the response from the server
        socket.on("order_update", (newOrder) => {
            console.log("Real-time order:", newOrder);

            // update state
            setOrderData((prev) => [newOrder, ...prev]);
        });

        return () => {
            socket.off("order_update"); // cleanup
        };

    },[])
    return orderData
}