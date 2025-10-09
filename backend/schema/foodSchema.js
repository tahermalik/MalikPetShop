import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
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
        required:true,
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
    }

},{timestamps:true})

const Food = mongoose.model("Food", foodSchema);
export default Food