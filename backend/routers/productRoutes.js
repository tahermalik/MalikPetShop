import express from "express"
import { authenticateAdmin, findProduct ,uploadImage} from "../controllers/middleware.js";
import { addProduct, deleteProduct, displayProduct } from "../controllers/productController.js";

const pRouter=express.Router();
console.log("in this productRouters")
pRouter.post("/addProduct",uploadImage().single("image"),(req,res)=>addProduct(req,res))
pRouter.post("/deleteProduct/:id",(req,res)=>deleteProduct(req,res))
pRouter.post("/displayProduct",(req,res)=>displayProduct(req,res))
export default pRouter