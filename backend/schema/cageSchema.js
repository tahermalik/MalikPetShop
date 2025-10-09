import mongoose from "mongoose";

const cageSchema = new mongoose.Schema({
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
    animal:{
        type:String,
        required:true
    },
    material:{
        type:String,
        required:true
    },
    length:{
        type:Number,
        required:true
    },
    width:{
        type:Number,
        required:true
    },
    height:{
        type:Number,
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
    }

},{timestamps:true})

const Cage = mongoose.model("Cage", cageSchema);
export default Cage