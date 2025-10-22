import express from "express"
import { login, register ,logout, viewCompanyFood, viewFood, addCart, addWhishList, placeOrder} from "../controllers/userController.js";
import { authenticate } from "../controllers/middleware.js";

const uRouter=express.Router();
console.log("in this userRouters")
uRouter.post("/login/:role",(req,res)=>login(req,res))
uRouter.post("/register",(req,res)=>register(req,res))
uRouter.get("/logout",(req,res,next)=>authenticate(req,res,next),(req,res)=>logout(req,res))
uRouter.post("/viewCompanyFood",(req,res)=>viewCompanyFood(req,res))
uRouter.post("/viewFood",(req,res)=>viewFood(req,res))

uRouter.put("/addWishList/:id",(req,res,next)=>authenticate(req,res,next),(req,res)=>addWhishList(req,res))
uRouter.put("/addCart/:id",(req,res,next)=>authenticate(req,res,next),(req,res)=>addCart(req,res))
uRouter.put("/placeOrder",(req,res,next)=>authenticate(req,res,next),(req,res)=>placeOrder(req,res))
export default uRouter