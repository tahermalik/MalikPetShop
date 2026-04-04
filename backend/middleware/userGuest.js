import User from "../schema/userSchema.js";
import jwt from "jsonwebtoken";

export async function userGuest(req,res,next){
    try{
        const token=req?.cookies?.token
        const guestId=req?.cookies?.guestId;

        // console.log(token,guestId)
        if(token===undefined && guestId===undefined) return res.status(404).json({message:"Something wrong with the browser"})

        /// it means guest is accessing the browser
        if(token===undefined){
            next();
        }else{

            const secret_key=process.env.JWT_SECRET
            
            // verifying the cookie
            const decoded = jwt.verify(token, secret_key);

            console.log(decoded,"Taher")
    
            // checking for the user existance
            const result=await User.findById(decoded?.id);
            if(!result) return res.status(404).json({message:"User not found",comment:"User Not Found"});
    
            // attaching the userinfo
            req["userInfo"]=decoded;
    
            next()
        }  
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Some problem occured in middleware"});
    }

}