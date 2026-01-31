import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
    maxlength: [2000, "Message cannot exceed 2000 characters"]
  },
  status: {
    type: String,
    enum: ["unread", "read", "replied"],
    default: "unread"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  readAt: {
    type: Date
  },
  repliedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ status: 1 });

export default mongoose.model("ContactMessage", contactMessageSchema);
