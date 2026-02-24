import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        match:/^[a-fA-F0-9]{24}$/,
        required: false
    },
    guestId: {
        type: String,
        required: false, // only guests
        index: true,
    },
    couponId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Coupon",
        required:false
    },
    products: [
        {
            _id:false,
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required: true,
            },
            productVariation:{
                type:Number,
                default : 0,
                min: 0
            },
            productQuantity:{
                type:Number,
                default:1,
                min:1
            },
            reservedAt:{
                type:Date,
                default: Date.now
            }
        }
    ]
},{timestamps:true})

cartSchema.pre("save", function (next) {
  if (!this.userId && !this.guestId) {
    return next(new Error("Cart must belong to a user or a guest"));
  }
  next();
});

/// for the cart uniqueness; it is required when productId and productVariation does not exists
cartSchema.index({ userId: 1 }, { unique: true ,sparse:true})

cartSchema.index({ guestId: 1 }, { unique: true, sparse: true });

// for the product uniqueness
cartSchema.index(
  { userId: 1, "products.productId": 1, "products.productVariation": 1 },
  { unique: true, sparse: true }
)

cartSchema.index(
  { guestId: 1, "products.productId": 1, "products.productVariation": 1 },
  { unique: true, sparse: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart