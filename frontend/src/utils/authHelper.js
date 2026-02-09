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
    const cachedUser = (() => {
      try {
        const raw = sessionStorage.getItem("auth_user");
        return raw ? JSON.parse(raw) : null;
      } catch (error) {
        return null;
      }
    })();

    if (cachedUser) {
      const user = cachedUser;
      console.log("?? User role:", user.role, "Tutor profile complete:", user.isTutorProfileComplete);
      if (user.role === "admin") {
        console.log("? Admin cannot apply as tutor");
        console.warn("Admins cannot apply as tutors. Please use a regular user account.");
        return;
      }
      if (user.role === "tutor") {
        if (!user.isTutorProfileComplete) {
          console.log("?? Tutor but profile incomplete, redirecting to complete-profile");
          navigate("/complete-profile");
        } else {
          console.log("?? Tutor with complete profile, redirecting to apply-tutor");
          navigate("/apply-tutor");
        }
        return;
      } else if (user.role === "user") {
        console.log("?? User logged in, redirecting to complete tutor profile");
        navigate("/complete-profile");
        return;
      }
    }

    console.log("?? handleApplyAsTutor: Checking auth...");
    const authData = await verifyAuth();
    console.log("? handleApplyAsTutor: Auth data:", authData);

    if (authData.success && authData.user) {
      const user = authData.user;
      try {
        sessionStorage.setItem("auth_user", JSON.stringify(user));
      } catch (error) {
        // Ignore storage errors
      }
      console.log("?? User role:", user.role, "Tutor profile complete:", user.isTutorProfileComplete);

      if (user.role === "admin") {
        console.log("? Admin cannot apply as tutor");
        console.warn("Admins cannot apply as tutors. Please use a regular user account.");
        return;
      }

      if (user.role === "tutor") {
        if (!user.isTutorProfileComplete) {
          console.log("?? Tutor but profile incomplete, redirecting to complete-profile");
          navigate("/complete-profile");
        } else {
          console.log("?? Tutor with complete profile, redirecting to apply-tutor");
          navigate("/apply-tutor");
        }
        return;
      } else if (user.role === "user") {
        console.log("?? User logged in, redirecting to complete tutor profile");
        navigate("/complete-profile");
        return;
      }
    }

    console.log("?? Not authenticated, redirecting to login");
    navigate("/login");
  } catch (error) {
    console.error("? handleApplyAsTutor error:", error);
    navigate("/login");
  }
}


