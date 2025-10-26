import { Schema, model, Document, Types } from "mongoose";

export interface IStudent extends Document {
  name: string;
  email: string;
  phone: string;
  education: string;
  program: string;
  experience: string;
  startDate: Date;
  motivation: string;
  role: "guest" | "student" | "admin";
  referral: string;
  password?: string;
  cohort?: Types.ObjectId;
}

const studentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    education: { type: String },
    program: { type: String },
    experience: { type: String },
    startDate: { type: Date },
    motivation: { type: String },
    role: {type:String,enum:["guest","student","admin"],default:"student"},
    referral: { type: String },
    cohort: { type: Schema.Types.ObjectId, ref: "Cohort" },
    password: { type: String },
  },
  { timestamps: true }
);

export default model<IStudent>("Student", studentSchema);
