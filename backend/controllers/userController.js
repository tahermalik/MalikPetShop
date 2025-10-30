import User from "../schema/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Product from "../schema/productSchema.js";
import Order from "../schema/orderSchema.js";

export async function login(req, res) {
    try {
        console.log("in this login component")
        const {email,password}=req.body;
        const role=req.params?.role || "user";

        console.log("role",role)
        
        if(!email || !password){
            return res.status(400).json({message:"All the fields are mandatory",bool:false});
        }

        const user=await User.findOne({email:email})
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


export async function addWhishList(req,res){
    try{
        const product_id=req.params.id;
        let wishData=await User.findById(req?.user?.id).select("-password")
        wishData=wishData.wishlist

        let item_price=await Product.findById(product_id)
        item_price=Math.ceil((item_price.originalPrice*item_price.discount)/100)

        //// removing the item from the cart
        for(let i=0;i<wishData.length;i++){
            if(wishData[i]["product_id"]==product_id){
                await User.findByIdAndUpdate(
                    req?.user?.id,
                    { $pull: { wishlist: { product_id: product_id} } },
                    { new: true }
                    );
                return res.status(200).json({message:"Item removed from the wishlist"})
            }
        }


        //// adding the item into the cart
        await User.findByIdAndUpdate(
            req?.user?.id,
            { $push: { wishlist: { product_id: product_id ,price:item_price} } },
            { new: true }
            );
        return res.status(200).json({message:"Item added succesfully to wishlist"})

    }catch(error){
        console.log("Something wrong at server side in addWhishList",error)
        return res.status(500).json("something wrong at server end")
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







