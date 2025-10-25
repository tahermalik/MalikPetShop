import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
    },
    expiryDate:{
        type:String,
        
    },
    manufactureDate:{
        type:String,
    },
    brand:{
        type:String,
    },
    category:{
        type:String,
    },
    type:{
        type:String,
    },
    discountValue:{
        type:Number,
        match:/^\d+(\.\d+)?$/
    },
    discountType:{
        type:String,
        default:"percent",
        enum:["percent","flat"]
    },
    originalPrice:{
        type:Number,
        match:/^\d+(\.\d+)?$/
    },
    netWeight:{
        type:Number,
        match:/^\d+(\.\d+)?$/
    },
    pet:{
        type:String,
        match:/^[A-Za-z]+$/
    },
    stock:{
        type:Number,
    },
    breed:{
        type:String,
    },
    diet:{
        type:String,
    },


    /// snack schema
    flavor:{
        type:String,
        match:/^[A-Za-z]+$/
    },

    //// cloth schema
    size:{
        type:Number,
    },
    color:{
        type:String,
        match:/^[A-Za-z]+$/
    },
    material:{
        type:String,
        match:/^[A-Za-z]+$/
    },



    /// cage schema
    length:{
        type:Number,
        match:/^\d+(\.\d+)?$/
        
    },
    width:{
        type:Number,
        match:/^\d+(\.\d+)?$/
    },
    height:{
        type:Number,
        match:/^\d+(\.\d+)?$/
    }

},{timestamps:true})

const Product = mongoose.model("Product", productSchema);
export default Product