import Cart from "../schema/cartSchema.js";
import Product from "../schema/productSchema.js";

//// all the below codes are for the login user
///// when the logged in user presses add to cart button

/// wroking
export async function addToCart(req,res){
    try{
        console.log("adding the product into cart")
        const {userId,productId,productVariation}=req?.body;
        const productData=await Product.findById(productId)
        const cart=await Cart.findOne({userId})
        if(!productData) return res.status(404).json({message:"product not found"})

        
        /// if already there some items in the cart
        if(cart){
            const existingProduct = cart.products.find(
                (p) =>
                p.productId.toString() === productId &&
                p.productVariation === productVariation
            );

            if (existingProduct) {
                return res.status(200).json({ message: "Product already in cart" ,bool:false,comment:"Already Present"});
            }
            
            await Cart.findOneAndUpdate({userId:userId},{$push:{products:{productId:productId,productVariation:productVariation}}})
        }else{
            await Cart.create({
                userId:userId,
                products:[{
                    productId:productId,
                    productVariation:productVariation
                }]
            })
        }
        return res.status(200).json({message:"item added to the cart successfully"})

    }catch(error){
        console.log("wrong in add to cart",error);
        return res.status(500).json({message:"Server fucked at add to cart"})
    }
}

/// working
export async function getCartItems(req,res){
    try{
        console.log("inside getCartItems")
        const userId=req?.params?.userId;
        const result=await Cart.findOne({userId})

        if(!result) return res.status(404).json({message:"Cart Not found",bool:false})
        return res.status(200).json({cartData:result?.products})
    }catch(error){
        console.log("server fucked up at getCartItems",error)
        return res.status(500).json({message:"server fucked up at getCartItems"})
    }
}

/// working
export async function removerCartItem(req,res){
    try{

        const {userId,productId,productVariation}=req?.body
        console.log("inside remove cart item")
        let cart=await Cart.findOne({userId}).select("products")
        if(!cart) return res.status(404).json({message:"Cart not found",bool:false})

        const result = await Cart.findOneAndUpdate(
            {userId:userId},
            { $pull: { products: { productId: productId ,productVariation:productVariation} } }
        )
        
        if(result.modifiedCount === 0) return res.status(404).json({message:"Product not found",bool:false})

        cart=await Cart.findOne({userId}).select("products")
        
        return res.status(200).json({message:"Product removed from the cart",bool:true})
    }catch(error){
        console.log("wrong in removeCartItem",error);
        return res.status(500).json({message:"Error from server end in removeCartItems",bool:false})
    }
}

/// per user there is only one cart
export async function mergeCartItems(userId,reduxCartData){
    try{
        
        userId=userId.toString()
        // console.log(userId,reduxCartData,"inside mergeCartItems")
        let existingProducts=await Cart.findOne({userId}).select("products")

        //// if existingProduct is found
        if(existingProducts){
            existingProducts=existingProducts["products"]

            //// both reduxCartData and existingProducts are the array of objects
            // console.log(existingProducts)

            const newItems = reduxCartData.filter(
                (r) =>
                    !existingProducts.some(
                    (e) => e.productId.toString() === r.productId && e.productVariation === r.productVariation
                )
            );

            if (newItems.length > 0) {
                await Cart.updateOne(
                    { userId },
                    { $push: { products: { $each: newItems } } }
                );
            }
        }
        else if (reduxCartData?.length > 0) {
            await Cart.create({ userId, products: reduxCartData });
        }
    }catch(error){
        console.log("wrong in mergeCartItems",error);
    }
}