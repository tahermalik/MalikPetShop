import Coupon from "../schema/couponSchema.js";

export async function viewCoupons(req,res){
    try{
        console.log("inside view Coupons")
        const limit = parseInt(req.body.limit) || 20;
        const lastId = req.body.lastId;
        // console.log(limit,lastId)

        const query = lastId ? { _id: { $gt: lastId } } : {};

        const coupons = await Coupon.find(query)
                                    .sort({ _id: 1 })
                                    .limit(limit);

        res.status(200).json({
        coupons,
        nextCursor: coupons.length ? coupons[coupons.length - 1]._id : null
        });

    }catch(error){
        console.log("wrong in viewCoupon",error);
        return res.status(500).json({message:"fucked up in viewCoupon"})
    }

}

function parseDMY(dateString) {
  if (!dateString) return undefined; // handle missing date
  let [day, month, year] = dateString.split("-");
  
  return new Date(year, month - 1, day); // JS months are 0-indexed
}

//// if the coupon already exists then the coupon is updated otherwise it is created
export async function setCoupons(req,res){
    try{
        let {couponCode,couponDesc,couponDiscountType,couponDiscountValue,couponMaxDiscount,couponMinOrderAmount,couponMaxUses,couponTotalUsage,newUser,productID,couponStartDate,couponEndDate}=req?.body
        // console.log(couponCode,couponDesc,couponDiscountValue,couponDiscountType)
        let message="";
        const coupon=await Coupon.findOne({couponCode:couponCode})
        if(!coupon) message=`Coupon with ${couponCode} created`
        else message=`Coupon with ${couponCode} modified`

        // console.log(couponStartDate,couponEndDate)

        if(couponEndDate<=couponStartDate) return res.status(400).json({message:"Enddate cant be before start date"})
        
        if(typeof couponStartDate==="undefined") couponStartDate=new Date()

        await Coupon.findOneAndUpdate({couponCode:couponCode},{
            $set:{
                couponDesc:couponDesc,
                couponDiscountType:couponDiscountType,
                couponDiscountValue:couponDiscountValue,
                couponMaxDiscount:couponMaxDiscount,
                couponMinOrderAmount:couponMinOrderAmount,
                couponMaxUses:couponMaxUses,
                couponTotalUsage:couponTotalUsage,
                newUser:newUser,
                productID:productID,
                couponStartDate:couponStartDate,
                couponEndDate:couponEndDate

            }},
            { upsert: true, new: true, runValidators: true }

        )

        
        return res.status(200).json({message:message})

    }catch(error){
        console.log("wrong in setCoupon",error);
        return res.status(500).json({message:"fucked up in setCoupon"})
    }
}


export async function deleteCoupon(req,res){
    try{
        const couponID=req.params?.id;

        const coupon=await Coupon.findByIdAndDelete(couponID)
        if(coupon){
            return res.status(200).json({message:`coupon ${coupon.couponCode} got deleted sucessfully`})
        }
        return res.status(404).json({message:"No Coupon found"})

    }catch(error){
        console.log("wrong in deleteCoupon",error);
        return res.status(500).json({message:"Server fucked up at deleteCoupon"})
    }
}

export async function couponUsage(req,res){
    try{
        const couponId=req?.params?.id
        if(!couponId) return res.status(404).json({message:"Coupon id not found"})

        const updatedCoupon = await Coupon.findOneAndUpdate(
            { _id: couponId, couponTotalUsage: { $gt: 0 } }, // condition to ensure still valid
            { $inc: { couponTotalUsage: -1 } },               // atomic decrement
            { new: true }                                     // return updated doc
        );

        if (!updatedCoupon) return res.status(400).json({ message: "Coupon not found or already expired" });

        if(updatedCoupon.couponTotalUsage===0) await Coupon.findByIdAndUpdate(couponId,{$set:{couponEndDate:new Date()}})
        return res.status(200).json({message:"Coupon usage decremented"})
        
    }catch(error){
        console.log("wrong in couponUseage",error);
        return res.status(500).json({message:"server fucked up at couponUsage"})
    }
}