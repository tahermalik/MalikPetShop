import mongoose from "mongoose";

const forgotPasswordSchema = new mongoose.Schema({
    otp:{
        type:Number,
        default:-1,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true,
        required:true
    },
    expiryDate:{
        type:Date,
        required:true
    }
})

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema);
export default ForgotPassword