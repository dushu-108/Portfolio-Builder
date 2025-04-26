import express from "express";
import { signUp, login, logout, getStatus } from "../controller/authController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/status", protectRoute, getStatus);

export default router;