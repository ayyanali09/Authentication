import { Schema, model } from "mongoose";

export type UserRole = "admin" | "editor";

export type UserDocument = {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "admin"
    }
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("User", userSchema);
