import { Schema, model, Document } from "mongoose";

export interface ICommunity extends Document {
  name: string;
  description: string;
  members: Schema.Types.ObjectId[];
}

const communitySchema = new Schema<ICommunity>(
  {
    name: { type: String, required: true },
    description: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default model<ICommunity>("Community", communitySchema);
