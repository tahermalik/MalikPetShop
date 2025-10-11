import express from "express"
import { authenticate } from "../controllers/middleware.js";
import { createFeedBack, deleteFeedBack, viewFeedBack, viewFeedBackLogin } from "../controllers/feedbackController.js";

const feedbackRouter=express.Router();
console.log("in this feedbackRouters")
feedbackRouter.post("/create_feedback",(req,res,next)=>authenticate(req,res,next),(req,res)=>createFeedBack(req,res))
feedbackRouter.get("/viewFeedBack",(req,res)=>viewFeedBack(req,res)) // without login
feedbackRouter.get("/viewFeedBackLogin/:id",(req,res)=>viewFeedBackLogin(req,res)) // with login
feedbackRouter.delete("/deleteFeedBack/:id",(req,res,next)=>authenticate(req,res,next),(req,res)=>deleteFeedBack(req,res))


export default feedbackRouter