// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import Student, { IStudent } from "../models/student";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export interface AuthRequest extends Request {
  student?: IStudent;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded: any = Jwt.verify(token, JWT_SECRET);
    const student = await Student.findById(decoded.id).select("-password");
    if (!student) return res.status(401).json({ message: "Not authorized, student not found" });

    req.student = student;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Role-based access
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.student || !roles.includes(req.student.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};
