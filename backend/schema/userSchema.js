import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,      // Data type is String
        required: true,    // Must be provided
        unique: true,      // No duplicate emails {will gonna identify users uniquely on the basis of the email}
        lowercase: true,   // Converts to lowercase before saving
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ // Optional: regex to validate email format
    },
    username:{
        type:String,
        required:true,
        match:/^[A-Za-z]+(?: [A-Za-z]+)*$/
    },
    password:{
        type:String,
        required:true,
        match:/^.{8,}$/
    },
    wishlist: [
        {
            product_id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            price:{
                type:Number,
                required:true
            }
        }
    ],
    cart: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
            price:{
                type:Number,
                required:true
            }
        }
    ],
    orders: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        }
    ],
    feedbacks: [
        {
            message: { type: String, required: true },
            rating: { type: Number, min: 1, max: 5 ,default:3},
            createdAt: { type: Date, default: () => new Date()},
        }
    ],
    role:{
        type:String,
        required:true
    }
})

const User = mongoose.model("User", userSchema);
export default User