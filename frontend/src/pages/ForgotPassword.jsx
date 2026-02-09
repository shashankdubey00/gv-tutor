import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    console.log("📧 Forgot password form submitted for:", email);

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSuccess(true);
        // SECURITY FIX: OTP is never returned from backend
        // Redirect to OTP verification page after 2 seconds
        setTimeout(() => {
          navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
        }, 2000);
      }
    } catch (err) {
      console.error("❌ Forgot password error:", err);
      // Check if it's a Google account error
      if (err.message && err.message.includes("Google")) {
        setError("This account was created with Google. Please use 'Login with Google' or set a password first in your account settings.");
      } else {
        setError(err.message || "Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-bg pt-28 px-4 flex items-center justify-center">
      <div className="glass-card w-full max-w-md p-8 sm:p-10 text-white">
        <h2 className="text-3xl font-bold text-center text-white">Forgot Password</h2>
        <p className="text-center text-white/80 mt-1">
          Enter your email to receive an OTP
        </p>

        {error && <p className="text-red-300 text-sm mt-3">{error}</p>}
        
        {success && (
          <div className="mt-3 space-y-3">
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-300 text-sm">
                If an account exists with this email, an OTP has been sent. Please check your inbox (and spam folder).
              </p>
            </div>
            
            <div className="p-2 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <p className="text-blue-300 text-xs">
                Redirecting to verification page in a few seconds...
              </p>
            </div>
          </div>
        )}

        {!success && (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg
                bg-white/90 text-black
                focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 transition font-semibold disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-emerald-300 hover:underline text-sm">
            Back to Login
          </Link>
        </div>

        <p className="text-center text-sm mt-5 text-white/80">
          Don't have an account?
          <Link to="/signup" className="text-emerald-300 hover:underline ml-1">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

