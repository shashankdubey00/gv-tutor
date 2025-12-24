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
 * VERIFY AUTHENTICATION
 */
export function verifyAuth() {
  return apiRequest("/api/auth/verify", {
    method: "GET",
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

