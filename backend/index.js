import express from "express";
import dotenv from "dotenv";   // if using ES modules
const app=express();

dotenv.config();


app.listen(process.env.PORT_NUM,()=>console.log(`${process.env.PORT_NUM}`))

