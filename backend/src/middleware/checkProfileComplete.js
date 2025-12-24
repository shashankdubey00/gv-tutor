import User from "../models/User.js";

export const checkProfileComplete = async (req, res, next) => {
  try {
    const startTime = Date.now();
    const userId = req.user.userId;
    
    console.log(`🔍 Checking profile completion for user: ${userId}`);

    const user = await User.findById(userId).select("role isTutorProfileComplete");

    if (!user) {
      console.error(`❌ User not found: ${userId}`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admins from accessing tutor routes
    if (user.role === "admin") {
      console.error(`❌ Admin cannot access tutor routes: ${user.role}`);
      return res.status(403).json({
        success: false,
        message: "Admins cannot apply as tutors",
      });
    }
    
    // Check if user is a tutor
    if (user.role !== "tutor") {
      console.error(`❌ User is not a tutor: ${user.role}`);
      return res.status(403).json({
        success: false,
        message: "This route is only for tutors",
      });
    }

    // Check if profile is complete
    if (!user.isTutorProfileComplete) {
      console.log(`⚠️ Profile incomplete for user: ${userId}`);
      return res.status(403).json({
        success: false,
        message: "Please complete your profile first",
        redirectTo: "/complete-profile",
      });
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Profile check complete in ${duration}ms for user: ${userId}`);
    next();
  } catch (error) {
    console.error("❌ Check profile complete error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

