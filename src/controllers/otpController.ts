import { Request, Response } from "express";
import OTP from "../models/otpModel";
import User from "../models/user.model";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import Jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// ✅ REMOVED transporter creation from here

// Send OTP
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // ✅ CREATE THE TRANSPorter HERE, INSIDE THE FUNCTION
    // Now process.env will be fully loaded
    const transporter = nodemailer.createTransport({
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
    const otp = crypto.randomInt(100000, 999999).toString();

    // Hash OTP before saving
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

      // Save OTP record
    await OTP.findOneAndUpdate(
      { email },
      {
        email,
        otp: hashedOtp,
        attempts: 0,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
      },
      { upsert: true }
    );

    // Send OTP via email
    await transporter.sendMail({
      from: `"ETB Club" <${process.env.EMAIL_USER}>`, // Use it here too
      to: email,
      subject: "Your OTP Code",
      text: `Hello ${name}, your OTP code is: ${otp}. It expires in 5 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to your email" ,otp: hashedOtp});
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP and create user
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp, name, password, role } = req.body;

    const record = await OTP.findOne({ email });
    if (!record) return res.status(400).json({ message: "OTP not found" });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });
    if (record.attempts >= 5) return res.status(400).json({ message: "Max verification attempts exceeded" });

    const isValid = await bcrypt.compare(otp, record.otp);
    if (!isValid) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP valid → create user
    const user = await User.create({ email, name, password, role });
    await OTP.deleteOne({ _id: record._id });

    const token = Jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ message: "User verified and created", user, token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};