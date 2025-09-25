"use strict";
// src/routes/userRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const validate_1 = require("../middleware/validate");
const userValidators_1 = require("../validators/userValidators");
const upload_1 = require("../middleware/upload");
const otpController_1 = require("../controllers/otpController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and management
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post("/register", userValidators_1.registerUserValidator, validate_1.validate, userController_1.registerUser);
/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     summary: Send OTP for verification
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Failed to send OTP
 */
router.post("/send-otp", otpController_1.sendOTP);
/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP to complete registration
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully, user created
 *       400:
 *         description: Invalid OTP
 */
router.post("/verify-otp", otpController_1.verifyOTP);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", userController_1.loginUser);
/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Authenticate user with Google OAuth
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Google authentication successful
 *       400:
 *         description: Google authentication failed
 */
router.post("/google", userController_1.googleAuth);
/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/users", userController_1.getUsers);
/**
 * @swagger
 * /auth/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/user/:id", userController_1.getUserById);
/**
 * @swagger
 * /auth/user/{id}:
 *   put:
 *     summary: Update user profile (with optional avatar upload)
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 */
router.put("/user/:id", upload_1.upload.single("avatar"), upload_1.handleMulterErrors, userValidators_1.updateUserValidator, validate_1.validate, userController_1.updateUserProfile);
/**
 * @swagger
 * /auth/{id}/status:
 *   get:
 *     summary: Get user status
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User status retrieved
 */
router.get("/:id/status", userController_1.getUserStatus);
/**
 * @swagger
 * /auth/{id}/status:
 *   put:
 *     summary: Update user status
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *     responses:
 *       200:
 *         description: User status updated
 */
router.put("/:id/status", userController_1.updateUserStatus);
/**
 * @swagger
 * /auth/user/{id}/deactivate:
 *   put:
 *     summary: Deactivate user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deactivated
 */
router.put("/user/:id/deactivate", userController_1.deactivateUser);
/**
 * @swagger
 * /auth/user/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete("/user/:id", userController_1.deleteUser);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User logged out
 */
router.post("/logout", userController_1.logoutUser);
exports.default = router;
