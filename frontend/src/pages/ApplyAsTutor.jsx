import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getPostedTutorRequests } from "../services/tutorService";
import { verifyAuth, logoutUser } from "../services/authService";
import LoadingSpinner from "../components/LoadingSpinner";
import { setRedirecting, isRedirecting, shouldRedirect, clearRedirecting } from "../utils/redirectGuard";

export default function ApplyAsTutor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState([]);
  const [isRedirectingState, setIsRedirectingState] = useState(false);

  // Check authentication and profile completion
  useEffect(() => {
    let isMounted = true;
    let timeoutId;
    
    // Clear any previous redirect flags after a delay
    setTimeout(() => {
      clearRedirecting();
    }, 1000);
    
    async function checkAuth() {
      // Prevent redirect loops
      if (isRedirecting()) {
        return;
      }
      
      try {
        console.log("🔍 Checking authentication...");
        const authData = await verifyAuth();
        console.log("✅ Auth check complete:", authData);
        
        // Only tutors can access this page
        if (!authData.success || authData.user.role !== "tutor") {
          console.log("❌ Not a tutor, redirecting to login or complete-profile");
          if (isMounted) {
            // Prevent admins from accessing tutor pages
            if (authData.success && authData.user.role === "admin") {
              console.log("❌ Admin cannot access tutor pages, redirecting to admin dashboard");
              alert("Admins cannot apply as tutors. Redirecting to admin dashboard.");
              setIsRedirectingState(true);
              setRedirecting("/admin/dashboard");
              setTimeout(() => {
                navigate("/admin/dashboard", { replace: true });
              }, 500);
              return;
            }
            
            if (authData.success && authData.user.role === "user") {
              // User is logged in but not a tutor - redirect to complete profile
              setIsRedirectingState(true);
              setRedirecting("/complete-profile");
              setTimeout(() => {
                navigate("/complete-profile", { replace: true });
              }, 500);
            } else {
              // Not logged in - redirect to login
              if (shouldRedirect(location.pathname, "/login")) {
                setIsRedirectingState(true);
                setRedirecting("/login");
                setTimeout(() => {
                  navigate("/login", { replace: true });
                }, 500);
              }
            }
          }
          return;
        }

        if (!authData.user.isTutorProfileComplete) {
          console.log("❌ Profile incomplete, redirecting to complete-profile");
          if (isMounted && shouldRedirect(location.pathname, "/complete-profile")) {
            setIsRedirectingState(true);
            setRedirecting("/complete-profile");
            setTimeout(() => {
              navigate("/complete-profile", { replace: true });
            }, 500);
          }
          return;
        }

        // Load tutor requests only if profile is complete
        if (isMounted) {
          try {
            console.log("📥 Loading tutor requests...");
            const requestStartTime = Date.now();
            const data = await getPostedTutorRequests();
            const requestDuration = Date.now() - requestStartTime;
            console.log(`✅ Tutor requests loaded in ${requestDuration}ms:`, data);
            if (data.success && isMounted) {
              setRequests(data.requests || []);
            }
          } catch (err) {
            console.error("❌ Error loading tutor requests:", err);
            if (err.message.includes("complete your profile") || err.message.includes("Please complete your profile")) {
              if (isMounted && shouldRedirect(location.pathname, "/complete-profile")) {
                setIsRedirectingState(true);
                setRedirecting("/complete-profile");
                setTimeout(() => {
                  navigate("/complete-profile", { replace: true });
                }, 500);
              }
            } else if (isMounted) {
              setError(err.message || "Failed to load tutor requests. Please check your connection and ensure the backend server is running.");
            }
          }
        }
      } catch (err) {
        console.error("❌ Auth error:", err);
        if (isMounted) {
          setError(err.message || "Authentication failed. Please try logging in again.");
          if (shouldRedirect(location.pathname, "/login")) {
            setIsRedirectingState(true);
            setRedirecting("/login");
            setTimeout(() => {
              navigate("/login", { replace: true });
            }, 500);
          }
        }
      } finally {
        if (isMounted) {
          console.log("✅ Setting loading to false");
          setLoading(false);
          setChecking(false);
        }
      }
    }
    
    // Add timeout to prevent infinite loading (15 seconds for initial check)
    timeoutId = setTimeout(() => {
      if (isMounted && checking) {
        console.error("⏱️ Timeout: Initial check took too long");
        setError("Request is taking longer than expected. Please check your connection and ensure the backend server is running.");
        setLoading(false);
        setChecking(false);
      }
    }, 15000); // 15 seconds timeout for initial check
    
    checkAuth();
    
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate, location.pathname]);

  if (checking || isRedirectingState) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-black pt-28 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-8 sm:p-10 text-white rounded-xl mb-6">
          <h2 className="text-3xl font-bold text-center mb-2">
            Available Tutor Positions
          </h2>
          <p className="text-center text-white/80">
            Browse and apply for tutor positions that match your expertise
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6 flex items-center justify-between">
            <div>
              <p className="mb-2">{error}</p>
              <p className="text-sm text-red-200/70">
                Make sure your backend server is running on port 5000 (or your configured PORT).
              </p>
            </div>
            <button
              onClick={() => {
                setError("");
                setChecking(true);
                setLoading(true);
                window.location.reload();
              }}
              className="ml-4 px-4 py-2 bg-red-500/30 hover:bg-red-500/40 rounded text-sm font-semibold transition"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-8 text-center text-white rounded-xl">
            <p className="text-xl mb-4 text-red-400">Unable to load tutor positions</p>
            <p className="text-white/70 mb-6">
              Please check your connection and ensure the backend server is running.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 rounded-lg font-semibold text-white transition"
              >
                Refresh Page
              </button>
              <button
                onClick={async () => {
                  try {
                    await logoutUser();
                    navigate("/login");
                  } catch (err) {
                    navigate("/login");
                  }
                }}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-cyan-500/30 rounded-lg font-semibold text-white transition"
              >
                Logout
              </button>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-8 text-center text-white rounded-xl">
            <p className="text-xl mb-4">No tutor positions available at the moment.</p>
            <p className="text-white/70">
              Check back later or contact admin for more information.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-end">
              <button
                onClick={async () => {
                  try {
                    await logoutUser();
                    navigate("/login");
                  } catch (err) {
                    console.error("Logout error:", err);
                    // Clear cookie manually if API fails
                    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    navigate("/login");
                  }
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-cyan-500/30 rounded-lg font-semibold text-white transition"
              >
                Logout
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((request) => (
              <div
                key={request._id}
                className="bg-white text-gray-900 p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Grade: {request.studentGrade}
                  </h3>
                </div>

                <div className="space-y-3 mb-4">
                  {request.subjects && (
                    <div>
                      <p className="text-gray-700 text-sm font-semibold mb-1">Subjects:</p>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(request.subjects) ? (
                          request.subjects.map((subject, idx) => (
                            <span
                              key={idx}
                              className="bg-cyan-100 text-cyan-700 border border-cyan-300 px-2 py-1 rounded text-xs font-medium"
                            >
                              {subject}
                            </span>
                          ))
                        ) : (
                          <span className="bg-cyan-100 text-cyan-700 border border-cyan-300 px-2 py-1 rounded text-xs font-medium">
                            {request.subjects}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {request.preferredLocation && (
                    <div>
                      <p className="text-gray-700 text-sm font-semibold">Location:</p>
                      <p className="text-gray-900">{request.preferredLocation}</p>
                    </div>
                  )}

                  {request.preferredTiming && (
                    <div>
                      <p className="text-gray-700 text-sm font-semibold">Timing:</p>
                      <p className="text-gray-900">{request.preferredTiming}</p>
                    </div>
                  )}

                  {request.frequency && (
                    <div>
                      <p className="text-gray-700 text-sm font-semibold">Frequency:</p>
                      <p className="text-gray-900 capitalize">{request.frequency}</p>
                    </div>
                  )}

                  {request.budget && (
                    <div>
                      <p className="text-gray-700 text-sm font-semibold">Budget:</p>
                      <p className="text-gray-900 font-bold text-lg">{request.budget}</p>
                    </div>
                  )}

                  {request.preferredTutorGender && (
                    <div>
                      <p className="text-gray-700 text-sm font-semibold">Tutor Gender:</p>
                      <p className="text-gray-900 capitalize">{request.preferredTutorGender}</p>
                    </div>
                  )}

                  {request.additionalRequirements && (
                    <div>
                      <p className="text-gray-700 text-sm font-semibold">Additional Requirements:</p>
                      <p className="text-gray-600 text-sm">{request.additionalRequirements}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-500 text-xs mb-3">
                    Posted: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => {
                      // TODO: Implement apply functionality
                      alert("Apply functionality will be implemented next!");
                    }}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 transition font-semibold text-white shadow-lg hover:shadow-xl"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

