import mongoose from "mongoose";

const tutorRequestSchema = new mongoose.Schema(
  {
    // Parent/Student Information
    parentName: {
      type: String,
      required: true,
      trim: true,
    },
    parentEmail: {
      type: String,
      required: false, // Made optional
      lowercase: true,
      trim: true,
      default: "",
    },
    parentPhone: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Student Information
    studentGrade: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Tutoring Requirements
    subjects: {
      type: [String],
      required: true,
    },
    preferredLocation: {
      type: String,
      required: true,
      trim: true,
    },
    preferredTiming: {
      type: String,
      required: true,
      trim: true,
    },
    frequency: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "bi-weekly", "monthly"],
    },
    budget: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Tutor Preference
    preferredTutorGender: {
      type: String,
      enum: ["male", "female", "any"],
      default: "any",
    },
    teacherExperience: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 50,
    },
    
    // Additional Requirements
    additionalRequirements: {
      type: String,
      default: "",
      trim: true,
    },
    
    // Status Management
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "filled", "posted"],
      default: "pending",
    },
    
    // Field Visibility Flags (controlled by admin)
    fieldVisibility: {
      parentName: { type: Boolean, default: true },
      parentEmail: { type: Boolean, default: true },
      parentPhone: { type: Boolean, default: true },
      studentGrade: { type: Boolean, default: true },
      subjects: { type: Boolean, default: true },
      preferredLocation: { type: Boolean, default: true },
      preferredTiming: { type: Boolean, default: true },
      frequency: { type: Boolean, default: true },
      budget: { type: Boolean, default: true },
      preferredTutorGender: { type: Boolean, default: true },
      teacherExperience: { type: Boolean, default: true },
      additionalRequirements: { type: Boolean, default: true },
    },
    
    // Admin Notes
    adminNotes: {
      type: String,
      default: "",
    },
    
    // Assigned Tutor (when tutor applies and gets selected)
    assignedTutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    
    // Tutors who have applied for this request
    appliedTutors: [{
      tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("TutorRequest", tutorRequestSchema);

