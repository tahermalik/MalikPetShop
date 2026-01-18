import Cart from "../schema/cartSchema.js";
import Product from "../schema/productSchema.js";
import mongoose, { mongo } from "mongoose";
import User from "../schema/userSchema.js";
import toast from "react-hot-toast";


//// all the below codes are for the login user
///// when the logged in user presses add to cart button

/// wroking for both
export async function addToCart(req, res) {
    let userId, productId, productVariation, quantity,guestId;
    let reservation = false
    try {
        console.log("adding the product into cart")
        userId = req?.body?.userId
        guestId=req?.cookies?.guestId
        productId = req?.body?.productId
        productVariation = req?.body?.productVariation
        quantity = req?.body?.quantity

        const isUser=!!userId
        const isGuest=!!guestId

        // so the productData is the object
        if(!isUser && !isGuest) return res.status(400).json({message:"Both fields cannot be null"})
        
        if (!productId || productVariation === undefined || quantity === undefined) return res.status(400).json({ message: "All the fields are mandatory" })
        
        if (quantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity" });
        }
        const productData = await Product.findById(productId)
        // console.log(productData)


        let cart
        if(isUser) cart=await Cart.findOne({ userId: userId })
        else cart=await Cart.findOne({ guestId: guestId })

        // console.log("Cart", cart, userId)
        if (!productData) return res.status(404).json({ message: "product not found" })

        /// making sure that the product variation is correct and not out of bound
        if (productData.netWeight.length <= productVariation || productVariation < 0) return res.status(400).json({ message: "Something went wrong while adding product to the cart" })

        /// checking the availabilty of the product
        console.log(productData["stock"][productVariation],"Helo")
        const reserveResult = await Product.updateOne(
            {
                _id: productId,
                [`stock.${productVariation}`]: { $gte: quantity },
                $expr: {
                    $gte: [
                        { $subtract:[{ $arrayElemAt: ["$stock", productVariation] },
                                    { $arrayElemAt: ["$reservedStock", productVariation]}
                        ]},
                        quantity
                    ]
                }

            },
            {
                $inc: {
                    [`reservedStock.${productVariation}`]: quantity
                }
            }
        )

        if (reserveResult.matchedCount === 0) {
            return res.status(400).json({ message: "Product out of stock" });
        }

        reservation = true;


        /// if already there are some items in the cart
        if (cart) {
            //// need to work more on this section of add to cart
            const existingProduct = cart.products.find(
                p =>
                    p.productId.toString() === productId &&
                    p.productVariation === productVariation
            );

            if (existingProduct) {
                // rollback reservation
                await Product.updateOne(
                    { _id: productId },
                    { $inc: { [`reservedStock.${productVariation}`]: -quantity } }
                );

                return res.status(409).json({ message: "Product already in cart" });
            }


            console.log("Adding item to the cart ", quantity)

            if(isUser){
                await Cart.findOneAndUpdate(
                    { userId },
                    {
                        $push: {
                            products: {
                                productId,
                                productVariation,
                                productQuantity: quantity,
                                reservedAt: new Date()
                            }
                        }
                    },
                    { upsert: true }
                );
            }else{
                await Cart.findOneAndUpdate(
                    { guestId },
                    {
                        $push: {
                            products: {
                                productId,
                                productVariation,
                                productQuantity: quantity,
                                reservedAt: new Date()
                            }
                        }
                    },
                    { upsert: true }
                );

            }

        } else {
            console.log("creating the cart", quantity)

            /// only do rollback when reservation is done successfully
            
            if(isUser){
                await Cart.create({
                    userId: userId,
                    products: [{
                        productId: productId,
                        productVariation: productVariation,
                        productQuantity: quantity,
                        reservedAt: new Date()
                    }]
                })
            }else{
                await Cart.create({
                    guestId: guestId,
                    products: [{
                        productId: productId,
                        productVariation: productVariation,
                        productQuantity: quantity,
                        reservedAt: new Date()
                    }]
                })
            }
            
        }

        ///// adding the userID into the cart; it only contains unique userId
        if(isUser) await Product.findByIdAndUpdate(productId, { $addToSet: { cart: userId } })

        return res.status(200).json({ message: "item added to the cart successfully" })

    } catch (error) {
        if (reservation) {
            await Product.updateOne(
                { _id: productId },
                { $inc: { [`reservedStock.${productVariation}`]: -quantity } }
            );
        }
        console.log("wrong in add to cart", error);
        return res.status(500).json({ message: "Server fucked at add to cart" })
    }
}

