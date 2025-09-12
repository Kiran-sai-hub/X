import express from "express";
import {
  getMe,
  login,
  logout,
  singUp,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", singUp);
router.post("/login", login);
router.post("/logout", logout);

export default router;
