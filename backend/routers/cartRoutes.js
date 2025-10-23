import express from "express"
import { authenticate } from "../controllers/middleware.js";
import { addToCart, removerCartItemLogin } from "../controllers/cartController.js";


const cartRouter=express.Router();
console.log("in this cartRoutes")

cartRouter.get("/addToCart/:id",(req,res,next)=>authenticate(req,res,next),(req,res)=>addToCart(req,res))
cartRouter.delete("/removeCartItem/:id",(req,res,next)=>authenticate(req,res,next),(req,res)=>removerCartItemLogin(req,res))
export default cartRouter