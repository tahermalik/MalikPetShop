import express from "express"
import { authenticate } from "../controllers/middleware.js";
import { addToCart, removerCartItem ,getCartItems, mergeCartItemsAppCall} from "../controllers/cartController.js";


const cartRouter=express.Router();
console.log("in this cartRoutes")

cartRouter.post("/addToCart",(req,res)=>addToCart(req,res))
cartRouter.get("/getCartItems/:userId",(req,res)=>getCartItems(req,res))
cartRouter.post("/mergeCartItemsAppCall",(req,res)=>mergeCartItemsAppCall(req,res));
cartRouter.post("/removeCartItem",(req,res)=>removerCartItem(req,res))

export default cartRouter