import express from "express"
import { authenticateAdmin, findProduct ,uploadImage} from "../controllers/middleware.js";
import { addProduct, bulkProductAddition, deleteProduct, displayProduct,getProductsViaIds } from "../controllers/productController.js";

const pRouter=express.Router();
console.log("in this productRouters")
pRouter.post("/addProduct",uploadImage().single("image"),(req,res)=>addProduct(req,res))
pRouter.post("/deleteProduct/:id",(req,res)=>deleteProduct(req,res))
pRouter.post("/displayProduct",(req,res)=>displayProduct(req,res))
pRouter.post("/getProductsViaId",(req,res)=>getProductsViaIds(req,res))

pRouter.post("/bulkAddition",(req,res)=>bulkProductAddition(req,res))
export default pRouter