import jwt from "jsonwebtoken";
import Product from "../schema/productSchema.js";
import multer from "multer";
import path from "path";
import fs from "fs";

export async function authenticate(req,res,next){
    try{
        const token=req.cookies?.token;
        // console.log("token",token)
        if(!token){
            return res.status(401).json({message:"No token found"})
        }
        
        const data= await jwt.verify(token, process.env.JWT_SECRET)
        req.user=data
        next()
    }catch(error){
        console.log(error,"something went wrong in middleware")
        return res.status(500).json({message:"something went wrong at the server side"})
    }
}

export async function findProduct(req,res,next){
    try{
        //// find the product to update
        let {name,company,netWeight}=req.body;
        netWeight=Number(netWeight)

        const product_db=await Product.findOne({name:name,netWeight:netWeight,company:company})
        // console.log(name,company,netWeight)
        if(!product_db){
            return res.status(404).json({message:"Product not found"})
        }

        //// if the product is there then ask for the changes

        next();
    }catch(error){
        console.log("wrong in findProduct",error);
        return res.status(500).json({message:"Something went wrong at server side in findProduct"})
    }

}

export async function authenticateAdmin(req,res,next){
    try{
        console.log("Inside authenticate admin")
        const token=req.cookies?.token;
        if(!token){
            return res.status(401).json({message:"No token found"})
        }
        
        const data= await jwt.verify(token, process.env.JWT_SECRET)

        if(data["role"]!=="admin") return res.status(400).json({message:"Only admin can perform this operation"})
        req.user=data
        next()
    }catch(error){
        console.log(error,"something went wrong in middleware")
        return res.status(500).json({message:"something went wrong at the server side"})
    }
}

export function uploadImage(){
    try{
        // Ensure uploads folder exists
        const uploadPath = "uploads/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, uploadPath); // save files inside /uploads folder
            },
            filename: (req, file, cb) => {
                // Extract fields from form data
                const brand = req.body.brand ? req.body.brand.trim().replace(/\s+/g, "_") : "unknownBrand";
                const productName = req.body.productName ? req.body.productName.trim().replace(/\s+/g, "_") : "unknownProduct";
                const netWeight = req.body.netWeight ? req.body.netWeight.toString().trim().replace(/\s+/g, "_") : "unknownWeight";

                // Construct clean filename
                const fileName = `${brand}_${productName}_${netWeight}${path.extname(file.originalname)}`;

                cb(null, fileName);
            },
        });

        return multer({storage})

    }catch(error){
        console.log("wrong in uploadImage");
        return res.status(500).json({maessage:"Image not uploaded"})
    }
}