/// working for both
export async function getCartItems(req, res) {
    try {
        console.log("inside getCartItems")
        const userId = req?.params?.userId;
        const isUser=!!userId
        const guestId=req?.cookies?.guestId;
        const isGuest=!!guestId

        if(!isUser && !isGuest) return res.status(400).json({message:"User should either be Guest or loggedIn"})
        
        let result;
        if(isUser && userId!=="undefined") result=await Cart.findOne({ userId:userId })
        else{
            result=await Cart.findOne({guestId:guestId})
            // console.log("Tahah",result)
        }

        if (!result) return res.status(404).json({ message: "Cart Not found", bool: false })
        // console.log(result?.products)
        return res.status(200).json({ cartData: result?.products })
    } catch (error) {
        console.log("server fucked up at getCartItems", error)
        return res.status(500).json({ message: "server fucked up at getCartItems" })
    }
}

/// working for both
export async function removerCartItem(req, res) {
    let update=false
    let userId,productId, productVariation,guestId,productQuantityData;
    try {
        userId=req?.body?.userId
        productId=req?.body?.productId
        productVariation=req?.body?.productVariation
        guestId=req?.cookies?.guestId

        const isUser=!!userId
        const isGuest=!!guestId

        if(!isUser && !isGuest) return res.status(400).json({message:"User should be either logged or guest"})

        let cart
        if(isUser){
            cart= await Cart.findOne({ userId }).select("products")
        }else cart= await Cart.findOne({ guestId:guestId }).select("products")
        console.log("Taher",cart,guestId)
        if (!cart) return res.status(404).json({ message: "Cart not found", bool: false })

        const cartItem=cart.products.find((p)=> p.productId.toString()===productId && p.productVariation===productVariation)
        
        if(!cartItem) return res.status(404).json({message:"Product not Found"})
        
        productQuantityData=cartItem["productQuantity"]

        const productResult= await Product.updateOne(
            {_id:productId,
            [`reservedStock.${productVariation}`]:{$gte:productQuantityData}},
            {$inc:{[`reservedStock.${productVariation}`]:-productQuantityData}}
        )

        
        if(productResult.modifiedCount===0) return res.status(400).json({message:"failed to release reservation"}) 
        update=true
        let result
        if(isUser){
            result = await Cart.updateOne(
                { userId: userId },
                { $pull: { products: { productId: productId, productVariation: productVariation } } }
            )
        }else{
            result = await Cart.updateOne(
                { guestId: guestId },
                { $pull: { products: { productId: productId, productVariation: productVariation } } }
            )
        }

        if (result.modifiedCount === 0) return res.status(404).json({ message: "Product not found", bool: false })


        /// this is done to find out whether any variation of product is still present in the cart or not
        if(isUser){
            cart = await Cart.findOne({ userId }).select("products")
            const exists = cart.products.some((item) => item["productId"].toString() === productId)
            if (!exists) {
                await Product.findByIdAndUpdate(productId, { $pull: { cart: userId } });
            }
        }

        return res.status(200).json({ message: "Product removed from the cart", bool: true })
    } catch (error) {
        if(update){
            await Product.updateOne({
                _id:productId,
                [`reservedStock.${productVariation}`]:{$gte:productQuantityData}},
                {$inc:{[`reservedStock.${productVariation}`]:productQuantityData}}
            )
        }
        console.log("wrong in removeCartItem", error);
        return res.status(500).json({ message: "Error from server end in removeCartItems", bool: false })
    }
}

