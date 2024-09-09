import userModel from "../models/userModel.js";
import { hashPassword } from "../utils/passwordUtils.js";

// creating a function for router to register a user
export const register = async (req,res)=>{
    try {
    const {userName,contact,email,password} = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await userModel.create({
        userName,
        contact,
        email,
        password:hashedPassword
    });
        const userWithoutPassword = await userModel.findById(user._id).select("-password").lean();
        res.status(201).json({ message: "User Created Successfully", userWithoutPassword });      
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"})
    }
};

