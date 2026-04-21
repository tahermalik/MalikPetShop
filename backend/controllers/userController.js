import User from "../schema/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Product from "../schema/productSchema.js";
import Order from "../schema/orderSchema.js";
import FeedBack from "../schema/feedBackSchema.js";
import mongoose, { mongo } from "mongoose";
import { mergeCartItems } from "./cartController.js";
import ForgotPassword from "../schema/forgotPassword.js";
import Address from "../schema/addressSchema.js";
import Cart from "../schema/cartSchema.js";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../config/redis.js";
import axios from "axios";
import { REC_ENDPOINT } from "../config/endpoints.js";
import { validate_coupon } from "./couponController.js";
import Counter from "../schema/counterSchema.js";
import Coupon from "../schema/couponSchema.js";
import nodemailer from "nodemailer";
import toast from "react-hot-toast";
import emailQueue from "../queues/emailQueue.js";
import generalQueue from "../queues/generalQeue.js";
import { getIO } from "../socket.js";

/// working
export async function login(req, res) {
    try {
        console.log("in this login component")
        const { email, password, reduxWishListData } = req.body;
        const guestId = req?.cookies?.guestId
        const role = req.params?.role || "user";

        // const isGuest=!!guestId
        // console.log(isGuest,"Holaaa")
        // if(!isGuest) return res.status(404).json({message:"Something is wrong"})

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
            { id: user._id, username: user.username, role: role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // token valid for 7 days
        );
        const updatedWishListData=await mergeWishList(user._id, reduxWishListData)
        await mergeCartItems(user._id, guestId)

        const updatedUser = await User.findById(user._id).select("-email")
        // console.log("toeken",token)
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie is the container so both the container and its data is valid for 7 days
        });
        return res.status(200).json({ message: `Welcome @${user.username}`, bool: true, user: updatedUser,updatedWishListData:updatedWishListData })
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

/// workinig
export async function logout(req, res) {
    try {
        console.log("inside the logout function")
        const token = req?.cookies?.token
        if (!token) return res.status(400).json({ message: "user is not logged in" })
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,     // same as when you set it
            sameSite: "none"
        });

        // console.log(req.user)
        return res.status(200).json({ message: ` logout successfully` })

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

/// This 3 features are working but here the data of the user who is not logged in is on the redux
// export async function favourite(req, res) {
//     try {
//         console.log("inside favourite")
//         // if the user is guest
//         if(req?.userInfo===undefined) return res.status(200).json({message:"As the user is guest"})

//         const wishList=req?.body?.wishList
//         const userId=req?.userInfo?.id

//         const hashKey=`${userId}_WishList`

//         const productIds=wishList.map((obj)=>obj["productId"])
//         const result=await Product.find({_id:{$in:productIds}}).select("_id netWeight")

//         const DBProductMap=new Map();
//         for(let i=0;i<result.length;i++){
//             DBProductMap.set(result[i]["_id"].toString(),result[i]["netWeight"])
//         }


//         const realProductIds=[]

//         for(let i=0;i<productIds.length;i++){
//             const result=DBProductMap.get(productIds[i].toString())
//             if(result===undefined) return res.status(400).json({message:"There is some problem with the productIds"})
//             const netWeightLength=result.length
//             const productVariation=wishList[i]["productVariation"]
//             if(productVariation>=netWeightLength || productVariation<0) return res.status(400).json({message:"There is some problem with the product Variation"})
//             realProductIds.push(productIds[i])
//         }



//         // console.log(wishList,"Hola")
//         let wishListDB=await User.findById(userId).select("wishList").lean()
//         wishListDB=wishListDB["wishList"]   // this will be the array of objects

//         // will be an array id_var
//         const wishList_str=wishList.map((obj)=>`${obj["productId"]}_${obj["productVariation"]}`)
//         const wishListDB_str=wishListDB.map((obj)=>`${obj["productId"]}_${obj["productVariation"]}`)

