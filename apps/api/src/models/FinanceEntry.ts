import { Schema, model } from "mongoose";

export type FinanceEntryType = "income" | "expense";
export type FinanceEntryStatus = "paid" | "pending" | "overdue";

export type FinanceEntryDocument = {
  date: Date;
  type: FinanceEntryType;
  category: string;
  description: string;
  client?: string;
  amount: number;
  paymentMethod?: string;
  status: FinanceEntryStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

const financeEntrySchema = new Schema<FinanceEntryDocument>(
  {
    date: { type: Date, required: true, index: true },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
      index: true
    },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 180 },
    client: { type: String, trim: true, maxlength: 120 },
    amount: { type: Number, required: true, min: 0.01 },
    paymentMethod: { type: String, trim: true, maxlength: 80 },
    status: {
      type: String,
      enum: ["paid", "pending", "overdue"],
      default: "pending",
      index: true
    },
    notes: { type: String, trim: true, maxlength: 1000 }
  },
  { timestamps: true }
);

financeEntrySchema.index({ description: "text", category: "text", client: "text" });

export const FinanceEntryModel = model<FinanceEntryDocument>(
  "FinanceEntry",
  financeEntrySchema
);
