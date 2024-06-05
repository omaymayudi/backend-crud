import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/UsersController.js";
import { verifyUser, AdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/", verifyUser, AdminOnly, getUsers);
router.get("/:id", verifyUser, AdminOnly, getUserById);
router.post("/", createUser);
router.put("/:id", verifyUser, AdminOnly, updateUser);
router.delete("/:id", verifyUser, AdminOnly, deleteUser);

export default router;
