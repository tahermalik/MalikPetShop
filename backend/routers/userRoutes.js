import express from "express"
import { login, register } from "../controllers/userController.js";

const router=express.Router();
console.log("in this userRouters")
router.post("/login",(req,res)=>login(req,res))
router.post("/register",(req,res)=>register(req,res))
export default router