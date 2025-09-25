"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.deleteUser = exports.deactivateUser = exports.updateUserStatus = exports.getUserStatus = exports.googleAuth = exports.updateUserProfile = exports.getUserById = exports.getUsers = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const otpController_1 = require("./otpController");
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
// Generate JWT
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
};
// @desc Register user → send OTP
const registerUser = async (req, res) => {
    try {
        await (0, otpController_1.sendOTP)(req, res); // delegate OTP sending to otpController
        console.log("opt send to ur email");
    }
    catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};
exports.registerUser = registerUser;
// @desc Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user || !user.password) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return res.status(400).json({ msg: "Invalid credentials" });
        const token = generateToken(user.email);
        res.json({ token, user });
    }
    catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};
exports.loginUser = loginUser;
// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await user_model_1.default.find().sort({ createdAt: -1 }); // latest first
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving users", error });
    }
};
exports.getUsers = getUsers;
// Get a single user by ID
const getUserById = async (req, res) => {
    try {
        const user = await user_model_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving user", error });
    }
};
exports.getUserById = getUserById;
// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedUser = await user_model_1.default.findByIdAndUpdate(id, updates, {
            new: true, // return the updated doc
            runValidators: true, // enforce schema validation
        });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
};
exports.updateUserProfile = updateUserProfile;
// @desc Google login/register
const googleAuth = async (req, res) => {
    try {
        const { name, email, googleId, avatar } = req.body;
        let user = await user_model_1.default.findOne({ email });
        if (!user) {
            user = new user_model_1.default({ name, email, googleId, avatar });
            await user.save();
            console.log("user saved to etbclubdb ", user);
        }
        const token = generateToken(user.email.toString());
        res.json({ token, user });
    }
    catch (error) {
        res.status(500).json({ msg: "Google auth error", error: error.message });
    }
};
exports.googleAuth = googleAuth;
// Get user status by ID
const getUserStatus = async (req, res) => {
    try {
        const user = await user_model_1.default.findById(req.params.id).select("status");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ id: user._id, status: user.status });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving user status", error });
    }
};
exports.getUserStatus = getUserStatus;
// Update user status by ID
const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["active", "inactive", "suspended"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        const user = await user_model_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }).select("status");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ id: user._id, status: user.status });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating user status", error });
    }
};
exports.updateUserStatus = updateUserStatus;
// Deactivate user (set status to "inactive")
const deactivateUser = async (req, res) => {
    try {
        const user = await user_model_1.default.findByIdAndUpdate(req.params.id, { status: "inactive" }, { new: true });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deactivated", user });
    }
    catch (error) {
        res.status(500).json({ message: "Error deactivating user", error });
    }
};
exports.deactivateUser = deactivateUser;
// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await user_model_1.default.findByIdAndDelete(req.params.id);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted", user });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};
exports.deleteUser = deleteUser;
// Logout user
const logoutUser = async (req, res) => {
    try {
        // If storing JWT in cookies, clear it
        res.clearCookie("token"); // only if using cookies
        // Otherwise, just inform the client to remove token
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error logging out", error });
    }
};
exports.logoutUser = logoutUser;