//         // this will be the array of new id_var which were not there in the db
//         const newProducts=[]
//         for(let i=0;i<wishList_str.length;i++){
//             const str=wishList_str[i];
//             if(!wishListDB_str.includes(str)){
//                 const obj={}
//                 const split_list=str.split("_")
//                 obj["productId"]=split_list[0];
//                 obj["productVariation"]=split_list[1];
//                 newProducts.push(obj)
//             }
//         }

//         // console.log(wishList_str,wishListDB_str,newProducts,"newProducts")

//         // console.log("Adding Product to wishList",newProducts)

//         if(newProducts.length === 0){
//             return res.status(200).json({ message: "Wishlist already up to date" })
//         }

//         await Promise.all([
//             User.findByIdAndUpdate(userId, { $addToSet: { wishList: {$each:newProducts} } }),
//             Product.updateMany({_id:{$in:realProductIds}}, { $addToSet: { wishList: userId } })
//         ]);

//         let wishListData=[...wishListDB,...newProducts]

//         await redisClient.set(hashKey,JSON.stringify(wishListData))
//         await redisClient.expire(hashKey, 60*60); // expiry of 1 hour

//         return res.status(200).json({ message: "Item added succesfully to wishlist" })

//     } catch (error) {
//         console.log("Something wrong at server side in addWhishList", error)
//         return res.status(500).json("something wrong at server end")
//     }
// }

export async function favourite(req, res) {
    try {
        console.log("inside favourite")
        // if the user is guest
        if (req?.userInfo === undefined) return res.status(200).json({ message: "As the user is guest", comment: "GUEST" })


        const { productId, productVariation } = req.body;
        const userId = req?.userInfo?.id;

        const rateLimitKey = `fav_rate:${userId}`

        try {
            const requestCount = await redisClient.incr(rateLimitKey);

            if (requestCount === 1) {
                await redisClient.expire(rateLimitKey, 1);
            }

            if (requestCount > 5) {
                return res.status(429).json({
                    message: "Too many requests, please slow down"
                });
            }
        } catch (err) {
            console.log("Redis rate limit failed, allowing request");
        }

        if (!productId || productVariation === undefined) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        const hashKey = `WishList:${userId}`


        // console.log(wishList,"Hola")
        let wishListDB = await User.findById(userId).select("wishList").lean()
        wishListDB = wishListDB["wishList"]   // this will be the array of objects

        const exists = wishListDB.some(
            (item) =>
                item.productId.toString() === productId.toString() &&
                item.productVariation == productVariation
        );

        // remove
        if (exists) {
            await User.findByIdAndUpdate(userId, { $pull: { wishList: { productId, productVariation } } })
            let updatedWishListDB = await User.findById(userId).select("wishList").lean()
            updatedWishListDB = updatedWishListDB["wishList"]   // this will be the array of objects

            const stillExists = updatedWishListDB.some(
                (item) =>
                    item.productId.toString() === productId.toString()
            );

            if (!stillExists) await Product.findByIdAndUpdate(productId, { $pull: { wishList: userId } })

            // invalidating the cache
            await redisClient.del(`WishList:${userId}`)

            return res.status(200).json({ message: "Removed from wishlist", comment: "NOT GUEST" });

        } else { // add
            const productResult = await Product.findById(productId).select("netWeight")
            if (!productResult) return res.status(400).json({ message: "Product not found", comment: "NOT GUEST" })

            const length = productResult.netWeight?.length
            if (productVariation < 0 || productVariation >= length) return res.status(400).json({ message: "Some problem with the product variation", comment: "NOT GUEST" })

            await Promise.all([
                User.findByIdAndUpdate(userId, { $addToSet: { wishList: { productId, productVariation } } }),
                Product.findByIdAndUpdate(productId, { $addToSet: { wishList: userId } })
            ])

            // invalidating the cache
            await redisClient.del(`WishList:${userId}`)

            return res.status(200).json({ message: "Product added to wishlist", comment: "NOT GUEST" });

        }



    } catch (error) {
        console.log("Something wrong at server side in addWhishList", error)
        return res.status(500).json("something wrong at server end")
    }
}

