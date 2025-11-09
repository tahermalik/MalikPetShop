import User from "../schema/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Product from "../schema/productSchema.js";
import Order from "../schema/orderSchema.js";
import FeedBack from "../schema/feedBackSchema.js";
import mongoose from "mongoose";

/// working
export async function login(req, res) {
    try {
        console.log("in this login component")
        const {email,password}=req.body;
        const role=req.params?.role || "user";

        console.log("role",role)
        
        if(!email || !password){
            return res.status(400).json({message:"All the fields are mandatory",bool:false});
        }

        const user=await User.findOne({email:email}).select("-email")
        if(!user){
            return res.status(400).json({message:"either email or password is not correct",bool:false});
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"either email or password is not correct",bool:false});
        }

        if(user.role!==role) return res.status(400).json({message:"either email or password is not correct",bool:false});

        //// if the code is reached till here that user is genuine
        const token = jwt.sign(
            { id: user._id, email: user.email ,username:user.username,role:role},
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // token valid for 1 hour
        );
        return res.status(200).cookie("token",token,{httpOnly:true,sameSite:"None",maxAge: 3600000}).json({ message: `login ${user.username}`,bool:true,user:user })
    } catch (error) {
        console.log("wrong in login", error)
        return res.status(500).json({message:"something wrong at the server side",bool:false})
    }
}


/// working
export async function register(req, res) {
    try {
        console.log("in this register component")

        // destructuring the username,email and paswsword
        const { username, email, password } = req.body;

        // if any data comes null
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" ,bool:false});
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" ,bool:false});
        }

        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: "user already is registered" ,bool:false})
        }

        const hash_password = await bcrypt.hash(password, 10);
        user = await User.create({
            email: email,
            username: username,
            password: hash_password,
            role:"user"
        })

        return res.status(201).json({ message: `hello  ${username} register done`,bool:true })
    } catch (error) {
        console.log("wrong in register", error)
        return res.status(500).json({message:"error at the server side",bool:false})
    }
}

export async function logout(req,res){
    try{
        console.log("inside the logout function")
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,     // same as when you set it
            sameSite: "strict"
        });
        // console.log(req.user)
        return res.status(200).json({message:`${req.user.username} logout successfully`})

    }catch(error){
        console.log("something went wrong in logout",error)
        return res.status(500).json({message:"something went wrong in logout"})
    }
}

export async function viewCompanyFood(req,res){
    try{
        const {company}=req.body;
        const data=await Product.find({company:company})
        return res.status(200).json({message:data,company:company})

    }catch(error){
        console.log("wrong in view product",error);
        return res.status(500).json({message:"something went wrong at the server side"})
    }
}

export async function viewFood(req,res){
    try{
        let {animal}=req.body
        animal=animal.toLowerCase();
        let company_name=[]
        if(animal==="dog") company_name=["smart heart","pedigree","drools","chappi"];
        else company_name=["meo","whiskas"]

        let all_foods={}
        for(let i=0;i<company_name.length;i++){
            let result = await Product.aggregate([
                { $match: {company:`${company_name[i]}` } },
                { $sample: { size: 10 } }
                ]);
    
            all_foods[`${company_name[i]}`]=result
        }
        return res.status(200).json({message:`all foods for ${animal}`,all_foods})

    }catch(error){
        console.log("wrong in view product",error);
        return res.status(500).json({message:"something went wrong at the server side"})
    }
}

export async function addCart(req,res){
    try{
        const product_id=req.params.id;
        let cartData=await User.findById(req?.user?.id).select("-password")
        cartData=cartData.cart

        let item_price=await Product.findById(product_id)
        item_price=Math.ceil((item_price.originalPrice*item_price.discount)/100)
        //// removing the item from the cart
        for(let i=0;i<cartData.length;i++){
            if(cartData[i]["product_id"]==product_id){
                await User.findByIdAndUpdate(
                    req?.user?.id,
                    { $pull: { cart: { product_id: product_id } } },
                    { new: true }
                    );
                return res.status(200).json({message:"Item removed from the cart"})
            }
        }


        //// adding the item into the cart
        await User.findByIdAndUpdate(
            req?.user?.id,
            { $push: { cart: { product_id: product_id ,price:item_price} } },
            { new: true }
            );
        return res.status(200).json({message:"Item added succesfully"})

    }catch(error){
        console.log("Something wrong at server side in addCart",error)
        return res.status(500).json("something wrong at server end")
    }
}

/// working -> addition and removal of the products  ;;; user should be login for this
export async function favourite(req,res){
    try{
        console.log("inside favourite")
        let {userId,productId,toAdd,productVariation}=req?.body

        let result=await Product.findById(productId)
        if(!result) return res.status(404).json({message:"Product not found",bool:false})

        result = await User.findById(userId)
        if(!result) return res.status(404).json({message:"User not found",bool:false})
        // console.log(userId,productId)
        if(toAdd){
            console.log("Adding Product to wishList")
            await Promise.all([
                User.findByIdAndUpdate(userId, { $push: { wishList: {productId:productId,productVariation:productVariation} } }),
                Product.findByIdAndUpdate(productId, { $push: { wishList: userId } })
            ]);
        }else{
            console.log("removing product from wishList")
            /// we dont need to remove it from the wishlist
            await Promise.all([
                User.findByIdAndUpdate(userId, { $pull: { wishList: {productId:productId,productVariation:productVariation} } }),
                Product.findByIdAndUpdate(productId, { $pull: { wishList: userId } })
            ]);
            return res.status(200).json({message:"Item removed from the wishlist"})
        }
        return res.status(200).json({message:"Item added succesfully to wishlist"})

    }catch(error){
        console.log("Something wrong at server side in addWhishList",error)
        return res.status(500).json("something wrong at server end")
    }
}

