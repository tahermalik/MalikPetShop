import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        match:/^[a-fA-F0-9]{24}$/,
        unique:true
    },
    
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    userAddress:{
        type: String, // Exact address: house no, street, building etc.
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 200,
    },
    userCity:{
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    userPinCode:{
        type: String,
        required: true,
        match: /^[1-9][0-9]{5}$/, // Indian PIN code
        trim: true,
    },
    userPhoneNumber:{
        type: String,
        required: true,
        match: /^[6-9]\d{9}$/, // Indian phone number format
        trim: true,
    }
},{timestamps:true})

const Address = mongoose.model("Address", addressSchema);
export default Address