export async function removeFavourite(req, res) {
    try {
        console.log("inside remove fav")
        if (req?.userInfo === undefined) return res.status(200).json({ message: "User is the guest", comment: "GUEST" })

        const productId = req?.body?.productId;
        const productVariation = req?.body?.productVariation

        const userId = req?.userInfo?.id;

        let wishListData = await User.findById(userId).select("wishList")
        if (!wishListData) return res.status(404).json({ message: "Wishlist not found" })

        wishListData = wishListData?.wishList;

        const initialLength = wishListData.length;

        const deleteResult = await User.findByIdAndUpdate(userId, { $pull: { wishList: { productId, productVariation } } })


        const wishListDataUpdated = await User.findById(userId).select("wishList");

        if (wishListDataUpdated.wishList.length === initialLength) {
            return res.status(404).json({ message: "Product is not in the wishlist", comment: "NOT GUEST" })
        }

        // productIds after deletion
        const productIds = wishListDataUpdated.wishList.map((obj) => obj["productId"])

        // only now need to delete userId from the product's wishlist
        // if even one element satisfies the condition return true otherwise false
        const stillExists = wishListDataUpdated.wishList.some(
            (item) => item.productId.toString() === productId.toString()
        );
        if (!stillExists) {
            await Product.findByIdAndUpdate(productId, {
                $pull: { wishList: userId }
            });
        }

        await redisClient.del(`WishList:${userId}`)

        return res.status(200).json({ message: "Product removed from the wishlist", comment: "NOT GUEST" })
    } catch (error) {
        console.log("Problem while removing from favourite for the logged in user", error)
        return res.status(500).json({ message: "Problem while removing from favourite for the logged in user" })
    }
}

/// the task of this function is to just get id and variation of the product in the wishlist and nothing else for both guest and logged in user
export async function viewWishList(req, res) {
    try {
        console.log("inside view wishlist")

        if (req?.userInfo === undefined) return res.status(200).json({ message: "User is a guest", comment: "GUEST" })

        const userId = req?.userInfo?.id;

        let wishListData = await redisClient.get(`WishList:${userId}`)

        // there is a redis hit
        if (wishListData) {
            wishListData = JSON.parse(wishListData) //wishListData will be an array of obejct id_var
            console.log("redis is returning")
            return res.status(200).json({ wishListData: wishListData, comment: "NOT GUEST" })
        }
        console.log("DB is returning")


        let userWishList = await User.findById(userId).select("wishList") /// just fetching out the wishList
        if (!userWishList) return res.status(404).json({ message: "User not found", bool: false })
        wishListData = userWishList?.wishList

        // as there was a redis miss so need to populate the redis
        await redisClient.set(`WishList:${userId}`, JSON.stringify(wishListData))
        await redisClient.expire(`WishList:${userId}`,60 * 60)

        return res.status(200).json({ wishListData: wishListData, comment: "NOT GUEST", bool: true })
    } catch (error) {
        console.log("error in view wishList", error)
        return res.status(500).json({ message: "Server fucked up in view WishList" })
    }
}
/// working
export async function mergeWishList(userId, reduxWishListData) {
    try {
        console.log("inside merging of wishlist")
        
        const wishList=reduxWishListData


        const productIds=wishList.map((obj)=>obj["productId"])
        const result=await Product.find({_id:{$in:productIds}}).select("_id netWeight")

        const DBProductMap=new Map();
        for(let i=0;i<result.length;i++){
            DBProductMap.set(result[i]["_id"].toString(),result[i]["netWeight"])
        }


        const realProductIds=[]

        for(let i=0;i<productIds.length;i++){
            const result=DBProductMap.get(productIds[i].toString())
            if(result===undefined) return new Error("There is some problem with the productIds")
            const netWeightLength=result.length
            const productVariation=wishList[i]["productVariation"]
            if(productVariation>=netWeightLength || productVariation<0) return res.status(400).json({message:"There is some problem with the product Variation"})
            realProductIds.push(productIds[i])
        }

        // console.log(wishList,"Hola")
        let wishListDB=await User.findById(userId).select("wishList").lean()
        wishListDB=wishListDB["wishList"]   // this will be the array of objects

        // will be an array id_var
        const wishList_str=wishList.map((obj)=>`${obj["productId"]}_${obj["productVariation"]}`)
        const wishListDB_str=wishListDB.map((obj)=>`${obj["productId"]}_${obj["productVariation"]}`)

        // this will be the array of new id_var which were not there in the db
        const newProducts=[]
        for(let i=0;i<wishList_str.length;i++){
            const str=wishList_str[i];
            if(!wishListDB_str.includes(str)){
                const obj={}
                const split_list=str.split("_")
                obj["productId"]=split_list[0];
                obj["productVariation"]=split_list[1];
                newProducts.push(obj)
            }
        }

        // console.log(wishList_str,wishListDB_str,newProducts,"newProducts")

        // console.log("Adding Product to wishList",newProducts)

        if(newProducts.length === 0){
            return wishListDB
        }

        await Promise.all([
            User.findByIdAndUpdate(userId, { $addToSet: { wishList: {$each:newProducts} } }),
            Product.updateMany({_id:{$in:realProductIds}}, { $addToSet: { wishList: userId } })
        ]);

        return wishListDB

    } catch (error) {
        console.log("Something wrong at server side in addWhishList", error)
        throw new Error
    }
}

