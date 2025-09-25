import { Schema, model, Document } from "mongoose";

export interface ICohort extends Document {
  name: string;
  program: string;
  startDate: Date;
  endDate: Date;
  students: string[]; // Array of Student IDs
  description: string;
}

const cohortSchema = new Schema<ICohort>(
  {
    name: { type: String, required: true },
    program: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    description: { type: String },
  },
  { timestamps: true }
);

export default model<ICohort>("Cohort", cohortSchema);
