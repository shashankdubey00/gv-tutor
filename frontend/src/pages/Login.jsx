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

  // Define redirect function early so it can be used in useEffect
  const performAuthRedirect = async () => {
    try {
      console.log("🔍 Verifying authentication...");
      const authData = await verifyAuth();
      console.log("✅ Auth data received:", authData);
      
      if (authData.success) {
        const user = authData.user;
        console.log("✅ User verified:", {
          role: user.role,
          email: user.email,
          isTutorProfileComplete: user.isTutorProfileComplete,
        });
        
        // Redirect immediately based on role and profile status (no delay for instant redirect)
        let redirectPath = "/";
        
        if (user.role === "admin") {
          redirectPath = "/admin/dashboard";
          console.log("➡️ Admin detected - redirecting to /admin/dashboard");
        } else if (user.role === "tutor") {
          if (!user.isTutorProfileComplete) {
            redirectPath = "/complete-profile";
            console.log("➡️ Tutor without profile - redirecting to /complete-profile");
          } else {
            redirectPath = "/apply-tutor";
            console.log("➡️ Tutor with profile - redirecting directly to /apply-tutor (SKIP landing page)");
          }
        } else {
          redirectPath = "/";
          console.log("➡️ Regular user - redirecting to landing page /");
        }
        
        // Use replace to avoid adding to browser history
        window.location.replace(redirectPath);
      } else {
        setError("Authentication verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Auth verification failed:", err);
      setError("Authentication failed. Please try again.");
    }
  };

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

  return (
    <div className="auth-bg pt-28 px-4 flex items-center justify-center">
      <div className="glass-card w-full max-w-md p-8 sm:p-10 text-white">

        <h2 className="text-3xl font-bold text-center text-gray-900">Login</h2>
        <p className="text-center text-gray-800 mt-1">
          Welcome back, continue journey
        </p>

        {error && <p className="text-red-600 text-sm mt-3 font-medium">{error}</p>}
        
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
                bg-white/95 text-black
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
              bg-white/95 text-black
              focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <div className="flex items-center justify-between text-sm text-gray-800">
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

            <Link to="/forgot-password" className="text-gray-700 hover:text-gray-900 font-medium">
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
          <div className="flex-1 h-px bg-gray-400"></div>
          <span className="text-sm text-gray-700">or</span>
          <div className="flex-1 h-px bg-gray-400"></div>
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



        <p className="text-center text-sm mt-5 text-gray-800">
          Don’t have an account?
          <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium ml-1">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