//// working--> no need of transaction over here
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
        console.log("wrong in display FeedBack", error)
        return res.status(500).json({ message: "Server fucked up in display feedback" })
    }
}

// working and is session aware
export async function wishListCleanUp(productId, productVariation, session) {
    try {
        let wishListUserIds = await Product.findById(productId).select("wishList").session(session)
        wishListUserIds = wishListUserIds["wishList"] /// it will be array of ids

        await Promise.all(
            wishListUserIds.map(async id => {
                await User.findByIdAndUpdate(id, { $pull: { wishList: { productId: productId, productVariation: productVariation } } }, { session })
            })
        )

    } catch (error) {
        console.log("error in wishList cleanup", error)
    }
}

/// working
export async function sendEmail(toEmail, subject, template, comment) {
    try {
        const mailOptions = {
            from: `"MalikPetShop" <${process.env.COMPANY_MAIL_ID}>`,
            to: toEmail,
            subject: subject,
            html: template
        };

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",      // or your SMTP host
            port: 465,                   // 465 for SSL, 587 for TLS
            secure: true,                // true for port 465
            auth: {
                user: process.env.COMPANY_MAIL_ID,   // your email
                pass: process.env.EMAIL_PASSWD    // app password or SMTP password
            }
        });

        const info = await transporter.sendMail(mailOptions);
        console.log("Mail sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending Mail:", error);
        throw error;
    } finally {
        console.log(comment)
    }
}

