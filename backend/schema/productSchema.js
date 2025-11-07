import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
    },
    cleanProductName:{
        type:String,
    },
    expiryDate: {
        type: [String],
    },
    manufactureDate: {
        type: [String],
    },
    brand: {
        type: String,
    },
    category: {
        type: String,
    },
    type: {
        type: String,
    },
    discountValue: {
        type: [Number],
    },
    discountType: {
        type: [String],
        default: ["percent"],
        enum: ["percent", "flat"]
    },
    originalPrice: {
        type: [Number],
    },
    netWeight: {
        type: [Number],
    },
    pet: {
        type: String,
        match: /^[A-Za-z]+$/
    },
    stock: {
        type: [Number],
    },
    breed: {
        type: String,
    },
    diet: {
        type: String,
    },
    image: {
        type: [String],
    },

    //// wishlist added here so that to find out which product is popular among user
    wishList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    ///// Every product will have its own String so that they can be serached by the humans
    productString: {
        type: [String]
    },


    /// snack schema
    flavor: {
        type: String,
        match: /^[A-Za-z]+$/,
        required: false
    },

    //// cloth schema
    size: {
        type: Number,
    },
    color: {
        type: String,
        match: /^[A-Za-z]+$/
    },
    material: {
        type: String,
        match: /^[A-Za-z]+$/
    },



    /// cage schema
    length: {
        type: Number,
        min: 0

    },
    width: {
        type: Number,
        min: 0
    },
    height: {
        type: Number,
        min: 0
    }

}, { timestamps: true })

const Product = mongoose.model("Product", productSchema);
export default Product