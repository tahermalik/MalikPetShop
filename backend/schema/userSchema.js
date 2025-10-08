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
    }
})

const User = mongoose.model("User", userSchema);
export default User