/// working
export async function forgotPassword(req, res) {
    try {
        const userEmail = req?.body?.userEmail;
        if (!userEmail) return res.status(404).json({ message: "Email not found", bool: false })
        const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!mailRegex.test(userEmail)) return res.status(400).json({ message: "Enter the valid email address", bool: false })


        let userId = await User.findOne({ email: userEmail }).select("_id");
        if (!userId) {
            return res.status(404).json({ message: "User is not registered", bool: false })
        }
        userId = userId?._id;
        const OTP = Math.floor(100000 + Math.random() * 900000); // 6-digit number

        //// seeting the OTP key ; for faster access
        const hashKey = `user:OTP:${userId}`
        await redisClient.setEx(hashKey, 60 * 5, String(OTP))

        await ForgotPassword.findOneAndUpdate({ userId: userId._id }, { otp: OTP, expiryDate: new Date(Date.now() + 5 * 60 * 1000) }, { upsert: true })


        // //// just to check whther SMTP is running fine or not
        // transporter.verify((error, success) => {
        //     if (error) {
        //         console.log("SMTP ERROR:", error);
        //     } else {
        //         console.log("SMTP READY");
        //     }
        // });

        console.log("Inside forgot password")
        const template = `
                <div style="font-family: Arial; color: #333;">
                    <h2 style="color: #0d6efd;">Your OTP Code</h2>
                    <p>Use the following OTP to reset your password. It is valid for <strong>10 minutes</strong>.</p>
                    <h3 style="background: #f0f0f0; padding: 10px; display: inline-block;">${OTP}</h3>
                </div>
            `
        const subject = "Your OTP for Password Reset"
        const result = await sendEmail(userEmail, subject, template, "OTP MAIL")
        if (result) toast.success("OTP sent")
        return res.status(200).json({ message: "OTP sent to you mail" })

    } catch (error) {
        console.log("Server fucked up at forgotPasswd", error)
        return res.status(500).json({ message: "Server fucked up", bool: false })
    }
}

/// working
export async function verifyOTP(req, res) {
    try {
        // console.log("inside verify OTP")
        const { OTPStr, userEmail } = req?.body;
        if (!OTPStr || !userEmail) return res.status(400).json({ message: "Both the fields are mandatory", bool: false })
        let userId = await User.findOne({ email: userEmail }).select("_id")
        if (!userId) return res.status(404).json({ message: "Either OTP or email is not correct", bool: false })
        userId = userId._id

        /// this contains the OTP sent by the user
        const sentOTP = Number(OTPStr)
        const hashKey = `user:OTP:${userId}`
        const isPresent = await redisClient.exists(hashKey)
        if (isPresent) {
            const redisOTP = Number(await redisClient.get(hashKey))
            console.log("redisOTP --> ", redisOTP)
            console.log("sentOTP --> ", sentOTP)

            if (redisOTP === sentOTP) {
                await redisClient.del(hashKey)
                const resetverificationKey = `user:verification:${userId}`
                console.log("inside verify OTP --> ", resetverificationKey)
                await redisClient.setEx(resetverificationKey, 60 * 10, "Open")

                return res.status(200).json({ message: "OTP is correct", bool: true })
            }
            else return res.status(400).json({ message: "either OTP or mail is not correct", bool: false })
        }

        let OTPData = await ForgotPassword.findOne({ userId: userId }).select("otp expiryDate")
        if (!OTPData) {
            return res.status(404).json({ message: "OTP not found", bool: false });
        }
        const OTP = OTPData.otp;

        const now = new Date();
        const expiry = new Date(OTPData.expiryDate);
        if ((now - expiry) / (1000 * 60) > 5) return res.status(400).json({ message: "either OTP or mail is not correct", bool: false })

        if (OTP === sentOTP) {
            await ForgotPassword.findOneAndDelete({ userId: userId })
            return res.json({ message: "OTP is correct", bool: true })
        }
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

        let userId = await User.findOne({ email: email }).select("_id")
        if (!userId) return res.status(404).json({ message: "Either OTP or email is not correct", bool: false })
        userId = userId._id
        const resetverificationKey = `user:verification:${userId}`
        console.log(resetverificationKey)
        const redisVerificationResult = await redisClient.exists(resetverificationKey)
        if (!redisVerificationResult) return res.status(400).json({ message: "Need to verify OTP again" })
        const oldPasswordObj = await User.findOne({ email: email }).select("password");

        if (!oldPasswordObj) return res.status(404).json({ message: "User not found", bool: false });
        const oldPassword = oldPasswordObj["password"];
        const isSamePassword = await bcrypt.compare(password, oldPassword);
        if (isSamePassword) return res.status(400).json({ message: "You cant have the same password as of your old one", bool: false })

        /// deleing the key of wondow opened for reset password
        await redisClient.del(resetverificationKey)


        const newHashedPassword = await bcrypt.hash(password, 10);
        console.log("password changed")
        await User.updateOne({ email: email }, { password: newHashedPassword });

        return res.status(200).json({ message: "Password reset succesfully", bool: true });


    } catch (error) {
        console.log("Server fucked up at reset password", error)
        return res.status(500).json({ message: "Server fucked up at reset password" });
    }
}

