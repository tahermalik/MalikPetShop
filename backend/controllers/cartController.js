import Cart from "../schema/cartSchema.js";
import Product from "../schema/productSchema.js";
import mongoose from "mongoose";
import User from "../schema/userSchema.js";
import toast from "react-hot-toast";
import redisClient from "../config/redis.js";


//// all the below codes are for the login user
///// when the logged in user presses add to cart button

/// wroking for both
export async function addToCart(req, res) {
    let userId, productId, productVariation, quantity, guestId;
    const session=await mongoose.startSession()
    try {
        console.log("adding the product into cart")
        userId = req?.body?.userId
        guestId = req?.cookies?.guestId
        console.log("guestId --> ",guestId)
        productId = req?.body?.productId
        productVariation = req?.body?.productVariation
        quantity = req?.body?.quantity

        const isUser = !!userId
        const isGuest = !!guestId

        // so the productData is the object
        if (!isUser && !isGuest) return res.status(400).json({ message: "Both fields cannot be null" })

        if (!productId || productVariation === undefined || quantity === undefined) return res.status(400).json({ message: "All the fields are mandatory" })

        if (quantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity" });
        }
        const productData = await Product.findById(productId)
        // console.log(productData)

        const hashKey=isUser ? `user:${userId}`:`guest:${guestId}`
        const redisKey=`${productId}_${productVariation}`

        const productExists=await redisClient.hExists(hashKey,redisKey);
        if(productExists) return res.status(409).json({ message: "Product already in cart" });

        let cart
        if (isUser) cart = await Cart.findOne({ userId: userId })
        else cart = await Cart.findOne({ guestId: guestId })

        // console.log("Cart", cart, userId)
        if (!productData) return res.status(404).json({ message: "product not found" })

        /// making sure that the product variation is correct and not out of bound
        if (productData.netWeight.length <= productVariation || productVariation < 0) return res.status(400).json({ message: "Something went wrong while adding product to the cart" })

        /// checking the availabilty of the product
        // console.log(productData["stock"][productVariation], "Helo")
        await session.startTransaction()
        const reserveResult = await Product.updateOne(
            {
                _id: productId,
                [`stock.${productVariation}`]: { $gte: quantity },
                $expr: {
                    $gte: [
                        {
                            $subtract: [{ $arrayElemAt: ["$stock", productVariation] },
                            { $arrayElemAt: ["$reservedStock", productVariation] }
                            ]
                        },
                        quantity
                    ]
                }

            },
            {
                $inc: {
                    [`reservedStock.${productVariation}`]: quantity
                }
            },
            {session}
        )

        if (reserveResult.matchedCount === 0) {
            await session.abortTransaction()
            return res.status(400).json({ message: "Product out of stock" });
        }
        
        await redisClient.hSet(hashKey,redisKey,quantity)
        if(isGuest) await redisClient.expire(hashKey,60*60);

        /// if already there are some items in the cart
        if (cart) {
            // need to work more on this section of add to cart
            const existingProduct = cart.products.find(
                p =>
                    p.productId.toString() === productId &&
                    p.productVariation === productVariation
            );


            if (existingProduct) {
                // rollback reservation
                await Product.updateOne(
                    { _id: productId },
                    { $inc: { [`reservedStock.${productVariation}`]: -quantity } },
                    {session}
                );

                await session.abortTransaction()
                return res.status(409).json({ message: "Product already in cart" });
            }

            console.log("Adding item to the cart ", quantity)

            if (isUser) {
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
                    { upsert: true,session }
                );
            } else {
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
                    { upsert: true ,session}
                );

            }

        } else {
            console.log("creating the cart", quantity)

            /// only do rollback when reservation is done successfully

            if (isUser) {
                await Cart.create({
                    userId: userId,
                    products: [{
                        productId: productId,
                        productVariation: productVariation,
                        productQuantity: quantity,
                        reservedAt: new Date()
                    }]
                })
            } else {
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
        if (isUser) await Product.findByIdAndUpdate(productId, { $addToSet: { cart: userId } },{session})
            
        /// commiting the transaction
        await session.commitTransaction()

        await redisClient.del(hashKey); // invalidate cache
        return res.status(200).json({ message: "item added to the cart successfully" })

    } catch (error) {
        session.abortTransaction()
        console.log("wrong in add to cart", error);
        return res.status(500).json({ message: "Server fucked at add to cart" })
    }
}

