import userModel from "../models/userModel.js";
import {createJWT} from '../utils/tokenUtils.js'
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";

// creating a function for router to register a user
export const register = async (req, res) => {
    try {
        const { userName, contact, email, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const existingUser = await userModel.findOne({ $or: [{ userName }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists" });
        }
        const user = await userModel.create({
            userName,
            contact,
            email,
            password: hashedPassword
        });
        const token = createJWT({userId:user._id});
        res.cookie("token",token,{
            httpOnly:true,
            expiresIn:'1d'
        });
        // res.setHeader('Authorization', `Bearer ${token}`);
        const userWithoutPassword = await userModel.findById(user._id).select("-password").lean();
        res.status(201).json({ message: "User Created Successfully", userWithoutPassword });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

// creating a login page 
export const login = async (req, res) => {
    try {
        const { email, password ,userName} = req.body;
        const user = await userModel.findOne({ $or: [{ email }, {userName }] });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const isPassword = comparePassword(password, user.password);
        if (!isPassword) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const token = createJWT({userId:user._id});
        res.cookie("token",token,{
            httpOnly:true,
            expiresIn:'1d'
        });
        // res.setHeader('Authorization', `Bearer ${token}`);
        const userWithoutPassword = await userModel.findById(user._id).select("-password").lean();
        res.status(200).json({ message: "User Logged In Successfully", userWithoutPassword });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}