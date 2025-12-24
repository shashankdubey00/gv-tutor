import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { verifyOTP, resetPassword } from "../services/authService";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("verify"); // "verify" or "reset"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      setError("Email is required");
    }
  }, [searchParams]);

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("").concat(Array(6 - pastedData.length).fill(""));
      setOtp(newOtp.slice(0, 6));
      const lastFilledIndex = Math.min(pastedData.length - 1, 5);
      const nextInput = document.getElementById(`otp-${lastFilledIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  const otpString = otp.join("");

  async function handleVerifyOTP(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (otpString.length !== 6) {
      setError("Please enter a 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const result = await verifyOTP(email, otpString);
      if (result.success) {
        setStep("reset");
        setSuccess(false); // Reset success state for reset password step
        setError("");
        // Keep OTP in state for reset password step
      }
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      const firstInput = document.getElementById("otp-0");
      if (firstInput) firstInput.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await resetPassword(email, otpString, password);
      if (result.success) {
        setSuccess(true);
        setError("");
        // Use window.location.href for full page reload to ensure clean state
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  if (step === "verify") {
    return (
      <div className="auth-bg pt-28 px-4 flex items-center justify-center">
        <div className="glass-card w-full max-w-md p-8 sm:p-10 text-white">
          <h2 className="text-3xl font-bold text-center">Verify OTP</h2>
          <p className="text-center text-white/80 mt-1">
            Enter the 6-digit OTP sent to {email}
          </p>

          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

          <form className="mt-6 space-y-6" onSubmit={handleVerifyOTP}>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-lg
                    bg-white/90 text-black
                    focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || otpString.length !== 6}
              className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 transition font-semibold disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-white/70">
              Didn't receive OTP?
            </p>
            <Link 
              to="/forgot-password" 
              className="text-green-300 hover:underline text-sm"
            >
              Request New OTP
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-green-300 hover:underline text-sm">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Reset Password Step
  return (
    <div className="auth-bg pt-28 px-4 flex items-center justify-center">
      <div className="glass-card w-full max-w-md p-8 sm:p-10 text-white">
        <h2 className="text-3xl font-bold text-center">Reset Password</h2>
        <p className="text-center text-white/80 mt-1">
          Enter your new password
        </p>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        
        {success && (
          <div className="mt-3 space-y-3">
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-300 text-sm">
                Password reset successfully! Redirecting to login...
              </p>
            </div>
            <button
              onClick={() => {
                window.location.href = "/login";
              }}
              className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 transition font-semibold"
            >
              Go to Login
            </button>
          </div>
        )}

        {!success && (
          <form className="mt-6 space-y-4" onSubmit={handleResetPassword}>
            <div>
              <input
                type="password"
                name="password"
                placeholder="New Password (minimum 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg
                  bg-white/90 text-black
                  focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {password && password.length < 8 && (
                <p className="text-xs mt-1 text-white/70">
                  Password must be at least 8 characters
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg
                  bg-white/90 text-black
                  focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs mt-1 text-red-400">
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 transition font-semibold disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-green-300 hover:underline text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

