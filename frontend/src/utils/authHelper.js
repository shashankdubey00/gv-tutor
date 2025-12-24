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

/**
 * Handle Apply as Tutor button click
 * Checks if user is logged in and redirects appropriately
 */
export async function handleApplyAsTutor(navigate) {
  try {
    console.log("🔍 handleApplyAsTutor: Checking auth...");
    const authData = await verifyAuth();
    console.log("✅ handleApplyAsTutor: Auth data:", authData);
    
    if (authData.success && authData.user) {
      const user = authData.user;
      console.log("👤 User role:", user.role, "Tutor profile complete:", user.isTutorProfileComplete);
      
      // Prevent admins from applying as tutors
      if (user.role === "admin") {
        console.log("❌ Admin cannot apply as tutor");
        alert("Admins cannot apply as tutors. Please use a regular user account.");
        return;
      }
      
      if (user.role === "tutor") {
        // Already a tutor
        if (!user.isTutorProfileComplete) {
          console.log("➡️ Tutor but profile incomplete, redirecting to complete-profile");
          navigate("/complete-profile");
        } else {
          console.log("➡️ Tutor with complete profile, redirecting to apply-tutor");
          navigate("/apply-tutor");
        }
        return;
      } else if (user.role === "user") {
        // User is logged in but not a tutor - redirect to complete tutor profile
        console.log("➡️ User logged in, redirecting to complete tutor profile");
        navigate("/complete-profile");
        return;
      }
    }
    
    // Not logged in, go to login (they can signup from login page)
    console.log("➡️ Not authenticated, redirecting to login");
    navigate("/login");
  } catch (error) {
    console.error("❌ handleApplyAsTutor error:", error);
    // Not authenticated, go to login
    navigate("/login");
  }
}


