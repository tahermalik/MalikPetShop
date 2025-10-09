import mongoose from "mongoose";

const snackSchema = new mongoose.Schema({
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
    flavor:{
        type:String,
        required:true
    },
    ingredients:{
        type:Array,
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

const Snack = mongoose.model("Snack", snackSchema);
export default Snack