import express from "express"
import { authenticate, findProduct } from "../controllers/middleware.js";
import { addProduct, deleteProduct, updateProduct } from "../controllers/productController.js";

const pRouter=express.Router();
console.log("in this productRouters")
pRouter.post("/addProduct",(req,res,next)=>authenticate(req,res,next),(req,res)=>addProduct(req,res))
pRouter.delete("/deleteProduct",(req,res,next)=>authenticate(req,res,next),(req,res)=>deleteProduct(req,res))
pRouter.put("/updateProduct",(req,res,next)=>authenticate(req,res,next),(req,res,next)=>findProduct(req,res,next),(req,res)=>updateProduct(req,res))
export default pRouter