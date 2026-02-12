import { apiRequest } from "./api";

// Submit contact form
export const submitContactForm = async (formData) =>
  apiRequest("/api/contact/submit", {
    method: "POST",
    body: JSON.stringify(formData),
  });

// Get all contact messages (Admin only)
export const getContactMessages = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const suffix = queryString ? `?${queryString}` : "";

  return apiRequest(`/api/contact/all${suffix}`, {
    method: "GET",
  });
};

// Update message status (Admin only)
export const updateMessageStatus = async (messageId, status) =>
  apiRequest(`/api/contact/${messageId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// Delete message (Admin only)
export const deleteContactMessage = async (messageId) =>
  apiRequest(`/api/contact/${messageId}`, {
    method: "DELETE",
  });
