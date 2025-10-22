import express from "express"
import { couponUsage, deleteCoupon, setCoupons, viewCoupons } from "../controllers/couponController.js";
import { authenticateAdmin } from "../controllers/middleware.js";

const cRouter=express.Router();
console.log("in this CoupanRouters")
cRouter.post("/viewCoupons",(req,res)=>viewCoupons(req,res))
cRouter.post("/setCoupons",(req,res,next)=>authenticateAdmin(req,res,next),(req,res)=>setCoupons(req,res))
cRouter.delete("/deleteCoupons/:id",(req,res,next)=>authenticateAdmin(req,res,next),(req,res)=>deleteCoupon(req,res))
cRouter.get("/couponUsage/:id",(req,res)=>couponUsage(req,res))
export default cRouter