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
  }, [location.pathname]);

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
                        await logoutUser();
                        navigate("/");
                        window.location.reload();
                      } catch (err) {
                        console.error("Logout error:", err);
                        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                        navigate("/");
                        window.location.reload();
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
                        await logoutUser();
                        navigate("/");
                        window.location.reload();
                      } catch (err) {
                        console.error("Logout error:", err);
                        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                        navigate("/");
                        window.location.reload();
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
        <div className="md:hidden bg-black/70 backdrop-blur-xl text-white p-6 space-y-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block hover:text-blue-400">
            Home
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="block hover:text-blue-400">
            About
          </Link>

          <div>
            <p
              className="font-semibold mb-2 cursor-pointer"
              onClick={() => setTutorMenuOpen(!tutorMenuOpen)}
            >
              Home Tutor ▾
            </p>

            {tutorMenuOpen && (
              <div className="ml-4 space-y-2">
                <Link
                  to="/find-tutor"
                  onClick={() => {
                    setTutorMenuOpen(false);
                    setMenuOpen(false);
                  }}
                  className="block hover:text-blue-400"
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
                    className="block w-full text-left hover:text-blue-400"
                  >
                    Apply as Tutor
                  </button>
                )}
              </div>
            )}
          </div>

          <Link to="/library" onClick={() => setMenuOpen(false)} className="block hover:text-blue-400">
            Library
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="block hover:text-blue-400">
            Contact
          </Link>

          {user && user.role === "admin" ? (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block text-center w-full py-2 border border-white/30 rounded hover:bg-white/20"
              >
                Admin Dashboard
              </Link>
              <button
                type="button"
                onClick={async () => {
                  setMenuOpen(false);
                  try {
                    await logoutUser();
                    navigate("/");
                    window.location.reload();
                  } catch (err) {
                    console.error("Logout error:", err);
                    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    navigate("/");
                    window.location.reload();
                  }
                }}
                className="block text-center w-full py-2 bg-red-600 hover:bg-red-700 rounded transition cursor-pointer"
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
                    className="block text-center w-full py-2 border border-white/30 rounded hover:bg-white/20"
                  >
                    Apply as Tutor
                  </Link>
                  {profile && (
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block text-center w-full py-2 border border-white/30 rounded hover:bg-white/20"
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
                    await logoutUser();
                    navigate("/");
                    window.location.reload();
                  } catch (err) {
                    console.error("Logout error:", err);
                    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    navigate("/");
                    window.location.reload();
                  }
                }}
                className="block text-center w-full py-2 bg-red-600 hover:bg-red-700 rounded transition cursor-pointer"
              >
                Logout ({user.email})
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-center w-full py-2 border border-white/30 rounded hover:bg-white/20"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="block text-center w-full py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
