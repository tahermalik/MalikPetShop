import express from "express"
import { authenticateAdmin, findProduct} from "../controllers/middleware.js";
import { addProduct, bulkProductAddition, deleteProduct, displayProduct,generateSitMap,getProductHTMLFile,getProductsViaIds ,getProductData} from "../controllers/productController.js";
import { upload } from "../config/cloudinary.js";
import {userGuest} from "../middleware/userGuest.js"


const pRouter=express.Router();
console.log("in this productRouters")
pRouter.post("/addProduct",upload.single("image"),(req,res)=>addProduct(req,res))
pRouter.post("/deleteProduct/:id",(req,res)=>deleteProduct(req,res))
pRouter.post("/displayProduct",(req,res,next)=>userGuest(req,res,next),(req,res)=>displayProduct(req,res))
pRouter.post("/getProductsViaId",(req,res)=>getProductsViaIds(req,res))
pRouter.get("/singleProduct/:id",(req,res)=>getProductHTMLFile(req,res))
pRouter.post("/singleProductDisplay/:id",(req,res)=>getProductData(req,res))
pRouter.get("/generateSiteMap",(req,res)=>generateSitMap(req,res))

pRouter.post("/bulkAddition",upload.array("image"),(req,res)=>bulkProductAddition(req,res))
export default pRouter