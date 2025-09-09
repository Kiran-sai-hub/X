import express from "express";
import { singUp } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/signup",singUp);

router.get("/login", );

router.get("/logout", )

export default router;