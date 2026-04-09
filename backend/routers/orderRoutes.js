import express from "express"
import { userGuest } from "../middleware/userGuest.js";
import { getAllPlacedOrder } from "../controllers/orderController.js";



const orderRouter=express.Router();
console.log("in this orderRoutes")

orderRouter.post("/getAllPlacedOrder",(req,res,next)=>userGuest(req,res,next),(req,res)=>getAllPlacedOrder(req,res))
// orderRouter.get("/getAllPlacedOrder",(req,res)=>getAllPlacedOrder(req,res))




export default orderRouter