import mongoose from "mongoose";

const feedBackSchema = new mongoose.Schema({
    allFeedBack:[
        {
            message: { type: String, required: true },
            rating: { type: Number, min: 1, max: 5 ,default:3},
            createdAt: { type: Date, default: () => new Date()},
            username:{type: String, required: true},
        }
    ]
})

const FeedBack = mongoose.model("FeedBack", feedBackSchema);
export default FeedBack