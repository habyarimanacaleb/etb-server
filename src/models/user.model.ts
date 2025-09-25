import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: "student" | "mentor" | "admin";
  status:string
  avatar?: string;
  cohort?: Schema.Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String },
    role: { type: String, enum: ["student", "mentor", "admin"], default: "student" },
    avatar: { type: String },
    status: {
  type: String,
  enum: ["active", "inactive", "suspended"],
  default: "active"
},
    cohort: { type: Schema.Types.ObjectId, ref: "Cohort" },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password as string);
};

export default model<IUser>("User", userSchema);
