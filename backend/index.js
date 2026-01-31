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
import Offer from "./schema/offerSchema.js";
import ForgotPassword from "./schema/forgotPassword.js";
import Product from "./schema/productSchema.js";
import Cart from "./schema/cartSchema.js";


const app=express();
app.use(cors({
  origin:[ "http://localhost:5173","https://malikpetshop.onrender.com"],  // your React frontend URL

  credentials: true,                 // if you use cookies or auth
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // allowed methods
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"] // allowed headers
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


///// deleting the expired coupons, offers & OTP
cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const resultCoupon = await Coupon.deleteMany({
      couponEndDate: { $lt: now } // expired coupons
    });

    const resultOffer=await Offer.deleteMany({
      offerEndDate:{$lt:now} // expired offer
    })

    const resultOTP=await ForgotPassword.deleteMany({
      expiryDate:{$lt:now} /// expired OTP
    })

    if (resultCoupon.deletedCount > 0) {
      console.log(`🧹 Deleted ${resultCoupon.deletedCount} expired coupons at ${now.toISOString()}`);
    }

    if (resultOffer.deletedCount > 0) {
      console.log(`🧹 Deleted ${resultOffer.deletedCount} expired offer at ${now.toISOString()}`);
    }

    if (resultOTP.deletedCount > 0) {
      console.log(`🧹 Deleted ${resultOTP.deletedCount} expired OTP at ${now.toISOString()}`);
    }
  } catch (error) {
    console.error("Error deleting expired coupons or offer or OTP:", error);
  }
});

//// cron for the product's presence expiry
// cron.schedule("*/5 * * * *", async () => {
//   try {
//     const now = new Date();
//     const RESERVATION_PERIOD = 30 * 60 * 1000; // 30 min

//     const carts = await Cart.find({
//       "products.reservedAt": { $lt: new Date(now - RESERVATION_PERIOD) }
//     });

//     for (const cart of carts) {
//       let updated = false;

//       for (let i = cart.products.length - 1; i >= 0; i--) {
//         const item = cart.products[i];
//         if (now - item.reservedAt > RESERVATION_PERIOD) {
//           await Product.updateOne(
//             { _id: item.productId },
//             { $inc: { [`reservedStock.${item.productVariation}`]: -item.productQuantity } }
//           );

//           cart.products.splice(i, 1);
//           updated = true;
//         }
//       }

//       if (updated) await cart.save();
//     }

//     console.log("✅ Released expired cart reservations");
//   } catch (error) {
//     console.error("Error releasing expired reservations:", error);
//   }
// });

//// cron for the cart that has no products in it
cron.schedule("*/30 * * * *", async () => {
  try {
    const THRESHOLD = new Date(Date.now() - 15 * 60 * 1000);

    await Cart.deleteMany({
      guestId: { $exists: true },
      products: { $size: 0 },
      updatedAt: { $lt: THRESHOLD }
    });
    
    console.log("✅ Released empty carts");
  } catch (error) {
    console.error("Error releasing empty carts:", error);
  }
});

/// to parse the HTTP request
app.use(express.urlencoded({extended:true}));

//// if the data is sent in json format
app.use(express.json());
app.use(cookieParser())






app.get("/",(req,res)=>{
  res.status(200).json({ message: "Backend is working 🚀" });
})
app.use("/user",uRouter)
app.use("/product",pRouter)
app.use("/feedback",feedbackRouter)
app.use("/coupon",cRouter)
app.use("/cart",cartRouter)
app.use("/offer",offerRouter)
app.use("/demo",uRouter)

app.listen(process.env.PORT_NUM,()=>console.log(`${process.env.PORT_NUM}`))


