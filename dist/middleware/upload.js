"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMulterErrors = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// Use memory storage to pass file buffer to Cloudinary
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files are allowed!"));
        }
        else {
            cb(null, true);
        }
    },
});
// Middleware to handle errors from multer
const handleMulterErrors = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        return res.status(400).json({ error: err.message });
    }
    else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
};
exports.handleMulterErrors = handleMulterErrors;
