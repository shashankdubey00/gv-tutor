import { verifyAuth } from "../services/authService";

/**
 * Check if user is authenticated and redirect accordingly
 * Returns user data if authenticated, null otherwise
 */
export async function checkAuthAndRedirect(navigate) {
  try {
    const authData = await verifyAuth();
    if (authData.success) {
      return authData.user;
    }
    return null;
  } catch (error) {
    return null;
  }
}

