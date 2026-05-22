import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
    },
    cleanProductName: {
        type: String,
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

    // as each product have multiple variation so we are making use of array in stock and reservedStock
    stock: {
        type: [Number],
        default: []
    },
    reservedStock: {
        type: [Number],
        default: [],
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
    flavor:{
        type:String,
    },

    //// wishlist added here so that to find out which product is popular among user
    wishList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    ///// Every product will have its own String so that they can be serached by the humans
    productString: {
        type: [String]
    },

    description: {
        type: String,
    },
    usp: {
        type: String,
    },

    overview: {
        type: [
            {
                key: { type: String },
                value: { type: String },
                unit: { type: String }
            }
        ],
        default: []
    }

}, { timestamps: true })

productSchema.pre("save", function (next) {
    const len = this.netWeight?.length || 0;

    const arraysToCheck = [
        this.stock,
        this.reservedStock,
        this.discountValue,
        this.discountType,
        this.image,
        this.productString,
    ];

    let count = 0;
    for (const arr of arraysToCheck) {
        if (arr && arr.length !== len) {
            return next(
                new Error(`Variation arrays length mismatch ${count}`)
            );
        }
        count += 1;
    }

    next();
});

const Product = mongoose.model("Product", productSchema);
export default Product