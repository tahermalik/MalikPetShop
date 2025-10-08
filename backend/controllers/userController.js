import User from "../schema/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(req, res) {
    try {
        console.log("in this login component")
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All the fields are mandatory"});
        }

        const user=await User.findOne({email:email})
        if(!user){
            return res.status(400).json({message:"either email or password is not correct"});
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"either email or password is not correct"});
        }

        //// if the code is reached till here that user is genuine
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // token valid for 1 hour
        );
        return res.status(200).cookie("token",token,{httpOnly:true,sameSite:"Strict",maxAge: 3600000}).json({ message: `login ${user.username}` })
    } catch (error) {
        console.log("wrong in login", error)
        return res.status(500).json({message:"something wrong at the server side"})
    }
}


export async function register(req, res) {
    try {
        console.log("in this register component")

        // destructuring the username,email and paswsword
        const { username, email, password } = req.body;

        // if any data comes null
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: "user already is registered" })
        }

        const hash_password = await bcrypt.hash(password, 10);
        user = await User.create({
            email: email,
            username: username,
            password: hash_password
        })

        return res.status(201).json({ message: `hello  ${username} register done` })
    } catch (error) {
        console.log("wrong in register", error)
        return res.status(500).json({message:"error at the server side"})
    }
}
