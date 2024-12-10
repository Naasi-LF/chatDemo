import mongoose from "mongoose";

const userLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    action: {
        type: String,
        enum: ["login", "logout"],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
});

const UserLog = mongoose.model("UserLog", userLogSchema);

export default UserLog;
