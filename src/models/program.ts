import { Schema, model, Document } from "mongoose";

export interface IProgram extends Document {
  title: string;
  description: string;
  duration: string;
  skills: string[];
  projects: string[];
  outcomes: string[];
}

const programSchema = new Schema<IProgram>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    skills: [{ type: String }], // e.g. ["React", "Node.js", "MongoDB"]
    projects: [{ type: String }], // e.g. ["E-commerce Platform"]
    outcomes: [{ type: String }], // e.g. ["Professional Portfolio Site"]
  },
  { timestamps: true }
);

export default model<IProgram>("Program", programSchema);
