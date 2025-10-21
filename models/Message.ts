import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isValidImage: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
    },
    image: {
      type: String,
    },
    service: {
      type: String,
      enum: ["Consulting", "Website", "Animation", "Backend"],
      default: "Consulting",
    },
    budget: {
      type: String,
      enum: ["0k", "10k", "50k"],
      default: "0k",
    },
  },
  {
    timestamps: true,
  }
);

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;
