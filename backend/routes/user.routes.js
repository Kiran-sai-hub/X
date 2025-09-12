import express from "express";
import {
  followUnfollowUser,
  getSuggetedUsers,
  getUserProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggetedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);

export default router;
