import User from "../schema/userSchema.js";
import jwt from "jsonwebtoken";

export async function auth(req,res,next){
    try{
        const token=req?.cookies?.token

        if(token===undefined) return res.status(404).json({message:"User need to Login First",comment:"Login Needed"})

        const secret_key=process.env.JWT_SECRET
        // console.log(secret_key)
        // console.log(token);
        // console.log(userId);

        // verifying the cookie
        const decoded = jwt.verify(token, secret_key);

        // checking for the user existance
        const result=await User.findById(decoded?.id);
        if(!result) return res.status(404).json({message:"User not found",comment:"User Not Found"});

        // attaching the userinfo
        req["userInfo"]=decoded;

        next()

        
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Some problem occured in middleware"});
    }

}