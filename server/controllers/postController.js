import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";

// to create a post 
export const createPost = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const userId = req.user;
        const user = await userModel.findById(userId);
        // Extract categories from the request body
        const { category } = req.body;
        const categoryArray = category.split(',').map(item => item.trim());
        // Add categories to the request body
        req.body.category = categoryArray;
        const post = await postModel.create({ ...req.body, author: user.userName, useRef: user._id });
        res.status(201).json({ message: "Post Created Successfully", post });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// to get the post of our own 
export const getUserPosts = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const posts = await postModel.find({ useRef: req.user })
            .sort({ createdAt: -1 })
            .select("-1");;
        res.status(200).json({ posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// to get all the posts 
export const getPosts = async (req, res) => {
    try {
        const posts = await postModel.find()
            .sort({ createdAt: -1 })
            .select("-1");
        res.status(200).json({ posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    };
};

// to toggle the interest and uninterest for a post 
export const interestedPost = async (req, res) => {
    try {
        // Fetch the post by ID
        const post = await postModel.findById(req.params.id);

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        // Fetch the interested user
        const interestedUser = await userModel.findById(req.user);

        // Check if interestedUser is found
        if (!interestedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // If the post owner (useRef) and current user (req.user) are the same, show interested users
        if (post.useRef.toString() === req.user) {
            const showInterestUsers = await userModel.find({ _id: { $in: post.interest } }).select("userName");
            // Map the result to only include the userName
            const interestedUserNames = showInterestUsers.map(user => user.userName);
            return res.status(200).json({ message: "Interested Persons", interestedUsers: interestedUserNames });
        }

        // If the current user has already shown interest, remove their interest (uninterest the post)
        if (post.interest.includes(interestedUser._id)) {
            post.interest = post.interest.filter((id) => id.toString() !== interestedUser._id.toString());
            await post.save();
            return res.status(200).json({ message: "Post Uninterested" });
        }

        // Otherwise, add their interest
        post.interest.push(interestedUser._id);
        await post.save();
        return res.status(200).json({ message: "Post Interested" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// to comment on the post 
export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user.toString();

        if (!text) return res.status(400).json({ msg: "Comment can't be empty" });

        const post = await postModel.findById(postId);
        if (!post) return res.status(404).json({ msg: "Post not found" });

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const comment = { user: user.userName, text };
        post.comments.push(comment);
        await post.save();
        res.json({ msg: "Comment added successfully", posts: post });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

