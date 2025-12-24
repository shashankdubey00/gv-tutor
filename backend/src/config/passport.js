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
          // New user - create account with Google
          user = await User.create({
            email,
            googleId: profile.id,
            authProviders: ["google"],
            role: "user", // Default to "user" - will be updated in callback if state provides role
          });
          console.log(`✅ New user created via Google OAuth: ${email}`);
        } else {
          // Existing user - link Google account
          // Check if user already has password (signed up with email/password)
          const hasLocalAuth = user.authProviders.includes("local") && user.passwordHash;
          
          if (!user.authProviders.includes("google")) {
            user.authProviders.push("google");
            console.log(`✅ Linking Google account to existing user: ${email}`);
          }
          
          if (!user.googleId) {
            user.googleId = profile.id;
          }
          
          await user.save();
          
          // Log account linking
          if (hasLocalAuth) {
            console.log(`✅ Account linked: User ${email} can now login with both email/password and Google`);
          }
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
