import Offer from "../schema/offerSchema.js"

///// simply create the offer
export async function createOffer(req,res){
    try{
        const offerData=req?.body?.offerData

        const endDate=new Date(offerData["offerEndDate"])
        const startDate=new Date(offerData["offerStartDate"])
        const currentDate=new Date()
        if(endDate<=startDate || currentDate>=endDate ){
            console.log("fuck")
            return res.status(400).json({message:"offer is already expired"})
        }
        // console.log("fucked up")
        await Offer.create({
            offerName:offerData["offerName"],
            offerDesc:offerData["offerDesc"],
            offerStartDate:startDate,
            offerEndDate:endDate
        })
        // console.log(req.body?.offerData)
        // console.log(offerData["offerName"],offerData)
        
    }catch(error){
        console.log("wrong in create offer",error)
        return res.status(500).json({message:"server fucked up in createOffer"})
    }
}

export async function deleteOffer(req,res){
    try{
        /// will get the offer id via URL
        const offerId=req?.params?.id;
        const res=await Offer.findById(offerId)

        if(!res) return res.status(404).json({message:"Offer not found"})

        //// if the offer is present
        await Offer.deleteOne({_id:offerId})
        return res.status(200).json({message:"Offer got deleted"})

    }catch(error){
        console.log("wrong in delete offer")
        return res.status(500).json({message:"server fucked up in deleteOffer"})
    }
}

export async function displayOffer(req,res){
    try{
        const offers=await Offer.find()
        return res.status(200).json({offers:offers})
    }catch(error){
        console.log("wrong in display offer")
        return res.status(500).json({message:"server fucked up in displayOffer"})
    }
}