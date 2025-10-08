import express from "express";
import dotenv from "dotenv";   // if using ES modules
import router from "./routers/userRoutes.js";
import { connectDB } from "./database/database.js";
import cookieParser from "cookie-parser";


const app=express();
dotenv.config({
    path:"../.env"
})
connectDB()

/// to parse the HTTP request
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())




app.listen(process.env.PORT_NUM,()=>console.log(`${process.env.PORT_NUM}`))

app.use("/user",router)

