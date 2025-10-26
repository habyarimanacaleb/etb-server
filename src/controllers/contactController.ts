import { Request, Response } from "express";
import Contact from "../models/contact";
import nodemailer from "nodemailer";

/**
 * Send email utility

*/
console.log("SMTP CONFIG:", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  user: process.env.EMAIL_USER,
});

 const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

/**
 * @route POST /api/contact/send
 * @desc Create new contact query and send auto reply
 */

console.log("Email User:", process.env.EMAIL_USER);

export const sendQuery = async (req: Request, res: Response) => {
  try {
    const { name, email, message, program } = req.body;
    if (!name || !email || !message || !program) {
      return res.status(400).json({ error: "All fields are required" });
    }

    //check email and password in env
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ error: "Email service not configured" });
    }

    // Save to database
    const contact = new Contact({ name, email, message, program });
    await contact.save();

      await transporter.sendMail({
        from: `"ETB Programs" <${process.env.EMAIL_USER}>`,
        to: contact.email,
        subject: "We Received Your Query",
        text: `Hi ${contact.name},\n\nThank you for reaching out to ETB Programs regarding "${contact.program}". We have received your message and will get back to you shortly.\n\nBest regards,\nETB Programs Team`,
        }); // Send auto-reply email

       //notify admin
       await transporter.sendMail({
        from: `"ETB Programs" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Query from ${name}`,
        text: `New query received:\n\nName: ${name}\nEmail: ${email}\nProgram: ${program}\nMessage: ${message}`,
        });

        // delete query after 1 week
    setTimeout(async () => {
      await Contact.findByIdAndDelete(contact._id);
    }, 7 * 24 * 60 * 60 * 1000);

    res.status(201).json({ message: "Query submitted successfully", contact });
  } catch (error) {
    console.error("Error sending query:", error);
    res.status(500).json({ error: "Failed to submit query" });
  }
};

/**
 * @route GET /api/contact
 * @desc Get all contact queries
 */
export const getAllQueries = async (req: Request, res: Response) => {
  try {
    const queries = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch queries" });
  }
};

/**
 * @route GET /api/contact/:id
 * @desc Get a single contact query
 */
export const getQueryById = async (req: Request, res: Response) => {
  try {
    const query = await Contact.findById(req.params.id);
    if (!query) return res.status(404).json({ error: "Query not found" });
    res.status(200).json(query);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch query" });
  }
};

/**
 * @route DELETE /api/contact/:id
 * @desc Delete a query
 */
export const deleteQuery = async (req: Request, res: Response) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Query not found" });
    res.status(200).json({ message: "Query deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete query" });
  }
};

/**
 * @route POST /api/contact/reply/:id
 * @desc Send manual reply to a query
 */
export const replyToQuery = async (req: Request, res: Response) => {
  try {
    const { replyMessage } = req.body;
    const query = await Contact.findById(req.params.id);
    if (!query) return res.status(404).json({ error: "Query not found" });

    // Send reply email
      await transporter.sendMail({
        from: `"ETB Programs" <${process.env.EMAIL_USER}>`,
        to: query.email,
        subject: "Response to Your Query",
        text: `Hi ${query.name},\n\n${replyMessage}\n\nBest regards,\nETB Programs Team`,
        });
    // delete query after 1 week
    setTimeout(async () => {
      await Contact.findByIdAndDelete(req.params.id);
    }, 7 * 24 * 60 * 60 * 1000);

    res.status(200).json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("Reply error:", error);
    res.status(500).json({ error: "Failed to send reply" });
  }
};
