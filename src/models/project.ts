import { Schema, model, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  category: string; // e.g., "IoT", "Mechatronics", "Software"
  description: string;
  status: "ongoing" | "completed" | "opened";
  tools: string[];
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["ongoing", "completed", "opened"], default: "opened" },
    tools: [{ type: String }],
  },
  { timestamps: true }
);

// Optimize query performance
projectSchema.index({ title: 1 });

export default model<IProject>("Project", projectSchema);
