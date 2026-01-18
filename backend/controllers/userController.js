import User from "../schema/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Product from "../schema/productSchema.js";
import Order from "../schema/orderSchema.js";
import FeedBack from "../schema/feedBackSchema.js";
import mongoose from "mongoose";
import { mergeCartItems } from "./cartController.js";
import ForgotPassword from "../schema/forgotPassword.js";
import nodemailer from "nodemailer";
import Address from "../schema/addressSchema.js";
import Cart from "../schema/cartSchema.js";
import { v4 as uuidv4 } from "uuid";

/// working
export async function login(req, res) {
    try {
        console.log("in this login component")
        const { email, password, reduxCartData, reduxWishListData } = req.body;
        const guestId=req?.cookies?.guestId
        const role = req.params?.role || "user";

        const isGuest=!!guestId
        if(!isGuest) return res.status(404).json({message:"Something is wrong"})

        console.log("role", role)

        if (!email || !password) {
            return res.status(400).json({ message: "All the fields are mandatory", bool: false });
        }

        const user = await User.findOne({ email: email }).select("-email")
        if (!user) {
            return res.status(400).json({ message: "either email or password is not correct", bool: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "either email or password is not correct", bool: false });
        }

        if (user.role !== role) return res.status(400).json({ message: "either email or password is not correct", bool: false });

        //// if the code is reached till here that user is genuine
        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username, role: role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // token valid for 1 hour
        );
        await mergeWishList(user._id, reduxWishListData)
        await mergeCartItems(user._id,guestId)

        const updatedUser = await User.findById(user._id).select("-email")
        return res.status(200).cookie("token", token, { httpOnly: true, sameSite: "None", maxAge: 3600000 }).json({ message: `Welcome @${user.username}`, bool: true, user: updatedUser })
    } catch (error) {
        console.log("wrong in login", error)
        return res.status(500).json({ message: "something wrong at the server side", bool: false })
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
            return res.status(400).json({ message: "All fields are required", bool: false });
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format", bool: false });
        }

        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: "user already is registered", bool: false })
        }

        const hash_password = await bcrypt.hash(password, 10);
        user = await User.create({
            email: email,
            username: username,
            password: hash_password,
            role: "user"
        })

        return res.status(201).json({ message: `hello  ${username} register done`, bool: true })
    } catch (error) {
        console.log("wrong in register", error)
        return res.status(500).json({ message: "error at the server side", bool: false })
    }
}

export async function logout(req, res) {
    try {
        console.log("inside the logout function")
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,     // same as when you set it
            sameSite: "strict"
        });
        // console.log(req.user)
        return res.status(200).json({ message: `${req.user.username} logout successfully` })

    } catch (error) {
        console.log("something went wrong in logout", error)
        return res.status(500).json({ message: "something went wrong in logout" })
    }
}

export async function viewCompanyFood(req, res) {
    try {
        const { company } = req.body;
        const data = await Product.find({ company: company })
        return res.status(200).json({ message: data, company: company })

    } catch (error) {
        console.log("wrong in view product", error);
        return res.status(500).json({ message: "something went wrong at the server side" })
    }
}

export async function viewFood(req, res) {
    try {
        let { animal } = req.body
        animal = animal.toLowerCase();
        let company_name = []
        if (animal === "dog") company_name = ["smart heart", "pedigree", "drools", "chappi"];
        else company_name = ["meo", "whiskas"]

        let all_foods = {}
        for (let i = 0; i < company_name.length; i++) {
            let result = await Product.aggregate([
                { $match: { company: `${company_name[i]}` } },
                { $sample: { size: 10 } }
            ]);

            all_foods[`${company_name[i]}`] = result
        }
        return res.status(200).json({ message: `all foods for ${animal}`, all_foods })

    } catch (error) {
        console.log("wrong in view product", error);
        return res.status(500).json({ message: "something went wrong at the server side" })
    }
}

export async function addCart(req, res) {
    try {
        const product_id = req.params.id;
        let cartData = await User.findById(req?.user?.id).select("-password")
        cartData = cartData.cart

        let item_price = await Product.findById(product_id)
        item_price = Math.ceil((item_price.originalPrice * item_price.discount) / 100)
        //// removing the item from the cart
        for (let i = 0; i < cartData.length; i++) {
            if (cartData[i]["product_id"] == product_id) {
                await User.findByIdAndUpdate(
                    req?.user?.id,
                    { $pull: { cart: { product_id: product_id } } },
                    { new: true }
                );
                return res.status(200).json({ message: "Item removed from the cart" })
            }
        }


        //// adding the item into the cart
        await User.findByIdAndUpdate(
            req?.user?.id,
            { $push: { cart: { product_id: product_id, price: item_price } } },
            { new: true }
        );
        return res.status(200).json({ message: "Item added succesfully" })

    } catch (error) {
        console.log("Something wrong at server side in addCart", error)
        return res.status(500).json("something wrong at server end")
    }
}

