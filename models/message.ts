// Importing this file from a client component is now a build error, so the
// mongoose dependency can never leak into the browser bundle again.
import "server-only";

import mongoose, { type InferSchemaType, type Model } from "mongoose";

import { BUDGETS, SERVICES } from "@/lib/contact-options";


const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    service: { type: String, enum: SERVICES, default: "Consulting" },
    budget: { type: String, enum: BUDGETS, default: "<5k" },
    // Kept for triage, never rendered back to a visitor.
    userAgent: { type: String, maxlength: 400 },
  },
  { timestamps: true },
);

export type MessageDoc = InferSchemaType<typeof messageSchema>;

/**
 * Reuse the compiled model across hot reloads.
 *
 * Re-registering a model name throws `OverwriteModelError`, which is why the
 * `mongoose.models` lookup has to come first.
 */
export const Message: Model<MessageDoc> =
  (mongoose.models.Message as Model<MessageDoc>) ??
  mongoose.model<MessageDoc>("Message", messageSchema);

export default Message;
