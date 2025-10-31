import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    offerName: {
        type: String,      // Data type is String
        required: true,    // Must be provided
        unique:true,
        trim:true
    },
    offerDesc:{
        type:String,
    },
    
    offerEndDate:{
        type:Date,
    },
    offerStartDate:{
        type:Date
    }
})

const Offer = mongoose.model("Offer", offerSchema);
export default Offer