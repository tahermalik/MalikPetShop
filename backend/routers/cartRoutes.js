import express from "express"
import { addToCart, removerCartItem ,getCartItems, getProductQuantityViaUserId, updateCart} from "../controllers/cartController.js";
import { userGuest } from "../middleware/userGuest.js";


const cartRouter=express.Router();
console.log("in this cartRoutes")

cartRouter.post("/addToCart",(req,res,next)=>userGuest(req,res,next),(req,res)=>addToCart(req,res))
cartRouter.get("/getCartItems",(req,res,next)=>userGuest(req,res,next),(req,res)=>getCartItems(req,res))
cartRouter.post("/removeCartItem",(req,res,next)=>userGuest(req,res,next),(req,res)=>removerCartItem(req,res))
cartRouter.post("/getProductQuantityViaUserId",(req,res)=>getProductQuantityViaUserId(req,res))
cartRouter.post("/updateCart",(req,res,next)=>userGuest(req,res,next),(req,res)=>updateCart(req,res))

export default cartRouter