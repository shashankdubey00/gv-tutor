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
      teacherExperience,
      additionalRequirements,
    } = req.body;

    console.log(
      "📩 createTutorRequest received teacherExperience:",
      teacherExperience,
      "type:",
      typeof teacherExperience
    );

    // Validate required fields (email is now optional)
    if (
      !name ||
      !phone ||
      !studentGrade ||
      !subjects ||
      !preferredLocation ||
      !preferredTiming ||
      !frequency ||
      !budget ||
      teacherExperience === undefined ||
      teacherExperience === null ||
      teacherExperience === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const parsedTeacherExperience = parseInt(teacherExperience, 10);

    console.log(
      "🧮 createTutorRequest parsed teacherExperience:",
      parsedTeacherExperience,
      "isNaN:",
      Number.isNaN(parsedTeacherExperience)
    );
    if (
      Number.isNaN(parsedTeacherExperience) ||
      parsedTeacherExperience < 0 ||
      parsedTeacherExperience > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "Teacher experience must be a number between 0 and 50",
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
      teacherExperience: parsedTeacherExperience,
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
        teacherExperience: true,
        additionalRequirements: true,
      },
    });

    console.log(
      "💾 createTutorRequest saved teacherExperience:",
      tutorRequest.teacherExperience
    );

    return res.status(201).json({
      success: true,
      message: "Tutor request submitted successfully. Admin will review it soon.",
      requestId: tutorRequest._id,
      teacherExperience: tutorRequest.teacherExperience,
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
    const requests = await TutorRequest.find({ 
      status: "posted",
      hiddenByTutors: { $ne: tutorId },
    })
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
      if (!visibility.teacherExperience) delete filtered.teacherExperience;
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

/* ---------------- HIDE TUTOR REQUEST (Tutor hides from dashboard) ---------------- */
export const hideTutorRequestForTutor = async (req, res) => {
  try {
    const { requestId } = req.params;
    const tutorId = req.user.userId;

    const request = await TutorRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Tutor request not found",
      });
    }

    if (!request.hiddenByTutors) {
      request.hiddenByTutors = [];
    }

    if (!request.hiddenByTutors.some((id) => id.toString() === tutorId.toString())) {
      request.hiddenByTutors.push(tutorId);
      await request.save();
    }

    return res.status(200).json({
      success: true,
      message: "Request removed from your dashboard",
    });
  } catch (error) {
    console.error("Hide tutor request error:", error);
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

