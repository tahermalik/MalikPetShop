import express from "express"
import { createOffer, displayOffer } from "../controllers/offerController.js";


const offerRouter=express.Router();
console.log("in this offer router")

offerRouter.post("/createOffer",(req,res)=>createOffer(req,res))
offerRouter.get("/getOffer",(req,res)=>displayOffer(req,res))

export default offerRouter