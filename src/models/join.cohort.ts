import { string } from "joi";
import { Schema, model, Document } from "mongoose";

export interface IJoinCohort extends Document {
  name: string;
  email: string;
  program: string;
  motivation: string;
}

const cohortSchema = new Schema<IJoinCohort>(
  {
    name: { type: String, required: true },
    email: { type: String },
    program: { type: String, required: true },
    motivation: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IJoinCohort>("Cohort", cohortSchema);
