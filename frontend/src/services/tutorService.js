import { apiRequest, apiFormDataRequest } from "./api";

/**
 * CREATE TUTOR REQUEST (Parent/Student - No auth required)
 */
export function createTutorRequest(formData) {
  return apiRequest("/api/tutor-requests", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

/**
 * GET POSTED TUTOR REQUESTS (Tutors - Auth required)
 */
export function getPostedTutorRequests() {
  return apiRequest("/api/tutor-requests/posted", {
    method: "GET",
  });
}

function buildTutorProfilePayload(data) {
  return {
    fullName: data.fullName,
    phone: data.phone,
    gender: typeof data.gender === "string" ? data.gender.toLowerCase() : data.gender,
    address: data.address,
    experience:
      typeof data.experience === "number" ? data.experience : parseInt(String(data.experience), 10),
    subjects: data.subjects,
    classes: data.classes,
    availableLocations: data.availableLocations,
    preferredTiming: data.preferredTiming,
    hourlyRate:
      typeof data.hourlyRate === "number" ? data.hourlyRate : parseFloat(String(data.hourlyRate)),
    bio: data.bio || "",
    achievements: data.achievements || "",
  };
}

/**
 * CREATE/UPDATE TUTOR PROFILE
 * Pass optional `resumeFile` when uploading or replacing a resume; omit if unchanged and already stored.
 */
export function createOrUpdateTutorProfile(data, resumeFile = null) {
  const payload = buildTutorProfilePayload(data);

  if (resumeFile) {
    const fd = new FormData();
    fd.append("fullName", payload.fullName);
    fd.append("phone", payload.phone);
    fd.append("gender", payload.gender);
    fd.append("address", payload.address);
    fd.append("experience", String(payload.experience));
    fd.append("preferredTiming", payload.preferredTiming);
    fd.append("hourlyRate", String(payload.hourlyRate));
    fd.append("bio", payload.bio);
    fd.append("achievements", payload.achievements);
    fd.append("subjects", JSON.stringify(payload.subjects));
    fd.append("classes", JSON.stringify(payload.classes));
    fd.append("availableLocations", JSON.stringify(payload.availableLocations));
    fd.append("resume", resumeFile);
    return apiFormDataRequest("/api/tutor-profile", fd, "POST");
  }

  return apiRequest("/api/tutor-profile", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Upload or replace resume only (profile must already be complete).
 */
export function uploadTutorResumeFile(file) {
  const fd = new FormData();
  fd.append("resume", file);
  return apiFormDataRequest("/api/tutor-profile/resume", fd, "POST");
}

/**
 * GET TUTOR PROFILE
 */
export function getTutorProfile() {
  return apiRequest("/api/tutor-profile", {
    method: "GET",
  });
}

/**
 * APPLY TO TUTOR REQUEST (Tutor applies to a posted request)
 */
export function applyToTutorRequest(requestId) {
  return apiRequest(`/api/tutor-requests/${requestId}/apply`, {
    method: "POST",
  });
}

export function hideTutorRequest(requestId) {
  return apiRequest(`/api/tutor-requests/${requestId}/hide`, {
    method: "POST",
  });
}