export async function setAddress(req, res) {
    try {
        const deliverableBlocks = ["400062", "400104", "400063", "400064", "400058", "400053", "400061"]
        let { userAddress, userName, userPhoneNumber, userId } = req?.body;
        userName = userName.trim();
        userPhoneNumber = userPhoneNumber.trim();
        const pincode = userAddress[3].trim();
        const address = userAddress[0].trim() + " " + userAddress[1].trim();
        const city = userAddress[2].trim();

        //// verifying whether user do exists or not
        let result = await User.findById(userId);
        if (!result) return res.status(404).json({ message: "User not found", bool: false })

        if (!deliverableBlocks.includes(pincode)) {
            return res.status(400).json({ message: "Sorry product cant be delivered in your locality", bool: false })
        }

        result = await Address.findOne({ userId: userId });
        /// create one
        if (!result) {
            await Address.create({
                userId: userId,
                userAddress: address,
                userName: userName,
                userPinCode: pincode,
                userCity: city,
                userPhoneNumber: userPhoneNumber
            })

            return res.status(200).json({ message: "Address saved successfully", bool: true })

        } else {  //// update one
            await Address.updateOne({ userId: userId }, {
                $set: {
                    userAddress: address,
                    userName: userName,
                    userPinCode: pincode,
                    userCity: city,
                    userPhoneNumber: userPhoneNumber
                }
            })

            return res.status(200).json({ message: "Address updated successfully", bool: true })

        }
    } catch (error) {
        return res.status(500).json({ message: "Server failed at while adding the address" })
    }
}

export async function demo(req, res) {
    try {
        const userId = req?.body?.userId;
        const email = await User.findById(userId).select("email").lean()
        console.log(email["email"])

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server went wrong in demo" })
    }
}

/// working
export async function getGuestId(req, res) {
    try {
        if (!req.cookies?.guestId) {
            const guestId = uuidv4();
            res.cookie("guestId", guestId, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
        }
        res.status(200).json({ message: "Guest ID set" });
    } catch (error) {
        console.log("error while generating guest id")
    }
}

/// working
export async function ingest_products(req, res) {
    try {
        const products = await Product.find().select("_id description usp").lean()
        for (let i = 0; i < products.length; i++) products[i]["_id"] = products[i]["_id"].toString()

        // for localhost
        // const result=await axios.post("http://127.0.0.1:8001/ingest",{products},{withCredentials:true})

        // for render
        const result = await axios.post(`${REC_ENDPOINT}/ingest`, { products }, { withCredentials: true })


        return res.status(200).json({ message: result["data"] })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "something went wrong while creating embeddings" })
    }
}

