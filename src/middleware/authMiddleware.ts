import { Request, Response, NextFunction, RequestHandler } from "express";
import Jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: IUser;
}

// Protect middleware
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded: any = Jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Not authorized, user not found" });

    (req as AuthRequest).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Role-based middleware
export const authorizeRoles = (...roles: string[]): RequestHandler => {
  return (req, res, next) => {
    const authReq = req as AuthRequest;
    if (!authReq.user || !roles.includes(authReq.user.role || "student")) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};
