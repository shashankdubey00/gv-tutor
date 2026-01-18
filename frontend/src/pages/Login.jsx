import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { loginUser, verifyAuth } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showBraveNotice, setShowBraveNotice] = useState(false);

  // Handle OAuth callback after Google redirects back
  useEffect(() => {
    const authSuccess = searchParams.get("auth");
    const provider = searchParams.get("provider");
    
    if (authSuccess === "success" && provider === "google") {
      console.log("✅ OAuth callback detected - verifying and redirecting");
      performAuthRedirect();
    }
  }, [searchParams]);

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
    
    if (email.includes('..')) {
      setEmailError("Email cannot contain consecutive dots");
      return false;
    }
    
    setEmailError("");
    return true;
  };

  // Check for OAuth errors in URL
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "google_auth_failed") {
        setError("Google authentication failed. Please try again.");
      } else if (errorParam === "no_user") {
        setError("Unable to create user account. Please try again.");
      } else if (errorParam === "server_error") {
        setError("Server error occurred. Please try again.");
      }
    }
  }, [searchParams]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Validate email in real-time
    if (name === "email") {
      validateEmail(value);
    }
  }

  function handleGoogleLogin() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    // Standard OAuth flow: Full-page redirect (like most websites do)
    // This ensures single tab experience and proper session handling
    console.log("🔵 Google Login - Full page redirect");
    window.location.href = `${backendUrl}/auth/google`;
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

    try {
      console.log("🔐 Attempting login for:", formData.email);
      const loginResponse = await loginUser(formData);
      console.log("✅ Login API response:", loginResponse);
      
      // Longer delay to ensure cookie is set and browser processes it
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use shared redirect function (works for both regular login and OAuth)
      await performAuthRedirect();
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  // Handle authentication redirect (used by both OAuth popup and regular login)
  // Ensures redirect happens in SAME TAB for webapp compatibility
  async function performAuthRedirect() {
    try {
      console.log("🔍 Verifying authentication...");
      const authData = await verifyAuth();
      if (authData.success) {
        const user = authData.user;
        console.log("✅ Auth verified - user role:", user.role);
        
        // Redirect in SAME TAB using window.location (critical for webapp)
        if (user.role === "admin") {
          console.log("➡️ Redirecting to /admin/dashboard");
          window.location.href = "/admin/dashboard";
        } else if (user.role === "tutor" && !user.isTutorProfileComplete) {
          console.log("➡️ Redirecting to /complete-profile");
          window.location.href = "/complete-profile";
        } else if (user.role === "tutor" && user.isTutorProfileComplete) {
          console.log("➡️ Redirecting to /apply-tutor");
          window.location.href = "/apply-tutor";
        } else {
          console.log("➡️ Redirecting to /");
          window.location.href = "/";
        }
      } else {
        setError("Authentication verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Auth verification failed:", err);
      setError("Authentication failed. Please try again.");
    }
  }

  return (
    <div className="auth-bg pt-28 px-4 flex items-center justify-center">
      <div className="glass-card w-full max-w-md p-8 sm:p-10 text-white">

        <h2 className="text-3xl font-bold text-center">Login</h2>
        <p className="text-center text-white/80 mt-1">
          Welcome back, continue journey
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
                  or use email/password login below.
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
                bg-white/90 text-black
                focus:outline-none focus:ring-2 ${
                  emailError ? "focus:ring-red-400 border-2 border-red-400" : "focus:ring-green-400"
                }`}
            />
            {emailError && (
              <p className="text-xs mt-1 text-red-400">{emailError}</p>
            )}
          </div>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg
              bg-white/90 text-black
              focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <div className="flex items-center justify-between text-sm text-white/80">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="accent-green-500"
              />
              Remember me
            </label>

            <Link to="/forgot-password" className="hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 transition font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
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
          className="w-full py-3 rounded-lg bg-white text-black font-semibold flex items-center justify-center gap-2"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5"
            alt="Google"
          />
          Login with Google
        </button>



        <p className="text-center text-sm mt-5 text-white/80">
          Don’t have an account?
          <Link to="/signup" className="text-green-300 hover:underline ml-1">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