// working
export async function recommendProducts(req, res) {
    try {
        console.log("inside recommend Products")
        const userQuery = req?.body["userQuery"]
        // for localhost
        // let result = await axios.post("http://127.0.0.1:8001/recommend",{userQuery},{withCredentials:true})

        // for render
        let result = await axios.post(`${REC_ENDPOINT}/recommend`, { userQuery }, { withCredentials: true })
        result = result["data"]  // list of recommended objects
        const recommendedProductIds = []

        for (let i = 0; i < result.length; i++) recommendedProductIds.push(new mongoose.Types.ObjectId(result[i]["product_id"]))
        // console.log(recommendedProductIds)

        /// productData is an array of object where each object is an product
        const productData = await Product.find({ "_id": { $in: recommendedProductIds } }).select("-wishList -cart -productString")
        // console.log(productData)
        return res.status(200).json({ result: productData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Some problem occured while processing your request" })
    }
}

async function generateOrderId() {

    const counter = await Counter.findOneAndUpdate(
        { name: "orderId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );

    const number = counter.value.toString().padStart(6, '0');

    return `ORD-${Date.now()}-${number}`;
}

function calcDsicountAmount(productId, productMap, cartDataMap) {
    const [variation, quantity] = cartDataMap.get(productId);
    let discountType = productMap.get(productId)["discountType"][variation]
    let ogPrice = productMap.get(productId)["originalPrice"][variation]
    let discountValue = productMap.get(productId)["discountValue"][variation]
    let finalPrice = 0;
    if (discountType === "flat") finalPrice += discountValue;
    else if (discountType === "percent") finalPrice += Math.floor(ogPrice * discountValue / 100)    // trying to maximize the profit
    return finalPrice * quantity
}

function calcFinalPrice(productId, productMap, cartDataMap) {
    let finalUnitPrice = 0
    const [variation, quantity] = cartDataMap.get(productId);
    let discountType = productMap.get(productId)["discountType"][variation]
    let ogPrice = productMap.get(productId)["originalPrice"][variation]
    let discountValue = productMap.get(productId)["discountValue"][variation]
    if (discountType === "flat") finalUnitPrice += (ogPrice - discountValue);
    else if (discountType === "percent") finalUnitPrice += (ogPrice - Math.floor(ogPrice * discountValue / 100))

    return finalUnitPrice * quantity

}

export async function proceed_checkout(req, res) {
    const session = await mongoose.startSession();
    try {

        const userInfo = req?.userInfo;   // all thanks to middleware
        const userId = userInfo?.id;

        // console.log(userId,"userId")

        if (!userId) return res.status(500).json({ message: "Something wrong with middleware" })

        await session.startTransaction();
        /// below things are done for cart validation
        let cartItems = await Cart.findOne({ userId: userId }).select("products").session(session)
        if (!cartItems) return res.status(404).json({ message: "Cart not found" })
        const cartId = cartItems._id.toString()
        // if cart is present then products array would be there
        // console.log(cartItems)
        cartItems = cartItems.products

        if (cartItems.length === 0) return res.status(400).json({ message: "Cart cant be empty" })

        /// cart items contains cart data
        /// fetching all the product that are present in the cart
        let productsIdArray = cartItems.map((item) => {
            return item["productId"].toString()
        })

        // productData is an array of object where each object is an product 
        let productData = await Product.find({ "_id": { $in: productsIdArray } }).session(session)
        // console.log(productData)

        console.log("inside proceed_checkout")

        const productMap = new Map();
        for (let i = 0; i < productData.length; i++) {
            productMap.set(productData[i]["_id"].toString(), productData[i]);
        }

        // creating the map for cart data just for faster lookup
        const cartDataMap = new Map();
        for (let i = 0; i < cartItems.length; i++) {
            cartDataMap.set(cartItems[i]["productId"].toString(), [cartItems[i]["productVariation"], cartItems[i]["productQuantity"]])
        }

        // product exists
        for (let i = 0; i < productsIdArray.length; i++) {
            const data = productMap.get(productsIdArray[i])
            if (data === undefined) return res.status(404).json({ message: "Product Not Found" })
        }


        // product active and stock availaibility
        for (let i = 0; i < productsIdArray.length; i++) {
            const data = productMap.get(productsIdArray[i])
            const [productVariation, productQuantity] = cartDataMap.get(productsIdArray[i])

            const rem = data["stock"][productVariation] - data["reservedStock"][productVariation]

            // console.log(rem, cartDataMap.get(productsIdArray[i])[1], productsIdArray[i])

            if (rem >= productQuantity) {
                continue;
            } else {
                return res.status(400).json({ message: "Product is out of stock" })
            }
        }





        // use latest price
        let total = 0;
        for (let i = 0; i < productsIdArray.length; i++) {
            let productId = productsIdArray[i];

            let product = productMap.get(productId);
            const [variation, quantity] = cartDataMap.get(productId);

            if (
                variation < 0 ||
                !product.discountType ||
                !product.originalPrice ||
                !product.discountValue ||
                variation >= product.discountType.length
            ) {
                return res.status(400).json({
                    message: "Invalid product variation"
                });
            }

            const price = calcFinalPrice(productId, productMap, cartDataMap)
            // console.log(price,"Hola",i)
            total += price
        }



        /// this done to ensure coupon validation
        const { flag, discountValue, couponId } = await validate_coupon(total, cartId, session)
        if (!flag) return res.status(400).json({ message: "Coupon applied is not valid" })


        ///////////////////////// for now lets assume that the payment is successful ///////////////////
        let payment = true
        if (!payment) return res.status(400).json({ message: "Payment was not successfull" })

        /// creation of order will take place now
        const orderId = await generateOrderId(session)
        const order = await Order.create([{
            orderId: orderId,
            user: userId,
            products: cartItems.map(item => ({
                product_id: item?.productId,
                quantity: cartDataMap.get(item?.productId?.toString())[1],
                productOGPrice: productMap.get(item?.productId?.toString()).originalPrice[
                    cartDataMap.get(item?.productId?.toString())[0]
                ],
                productDiscount: calcDsicountAmount(
                    item?.productId.toString(),
                    productMap,
                    cartDataMap
                ),
                priceAtPurchase: calcFinalPrice(
                    item?.productId.toString(),
                    productMap,
                    cartDataMap
                ),
                variation: cartDataMap.get(item?.productId?.toString())[0]
            })),
            subTotal: total,
            couponId: couponId === undefined ? null : couponId,
            discountAmount: discountValue,
            finalAmount: total - discountValue,
            paymentStatus: "Processing"
        }], { session });
        const createdOrder = order[0];

        ////// decrementing the stock and reserved stock
        for (let i = 0; i < productsIdArray.length; i++) {
            const productId = productsIdArray[i]
            const [variation, quantity] = cartDataMap.get(productId)
            const orderResult = await Product.updateOne(
                {
                    _id: productId,
                },
                {
                    $inc: {
                        [`reservedStock.${variation}`]: quantity * -1,
                        [`stock.${variation}`]: quantity * -1
                    }
                },
                { session }
            )

            // if this process fails then refunc should be initiated

        }

        /// cart cleanup should be done here


        /// marking the coupon usage
        await Coupon.findByIdAndUpdate(
            couponId,
            { $inc: { couponTotalUsage: 1 } },
            { session }
        )

        /// marking the status of payment as done
        await Order.findOneAndUpdate(
            { orderId: orderId },
            {
                $set: {
                    paymentStatus: "Successfull",
                    status: "Processing"
                }
            },
            { session }
        )

        await session.commitTransaction()

        console.log("Taha")
        // each element of the queue is the job
        let userEmail = await User.findById(userId).select("email").lean()
        userEmail = userEmail["email"]


        // adding job to the emailQueue
        await emailQueue.add('sendOrderConfirmation', {
            orderId: orderId,
            userEmail: userEmail,
            amount: total - discountValue
        });

        // to associate order id with the user for future processing
        await generalQueue.add("addOrderId", {
            userId: userId,
            orderId: orderId
        })

        // 🔥 Emit event
        let orderData = {
            "couponId": createdOrder["couponId"],
            "createdAt": createdOrder["createdAt"],
            "finalAmount": createdOrder["finalAmount"],
            "orderId": createdOrder["orderId"],
            "products": createdOrder["products"],
            "status": createdOrder["status"]
        }
        const io = getIO();
        io.to(userId).emit("order_update", orderData);

        // await adminQueue.add('notifyAdmin', {
        //     orderId: orderId,
        //     amount: total - discountValue
        // });

        return res.status(200).json({ message: "Checkout successful" });


        // return res.status(200).json({
        //     message: "Checkout validated successfully",
        //     totalAmount: total - discountValue
        // });
    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        return res.status(500).json({ message: "Some problem occured while procedding to checkout" })
    }
}



