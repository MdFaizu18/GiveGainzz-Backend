import { Router } from "express";
import { commentOnPost, createPost, getPosts, getUserPosts, interestedPost } from "../controllers/postController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = Router();

router.use(authMiddleware)

// Route handling for user registration
router.post('/create', createPost);
router.get('/get', getPosts);
router.get('/get/own', getUserPosts);
router.get('/interest/:id', interestedPost);
router.post('/comment/:id', commentOnPost);

export default router; 