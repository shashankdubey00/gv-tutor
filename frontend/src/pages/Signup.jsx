import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { signupUser, verifyAuth } from "../services/authService";
import PasswordStrength from "../components/PasswordStrength";

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // All signups create "user" role by default
  // Role will be changed to "tutor" only after completing tutor profile
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    // No role field - backend will default to "user"
  });
  
  console.log("📝 Signup form - will create user with default role: 'user'");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showBraveNotice, setShowBraveNotice] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Enhanced email validation
  const validateEmail = (email) => {
    if (!email) {
      setEmailError("");
      return false;
    }
    
    const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    
    // Check for common typos
    if (email.includes('..')) {
      setEmailError("Email cannot contain consecutive dots");
      return false;
    }
    
    const [localPart] = email.split('@');
    if (localPart.startsWith('.') || localPart.endsWith('.') || 
        localPart.startsWith('-') || localPart.endsWith('-')) {
      setEmailError("Email format is invalid");
      return false;
    }
    
    setEmailError("");
    return true;
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate email in real-time
    if (name === "email") {
      validateEmail(value);
    }
  }

  function handleGoogleLogin() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const googleAuthUrl = `${backendUrl}/auth/google?popup=1`;
    const popup = window.open(
      googleAuthUrl,
      'google-auth',
      'width=500,height=600,left=' + (window.screen.width / 2 - 250) + ',top=' + (window.screen.height / 2 - 300)
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      // Popup blocked - fallback to full redirect
      window.location.href = `${backendUrl}/auth/google`;
      return;
    }

    // Listen for message from popup
    const messageListener = (event) => {
      const allowedOrigins = [
        backendUrl.replace(/\/$/, ''),
        window.location.origin
      ];
      
      if (!allowedOrigins.includes(event.origin)) {
        return;
      }

      if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
        window.removeEventListener('message', messageListener);
        if (popup && !popup.closed) {
          popup.close();
        }
        
        setTimeout(async () => {
          try {
            const authData = await verifyAuth();
            if (authData.success) {
              const user = authData.user;
              if (user.role === "admin") {
                window.location.href = "/admin/dashboard";
              } else if (user.role === "tutor" && !user.isTutorProfileComplete) {
                window.location.href = "/complete-profile";
              } else if (user.role === "tutor" && user.isTutorProfileComplete) {
                window.location.href = "/apply-tutor";
              } else {
                window.location.href = "/";
              }
            }
          } catch (err) {
            console.error("Auth verification failed:", err);
            setError("Authentication failed. Please try again.");
          }
        }, 500);
      } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
        window.removeEventListener('message', messageListener);
        if (popup && !popup.closed) {
          popup.close();
        }
        setError("Google authentication failed. Please try again.");
      }
    };

    window.addEventListener('message', messageListener);

    let messageReceived = false;
    const checkClosed = setInterval(() => {
      if (popup.closed && !messageReceived) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        // Show Brave notice if popup closed without success (likely cookie blocking)
        setShowBraveNotice(true);
      }
    }, 1000);
    
    // Track if we received a message
    const originalListener = messageListener;
    const wrappedListener = (event) => {
      messageReceived = true;
      originalListener(event);
    };
    window.removeEventListener('message', messageListener);
    window.addEventListener('message', wrappedListener);
    
    // Cleanup after 5 minutes (timeout)
    setTimeout(() => {
      clearInterval(checkClosed);
      window.removeEventListener('message', wrappedListener);
      if (popup && !popup.closed && !messageReceived) {
        popup.close();
        setShowBraveNotice(true);
      }
    }, 5 * 60 * 1000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setEmailError("");

    // Validate email before submission
    if (!validateEmail(formData.email)) {
      setLoading(false);
      return;
    }

    // Validate password (user-friendly: 10 characters minimum)
    if (formData.password.length < 10) {
      setError("Password must be at least 10 characters");
      setLoading(false);
      return;
    }

    try {
      console.log("📝 Attempting signup for:", formData.email);
      const signupResponse = await signupUser(formData);
      console.log("✅ Signup API response:", signupResponse);
      
      // Wait a bit to ensure cookie is set and browser processes it
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify auth to get user role and redirect accordingly (auto-login)
      console.log("🔍 Verifying authentication after signup...");
      const authData = await verifyAuth();
      console.log("✅ Auth verification result:", authData);
      
      if (authData.success) {
        const user = authData.user;
        console.log("✅ Signup successful, user role:", user.role, "Email:", user.email);
        
        // Auto-login: Redirect based on role (same logic as login)
        if (user.role === "admin") {
          console.log("➡️ Redirecting admin to dashboard");
          window.location.href = "/admin/dashboard";
          return;
        } else if (user.role === "tutor") {
          // User is a tutor
          if (!user.isTutorProfileComplete) {
            console.log("➡️ Redirecting tutor to complete-profile");
            window.location.href = "/complete-profile";
          } else {
            console.log("➡️ Redirecting tutor to apply-tutor");
            window.location.href = "/apply-tutor";
          }
          return;
        } else {
          // Regular user - go to home
          console.log("➡️ Redirecting user to home");
          window.location.href = "/";
          return;
        }
      } else {
        console.error("❌ Auth verification failed after signup:", authData);
        setError("Signup successful but session verification failed. Please try logging in.");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      // Check if error is about existing user
      if (err.message.includes("already exists") || err.message.includes("User already exists")) {
        setError("An account with this email already exists. Please login or use 'Login with Google' if you signed up with Google.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-bg pt-28 px-4 flex items-center justify-center">
      <div className="glass-card w-full max-w-md p-8 sm:p-10 text-white">

        <h2 className="text-3xl font-bold text-center">Sign Up</h2>
        <p className="text-center text-white/80 mt-1">
          Create your account here
        </p>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        
        {showBraveNotice && (
          <div className="mt-4 p-4 bg-yellow-500/10 border-2 border-yellow-500/50 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-xl">⚠️</span>
              <div className="flex-1">
                <p className="text-yellow-300 font-semibold mb-2">Brave Browser Notice:</p>
                <p className="text-white/90 text-sm mb-3">
                  Google OAuth requires third-party cookies. Click the Brave icon (🦁) in your address bar → 
                  <strong> Shields</strong> → Turn OFF <strong>"Block cross-site cookies"</strong> for this site, 
                  or use email/password signup below.
                </p>
                <button
                  onClick={() => setShowBraveNotice(false)}
                  className="text-yellow-300 hover:text-yellow-200 text-sm underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg
                bg-white/95 text-black
                focus:outline-none focus:ring-2 ${
                  emailError ? "focus:ring-red-400 border-2 border-red-400" : "focus:ring-green-400"
                }`}
            />
            {emailError && (
              <p className="text-xs mt-1 text-red-400">{emailError}</p>
            )}
          </div>

          <div>
          <input
            type="password"
            name="password"
              placeholder="Password (minimum 10 characters)"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg
              bg-white/95 text-black
              focus:outline-none focus:ring-2 focus:ring-green-400"
          />
            {formData.password && formData.password.length < 10 && (
              <p className="text-xs mt-1 text-white/70">
                Password must be at least 10 characters
              </p>
            )}
            {/* USER-FRIENDLY: Password strength meter */}
            <PasswordStrength 
              password={formData.password} 
              onStrengthChange={setPasswordStrength}
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 transition font-semibold"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center gap-2 my-5">
          <div className="flex-1 h-px bg-white/30"></div>
          <span className="text-sm text-white/70">or</span>
          <div className="flex-1 h-px bg-white/30"></div>
        </div>

        <button 
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-lg bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5"
              alt="Google"
            />
            Sign up with Google
        </button>

        <p className="text-center text-sm mt-5 text-white/80">
          Already have an account?
          <Link to="/login" className="text-green-300 hover:underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
