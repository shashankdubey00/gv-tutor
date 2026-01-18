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
    
    // Detect if browser blocks third-party cookies (Brave, Safari, etc.)
    // Try popup approach first (works better with privacy browsers)
    const googleAuthUrl = `${backendUrl}/auth/google?popup=1`;
    const popup = window.open(
      googleAuthUrl,
      'google-auth',
      'width=500,height=600,left=' + (window.screen.width / 2 - 250) + ',top=' + (window.screen.height / 2 - 300)
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      // Popup blocked - fallback to full redirect
      console.log("🔵 STEP 1: Google Login Button Clicked (Full Redirect - Popup Blocked)");
      console.log("   - Backend URL:", backendUrl);
      console.log("   - Using full redirect fallback");
      window.location.href = `${backendUrl}/auth/google`;
      return;
    }

    console.log("🔵 STEP 1: Google Login Button Clicked (Popup Mode)");
    console.log("   - Using popup for better privacy browser compatibility");
    console.log("   - Popup will stay on backend domain (cookies work)");
    
    // Listen for message from popup
    const messageListener = (event) => {
      // Verify origin for security - allow both backend and frontend origins
      const allowedOrigins = [
        backendUrl.replace(/\/$/, ''),
        window.location.origin
      ];
      
      if (!allowedOrigins.includes(event.origin)) {
        console.warn("⚠️ Ignoring message from untrusted origin:", event.origin);
        return;
      }

      if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
        console.log("✅ Received OAuth success from popup");
        window.removeEventListener('message', messageListener);
        if (popup && !popup.closed) {
          popup.close();
        }
        
        // FIX FOR BRAVE/PRIVACY BROWSERS: Handle token from postMessage if cookies are blocked
        if (event.data.token) {
          console.log("📦 Token received from popup - storing locally");
          // Store token temporarily in sessionStorage for privacy browsers that block third-party cookies
          sessionStorage.setItem('auth_token', event.data.token);
          // Also set as Authorization header for API requests
          localStorage.setItem('auth_token', event.data.token);
        }
        
        // Token is in cookie (set by backend) OR in sessionStorage (for privacy browsers)
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
            } else {
              setError("Authentication verification failed. Please try again.");
            }
          } catch (err) {
            console.error("Auth verification failed:", err);
            setError("Authentication failed. Please try again.");
          }
        }, 500);
      } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
        console.error("❌ OAuth error from popup:", event.data.error);
        window.removeEventListener('message', messageListener);
        if (popup && !popup.closed) {
          popup.close();
        }
        // Check if it's a cookie/third-party blocking issue
        if (event.data.error?.includes('cookie') || event.data.error?.includes('third-party')) {
          setShowBraveNotice(true);
        } else {
          setError(event.data.error || "Google authentication failed. Please try again.");
        }
      }
    };

    window.addEventListener('message', messageListener);

    // Check if popup was closed manually (but don't spam console)
    let popupClosedLogged = false;
    let messageReceived = false;
    const checkClosed = setInterval(() => {
      if (popup.closed && !messageReceived) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        if (!popupClosedLogged) {
          console.log("Popup closed by user before OAuth completed");
          popupClosedLogged = true;
          // Show Brave notice if popup closed without success (likely cookie blocking)
          setShowBraveNotice(true);
        }
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
        console.warn("OAuth popup timeout - closing");
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

    try {
      console.log("🔐 Attempting login for:", formData.email);
      const loginResponse = await loginUser(formData);
      console.log("✅ Login API response:", loginResponse);
      
      // Longer delay to ensure cookie is set and browser processes it
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify auth to get user role and redirect accordingly
      console.log("🔍 Verifying authentication...");
      const authData = await verifyAuth();
      console.log("✅ Auth verification result:", authData);
      
      if (authData.success) {
        const user = authData.user;
        console.log("✅ Login successful, user role:", user.role, "Email:", user.email);
        
        // Force page reload to ensure cookie is read by all components
        // Check if user is admin first
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
        console.error("❌ Auth verification failed after login:", authData);
        setError("Login successful but session verification failed. Please check browser cookies and try again.");
      }
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