/// working -> addition and removal of the products  ;;; user should be login for this
export async function favourite(req, res) {
    try {
        console.log("inside favourite")
        let { userId, productId, toAdd, productVariation } = req?.body

        let result = await Product.findById(productId)
        if (!result) return res.status(404).json({ message: "Product not found", bool: false })

        result = await User.findById(userId)
        if (!result) return res.status(404).json({ message: "User not found", bool: false })
        // console.log(userId,productId)
        if (toAdd) {
            console.log("Adding Product to wishList")
            await Promise.all([
                User.findByIdAndUpdate(userId, { $addToSet: { wishList: { productId: productId, productVariation: productVariation } } }),
                Product.findByIdAndUpdate(productId, { $addToSet: { wishList: userId } })
            ]);
        } else {
            console.log("removing product from wishList")
            /// we dont need to remove it from the wishlist

            await User.findByIdAndUpdate(userId, { $pull: { wishList: { productId: productId, productVariation: productVariation } } })

            result = await User.findById(userId).select("wishList")
            const exists = result.wishList.some((item) => item["productId"].toString() === productId)

            if (!exists) await Product.findByIdAndUpdate(productId, { $pull: { wishList: userId } })

            ///// this is done in order to delete the userId from product on cart removal

            return res.status(200).json({ message: "Item removed from the wishlist" })
        }
        return res.status(200).json({ message: "Item added succesfully to wishlist" })

    } catch (error) {
        console.log("Something wrong at server side in addWhishList", error)
        return res.status(500).json("something wrong at server end")
    }
}

////  user should be login for this ; working
export async function viewWishList(req, res) {
    try {
        const userId = req?.params?.id /// receiving the user id

        // Check if userId is valid ObjectId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID", bool: false });
        }

        let userWishList = await User.findById(userId).select("wishList") /// just fetching out the wishList

        if (!userWishList) return res.status(404).json({ message: "User not found", bool: false })
        const productIds = userWishList?.wishList

        // console.log([productIds])
        const productVariationArray = productIds.map((obj) => {
            return obj["productVariation"]
        })

        const ids = productIds.map((obj) => {
            return obj["productId"]
        })


        let productData = await Product.find({ _id: { $in: ids } }).lean()

        const productDataObj = {}
        for (let i = 0; i < productData.length; i++) {
            productDataObj[productData[i]._id] = productData[i]
        }

        productData = ids.map((id) => productDataObj[id])


        // console.log("varaition",productData)
        return res.status(200).json({ productData: productData, productVariationArray: productVariationArray, bool: true })
    } catch (error) {
        console.log("error in view wishList", error)
        return res.status(500).json({ message: "Server fucked up in view WishList" })
    }
}

/// working
export async function mergeWishList(userId, reduxWishListData) {
    try {
        userId = userId.toString()
        // console.log(userId,reduxCartData,"inside mergeCartItems")
        let existingProducts = await User.findById(userId).select("wishList")

        console.log("Prinitng this for debugging")

        //// if existingProduct is found
        if (existingProducts) {

            existingProducts = existingProducts["wishList"]
            //// both reduxCartData and existingProducts are the array of objects
            // console.log(existingProducts)

            ///// code is written so that product can have info about who has added it to the wishList
            const newItemForProductsWishList = reduxWishListData.filter(
                (r) => {
                    if (!existingProducts.some((e) => e.productId.toString() === r.productId)) {
                        return true
                    }
                }
            ).map(r => r.productId.toString())

            const newItems = reduxWishListData.filter(
                (r) =>
                    !existingProducts.some(
                        (e) => e.productId.toString() === r.productId && e.productVariation === r.productVariation
                    )
            );
            console.log(userId, reduxWishListData, newItems)


            //     console.log("new items",newItems)

            if (newItems.length > 0) {
                await User.findByIdAndUpdate(
                    userId,
                    { $addToSet: { wishList: { $each: newItems } } }
                );
            }

            if (newItemForProductsWishList.length > 0) {
                await Product.updateMany({ _id: { $in: newItemForProductsWishList } }, { $addToSet: { wishList: userId } })
            }
        }


    } catch (error) {
        console.log("wrong in mergeWishList", error);
    }
}