/// working for both
export async function getCartItems(req, res) {
    try {
        console.log("inside getCartItems")
        let userId = req?.params?.userId;
        let isUser = !!userId
        let guestId = req?.cookies?.guestId;
        let isGuest = !!guestId
        if(userId==="undefined"){
            isUser=false
            userId=undefined
        }

        if (!isUser && !isGuest) return res.status(400).json({ message: "User should either be Guest or loggedIn" })

        
        const hashKey=isUser ? `user:${userId}`:`guest:${guestId}`
        console.log(hashKey)

        try{
            const isPresent=await redisClient.exists(hashKey)
            if(isPresent){
                let products=await redisClient.hGetAll(hashKey)
                products=Object.values(products)

                const productsArray=[]
                for(let i=0;i<products.length;i++){
                    productsArray.push(JSON.parse(products[i]));
                }
                console.log("redis is returning")
                return res.status(200).json({ cartData:  productsArray})
            }else{
                console.log("Mongo is returning")
            }
        }catch(error){
            console.log("redis failed",error)
        }
        let result;
        if (isUser && userId !== "undefined") result = await Cart.findOne({ userId: userId })
        else {
            result = await Cart.findOne({ guestId: guestId })
            // console.log("Tahah",result)
        }

        if (!result) return res.status(404).json({ message: "Cart Not found", bool: false })
        // console.log(result?.products)

        try{
            /// as hSet accepts only plain object
            const productMap={}
            for(let i=0;i<result?.products?.length;i++){
                const productKey=`${result?.products[i].productId}_${result?.products[i].productVariation}`
                productMap[productKey]=JSON.stringify(result?.products[i]);
            }
            if (Object.keys(productMap).length > 0) {
                await redisClient.hSet(hashKey, productMap);
                await redisClient.expire(hashKey,60*60)
            }
        }catch(error){
            console.log("redis failed",error)
        }
        return res.status(200).json({ cartData: result?.products })
    } catch (error) {
        console.log("server fucked up at getCartItems", error)
        return res.status(500).json({ message: "server fucked up at getCartItems" })
    }
}

/// working for both
export async function removerCartItem(req, res) {
    let userId, productId, productVariation, guestId, productQuantityData;

    const session=await mongoose.startSession()
    try {
        
        userId = req?.body?.userId
        productId = req?.body?.productId
        productVariation = req?.body?.productVariation
        guestId = req?.cookies?.guestId

        const isUser = !!userId
        const isGuest = !!guestId

        
        if (!isUser && !isGuest) return res.status(400).json({ message: "User should be either logged or guest" })
           
        const hashKey=isUser ? `user:${userId}`:`guest:${guestId}`
        const redisKey=`${productId}_${productVariation}`

        // console.log("remove button got clicked")
        let cart
        if (isUser) {
            cart = await Cart.findOne({ userId }).select("products").session(session)
        } else cart = await Cart.findOne({ guestId: guestId }).select("products").session(session)
        // console.log("Taher", cart, guestId)
        if (!cart) return res.status(404).json({ message: "Cart not found", bool: false })

        const cartItem = cart.products.find((p) => p.productId.toString() === productId && p.productVariation === productVariation)

        if (!cartItem) return res.status(404).json({ message: "Product not Found" })

        productQuantityData = cartItem["productQuantity"]

        /// start of the transaction
        await session.startTransaction()

        const productResult = await Product.updateOne(
            {
                _id: productId,
                [`reservedStock.${productVariation}`]: { $gte: productQuantityData }
            },
            { $inc: { [`reservedStock.${productVariation}`]: -productQuantityData } },
            {session}
        )


        if (productResult.modifiedCount === 0){
            await session.abortTransaction()
            return res.status(400).json({ message: "failed to release reservation" })
        }
        
        let result
        if (isUser) {
            result = await Cart.updateOne(
                { userId: userId },
                { $pull: { products: { productId: productId, productVariation: productVariation } } },
                {session}
            )
        } else {
            result = await Cart.updateOne(
                { guestId: guestId },
                { $pull: { products: { productId: productId, productVariation: productVariation } } },
                {session}
            )
        }

        if (result.modifiedCount === 0){
            await session.abortTransaction()
            return res.status(404).json({ message: "Product not found", bool: false })
        }


        /// this is done to find out whether any variation of product is still present in the cart or not
        if (isUser) {
            cart = await Cart.findOne({ userId }).select("products").session(session)
            const exists = cart.products.some((item) => item["productId"].toString() === productId)
            if (!exists) {
                await Product.findByIdAndUpdate(productId, { $pull: { cart: userId } }).session(session);
            }
        }
        await session.commitTransaction();

        // Redis failure must never affect API success once DB commit is done
        const deleted=await redisClient.del(hashKey).catch(err => {
            console.error("Redis cleanup failed", err)
        });
        

        return res.status(200).json({ message: "Product removed from the cart", bool: true })
    } catch (error) {
        console.log("wrong in removeCartItem", error);
        await session.abortTransaction();
        return res.status(500).json({ message: "Error from server end in removeCartItems", bool: false })
    }
}

