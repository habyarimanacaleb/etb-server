import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import User from "../models/user.model";
import { sendOTP } from "./otpController";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Generate JWT
const generateToken = (id: string) => {
  return Jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
};

// @desc Register user → send OTP
export const registerUser = async (req: Request, res: Response) => {
  try {
    await sendOTP(req, res); // delegate OTP sending to otpController
    console.log("opt send to ur email");
  } catch (error: any) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// @desc Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user.email);

    res.json({ token, user });
  } catch (error: any) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
};

// Get a single user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true, // return the updated doc
      runValidators: true, // enforce schema validation
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// @desc Google login/register
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { name, email, googleId, avatar } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, googleId, avatar });
      await user.save();
      console.log("user saved to etbclubdb ", user);
    }

    const token = generateToken(user.email.toString());

    res.json({ token, user });
  } catch (error: any) {
    res.status(500).json({ msg: "Google auth error", error: error.message });
  }
};

// Get user status by ID
export const getUserStatus = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("status");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ id: user._id, status: user.status });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user status", error });
  }
};

// Update user status by ID
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive", "suspended"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select("status");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ id: user._id, status: user.status });
  } catch (error) {
    res.status(500).json({ message: "Error updating user status", error });
  }
};

// Deactivate user (set status to "inactive")
export const deactivateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deactivated", user });
  } catch (error) {
    res.status(500).json({ message: "Error deactivating user", error });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted", user });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// Logout user
export const logoutUser = async (req: Request, res: Response) => {
  try {
    // If storing JWT in cookies, clear it
    res.clearCookie("token"); // only if using cookies
    // Otherwise, just inform the client to remove token
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error });
  }
};
