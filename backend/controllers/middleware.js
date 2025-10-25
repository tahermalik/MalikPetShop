import jwt from "jsonwebtoken";
import Product from "../schema/productSchema.js";
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