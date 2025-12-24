import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { changePassword, verifyAuth } from "../services/authService";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const authData = await verifyAuth();
        if (!authData.success) {
          navigate("/login");
          return;
        }
        setUser(authData.user);
        
        // Check if user has a password (not Google-only account)
        if (!authData.user.hasPassword) {
          setError("You don't have a password set. Please use 'Set Password' to create one first.");
        }
      } catch (err) {
        console.error("Auth check error:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    // Validation
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      setSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      setSubmitting(false);
      return;
    }

    try {
      const result = await changePassword(currentPassword, newPassword);
      if (result.success) {
        setSuccess(true);
        // Clear form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "Failed to change password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="auth-bg pt-28 px-4 flex items-center justify-center min-h-screen">
      <div className="glass-card w-full max-w-md p-8 sm:p-10 text-white">
        <h2 className="text-3xl font-bold text-center">Change Password</h2>
        <p className="text-center text-white/80 mt-1">
          Update your account password
        </p>

        {error && (
          <div className="mt-3 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-3 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-green-300 text-sm">
              Password changed successfully! Redirecting...
            </p>
          </div>
        )}

        {!success && (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg
                  bg-white/90 text-black
                  focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password (minimum 8 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg
                  bg-white/90 text-black
                  focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {newPassword && newPassword.length < 8 && (
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
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs mt-1 text-red-400">
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || !currentPassword || !newPassword || !confirmPassword}
              className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center space-y-2">
          <Link to="/" className="text-green-300 hover:underline text-sm">
            Back to Home
          </Link>
          {user && user.role === "tutor" && (
            <div>
              <Link to="/profile" className="text-green-300 hover:underline text-sm">
                Back to Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

