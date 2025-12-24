import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyAuth } from "../services/authService";
import { setPassword as setPasswordAPI } from "../services/authService";

export default function SetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const authData = await verifyAuth();
        if (authData.success) {
          setUser(authData.user);
          // Check if user already has password
          if (authData.user.hasPassword) {
            setError("You already have a password set for this account.");
          }
        } else {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setSubmitting(false);
      return;
    }

    try {
      const result = await setPasswordAPI(formData.password);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "Failed to set password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="auth-bg pt-28 px-4 flex items-center justify-center">
        <div className="glass-card w-full max-w-md p-8 text-white text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-bg pt-28 px-4 flex items-center justify-center">
      <div className="glass-card w-full max-w-md p-8 sm:p-10 text-white">
        <h2 className="text-3xl font-bold text-center">Set Password</h2>
        <p className="text-center text-white/80 mt-1">
          Add a password to your account for email/password login
        </p>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        
        {success && (
          <div className="mt-3 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-green-300 text-sm">
              Password set successfully! You can now login with email and password.
            </p>
          </div>
        )}

        {!success && (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="password"
                name="password"
                placeholder="New Password (minimum 8 characters)"
                value={formData.password}
                onChange={handleChange}
                required
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

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg
                  bg-white/90 text-black
                  focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs mt-1 text-red-400">
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 transition font-semibold disabled:opacity-50"
            >
              {submitting ? "Setting Password..." : "Set Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-green-300 hover:underline text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

