import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        match:/^[a-fA-F0-9]{24}$/,
        unique:true
    },
    products: [
        {
            _id:false,
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
            originalPrice:{
                type:Number,
                required:true,
            },
            discountValue:{
                type:Number,
                required:true,
                default:0
            },
            discountType:{
                type:String,
                enum: ["flat", "percentage"], // restricts allowed values
                required:true,
                default:"percentage"
            }
        }
    ]
},{timestamps:true})

const Cart = mongoose.model("Cart", cartSchema);
export default Cart