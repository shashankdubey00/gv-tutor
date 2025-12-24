import { apiRequest } from "./api";

/**
 * LOGIN
 */
export function loginUser(formData) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

/**
 * SIGNUP
 */
export function signupUser(formData) {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

/**
 * FORGOT PASSWORD
 */
export function forgotPassword(email) {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/**
 * VERIFY AUTHENTICATION
 */
export function verifyAuth() {
  return apiRequest("/auth/verify", {
    method: "GET",
  });
}

/**
 * LOGOUT
 */
export function logoutUser() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}

