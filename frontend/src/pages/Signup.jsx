import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { signupUser } from "../services/authService";

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
  const [emailError, setEmailError] = useState("");

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
    // Google OAuth will create user with default "user" role
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
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

    // Validate password
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      await signupUser(formData);
      // After signup, redirect to login (user needs to log in first)
      // Login page will then redirect to complete-profile if tutor
      navigate("/login");
    } catch (err) {
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

          <div>
          <input
            type="password"
            name="password"
              placeholder="Password (minimum 8 characters)"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg
              bg-white/90 text-black
              focus:outline-none focus:ring-2 focus:ring-green-400"
          />
            {formData.password && formData.password.length < 8 && (
              <p className="text-xs mt-1 text-white/70">
                Password must be at least 8 characters
              </p>
            )}
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