//// this function will only be invoked when the user clicks login button

/// per user there is only one cart; working for both
export async function mergeCartItems(userId, guestId) {
    const session=await mongoose.startSession() // this will start the session
    console.log("inside merge cart items")
    try {
        
        const isGuest=!!guestId
        if(!isGuest) return false;
        session.startTransaction();
        let guestProducts=await Cart.findOne({guestId:guestId}).session(session)
        let userProducts=await Cart.findOne({userId:userId}).session(session)

        
        guestProducts=guestProducts?.products || []
        userProducts=userProducts?.products || []
        
        const productMap=new Map();
        for(let i=0;i<userProducts.length;i++){
            const key=`${userProducts[i].productId}_${userProducts[i].productVariation}`
            productMap.set(key,userProducts[i])
        }

        for(let i=0;i<guestProducts.length;i++){
            const key=`${guestProducts[i].productId}_${guestProducts[i].productVariation}`
            const item=productMap.get(key)
            if(item){
                item.productQuantity+=guestProducts[i].productQuantity
                item.reservedAt=new Date()
            }else productMap.set(key,guestProducts[i])
        }

        for(let i=0;i<guestProducts.length;i++){
            const item=guestProducts[i]
            const res=await Product.updateOne(
                {_id:item.productId,[`reservedStock.${item.productVariation}`]:{$gte:item.productQuantity}},
                {$inc:{
                    [`reservedStock.${item.productVariation}`]:-item.productQuantity
                }},
                {session}
            )
            if(res.modifiedCount===0) throw new Error("Reservation relaease failed")
        }

        await Cart.deleteOne({guestId:guestId}).session(session)

        const mergedArray=Array.from(productMap.values());
        for(let i=0;i<mergedArray.length;i++){
            const item=mergedArray[i];

            const ele=userProducts.find((p)=>{
                return p.productId.toString()===item.productId.toString() && p.productVariation===item.productVariation
            })

            let qty=0;
            if(ele) qty=ele.productQuantity
            
            const guestQuantity=item.productQuantity-qty

            if(guestQuantity>0){
                const res=await Product.updateOne(
                    {_id:item.productId,[`stock.${item.productVariation}`]:{$gte:guestQuantity}},
                    {$inc:
                        {
                            [`reservedStock.${item.productVariation}`]:guestQuantity
                        }
                    },
                    {session}
                )

                if(res.modifiedCount===0) throw new Error("Stock reservation failed")
            }
        }

        const keys=new Set()
        for(let i=0;i<mergedArray.length;i++){
            const key=mergedArray[i].productId
            keys.add(key)
        }
        await Product.updateMany(
            {_id:{$in:[...keys]}},
            {$addToSet:{cart:userId}},
            {session}
        )

        ///if we dont make use of upsert : true then
        //// case where user is completely new and instead of adding anything to the cart perform login directly 
        // now this case will fail
        await Cart.updateOne(
            {userId:userId},
            {$set:{products:mergedArray}},
            {session,upsert:true}
        )

        await session.commitTransaction()
        return true

    }catch(error){
        await session.abortTransaction()
        console.log(error)
        return false
    }
}

// working
export async function cartCleanUp(productId, productVariation) {
    try {
        let cartUserIds = await Product.findById(productId).select("cart")
        cartUserIds = cartUserIds["cart"] /// it will be array of ids

        await Promise.all(
            cartUserIds.map(async id => {
                await Cart.findOneAndUpdate({ userId: id }, { $pull: { products: { productId: productId, productVariation: productVariation } } })
            })
        )

    } catch (error) {
        console.log("error in cart cleanup", error)
    }
}