export async function placeOrder(req, res) {
    try {
        const user_id = req?.user?.id;
        const user_data = await User.findById(user_id).select("-password")
        let cart = user_data.cart;

        let totalAmount = 0

        for (let i = 0; i < cart.length; i++) {
            totalAmount += cart[i].price;
        }


        await Order.create({
            user: req?.user?.id,
            items: user_data.cart,
            totalAmount: totalAmount,
            status: "Pending"
        })

        let order = await Order.find({ user: req?.user?.id })
        let order_id;

        for (let i = 0; i < order.length; i++) {
            if (order[i].user == req?.user?.id) {
                order_id = order[i]?._id;
            }
        }

        await User.findByIdAndUpdate(
            req?.user?.id,
            { $push: { orders: order?._id } },
            { new: true } // returns the updated document
        );

        return res.status(200).json({ message: "Order placed successfully" })


    } catch (error) {
        console.log("wrong in place order", error);
        res.status(500).json({ message: "wrong at server end in the placeOrder" })
    }
}


//// working
export async function createFeedBack(req, res) {
    let result
    try {
        const userId = req?.params;
        let { message, rating } = req?.body

        message = message.trim()
        if (message.length === 0) return res.status(400).json({ message: "FeedBack cant be empty", bool: false })

        result = await User.findByIdAndUpdate(userId?.id,
            { $push: { feedbacks: { message: message, rating: rating } } },
            { new: true }
        )
        return res.status(200).json({ bool: true })
    } catch (error) {
        console.log("wrong in create feedback", error)
        return res.status(500).json({ message: "server fucked up at createFeedBack", bool: false })
    } finally {
        topMostFeedBacks(req?.body?.message, req?.body?.rating, result?.username)
    }
}


/// working
async function topMostFeedBacks(message, rating, username) {
    try {
        await FeedBack.updateOne(
            {},
            {
                $push: {
                    allFeedBack: {
                        $each: [{ message, rating, username }], // you can push one or multiple
                        $sort: { rating: -1 }         // -1 = descending order
                    }
                }
            },
            { upsert: true }
        );
    } catch (error) {
        console.log("error in topMostFeedback", error)
    }
}


//// custom hook will gonna call this now ; working
export async function displayFeedBack(req, res) {
    try {
        console.log("inside displayFeedBack")
        const allFeedBack = await FeedBack.findOne()
        // console.log(allFeedBack)
        return res.status(200).json({ feedBackData: allFeedBack?.allFeedBack })
    } catch (error) {
        console.log("wrong in display FeedBack",error)
        return res.status(500).json({ message: "Server fucked up in display feedback" })
    }
}

// working
export async function wishListCleanUp(productId, productVariation) {
    try {
        let wishListUserIds = await Product.findById(productId).select("wishList")
        wishListUserIds = wishListUserIds["wishList"] /// it will be array of ids

        await Promise.all(
            wishListUserIds.map(async id => {
                await User.findByIdAndUpdate(id, { $pull: { wishList: { productId: productId, productVariation: productVariation } } })
            })
        )

    } catch (error) {
        console.log("error in wishList cleanup", error)
    }
}

