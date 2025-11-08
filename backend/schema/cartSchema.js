import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        match:/^[a-fA-F0-9]{24}$/,
        unique:true
    },
    products: [
        {
            _id:false,
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required: true,
            },
            productVariation:{
                type:Number,
                default : 0
            }
        }
    ]
},{timestamps:true})

const Cart = mongoose.model("Cart", cartSchema);
export default Cart