export async function updateCart(req,res){
    let userId,guestId;
    const session=await mongoose.startSession(); 
    try{
        session.startTransaction();
        userId=req?.body?.userId;
        guestId=req?.cookies?.guestId

        const isUser=!!userId
        const isGuest=!!guestId

        if(!isUser && !isGuest) throw new Error("user should be either logged in or guest")
        
        let cart,cartProducts;
        if(isUser){
            cart=await Cart.findOne({userId:userId}).session(session)
            cartProducts=cart?.products;
        }else{
            cart=await Cart.findOne({guestId:guestId}).session(session)
            cartProducts=cart?.products
        }
        
        let updatedCartProducts=req?.body?.cartItems

        if(cartProducts.length!==updatedCartProducts.length) throw new Error("Something wrong with the cart") 
        
        let productMap=new Map()
        for(let i=0;i<cartProducts.length;i++){
            const key=`${cartProducts[i].productId}_${cartProducts[i].productVariation}`
            productMap.set(key,cartProducts[i]);
        }

        for(let i=0;i<updatedCartProducts.length;i++){
            const key=`${updatedCartProducts[i].productId}_${updatedCartProducts[i].productVariation}`
            const item=productMap.get(key)
            if(!item) throw new Error("Something wrong with cart")
        }

        ///// reserving the products
        for(let i=0;i<updatedCartProducts.length;i++){
            const item=updatedCartProducts[i];
            const key=`${item?.productId}_${item?.productVariation}`
            let diff=productMap.get(key).productQuantity-item?.productQuantity
            /// do some reservation
            if(diff<0){
                const res= await Product.updateOne(
                    {_id:item?.productId,
                        $expr:
                        {
                            $gte:[
                                {
                                    $subtract:[`stock.${item?.productVariation}`,`reservedStock.${item?.productVariation}`],
                                },Math.abs(diff)
                            ]
                        }
                    },
                    {
                        $inc:{
                            [`reservedStock.${item?.productVariation}`]:Math.abs(diff)
                        }
                    },
                    {session}
                )
                if(res?.modifiedCount===0) throw new Error("Something went wrong in reservation")
            }
            else if(diff>0){
                const res= await Product.updateOne(
                    {_id:item?.productId,[`reservedStock.${item?.productVariation}`]:{$gte:diff}},
                    {
                        $inc:{
                            [`reservedStock.${item?.productVariation}`]:-diff
                        }
                    },
                    {session}
                )
    
                if(res?.modifiedCount===0) throw new Error("Something went wrong in reservation")
            }else continue;

            diff*=-1
            if(isUser){
                await Cart.updateOne(
                    {
                        userId,
                        "products.productId": item.productId,
                        "products.productVariation": item.productVariation
                    },
                    {
                        $inc: {
                        "products.$.productQuantity": diff
                        }
                    },
                    { session }
                );
            }else{
                await Cart.updateOne(
                    {
                        guestId,
                        "products.productId": item.productId,
                        "products.productVariation": item.productVariation
                    },
                    {
                        $inc: {
                        "products.$.productQuantity": diff
                        }
                    },
                    { session }
                );
            }
        }
        await session.commitTransaction()

        return res.status(200).json({ bool: true });
    }catch(error){
        await session.abortTransaction()
        console.log(error);
        return res.status(500).json({message:"Server side gone wrong at update Cart"})
    }finally{
        await session.endSession();
    }
}

/// working for loggedin user as this functionality is currently with logged in users only
export async function getProductQuantityViaUserId(req, res) {
    try {
        // console.log("holaaaaa")
        const { userId, productId, productVariation } = req?.body
        if (!userId || !productId || productVariation === undefined) return res.status(400).json({ message: "All details are required" })
        const cart = await Cart.findOne({ userId: userId })

        if (!cart) return res.status(404).json({ message: "Cart not found" })

        const products = cart.products;
        for (let i = 0; i < products.length; i++) {
            if (products[i]["productId"].toString() === productId && products[i]["productVariation"] === productVariation) {
                return res.status(200).json({ quantity: products[i]["productQuantity"] })
            }
        }
        return res.status(200).json({ quantity: 0 })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server problem in fetching getProductQuantityViaUserId" })
    }
}