/// working
export async function sendOTPEmail(transporter, toEmail, otp) {
    try {
        const mailOptions = {
            from: `"MalikPetShop" <${process.env.COMPANY_MAIL_ID}>`,
            to: toEmail,
            subject: "Your OTP for Password Reset",
            html: `
                <div style="font-family: Arial; color: #333;">
                    <h2 style="color: #0d6efd;">Your OTP Code</h2>
                    <p>Use the following OTP to reset your password. It is valid for <strong>10 minutes</strong>.</p>
                    <h3 style="background: #f0f0f0; padding: 10px; display: inline-block;">${otp}</h3>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("OTP email sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending OTP email:", error);
        throw error;
    }
}

/// working
export async function forgotPassword(req, res) {
    try {
        const userEmail = req?.body?.userEmail;
        if (!userEmail) return res.status(404).json({ message: "Email not found", bool: false })
        const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!mailRegex.test(userEmail)) return res.status(400).json({ message: "Enter the valid email address", bool: false })

        const userId = await User.findOne({ email: userEmail }).select("_id");
        if (!userId) return res.status(404).json({ message: "User is not registered", bool: false })

        const OTP = Math.floor(100000 + Math.random() * 900000); // 6-digit number

        await ForgotPassword.findOneAndUpdate({ userId: userId._id }, { otp: OTP, expiryDate: new Date(Date.now() + 10 * 60 * 1000) }, { upsert: true })


        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",      // or your SMTP host
            port: 465,                   // 465 for SSL, 587 for TLS
            secure: true,                // true for port 465
            auth: {
                user: process.env.COMPANY_MAIL_ID,   // your email
                pass: process.env.EMAIL_PASSWD    // app password or SMTP password
            }
        });

        //// just to check whther SMTP is running fine or not
        transporter.verify((error, success) => {
            if (error) {
                console.log("SMTP ERROR:", error);
            } else {
                console.log("SMTP READY");
            }
        });

        await sendOTPEmail(transporter, userEmail, OTP)



        return res.status(200).json({ message: "OTP sent to you mail" })


    } catch (error) {
        console.log("Server fucked up at forgotPasswd", error)
        return res.status(500).json({ message: "Server fucked up", bool: false })
    }
}

/// working
export async function verifyOTP(req, res) {
    try {
        console.log("inside verify OTP")
        const { OTPArray, userEmail } = req?.body;
        if (!OTPArray || !userEmail) return res.status(400).json({ message: "Both the fields are mandatory", bool: false })
        let userId = await User.findOne({ email: userEmail }).select("_id")
        if (!userId) return res.status(404).json({ message: "Either OTP or email is not correct", bool: false })
        userId = userId._id


        let OTPData = await ForgotPassword.findOne({ userId: userId }).select("otp expiryDate")
        if (!OTPData) {
            return res.status(404).json({ message: "OTP not found", bool: false });
        }
        const OTP = OTPData.otp;

        const now = new Date();
        const expiry = new Date(OTPData.expiryDate);
        if ((now - expiry) / (1000 * 60) > 10) return res.status(400).json({ message: "either OTP or mail is not correct", bool: false })

        const sentOTP = Number(OTPArray.join(""))

        if (OTP === sentOTP) return res.json({ message: "OTP is correct", bool: true })
        return res.json({ message: "OTP is not correct", bool: false })

    } catch (error) {
        console.log("server fucked up in verify OTP", error);
        return res.status(500).json({ message: "server fucked up in verify OTP", bool: false })
    }
}

/// working
export async function resetPassword(req, res) {
    try {
        const { password, email } = req?.body;
        const oldPasswordObj = await User.findOne({ email: email }).select("password");

        if (!oldPasswordObj) return res.status(404).json({ message: "User not found", bool: false });
        const oldPassword = oldPasswordObj["password"];
        const isSamePassword = await bcrypt.compare(password, oldPassword);
        if (isSamePassword) return res.status(400).json({ message: "You cant have the same password as of your old one", bool: false })


        const newHashedPassword = await bcrypt.hash(password, 10);
        console.log("password changed")
        await User.updateOne({ email: email }, { password: newHashedPassword });

        return res.status(200).json({ message: "Password reset succesfully", bool: true });


    } catch (error) {
        return res.status(500).json({ message: "Server fucked up at reset password" });
    }
}

export async function setAddress(req, res) {
    try {
        const deliverableBlocks=["400062","400104","400063","400064","400058", "400053", "400061"]
        let { userAddress, userName, userPhoneNumber, userId } = req?.body;
        userName = userName.trim();
        userPhoneNumber = userPhoneNumber.trim();
        const pincode = userAddress[3].trim();
        const address = userAddress[0].trim() + " " + userAddress[1].trim();
        const city = userAddress[2].trim();

        //// verifying whether user do exists or not
        let result = await User.findById(userId);
        if (!result) return res.status(404).json({ message: "User not found" ,bool:false})
        
        if(!deliverableBlocks.includes(pincode)){
            return res.status(400).json({message:"Sorry product cant be delivered in your locality",bool:false})
        }

        result=await Address.findOne({userId:userId});
        /// create one
        if(!result){
            await Address.create({
                userId:userId,
                userAddress:address,
                userName:userName,
                userPinCode:pincode,
                userCity:city,
                userPhoneNumber:userPhoneNumber  
            })

            return res.status(200).json({message:"Address saved successfully",bool:true})

        }else{  //// update one
            await Address.updateOne({userId:userId},{$set:{
                userAddress:address,
                userName:userName,
                userPinCode:pincode,
                userCity:city,
                userPhoneNumber:userPhoneNumber  
            }})

            return res.status(200).json({message:"Address updated successfully",bool:true})

        }
    } catch (error) {
        return res.status(500).json({ message: "Server failed at while adding the address" })
    }
}

export async function demo(req,res){
    try{
        const now = new Date();
        const RESERVATION_PERIOD = 30 * 60 * 1000; // 30 min
        const carts = await Cart.find({
            "products.reservedAt": { $lt: new Date(now - RESERVATION_PERIOD) }
        });

        const carts2=await Cart.find({
            "products.reservedAt":{$lt:new Date(now - (15 * 60 * 1000))}
        })

        console.log("Hola",carts2)

    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Server went wrong in demo"})
    }
}

/// working
export async function getGuestId(req,res){
    try{
        if (!req.cookies?.guestId) {
            const guestId = uuidv4();
            res.cookie("guestId", guestId, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
        }
        res.status(200).json({ message: "Guest ID set" });
    }catch(error){
        console.log("error while generating guest id")
    }
}

