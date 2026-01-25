import mongoose from "mongoose";
/*
if all the categories are there and amount is greater then minPurchase --> max discount
if the purchase amount is greater then minPurchase and applicableCategories is NONE --> then give dicount on subtotal

if an item of applicable is present and minPurchase is greater then total; then give me half of the percent discount as mentioned in discount
*/ 

const couponSchema = new mongoose.Schema({
    couponCode: {
        type: String,      // Data type is String
        required: true,    // Must be provided
        unique: true,      // No duplicate emails {will gonna identify users uniquely on the basis of the email}
        lowercase: true,   // Converts to lowercase before saving
        match: /^[a-z0-9]+$/ // Optional: regex to validate email format
    },
    couponDiscountValue:{
        type:Number,
        required:true,
    },
    couponDesc:{
        type:String,
        required:true,
    },
    couponDiscountType:{
        type:String,
        default:"percentage"
    },
    couponMaxDiscount:{type:Number,required:true,default:0},
    couponMinOrderAmount:{type:Number,required:true,default:0},

    /// Number of times copon can be used globally
    couponMaxUses:{type:Number,required:true,default:1},

    // number of times coupon is used till the present time
    couponTotalUsage:{type:Number,required:true,default:0},
    newUser:{type:Boolean},
    brands:[
        {
            type:String,
            default: []
        }
    ],
    couponStartDate:{type:Date},
    couponEndDate:{type:Date}
})

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon