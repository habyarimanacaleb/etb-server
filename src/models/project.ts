import { Schema, model, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  image?: string;
  author: Schema.Types.ObjectId;
  tools:string[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tools: { type: [String] }
  },
  { timestamps: true }
);

export default model<IProject>("Project", projectSchema);
