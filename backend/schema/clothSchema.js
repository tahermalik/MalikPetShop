import mongoose from "mongoose";

const clothSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true
    },
    material:{
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
    stock:{
        type:Number,
        required:true
    },
    animal:{
        type:String,
        required:true
    }

},{timestamps:true})

const Cloth = mongoose.model("Cloth", clothSchema);
export default Cloth