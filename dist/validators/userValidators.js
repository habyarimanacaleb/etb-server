"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidator = exports.registerUserValidator = void 0;
const express_validator_1 = require("express-validator");
exports.registerUserValidator = [
    (0, express_validator_1.body)("name")
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email must be valid"),
    (0, express_validator_1.body)("password")
        .optional()
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("role")
        .optional()
        .isIn(["student", "mentor", "admin"]).withMessage("Invalid role"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["active", "inactive", "suspended"]).withMessage("Invalid status"),
];
exports.updateUserValidator = [
    (0, express_validator_1.body)("name").optional().isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
    (0, express_validator_1.body)("email").optional().isEmail().withMessage("Email must be valid"),
    (0, express_validator_1.body)("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("role").optional().isIn(["student", "mentor", "admin"]).withMessage("Invalid role"),
    (0, express_validator_1.body)("status").optional().isIn(["active", "inactive", "suspended"]).withMessage("Invalid status"),
];
