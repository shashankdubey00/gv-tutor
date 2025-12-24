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
    // Only get requests with status "posted" (posted by admin)
    const requests = await TutorRequest.find({ status: "posted" })
      .sort({ createdAt: -1 })
      .select("-adminNotes");

    // Filter fields based on visibility flags
    const filteredRequests = requests.map((request) => {
      const filtered = request.toObject();
      const visibility = filtered.fieldVisibility || {};
      
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

