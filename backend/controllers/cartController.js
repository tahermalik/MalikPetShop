import Cart from "../schema/cartSchema.js";
import Product from "../schema/productSchema.js";

///// this function will be called when the user is logged in
export async function getCartItemsLogin(req,res){
    try{
        const user_id=req?.user?.id;
        const cart=await Cart.findOne({user_id})

        /// if the cart exists
        if(cart){
            return res.status(200).json({products:cart?.products,bool:true})
        }

        return res.status(200).json({bool:false})


    }catch(error){
        console.log("wrong in getCartItem",error);
        return res.status(500).json({message:"Error from server end in getCartItems"})
    }
}


///// function when the user is logged in ==> when the user clicks on the remove
export async function removerCartItemLogin(req,res){
    try{

        const product_id=req?.params?.id;  /// id will be passed via the parameter
        const user_id=req?.user?.id;

        let cart=await Cart.findOne({user_id}).select("products")
        if(!cart) return res.status(404).json({message:"Cart not found"})

        const result = await Cart.updateOne(
            {user_id:user_id},
            { $pull: { products: { product_id: product_id } } }
        )

        const exists = cart.products.some(p => p.product_id.toString() === product_id);
        cart=await Cart.findOne({user_id}).select("products")
        if (!exists) {
            return res.status(404).json({message:"Product not found"})
        } else {
            if(cart.products.length===0){
                await Cart.deleteOne({ user_id: user_id });
            }
            return res.status(200).json({message:"Product removed from the cart"})
        }
    }catch(error){
        console.log("wrong in removeCartItem",error);
        return res.status(500).json({message:"Error from server end in removeCartItems"})
    }
}


///// this function will be invoked when the user is logged in i.e when the user clicks on login button
export async function addToCart(req,res){
    try{
        const user_id=req?.user?.id; /// getting the userId via the middleware
        const product_id=req.params?.id;
        const productInfo=await Product.findById(product_id)
        const cart=await Cart.findOne({user_id})
        if(!productInfo) return res.status(404).json({message:"product not found"})
        
        /// so that no enum validation fails
        let validDiscountTypes = ["percentage", "flat"];
        let discountType = validDiscountTypes.includes(productInfo.discountType)
            ? productInfo.discountType
            : "percentage"; // fallback to default

        
        let productDetails={
            product_id:productInfo._id,
            quantity:1,
            originalPrice:productInfo?.originalPrice,
            discountValue:productInfo?.discountValue,
            discountType:discountType
        }

        console.log("Discount type from product:", productInfo.discountType, typeof productInfo.discountType);


        /// if already there some items in the cart
        if(cart){
            const exists = cart.products.some(
                p => p.product_id.toString() === product_id
            );

            if (!exists) {
                await Cart.updateOne(
                    { user_id },
                    { $push: { products: productDetails } }
                );
            }
        }else{
            let productDetailsArray=[productDetails]
            await Cart.create({
                user_id:user_id,
                products:productDetailsArray
            })
        }
        return res.status(200).json({message:"item added to the cart successfully"})


    }catch(error){
        console.log("wrong in add to cart",error);
        return res.status(500).json({message:"Server fucked at add to cart"})
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