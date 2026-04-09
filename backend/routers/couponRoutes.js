import express from "express"
import { getCoupon, selectCoupon, setCoupons, viewCoupons } from "../controllers/couponController.js";
import { userGuest } from "../middleware/userGuest.js";

const cRouter=express.Router();
console.log("in this CoupanRouters")
cRouter.post("/viewCoupons",(req,res,next)=>userGuest(req,res,next),(req,res)=>viewCoupons(req,res))
cRouter.post("/setCoupons",(req,res)=>setCoupons(req,res))
cRouter.post("/selectCoupon",(req,res,next)=>userGuest(req,res,next),(req,res)=>selectCoupon(req,res))
cRouter.get("/getCoupon",(req,res,next)=>userGuest(req,res,next),(req,res)=>getCoupon(req,res))
export default cRouter