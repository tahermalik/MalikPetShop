import Cart from "../schema/cartSchema.js";
import Product from "../schema/productSchema.js";

//// all the below codes are for the login user
///// when the logged in user presses add to cart button
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
                return res.status(200).json({ message: "Product already in cart" });
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

export async function removerCartItem(req,res){
    try{

        const {userId,productId,productVariation}=req?.body
        console.log("inside remove cart item")
        let cart=await Cart.findOne({userId}).select("products")
        if(!cart) return res.status(404).json({message:"Cart not found",bool:false})

        const result = await Cart.updateOne(
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
export async function mergeCartItems(req,res){
    try{

        const user_id=req?.params?.id;

        //// it only contains 2 things one product id and then its quantity
        const items=req.body?.items; /// object where key is productId and its value is quantity
        const cart=await Cart.findOne({user_id})
        if(cart){
            let already_present=await Cart.findOne({user_id}).select("products") // this will again be the array of objects
            already_present=already_present["products"]
            for(let i=0;i<already_present.length;i++){
                if(already_present[i]["product_id"] in items){
                    items[already_present[i]["product_id"]]+=already_present[i]["quantity"];
                }else items[already_present[i]["product_id"]]=already_present[i]["quantity"]
            }

        }

        //// my items object will contain key - value pair in the combined format
        const productIds = Object.keys(items);
        const products = await Product.find({ _id: { $in: productIds } }).select("_id name discount originalPrice"); // [{}]
        products.forEach(p => {
            const pid = p._id.toString();
            p.quantity = items[pid] || 1;
        });


        //// creating the merge product array of objects
        const mergedProducts = products.map(p => ({
            product_id: p._id,
            name: p.name,
            discount: p.discount,
            originalPrice: p.originalPrice,
            quantity: p.quantity || 1
        }));


        // 5️5 Update existing cart or create a new one
        if (cart) {
            cart.products = mergedProducts; // update products
            await cart.save();              // save changes
        } else {
            cart = new Cart({ user_id, products: mergedProducts });
            await cart.save();              // save new cart
        }

        return res.status(200).json({ message: "Cart merged successfully"});
        
        
    }catch(error){
        console.log("wrong in mergeCartItems",error);
        return res.status(500).json({message:"Error from server end in mergeCartItems"})
    }
}