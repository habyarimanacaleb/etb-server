import { Schema, model, Document } from "mongoose";

export interface IProgram extends Document {
  title: string;
  description: string;
  duration: string;
  mentor: Schema.Types.ObjectId;
}

const programSchema = new Schema<IProgram>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String },
    mentor: { type: Schema.Types.ObjectId, ref: "Mentor" },
  },
  { timestamps: true }
);

export default model<IProgram>("Program", programSchema);