/// per user there is only one cart; working for both
export async function mergeCartItems(userId, guestId) {
    const session = await mongoose.startSession() // this will start the session
    console.log("inside merge cart items")
    try {

        const isGuest = !!guestId
        if (!isGuest) return false;
        session.startTransaction();
        let guestProducts = await Cart.findOne({ guestId: guestId }).session(session)
        let userProducts = await Cart.findOne({ userId: userId }).session(session)


        guestProducts = guestProducts?.products || []
        userProducts = userProducts?.products || []

        const productMap = new Map();
        for (let i = 0; i < userProducts.length; i++) {
            const key = `${userProducts[i].productId}_${userProducts[i].productVariation}`
            productMap.set(key, userProducts[i])
        }

        for (let i = 0; i < guestProducts.length; i++) {
            const key = `${guestProducts[i].productId}_${guestProducts[i].productVariation}`
            const item = productMap.get(key)
            if (item) {
                item.productQuantity += guestProducts[i].productQuantity
                item.reservedAt = new Date()
            } else productMap.set(key, guestProducts[i])
        }

        for (let i = 0; i < guestProducts.length; i++) {
            const item = guestProducts[i]
            const res = await Product.updateOne(
                { _id: item.productId, [`reservedStock.${item.productVariation}`]: { $gte: item.productQuantity } },
                {
                    $inc: {
                        [`reservedStock.${item.productVariation}`]: -item.productQuantity
                    }
                },
                { session }
            )
            if (res.modifiedCount === 0) throw new Error("Reservation relaease failed")
        }

        await Cart.deleteOne({ guestId: guestId }).session(session)

        const mergedArray = Array.from(productMap.values());
        for (let i = 0; i < mergedArray.length; i++) {
            const item = mergedArray[i];

            const ele = userProducts.find((p) => {
                return p.productId.toString() === item.productId.toString() && p.productVariation === item.productVariation
            })

            let qty = 0;
            if (ele) qty = ele.productQuantity

            const guestQuantity = item.productQuantity - qty

            if (guestQuantity > 0) {
                const res = await Product.updateOne(
                    { _id: item.productId, [`stock.${item.productVariation}`]: { $gte: guestQuantity } },
                    {
                        $inc:
                        {
                            [`reservedStock.${item.productVariation}`]: guestQuantity
                        }
                    },
                    { session }
                )

                if (res.modifiedCount === 0) throw new Error("Stock reservation failed")
            }
        }

        const keys = new Set()
        for (let i = 0; i < mergedArray.length; i++) {
            const key = mergedArray[i].productId
            keys.add(key)
        }
        await Product.updateMany(
            { _id: { $in: [...keys] } },
            { $addToSet: { cart: userId } },
            { session }
        )

        ///if we dont make use of upsert : true then
        //// case where user is completely new and instead of adding anything to the cart perform login directly 
        // now this case will fail
        await Cart.updateOne(
            { userId: userId },
            { $set: { products: mergedArray } },
            { session, upsert: true }
        )

        await session.commitTransaction()
        return true

    } catch (error) {
        await session.abortTransaction()
        console.log(error)
        return false
    }finally{
        await session.endSession()
    }
}

