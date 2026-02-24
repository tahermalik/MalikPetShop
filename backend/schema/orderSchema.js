import mongoose from "mongoose";

//    paymentStatus: "pending"
//    createdAt

const orderSchema = new mongoose.Schema({
  // just for the sake of making it human readable
  orderId:{
    type:String,
    required:true,
    unique:true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      productOGPrice: {
        type: Number,
        required: true,
      },
      productDiscount: {
        type: Number,
        required: true,
        default:0,
      },
      priceAtPurchase:{
        type: Number,
        required: true,
        default:0
      },
      variation:{
        type:Number,
        required:true,
      }
    }
  ],

  // sum of all the product with the discounted price
  subTotal:{
    type: Number,
    required: true,
  },

  couponId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    required: false,
    default:null
  },

  /// amount that is give as discount via the coupon
  discountAmount: {
    type: Number,
    required: true,
    default:0,
  },

  // final amount
  finalAmount:{
    type:Number,
    required:true,
  },

  // it is the status of the order
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },

  // status of the payment
  paymentStatus:{
    type: String,
    enum: ["Processing", "Cancelled", "Successfull"],
    default: "Processing",

  },
  paymentId:{
    type:String,
    default:null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

orderSchema.index({ user: 1 })
orderSchema.index({ createdAt: -1 })
orderSchema.index({ orderId: 1 })
const Order=mongoose.model("Order",orderSchema)
export default Order
