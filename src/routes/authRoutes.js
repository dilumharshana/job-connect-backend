import express from "express";
import { authUser } from "../modules/auth-module/authController.js";

const router = express.Router();

router.post("/login", async (req, res) => await authUser(req, res));

export default router;
