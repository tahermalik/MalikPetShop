import express from "express"
import { login, register ,logout} from "../controllers/userController.js";
import { authenticate } from "../controllers/middleware.js";

const uRouter=express.Router();
console.log("in this userRouters")
uRouter.post("/login",(req,res)=>login(req,res))
uRouter.post("/register",(req,res)=>register(req,res))
uRouter.get("/logout",(req,res,next)=>authenticate(req,res,next),(req,res)=>logout(req,res))
export default uRouter