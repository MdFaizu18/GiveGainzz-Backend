import userModel from "../models/userModel.js";
import ticketModel from "../models/ticketModel.js";
import { createJWT } from "../utils/tokenUtils.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { initializeTicketsForUser } from "../controllers/ticketController.js";

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
        password: hashedPassword,
      });
  
      await initializeTicketsForUser(user._id);
  
      const token = createJWT({ userId: user._id });
      res.cookie("token", token, {
        httpOnly: true,
        expiresIn: "1d",
      });
  
      const userWithoutPassword = await userModel.findById(user._id).select("-password").lean();
      res.status(201).json({ message: "User Created Successfully", userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

export const login = async (req, res) => {
    try {
        const { email, password, userName } = req.body;

        const user = await userModel.findOne({ $or: [{ email }, { userName }] });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isPasswordValid = comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = createJWT({ userId: user._id });
        res.cookie("token", token, {
            httpOnly: true,
            expiresIn: "1d",
        });

        const userWithoutPassword = await userModel.findById(user._id).select("-password").lean();

        const userTickets = await ticketModel.find({ userId: user._id }).lean();

        res.status(200).json({ 
            message: "User Logged In Successfully", 
            user: userWithoutPassword, 
            tickets: userTickets 
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
