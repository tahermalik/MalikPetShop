import express from "express"
import { authenticate } from "../controllers/middleware.js";
import { addToCart, removerCartItem ,getCartItems, getProductQuantityViaUserId, updateCart} from "../controllers/cartController.js";


const cartRouter=express.Router();
console.log("in this cartRoutes")

cartRouter.post("/addToCart",(req,res)=>addToCart(req,res))
cartRouter.get("/getCartItems/:userId",(req,res)=>getCartItems(req,res))
cartRouter.post("/removeCartItem",(req,res)=>removerCartItem(req,res))
cartRouter.post("/getProductQuantityViaUserId",(req,res)=>getProductQuantityViaUserId(req,res))
cartRouter.post("/updateCart",(req,res)=>updateCart(req,res))

export default cartRouter