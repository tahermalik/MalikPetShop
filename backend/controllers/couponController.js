import mongoose from "mongoose";
import Coupon from "../schema/couponSchema.js";
import Cart from "../schema/cartSchema.js";
import Product from "../schema/productSchema.js";

/// working on the basis of pagination
export async function viewCoupons(req,res){
    try{
        console.log("inside view Coupons")
        const limit = parseInt(req.body.limit) || 20;
        const lastId = req.body.lastId;
        const userId=req?.body?.userId;
        const guestId=req?.cookies?.guestId;

        const isUser=!!userId
        const isGuest=!!guestId

        let cart;
        if(isUser){
            cart=await Cart.findOne({userId:userId})
        }else cart=await Cart.findOne({guestId:guestId})
        
        /// this is an array of objects where each object is an product added to the cart
        const productIdSet=new Set()
        let cartProducts = cart?.products || [];
        // console.log(cartProducts)
        for(let i=0;i<cartProducts.length;i++){
            productIdSet.add(cartProducts[i]["productId"].toString())
        }
        let productIdArray=[...productIdSet]
        
        /// this is array of object with 2 keys as id of the product and its brand
        let brandArray=await Product.find(
            {_id:{$in:productIdArray}}
        ).select("brand")

        let brandSet=new Set();
        for(let i=0;i<brandArray.length;i++){
            brandSet.add(brandArray[i]["brand"])
        }

        const query = lastId ? { _id: { $gt: lastId } } : {};

        //// only sending the required things to the frontend ; it is also an array of objects
        const coupons = await Coupon.find(query).sort({ _id: 1 }).limit(limit).select("_id couponCode couponDesc couponDiscountType couponDiscountValue couponEndDate couponMinOrderAmount couponStartDate brands").lean();

        for(let i=0;i<coupons.length;i++){
            let coupon=coupons[i]
            coupon.isValid = coupon.brands.some(brand =>
                brandSet.has(brand)
            );
        }

        res.status(200).json({coupons,nextCursor: coupons.length ? coupons[coupons.length - 1]._id : null});
    }catch(error){
        console.log("wrong in viewCoupon",error);
        return res.status(500).json({message:"fucked up in viewCoupon"})
    }

}

//// if the coupon already exists then the coupon is updated otherwise it is created
export async function setCoupons(req,res){
    try{
        let {couponCode,couponDesc,couponDiscountType,couponDiscountValue,couponMaxDiscount,couponMinOrderAmount,couponMaxUses,newUser,brands,couponStartDate,couponEndDate}=req?.body
        // console.log(couponCode,couponDesc,couponDiscountValue,couponDiscountType)
        let message="";
        const coupon=await Coupon.findOne({couponCode:couponCode})
        if(!coupon) message=`Coupon with ${couponCode} created`
        else message=`Coupon with ${couponCode} modified`

        // console.log(couponStartDate,couponEndDate)

        if(couponEndDate<=couponStartDate) return res.status(400).json({message:"Enddate cant be before start date"})
        
        if(typeof couponStartDate==="undefined") couponStartDate=new Date()

        /// this normalization is done in order to avoid bugs
        if(brands.length>0){
            brands.filter((item)=>item.toLowerCase())
        }

        /// upsurt:true is used which mean if the coupon is present then update it otherwise create new coupon
        console.log(typeof(brands),brands)
        await Coupon.findOneAndUpdate({couponCode:couponCode},{
            $set:{
                couponDesc:couponDesc,
                couponDiscountType:couponDiscountType,
                couponDiscountValue:couponDiscountValue,
                couponMaxDiscount:couponMaxDiscount,
                couponMinOrderAmount:couponMinOrderAmount,
                couponMaxUses:couponMaxUses,
                newUser:newUser,
                brands:brands,
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

/// need to work on this
// {
//   brands: [],
//   _id: '69745cd419a4e21633062119',
//   couponCode: 'tahabash2',
//   __v: 0,
//   couponDesc: '25% off on all whiskas products',
//   couponDiscountType: 'percentage',
//   couponDiscountValue: 25,
//   couponEndDate: '2026-04-15T00:00:00.000Z',
//   couponMaxDiscount: 150,
//   couponMaxUses: 1,
//   couponMinOrderAmount: 1000,
//   couponStartDate: '2026-01-01T00:00:00.000Z',
//   couponTotalUsage: 10,
//   newUser: false,
//   productID: [ '1234' ]
// }

// new user feature is under development
// this endpoint is invoked when the user clicks on the apply button
export async function selectCoupon(req,res){
    const session=await mongoose.startSession();
    try{
        /// as i want the automic property to take place
        await session.startTransaction()

        const currentDate=new Date()
        const couponSelected=req?.body?.couponSelected
        const total=req?.body?.total
        if(total<=0) throw new Error("Invalid total amount")
        // console.log("Selected coupon",couponSelected)
        const result=await Coupon.findById(couponSelected?._id).session(session)
        if(!result) throw new Error("Coupon is invalid")

        if(result["couponMinOrderAmount"]>total) throw new Error("Coupon cant be applied")
        
        if(currentDate>result["couponEndDate"]) throw new Error("Coupon is expired")

        if(result["couponTotalUsage"]>=result["couponMaxUses"]) throw new Error("last coupon got redemmed by another user , you were late")
        
        const valid=await Coupon.findOne({
            _id: couponSelected._id,
            couponTotalUsage: { $lt: result["couponMaxUses"] }
        }).session(session)

        if (!valid) throw new Error("Coupon exhausted");
            
        
        let discountValue;
        if(result["couponDiscountType"]==="percentage"){
            discountValue=total*(result["couponDiscountValue"]/100)
            if(discountValue>result["couponMaxDiscount"]) discountValue=result["couponMaxDiscount"]
        }
        else discountValue=result["couponDiscountValue"]
        await session.commitTransaction();
        return res.status(200).json({message:"Coupon Applied",finalAmount:total-discountValue})
    }catch(error){
        await session.abortTransaction();
        console.log("Server gone wrong while selecting the coupon",error)
        return res.status(500).json({message:"Server gone wrong while selecting the coupon"})
    }
}
