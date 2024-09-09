import { Router } from "express";
import { register } from "../controllers/authController.js";

const router = Router();

// Route handling for user registration
router.post('/register', register);

export default router;
