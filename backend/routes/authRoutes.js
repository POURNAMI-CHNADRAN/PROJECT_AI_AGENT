import express from "express";
import { login } from "../controllers/authController.js";
import { setPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);

router.post("/set-password/:token", setPassword);

export default router;

