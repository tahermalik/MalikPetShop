import express from "express"
import { login, register ,logout, viewCompanyFood, viewFood, addCart, placeOrder,createFeedBack,displayFeedBack, favourite, viewWishList, forgotPassword, verifyOTP, resetPassword,setAddress} from "../controllers/userController.js";
import { authenticate } from "../controllers/middleware.js";

const uRouter=express.Router();
console.log("in this userRouters")
uRouter.post("/login/:role",(req,res)=>login(req,res))
uRouter.post("/register",(req,res)=>register(req,res))
uRouter.get("/logout",(req,res,next)=>authenticate(req,res,next),(req,res)=>logout(req,res))
uRouter.post("/viewCompanyFood",(req,res)=>viewCompanyFood(req,res))
uRouter.post("/viewFood",(req,res)=>viewFood(req,res))

/// forgot password
uRouter.post("/forgotPassword",(req,res)=>forgotPassword(req,res))
uRouter.post("/verifyOTP",(req,res)=>verifyOTP(req,res))
uRouter.post("/resetPassword",(req,res)=>resetPassword(req,res))

/// wishList Routes
uRouter.post("/favourite",(req,res)=>favourite(req,res))
uRouter.get("/viewWishList/:id",(req,res)=>viewWishList(req,res))

/// cart routes
uRouter.put("/addCart/:id",(req,res,next)=>authenticate(req,res,next),(req,res)=>addCart(req,res))
uRouter.put("/placeOrder",(req,res,next)=>authenticate(req,res,next),(req,res)=>placeOrder(req,res))

/// feedback routes
uRouter.post("/createFeedBack/:id",(req,res)=>createFeedBack(req,res))
uRouter.get("/displayFeedBack",(req,res)=>displayFeedBack(req,res))

/// address routes
uRouter.post("/setAddress",(req,res)=>setAddress(req,res))
export default uRouter