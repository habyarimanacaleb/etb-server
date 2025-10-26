import { Schema, model, Document, Types } from "mongoose";

export interface ICohort extends Document {
  name: string;
  program: string;
  startDate: Date;
  endDate: Date;
  description?: string;
   students: {
      name: String,
      email: String,
      phone: String,
      education: String,
      program: String,
      experience: String,
      startDate: Date,
      motivation: String,
      referral: String,
    }[],
   
  status: "upcoming" | "active" | "completed";
}

const cohortSchema = new Schema<ICohort>(
  {
    name: { type: String, required: true },
    program: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String },
    students: [
      {
        name: { type: String },
        email: { type: String },
        phone: { type: String },
        education: { type: String },
        program: { type: String },
        experience: { type: String },
        startDate: { type: Date },
        motivation: { type: String },
        referral: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["upcoming", "active", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

export default model<ICohort>("Cohort", cohortSchema);