// working
export async function cartCleanUp(productId, productVariation,session) {
    try {
        let cartUserIds = await Product.findById(productId).select("cart").session(session)
        cartUserIds = cartUserIds["cart"] /// it will be array of ids

        await Promise.all(
            cartUserIds.map(async id => {
                await Cart.findOneAndUpdate({ userId: id }, { $pull: { products: { productId: productId, productVariation: productVariation } } },{session})
            })
        )

    } catch (error) {
        console.log("error in cart cleanup", error)
    }
}

export async function updateCart(req, res) {
    let userId, guestId;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        
        userId = req?.body?.userId;
        guestId = req?.cookies?.guestId

        const isUser = !!userId
        const isGuest = !!guestId

        if (!isUser && !isGuest) throw new Error("user should be either logged in or guest")

        let cart, cartProducts;
        if (isUser) {
            cart = await Cart.findOne({ userId: userId }).session(session)
            cartProducts = cart?.products;
        } else {
            cart = await Cart.findOne({ guestId: guestId }).session(session)
            cartProducts = cart?.products
        }


        // console.log("hola",cartProducts)

        let updatedCartProducts = req?.body?.cartItems
        // console.log("Updated Cart",updatedCartProducts)


        let productMap = new Map()
        for (let i = 0; i < cartProducts?.length; i++) {
            const key = `${cartProducts[i].productId.toString()}_${cartProducts[i].productVariation}`
            productMap.set(key, cartProducts[i]);
        }

        for (let i = 0; i < updatedCartProducts?.length; i++) {
            const key = `${updatedCartProducts[i].productId.toString()}_${updatedCartProducts[i].productVariation}`
            const item = productMap.get(key)
            // console.log(item,"item of DB cart",updatedCartProducts[i],"    ")

            if (!item) throw new Error("Something wrong with cart")
        }

        ///// reserving the products
        for (let i = 0; i < updatedCartProducts?.length; i++) {
            const item = updatedCartProducts[i];
            const key = `${item?.productId.toString()}_${item?.productVariation}`
            console.log(key)
            let diff = item?.productQuantity - productMap.get(key).productQuantity
            /// do some reservation
            if (diff > 0) {
                const res = await Product.updateOne(
                    {
                        _id: item?.productId,
                        $expr:
                        {
                            $gte: [
                                {
                                    $subtract: [{ $arrayElemAt: ["$stock", item?.productVariation] },
                                    { $arrayElemAt: ["$reservedStock", item?.productVariation] }
                                    ]
                                }, diff
                            ]
                        }
                    },
                    {
                        $inc: {
                            [`reservedStock.${item?.productVariation}`]: diff
                        }
                    },
                    { session }
                )
                if (res.matchedCount === 0) {
                    throw new Error("Insufficient stock");
                }
            }
            else if (diff < 0) {
                const res = await Product.updateOne(
                    { _id: item?.productId, [`reservedStock.${item?.productVariation}`]: { $gte: Math.abs(diff) } },
                    {
                        $inc: {
                            [`reservedStock.${item?.productVariation}`]: diff
                        }
                    },
                    { session }
                )
                if (res.matchedCount === 0) {
                    throw new Error("Invalid reserved stock release");
                }
            } else continue;

            const productId = new mongoose.Types.ObjectId(item.productId);
            const res = await Cart.updateOne(
                isUser ? { userId } : { guestId },
                {
                    $inc: {
                        "products.$[elem].productQuantity": diff
                    }
                },
                {
                    session,
                    arrayFilters: [
                        {
                            "elem.productId": productId,
                            "elem.productVariation": item.productVariation
                        }
                    ]
                }
            );
        }
        await session.commitTransaction()

        return res.status(200).json({ bool: true });
    } catch (error) {
        await session.abortTransaction()
        console.log(error);
        return res.status(500).json({ message: "Server side gone wrong at update Cart" })
    } finally {
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