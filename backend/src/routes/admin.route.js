import express from "express";
import { adminAuth, getAllUsers, updateUser, getAllMessages, deleteMessage, deleteUser, getUserLogs } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/auth", adminAuth);
router.get("/users", adminAuth, getAllUsers);
router.put("/users/:id", adminAuth, updateUser);
router.delete("/users/:id", adminAuth, deleteUser);
router.get("/messages", adminAuth, getAllMessages);
router.delete("/messages/:id", adminAuth, deleteMessage);
router.get("/logs", adminAuth, getUserLogs);

export default router;
