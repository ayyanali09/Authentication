import { Schema, model } from "mongoose";
import { SERVICES } from "@vantanova/shared";

export type ContactStatus = "new" | "read" | "archived";

export type ContactMessageDocument = {
  name: string;
  email: string;
  company?: string;
  service: string;
  budget?: string;
  message: string;
  status: ContactStatus;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
};

const contactMessageSchema = new Schema<ContactMessageDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    company: { type: String, trim: true },
    service: { type: String, enum: SERVICES, required: true },
    budget: { type: String, trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new",
      index: true
    },
    ipAddress: { type: String },
    userAgent: { type: String }
  },
  { timestamps: true }
);

export const ContactMessageModel = model<ContactMessageDocument>(
  "ContactMessage",
  contactMessageSchema
);
