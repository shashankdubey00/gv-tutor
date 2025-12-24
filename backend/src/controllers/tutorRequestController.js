import TutorRequest from "../models/TutorRequest.js";

/* ---------------- CREATE TUTOR REQUEST (Parent/Student) ---------------- */
export const createTutorRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      studentGrade,
      subjects,
      preferredLocation,
      preferredTiming,
      frequency,
      budget,
      preferredTutorGender,
      additionalRequirements,
    } = req.body;

    // Validate required fields (email is now optional)
    if (
      !name ||
      !phone ||
      !studentGrade ||
      !subjects ||
      !preferredLocation ||
      !preferredTiming ||
      !frequency ||
      !budget
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Validate email format only if provided
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }
    }

    // Create tutor request with default field visibility
    const tutorRequest = await TutorRequest.create({
      parentName: name,
      parentEmail: email ? email.toLowerCase().trim() : "",
      parentPhone: phone,
      studentGrade,
      subjects: Array.isArray(subjects) ? subjects : [subjects],
      preferredLocation,
      preferredTiming,
      frequency,
      budget,
      preferredTutorGender: preferredTutorGender || "any",
      additionalRequirements: additionalRequirements || "",
      status: "pending",
      // Default field visibility - all fields visible by default
      fieldVisibility: {
        parentName: true,
        parentEmail: true,
        parentPhone: true,
        studentGrade: true,
        subjects: true,
        preferredLocation: true,
        preferredTiming: true,
        frequency: true,
        budget: true,
        preferredTutorGender: true,
        additionalRequirements: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Tutor request submitted successfully. Admin will review it soon.",
      requestId: tutorRequest._id,
    });
  } catch (error) {
    console.error("Create tutor request error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ---------------- GET POSTED TUTOR REQUESTS (For Tutors) ---------------- */
export const getPostedTutorRequests = async (req, res) => {
  try {
    const tutorId = req.user.userId; // JWT token has userId, not _id

    // Only get requests with status "posted" (posted by admin)
    const requests = await TutorRequest.find({ status: "posted" })
      .sort({ createdAt: -1 })
      .select("-adminNotes");

    // Filter fields based on visibility flags and check if tutor has applied
    const filteredRequests = requests.map((request) => {
      const filtered = request.toObject();
      const visibility = filtered.fieldVisibility || {};
      
      // Check if current tutor has applied to this request
      filtered.hasApplied = request.appliedTutors.some(
        (app) => app.tutorId.toString() === tutorId.toString()
      );
      
      // Only include fields that are visible
      if (!visibility.parentName) delete filtered.parentName;
      if (!visibility.parentEmail) delete filtered.parentEmail;
      if (!visibility.parentPhone) delete filtered.parentPhone;
      if (!visibility.studentGrade) delete filtered.studentGrade;
      if (!visibility.subjects) delete filtered.subjects;
      if (!visibility.preferredLocation) delete filtered.preferredLocation;
      if (!visibility.preferredTiming) delete filtered.preferredTiming;
      if (!visibility.frequency) delete filtered.frequency;
      if (!visibility.budget) delete filtered.budget;
      if (!visibility.preferredTutorGender) delete filtered.preferredTutorGender;
      if (!visibility.additionalRequirements) delete filtered.additionalRequirements;
      
      // Remove visibility object from response
      delete filtered.fieldVisibility;
      
      return filtered;
    });

    return res.status(200).json({
      success: true,
      requests: filteredRequests,
      count: filteredRequests.length,
    });
  } catch (error) {
    console.error("Get posted requests error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ---------------- APPLY TO TUTOR REQUEST (Tutor applies to a posted request) ---------------- */
export const applyToTutorRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // Check if user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const tutorId = req.user.userId; // JWT token has userId, not _id

    // Validate requestId
    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    // Check if request exists and is posted
    const tutorRequest = await TutorRequest.findById(requestId);
    if (!tutorRequest) {
      return res.status(404).json({
        success: false,
        message: "Tutor request not found",
      });
    }

    if (tutorRequest.status !== "posted") {
      return res.status(400).json({
        success: false,
        message: "This request is not available for applications",
      });
    }

    // Initialize appliedTutors array if it doesn't exist
    if (!tutorRequest.appliedTutors) {
      tutorRequest.appliedTutors = [];
    }

    // Check if tutor has already applied
    const alreadyApplied = tutorRequest.appliedTutors.some(
      (app) => {
        const appTutorId = app.tutorId?.toString() || app.tutorId;
        return appTutorId === tutorId.toString();
      }
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this position",
      });
    }

    // Add tutor to appliedTutors array
    tutorRequest.appliedTutors.push({
      tutorId: tutorId,
      appliedAt: new Date(),
      status: "pending",
    });

    // Save the updated request
    const savedRequest = await tutorRequest.save();

    return res.status(200).json({
      success: true,
      message: "Application submitted successfully!",
      requestId: savedRequest._id,
    });
  } catch (error) {
    console.error("Apply to tutor request error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

