import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";

export default function PasswordStrength({ password, onStrengthChange }) {
  const [strength, setStrength] = useState({ strength: 0, label: "", feedback: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!password) {
      setStrength({ strength: 0, label: "", feedback: [] });
      if (onStrengthChange) onStrengthChange(0);
      return;
    }

    // Debounce API call
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await apiRequest("/api/auth/check-password-strength", {
          method: "POST",
          body: JSON.stringify({ password }),
        });
        setStrength(result);
        if (onStrengthChange) onStrengthChange(result.strength);
      } catch (error) {
        // Fallback to client-side calculation
        const clientStrength = calculateClientStrength(password);
        setStrength(clientStrength);
        if (onStrengthChange) onStrengthChange(clientStrength.strength);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [password, onStrengthChange]);

  // Client-side fallback calculation
  function calculateClientStrength(pwd) {
    if (!pwd) return { strength: 0, label: "", feedback: [] };
    
    let strength = 0;
    const feedback = [];
    
    if (pwd.length >= 10) {
      strength += 2;
      feedback.push("✓ Good length");
    } else if (pwd.length >= 8) {
      strength += 1;
      feedback.push("⚠️ Use at least 10 characters");
    } else {
      feedback.push("⚠️ Use at least 10 characters");
    }
    
    if (pwd.length >= 12) {
      strength += 1;
      feedback.push("✓ Very good length");
    }
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) {
      strength += 1;
      feedback.push("✓ Mix of uppercase and lowercase");
    }
    if (/\d/.test(pwd)) {
      strength += 1;
      feedback.push("✓ Contains numbers");
    }
    if (/[^a-zA-Z0-9]/.test(pwd)) {
      strength += 1;
      feedback.push("✓ Contains special characters");
    }
    
    let label = "";
    if (strength <= 2) label = "Weak";
    else if (strength <= 4) label = "Fair";
    else if (strength <= 5) label = "Good";
    else label = "Strong";
    
    return { strength: Math.min(strength, 6), label, feedback };
  }

  if (!password) return null;

  const strengthColors = {
    Weak: "bg-red-500",
    Fair: "bg-orange-500",
    Good: "bg-yellow-500",
    Strong: "bg-green-500",
  };

  const strengthColor = strengthColors[strength.label] || "bg-gray-500";
  const strengthPercent = (strength.strength / 6) * 100;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${strengthColor}`}
          style={{ width: `${strengthPercent}%` }}
        />
      </div>

      {/* Strength Label */}
      {strength.label && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/70">Strength:</span>
          <span
            className={`font-semibold ${
              strength.label === "Strong"
                ? "text-green-400"
                : strength.label === "Good"
                ? "text-yellow-400"
                : strength.label === "Fair"
                ? "text-orange-400"
                : "text-red-400"
            }`}
          >
            {strength.label}
          </span>
          {loading && (
            <span className="text-xs text-white/50">Checking...</span>
          )}
        </div>
      )}

      {/* Feedback Tips */}
      {strength.feedback && strength.feedback.length > 0 && password.length > 0 && (
        <div className="text-xs space-y-1 mt-2">
          {strength.feedback.slice(0, 3).map((tip, index) => (
            <div
              key={index}
              className={`${
                tip.startsWith("✓") ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {tip}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

