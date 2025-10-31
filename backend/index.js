import express from "express";
import dotenv from "dotenv";   // if using ES modules
import { connectDB } from "./database/database.js";
import cookieParser from "cookie-parser";
import uRouter from "./routers/userRoutes.js";
import pRouter from "./routers/productRoutes.js";
import feedbackRouter from "./routers/feedbackRoutes.js";
import cRouter from "./routers/couponRoutes.js";
import cors from "cors";
import cron from "node-cron";
import Coupon from "./schema/couponSchema.js";
import cartRouter from "./routers/cartRoutes.js";
import { fileURLToPath } from "url";
import path from "path"
import offerRouter from "./routers/offerRoutes.js";


const app=express();
app.use(cors({
  origin: "http://localhost:5173",  // your React frontend URL
  credentials: true                 // if you use cookies or auth
}));

// ✅ Serve static images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

dotenv.config({
    path:"../.env"
})

//// establishing the connection to the DB
connectDB()


///// deleting the expired coupons and expired offer
cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const resultCoupon = await Coupon.deleteMany({
      couponEndDate: { $lt: now } // expired coupons
    });

    const resultOffer=await Offer.deleteMany({
      offerEndDate:{$lt:now} // expired offer
    })



    if (resultCoupon.deletedCount > 0) {
      console.log(`🧹 Deleted ${resultCoupon.deletedCount} expired coupons at ${now.toISOString()}`);
    }

    if (resultOffer.deletedCount > 0) {
      console.log(`🧹 Deleted ${resultOffer.deletedCount} expired offer at ${now.toISOString()}`);
    }
  } catch (error) {
    console.error("Error deleting expired coupons or offer:", error);
  }
});


/// to parse the HTTP request
app.use(express.urlencoded({extended:true}));

//// if the data is sent in json format
app.use(express.json());
app.use(cookieParser())




app.listen(process.env.PORT_NUM,()=>console.log(`${process.env.PORT_NUM}`))

app.use("/user",uRouter)
app.use("/product",pRouter)
app.use("/feedback",feedbackRouter)
app.use("/coupon",cRouter)
app.use("/cart",cartRouter)
app.use("/offer",offerRouter)



