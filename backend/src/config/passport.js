import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if email exists in profile
        if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
          return done(new Error("No email found in Google profile"), null);
        }

        const email = profile.emails[0].value.toLowerCase().trim();

        let user = await User.findOne({ email });

        // Get role from state parameter (passed via OAuth state)
        // The state will be available in the callback route
        let role = "user"; // Default role

        if (!user) {
          user = await User.create({
            email,
            googleId: profile.id,
            authProviders: ["google"],
            role: "user", // Default to "user" - will be updated in callback if state provides role
          });
        } else {
          // Update existing user to include Google auth if not already present
          if (!user.authProviders.includes("google")) {
            user.authProviders.push("google");
          }
          if (!user.googleId) {
            user.googleId = profile.id;
          }
          await user.save();
        }

        done(null, user);
      } catch (err) {
        console.error("Passport Google Strategy error:", err);
        done(err, null);
      }
    }
  )
);

// ✅ THIS LINE IS REQUIRED
export default passport;
