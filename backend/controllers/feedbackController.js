import User from "../schema/userSchema.js";

export async function createFeedBack(req,res){
    try{
        /// extracting the message
        const {message}=req.body;

        if(!message || !message.trim()){
            return res.status(400).json({message:"to create a feedback you need to type in the message"})
        }
        await User.findByIdAndUpdate(
            req?.user?.id,
            { $push: { feedbacks: { message:message}} },
            { new: true } // returns the updated document
        );

        return res.status(200).json({message:"feedback created succesfully"})
        


    }catch(error){
        console.log("wrong in create feedback",error);
        return res.status(500).json({message:"wrong at server in createFeedBack"})
    }
}

///// without login
export async function viewFeedBack(req,res){
    try{
        //// will fetch only feedback from the 50 users
        let all_user_feedback=await User.find().select("feedbacks username").limit(50)

        all_user_feedback = all_user_feedback.flatMap(user =>
            user.feedbacks.map(feedback => ({
                ...feedback.toObject(),   // convert Mongoose doc to plain JS object
                username: user?.username   // your extra key-value pair
            }))
            );
        
        return res.status(200).json({message:"feedbacks of the other user",data:all_user_feedback})
    }catch(error){
        console.log("wrong in viewFeedback",error);
        return res.status(500).json({message:"something wrong in viewFeedBack"})
    }
}


/////// with login
export async function viewFeedBackLogin(req,res){
    try{
        const user_id=req.params.id;
        //// will fetch only feedback from the 50 users
        let all_user_feedback=await User.find({_id:{$ne:user_id}}).select("feedbacks username").limit(50)

        all_user_feedback = all_user_feedback.flatMap(user =>
            user.feedbacks.map(feedback => ({
                ...feedback.toObject(),   // convert Mongoose doc to plain JS object
                username: user?.username   // your extra key-value pair
            }))
            );
        
        return res.status(200).json({message:"feedbacks of the other user",data:all_user_feedback})
    }catch(error){
        console.log("wrong in viewFeedback",error);
        return res.status(500).json({message:"something wrong in viewFeedBack"})
    }
}


export async function deleteFeedBack(req,res){
    try{
        const feedback_id=req.params.id;
        const user_id=req?.user?.id;

        /// checking if the feedback is present or not
        const feedback = await User.findOne({ _id: user_id, "feedbacks._id": feedback_id });
        if(!feedback){
            return res.status(404).json({message:"feedback not found"})
        }

        await User.findByIdAndUpdate(
            user_id,
            { $pull: { feedbacks: { _id: feedback_id } } }, 
            { new: true }
        );

        return res.status(200).json({message:"Feedback deleted successfully"})

    }catch(error){
        console.log("wrong in deleteFeedBack",error)
        return res.status(500).json({message:"wrong in deleteFeedBack at the server side"})
    }
}
