import express from "express"
import { selectCoupon, setCoupons, viewCoupons } from "../controllers/couponController.js";
import { authenticateAdmin } from "../controllers/middleware.js";

const cRouter=express.Router();
console.log("in this CoupanRouters")
cRouter.post("/viewCoupons",(req,res)=>viewCoupons(req,res))
cRouter.post("/setCoupons",(req,res)=>setCoupons(req,res))
cRouter.post("/selectCoupon",(req,res)=>selectCoupon(req,res))
export default cRouter