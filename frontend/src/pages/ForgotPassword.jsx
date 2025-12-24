import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fallbackOtp, setFallbackOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    console.log("📧 Forgot password form submitted for:", email);

    try {
      const result = await forgotPassword(email);
      console.log("✅ Forgot password response:", result);
      if (result.success) {
        setSuccess(true);
        // Check if fallback OTP is provided (email failed or dev mode)
        if (result.fallbackOtp) {
          setFallbackOtp(result.fallbackOtp);
          setShowOtp(true);
          console.log("📧 Email may not have been sent. Fallback OTP available.");
        } else {
          console.log("✅ OTP sent successfully, redirecting to verification page...");
        }
        // Redirect to OTP verification page after 3 seconds (give time to see OTP if shown)
        setTimeout(() => {
          navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
        }, showOtp ? 5000 : 2000);
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
        <h2 className="text-3xl font-bold text-center">Forgot Password</h2>
        <p className="text-center text-white/80 mt-1">
          Enter your email to receive an OTP
        </p>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        
        {success && (
          <div className="mt-3 space-y-3">
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-300 text-sm">
                {showOtp 
                  ? "OTP generated! Use the OTP below if you didn't receive the email."
                  : "OTP sent successfully! Check your email (and spam folder)."
                }
              </p>
            </div>
            
            {showOtp && fallbackOtp && (
              <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                <p className="text-yellow-300 text-xs mb-2">Fallback OTP (Email may not have been sent):</p>
                <div className="bg-black/30 p-3 rounded-lg text-center">
                  <p className="text-3xl font-bold text-white tracking-widest">{fallbackOtp}</p>
                </div>
                <p className="text-yellow-300 text-xs mt-2">Copy this OTP and use it on the verification page</p>
              </div>
            )}
            
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
          <Link to="/login" className="text-green-300 hover:underline text-sm">
            Back to Login
          </Link>
        </div>

        <p className="text-center text-sm mt-5 text-white/80">
          Don't have an account?
          <Link to="/signup" className="text-green-300 hover:underline ml-1">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

