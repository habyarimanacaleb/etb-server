import { body } from "express-validator";

export const registerUserValidator = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email must be valid"),

  body("password")
    .optional()
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  body("role")
    .optional()
    .isIn(["student", "mentor", "admin"]).withMessage("Invalid role"),

  body("status")
    .optional()
    .isIn(["active", "inactive", "suspended"]).withMessage("Invalid status"),
];

export const updateUserValidator = [
  body("name").optional().isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
  body("email").optional().isEmail().withMessage("Email must be valid"),
  body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("role").optional().isIn(["student", "mentor", "admin"]).withMessage("Invalid role"),
  body("status").optional().isIn(["active", "inactive", "suspended"]).withMessage("Invalid status"),
];