////  user should be login for this ; working
export async function viewWishList(req,res){
    try{
        const userId=req?.params?.id /// receiving the user id

        // Check if userId is valid ObjectId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID", bool: false });
        }

        let userWishList=await User.findById(userId).select("wishList") /// just fetching out the wishList

        if(!userWishList) return res.status(404).json({message:"User not found",bool:false})
        const productIds=userWishList?.wishList        

        // console.log([productIds])
        const productVariationArray=productIds.map((obj)=>{
            return obj["productVariation"]
        })

        const ids=productIds.map((obj)=>{
            return obj["productId"] 
        })

        const productData=await Product.find({_id:{$in:ids}})
        console.log("varaition",productVariationArray,ids)
        return res.status(200).json({productData:productData,productVariationArray:productVariationArray,bool:true})
    }catch(error){
        console.log("error in view wishList",error)
        return res.status(500).json({message:"Server fucked up in view WishList"})
    }
}

export async function mergeWishList(req,res){
    try{
        // console.log("helllo")
        const userId=req?.params?.id;

        //// it only contains 2 things one product id and then its quantity
        const {reduxWishListData}=req?.body; /// array of objects

        // console.log(userId,reduxCartData,"inside mergeCartItems")
        let existingProducts=await User.findById(userId).select("wishList")

        // console.log(userId,reduxWishListData,existingProducts)

        //// if existingProduct is found
        if(existingProducts){
        
            existingProducts=existingProducts["wishList"]
            //// both reduxCartData and existingProducts are the array of objects
            // console.log(existingProducts)

            const newItems = reduxWishListData.filter(
                (r) =>
                    !existingProducts.some(
                    (e) => e.productId === r.productId && e.productVariation === r.productVariation
                )
            );

            if (newItems.length > 0) {
                await User.findByIdAndUpdate(
                    userId ,
                    { $push: { wishList: { $each: newItems } } }
                );
            }
        }
        return res.status(200).json({ message: "WishList Data merger successfully"});
        
        
    }catch(error){
        console.log("wrong in mergeWishList",error);
        return res.status(500).json({message:"Error from server end in mergeWishList"})
    }
}


export async function placeOrder(req,res){
    try{
        const user_id=req?.user?.id;
        const user_data= await User.findById(user_id).select("-password")
        let cart=user_data.cart;

        let totalAmount=0

        for(let i=0;i<cart.length;i++){
            totalAmount+=cart[i].price;
        }


        await Order.create({
            user:req?.user?.id,
            items:user_data.cart,
            totalAmount:totalAmount,
            status:"Pending"
        })

        let order=await Order.find({user:req?.user?.id})
        let order_id;

        for(let i=0;i<order.length;i++){
            if(order[i].user==req?.user?.id){
                order_id=order[i]?._id;
            }
        }

        await User.findByIdAndUpdate(
            req?.user?.id,
            { $push: { orders:  order?._id} },
            { new: true } // returns the updated document
            );

        return res.status(200).json({message:"Order placed successfully"})


    }catch(error){
        console.log("wrong in place order",error);
        res.status(500).json({message:"wrong at server end in the placeOrder"})
    }
}


//// working
export async function createFeedBack(req,res){
    let result
    try{
        const userId=req?.params;
        let {message,rating}=req?.body

        message=message.trim()
        if(message.length===0) return res.status(400).json({message:"FeedBack cant be empty",bool:false})

        result=await User.findByIdAndUpdate(userId?.id,
            {$push:{feedbacks:{message:message,rating:rating}}},
            {new:true}
        )
        return res.status(200).json({bool:true})
    }catch(error){
        console.log("wrong in create feedback",error)
        return res.status(500).json({message:"server fucked up at createFeedBack",bool:false})
    }finally{
        topMostFeedBacks(req?.body?.message,req?.body?.rating,result?.username)
    }
}


/// working
async function topMostFeedBacks(message,rating,username){
    try{ 
        await FeedBack.updateOne(
            {},
            {
                $push: {
                allFeedBack: {
                    $each: [{ message, rating ,username}], // you can push one or multiple
                    $sort: { rating: -1 }         // -1 = descending order
                }
                }
            },
            { upsert: true }
        );
    }catch(error){
        console.log("error in topMostFeedback",error)
    }
}


//// custom hook will gonna call this now ; working
export async function displayFeedBack(req,res){
    try{
        console.log("inside displayFeedBack")
        const allFeedBack=await FeedBack.findOne()
        // console.log(allFeedBack)
        return res.status(200).json({feedBackData:allFeedBack?.allFeedBack})
    }catch(error){
        console.log("wrong in display FeedBack")
        return res.status(500).json({message:"Server fucked up in display feedback"})
    }
}




