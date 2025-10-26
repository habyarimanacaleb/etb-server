"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.sendOTP = void 0;
const otpModel_1 = __importDefault(require("../models/otpModel"));
const user_model_1 = __importDefault(require("../models/user.model"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
// Send OTP
const sendOTP = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER, // Direct access here works
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        // Generate 6-digit OTP
        const otp = crypto_1.default.randomInt(100000, 999999).toString();
        // Hash OTP before saving
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedOtp = await bcryptjs_1.default.hash(otp, salt);
        // Save OTP record
        await otpModel_1.default.findOneAndUpdate({ email }, {
            email,
            otp: hashedOtp,
            attempts: 0,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
        }, { upsert: true });
        // Send OTP via email
        await transporter.sendMail({
            from: `"ETB Club" <${process.env.EMAIL_USER}>`, // Use it here too
            to: email,
            subject: "Your OTP Code",
            text: `Thank you for reachout  ${name}, your OTP code is: ${otp}. It will be expired in 5 minutes.`,
        });
        res.status(200).json({ message: "OTP sent to your email", otp: hashedOtp });
    }
    catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.sendOTP = sendOTP;
// Verify OTP and create user
const verifyOTP = async (req, res) => {
    try {
        const { email, otp, name, password, role } = req.body;
        const record = await otpModel_1.default.findOne({ email });
        if (!record)
            return res.status(400).json({ message: "OTP not found" });
        if (record.expiresAt < new Date())
            return res.status(400).json({ message: "OTP expired" });
        if (record.attempts >= 5)
            return res.status(400).json({ message: "Max verification attempts exceeded" });
        const isValid = await bcryptjs_1.default.compare(otp, record.otp);
        if (!isValid) {
            record.attempts += 1;
            await record.save();
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // OTP valid → create user
        const user = await user_model_1.default.create({ email, name, password, role });
        await otpModel_1.default.deleteOne({ _id: record._id });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
        res.status(201).json({ message: "User verified and created", user, token });
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.verifyOTP = verifyOTP;
