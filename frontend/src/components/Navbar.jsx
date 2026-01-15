import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { handleApplyAsTutor } from "../utils/authHelper";
import { verifyAuth, logoutUser } from "../services/authService";
import { getTutorProfile } from "../services/tutorService";

// Navbar component with logout functionality

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tutorMenuOpen, setTutorMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    // If logout query param is present, clear state immediately and remove param
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("logout") === "true") {
      setUser(null);
      setProfile(null);
      setLoading(false);
      // Remove logout param from URL without reload
      window.history.replaceState({}, "", "/");
      return;
    }
    
    async function checkUser() {
      try {
        const authData = await verifyAuth();
        if (authData.success) {
          setUser(authData.user);
          // If tutor, get profile
          if (authData.user.role === "tutor") {
            try {
              const profileData = await getTutorProfile();
              if (profileData.success) {
                setProfile(profileData.profile);
              }
            } catch (err) {
              // Profile might not exist yet - silent fail
            }
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        // Silently handle "Not authenticated" errors (expected when not logged in)
        // Only log unexpected errors
        if (!err.message || !err.message.includes("Not authenticated")) {
          console.error("Navbar: Unexpected auth error:", err);
        }
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, [location.pathname, location.search]);

  return (
    <nav className="fixed top-0 left-0 w-full h-20 z-50 backdrop-blur-md bg-white/10 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-semibold tracking-wide">
          GV Tutor
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-white text-lg items-center">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/about" className="hover:text-blue-400">About</Link>

          {/* Home Tutor Dropdown */}
          <li className="relative select-none">
            <span
              onClick={() => setTutorMenuOpen(!tutorMenuOpen)}
              className="hover:text-blue-400 cursor-pointer flex items-center gap-1"
            >
              Home Tutor ▾
            </span>

            {tutorMenuOpen && (
              <div className="absolute left-0 mt-2 w-44 bg-white text-black rounded-lg shadow-lg overflow-hidden">
                <Link
                  to="/find-tutor"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setTutorMenuOpen(false)}
                >
                  Find Tutor
                </Link>
                {/* Only show "Apply as Tutor" if user is not logged in OR is a tutor (not admin) */}
                {(!user || (user.role === "tutor" && user.role !== "admin")) && (
                  <button
                    onClick={() => {
                      setTutorMenuOpen(false);
                      handleApplyAsTutor(navigate);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Apply as Tutor
                  </button>
                )}
              </div>
            )}
          </li>

          <Link to="/library" className="hover:text-blue-400">Library</Link>
          <Link to="/contact" className="hover:text-blue-400">Contact</Link>
        </ul>

        {/* Desktop Buttons / Profile */}
        <div className="hidden md:flex gap-4 items-center">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse"></div>
          ) : user && user.role === "admin" ? (
            <div className="flex items-center gap-4">
              <Link
                to="/admin/dashboard"
                className="px-4 py-2 text-white border border-white/30 rounded hover:bg-white/20"
              >
                Admin Dashboard
              </Link>
              <div className="relative group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-green-500 flex items-center justify-center text-white font-semibold cursor-pointer">
                  {user.email[0].toUpperCase()}
                </div>
                <div className="absolute right-0 mt-2 w-40 bg-black/90 border border-white/30 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-auto">
                  <div className="px-4 py-2 text-sm text-white/70 border-b border-white/10">
                    {user.email}
                  </div>
                  <div className="px-4 py-2 text-xs text-white/50 border-b border-white/10">
                    Administrator
                  </div>
                  {/* Show "Change Password" for admin if they have a password */}
                  {user.hasPassword && (
                    <Link
                      to="/change-password"
                      className="block px-4 py-2 text-white hover:bg-white/10 border-b border-white/10"
                    >
                      Change Password
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        // Clear user state immediately
                        setUser(null);
                        setProfile(null);
                        // Call logout API
                        await logoutUser();
                        // Small delay to ensure cookie is cleared
                        await new Promise(resolve => setTimeout(resolve, 100));
                      } catch (err) {
                        console.error("Logout error:", err);
                      } finally {
                        // Clear all possible cookie variations
                        const domain = window.location.hostname;
                        const cookies = [
                          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
                          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax",
                          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure",
                          `token=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
                        ];
                        cookies.forEach(cookie => {
                          document.cookie = cookie;
                        });
                        // Force full page reload with cache bypass
                        window.location.replace("/?logout=true");
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-b-lg cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : user && (user.role === "tutor" || user.role === "user") ? (
            <div className="flex items-center gap-4">
              {/* Only show "Apply as Tutor" button for tutors, NOT for regular users or admins */}
              {user.role === "tutor" && user.role !== "admin" && (
                <>
                  <Link
                    to="/apply-tutor"
                    className="px-4 py-2 text-white border border-white/30 rounded hover:bg-white/20"
                  >
                    Apply as Tutor
                  </Link>
                  {profile && (
                    <Link
                      to="/profile"
                      className="px-4 py-2 text-white border border-white/30 rounded hover:bg-white/20"
                    >
                      My Profile
                    </Link>
                  )}
                </>
              )}
              {/* Profile icon with dropdown - shown for all logged-in users */}
              <div className="relative group">
                {user.role === "tutor" && profile ? (
                  <Link
                    to="/profile"
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-green-500 flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-cyan-500/30"
                  >
                    {profile.fullName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </Link>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-green-500 flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-cyan-500/30">
                    {user.email[0].toUpperCase()}
                  </div>
                )}
                <div className="absolute right-0 mt-2 w-40 bg-black/90 border border-white/30 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-auto">
                  <div className="px-4 py-2 text-sm text-white/70 border-b border-white/10">
                    {user.email}
                  </div>
                  <div className="px-4 py-2 text-xs text-white/50 border-b border-white/10">
                    {user.role === "tutor" ? "Tutor" : "User"}
                  </div>
                  {user.role === "tutor" && profile && (
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-white hover:bg-white/10 border-b border-white/10"
                    >
                      View Profile
                    </Link>
                  )}
                  {/* Show "Set Password" for Google-only users (check if no password) */}
                  {user.authProviders && 
                   user.authProviders.includes("google") && 
                   !user.hasPassword && (
                    <Link
                      to="/set-password"
                      className="block px-4 py-2 text-white hover:bg-white/10 border-b border-white/10"
                    >
                      Set Password
                    </Link>
                  )}
                  {/* Show "Change Password" for users who have a password */}
                  {user.hasPassword && (
                    <Link
                      to="/change-password"
                      className="block px-4 py-2 text-white hover:bg-white/10 border-b border-white/10"
                    >
                      Change Password
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        // Clear user state immediately
                        setUser(null);
                        setProfile(null);
                        // Call logout API
                        await logoutUser();
                        // Small delay to ensure cookie is cleared
                        await new Promise(resolve => setTimeout(resolve, 100));
                      } catch (err) {
                        console.error("Logout error:", err);
                      } finally {
                        // Clear all possible cookie variations
                        const domain = window.location.hostname;
                        const cookies = [
                          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
                          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax",
                          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure",
                          `token=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
                        ];
                        cookies.forEach(cookie => {
                          document.cookie = cookie;
                        });
                        // Force full page reload with cache bypass
                        window.location.replace("/?logout=true");
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-b-lg cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-white border border-white/30 rounded hover:bg-white/20"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div
          className="md:hidden text-white text-3xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-md z-50">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 h-full overflow-y-auto p-6 space-y-4">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block text-white hover:text-cyan-400 transition py-2 font-medium">
              Home
            </Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="block text-white hover:text-cyan-400 transition py-2 font-medium">
              About
            </Link>

            <div>
              <button
                onClick={() => setTutorMenuOpen(!tutorMenuOpen)}
                className="flex items-center justify-between w-full text-white hover:text-cyan-400 transition py-2 font-medium"
              >
                <span>Home Tutor</span>
                <span className={tutorMenuOpen ? "transform rotate-180" : ""}>▾</span>
              </button>

              {tutorMenuOpen && (
                <div className="ml-4 space-y-2 mt-2 border-l border-cyan-500/30 pl-4">
                  <Link
                    to="/find-tutor"
                    onClick={() => {
                      setTutorMenuOpen(false);
                      setMenuOpen(false);
                    }}
                    className="block text-white/70 hover:text-cyan-400 transition py-1"
                  >
                    Find Tutor
                  </Link>
                  {/* Only show "Apply as Tutor" if user is not logged in OR is a tutor (not admin) */}
                  {(!user || (user.role === "tutor" && user.role !== "admin")) && (
                    <button
                      onClick={() => {
                        setTutorMenuOpen(false);
                        setMenuOpen(false);
                        handleApplyAsTutor(navigate);
                      }}
                      className="block w-full text-left text-white/70 hover:text-cyan-400 transition py-1"
                    >
                      Apply as Tutor
                    </button>
                  )}
                </div>
              )}
            </div>

            <Link to="/library" onClick={() => setMenuOpen(false)} className="block text-white hover:text-cyan-400 transition py-2 font-medium">
              Library
            </Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="block text-white hover:text-cyan-400 transition py-2 font-medium">
              Contact
            </Link>

          {user && user.role === "admin" ? (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block text-center w-full py-3 px-4 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition font-medium text-white"
              >
                Admin Dashboard
              </Link>
              <button
                type="button"
                onClick={async () => {
                  setMenuOpen(false);
                  try {
                    // Clear user state immediately
                    setUser(null);
                    setProfile(null);
                    // Call logout API
                    await logoutUser();
                  } catch (err) {
                    console.error("Logout error:", err);
                  } finally {
                    // Always clear cookies and redirect
                    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
                    if (window.location.protocol === "https:") {
                      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure";
                    }
                    // Force full page reload to clear all state
                    window.location.href = "/";
                  }
                }}
                className="block text-center w-full py-3 px-4 bg-red-600 hover:bg-red-700 rounded-lg transition cursor-pointer font-semibold text-white shadow-lg"
              >
                Logout ({user.email})
              </button>
            </>
          ) : user && (user.role === "tutor" || user.role === "user") ? (
            <>
              {/* Only show "Apply as Tutor" button for tutors, NOT for regular users or admins */}
              {user.role === "tutor" && user.role !== "admin" && (
                <>
                  <Link
                    to="/apply-tutor"
                    onClick={() => setMenuOpen(false)}
                    className="block text-center w-full py-3 px-4 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition font-medium text-white mb-3"
                  >
                    Apply as Tutor
                  </Link>
                  {profile && (
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block text-center w-full py-3 px-4 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition font-medium text-white mb-3"
                    >
                      My Profile
                    </Link>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={async () => {
                  setMenuOpen(false);
                  try {
                    // Clear user state immediately
                    setUser(null);
                    setProfile(null);
                    // Call logout API
                    await logoutUser();
                  } catch (err) {
                    console.error("Logout error:", err);
                  } finally {
                    // Always clear cookies and redirect
                    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
                    if (window.location.protocol === "https:") {
                      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure";
                    }
                    // Force full page reload to clear all state
                    window.location.href = "/";
                  }
                }}
                className="block text-center w-full py-3 px-4 bg-red-600 hover:bg-red-700 rounded-lg transition cursor-pointer font-semibold text-white shadow-lg"
              >
                Logout ({user.email})
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-center w-full py-3 px-4 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition font-medium text-white mb-3"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="block text-center w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-semibold text-white shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Action Cards for non-logged-in users */}
          {!user && (
            <div className="pt-6 space-y-4 border-t border-white/10 mt-6">
              <p className="text-white/70 text-sm mb-4">Choose a trusted tutor for your learning needs or start earning as a home tutor today.</p>
              
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-cyan-500/30 rounded-xl p-4">
                <h3 className="text-white font-bold text-lg mb-3">Find the right tutor</h3>
                <Link
                  to="/find-tutor"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-center transition"
                >
                  Find Tutor
                </Link>
              </div>

              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-pink-500/30 rounded-xl p-4">
                <h3 className="text-white font-bold text-lg mb-3">Become a home tutor</h3>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleApplyAsTutor(navigate);
                  }}
                  className="block w-full py-2 px-4 bg-pink-600 hover:bg-pink-700 rounded-lg text-white font-semibold transition"
                >
                  Apply as Tutor
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      )}
    </nav>
  );
}
