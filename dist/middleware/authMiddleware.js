"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
// Protect middleware
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token)
        return res.status(401).json({ message: "Not authorized, no token" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await user_model_1.default.findById(decoded.id).select("-password");
        if (!user)
            return res.status(401).json({ message: "Not authorized, user not found" });
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};
exports.protect = protect;
// Role-based middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        const authReq = req;
        if (!authReq.user || !roles.includes(authReq.user.role || "student")) {
            return res.status(403).json({ message: "Forbidden: insufficient role" });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
