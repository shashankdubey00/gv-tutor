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
  }

  function handleGoogleLogin() {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  }



  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

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

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg
              bg-white/90 text-black
              focus:outline-none focus:ring-2 focus:ring-green-400"
          />

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
