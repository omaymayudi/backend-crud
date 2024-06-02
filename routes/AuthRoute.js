import express from "express";
import { Login, Logout, Me } from "../controller/Auth.js";

const router = express.Router();

router.get("/me", Me);
router.get("/login", Login);
router.post("/logout", Logout);

export default router;
