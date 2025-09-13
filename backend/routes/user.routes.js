import express from "express";
import {
  followUnfollowUser,
  getSuggetedUsers,
  getUserProfile,
  updateUser
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggetedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/update", protectRoute, updateUser);

export default router;
