import { Schema, model, Document } from "mongoose";

export interface IMentor extends Document {
  name: string;
  expertise: string[];
  bio?: string;
  user: Schema.Types.ObjectId; // link to user
}

const mentorSchema = new Schema<IMentor>(
  {
    name: { type: String, required: true },
    expertise: [{ type: String }],
    bio: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model<IMentor>("Mentor", mentorSchema);
