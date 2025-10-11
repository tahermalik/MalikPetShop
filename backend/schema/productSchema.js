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
        match:/^\d+(\.\d+)?$/
    },
    originalPrice:{
        type:Number,
        required:true,
        match:/^\d+(\.\d+)?$/
    },
    netWeight:{
        type:Number,
        match:/^\d+(\.\d+)?$/
    },
    animal:{
        type:String,
        required:true,
        match:/^[A-Za-z]+$/
    },
    stock:{
        type:Number,
        required:true
    },


    /// snack schema
    flavor:{
        type:String,
        match:/^[A-Za-z]+$/
    },
    ingredients:{
        type:Array
    },


    //// cloth schema
    size:{
        type:String,
        match:/^[A-Za-z]+$/
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