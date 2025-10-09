import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    expiry:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true,
    },
    originalPrice:{
        type:Number,
        required:true,
    },
    finalPrice:{
        type:Number,
        required:true
    }

},{timestamps:true})

const Product = mongoose.model("Product", productSchema);
export default Product