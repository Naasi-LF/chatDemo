import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import UserLog from "../models/userLog.model.js";
import bcrypt from "bcryptjs";

const ADMIN_KEY = "22030531";

export const adminAuth = async (req, res, next) => {
    const key = req.headers['admin-key'] || req.query.key;
    
    if (key !== ADMIN_KEY) {
        return res.status(401).json({ error: "Invalid admin key" });
    }
    
    if (req.method === "POST" && req.path === "/auth") {
        return res.status(200).json({ message: "Admin authenticated successfully" });
    }
    
    next();
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, password } = req.body;

        const updates = {};
        if (fullName) updates.fullName = fullName;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Error updating user" });
    }
};

export const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find()
            .populate("senderId", "fullName")
            .populate("receiverId", "fullName");
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Error fetching messages" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findByIdAndDelete(id);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting message" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 首先删除与该用户相关的所有消息
        await Message.deleteMany({
            $or: [
                { senderId: id },
                { receiverId: id }
            ]
        });

        // 然后删除用户
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User and all related messages deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({ error: "Error deleting user" });
    }
};

export const getUserLogs = async (req, res) => {
    try {
        const { days = 7, userId } = req.query;
        
        // 计算日期范围
        const dateFilter = new Date();
        dateFilter.setDate(dateFilter.getDate() - parseInt(days));
        
        // 构建查询条件
        let query = { timestamp: { $gte: dateFilter } };
        if (userId) {
            query.userId = userId;
        }

        const logs = await UserLog.find(query)
            .sort({ timestamp: -1 })
            .lean();

        res.status(200).json(logs);
    } catch (error) {
        console.error("Error in getUserLogs:", error);
        res.status(500).json({ error: "Error fetching user logs" });
    }
};
