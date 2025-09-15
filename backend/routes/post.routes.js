import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { commentOnPost, createPost, deletePost, getAllPosts, likeUnlikePost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.post("/likes/:id", protectRoute, likeUnlikePost);

export default router;
