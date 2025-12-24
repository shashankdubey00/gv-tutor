import { apiRequest } from "./api";

/**
 * LOGIN
 */
export function loginUser(formData) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

/**
 * SIGNUP
 */
export function signupUser(formData) {
  return apiRequest("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

/**
 * FORGOT PASSWORD
 */
export function forgotPassword(email) {
  return apiRequest("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/**
 * VERIFY OTP
 */
export function verifyOTP(email, otp) {
  return apiRequest("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

/**
 * RESET PASSWORD (Using OTP from email)
 */
export function resetPassword(email, otp, password) {
  return apiRequest("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, otp, password }),
  });
}

/**
 * VERIFY AUTHENTICATION
 */
export function verifyAuth() {
  return apiRequest("/api/auth/verify", {
    method: "GET",
  });
}

/**
 * SET PASSWORD (For Google users)
 */
export function setPassword(password) {
  return apiRequest("/api/auth/set-password", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

/**
 * CHANGE PASSWORD (For logged-in users - requires current password)
 */
export function changePassword(currentPassword, newPassword) {
  return apiRequest("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

/**
 * LOGOUT
 */
export function logoutUser() {
  return apiRequest("/api/auth/logout", {
    method: "POST",
  });
}

