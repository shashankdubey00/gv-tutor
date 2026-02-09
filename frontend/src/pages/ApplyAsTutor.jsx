import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getPostedTutorRequests, applyToTutorRequest, hideTutorRequest } from "../services/tutorService";
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
  const [applyingTo, setApplyingTo] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [displayCount, setDisplayCount] = useState(10);
  const [hidingRequestId, setHidingRequestId] = useState(null);

  // Check authentication and profile completion
  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;

    // Clear any previous redirect flags
    clearRedirecting();

    // Set timeout for slower connections (30 seconds for API timeout)
    timeoutId = setTimeout(() => {
      if (isMounted && checking) {
        console.error("⏱️ Timeout: Initial check took too long");
        setError("Request is taking longer than expected. Please check your connection and ensure the backend server is running.");
        setLoading(false);
        setChecking(false);
      }
    }, 30000); // 30 seconds timeout

    async function checkAuth() {
      // Prevent redirect loops
      if (isRedirecting()) {
        return;
      }

      try {
        console.log("🔍 Checking authentication...");
        const authData = await verifyAuth();
        console.log("✅ Auth check complete:", authData);

        // Clear timeout since auth check completed
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        // Only tutors can access this page
        if (!authData.success || authData.user.role !== "tutor") {
          console.log("❌ Not a tutor, redirecting to login or complete-profile");
          if (isMounted) {
            // Prevent admins from accessing tutor pages
            if (authData.success && authData.user.role === "admin") {
              console.log("❌ Admin cannot access tutor pages, redirecting to admin dashboard");
              console.warn("Admins cannot apply as tutors. Redirecting to admin dashboard.");
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
              setError(""); // Clear any previous errors
              setSuccessMessage(""); // Clear success messages
            }
          } catch (err) {
            console.error("❌ Error loading tutor requests:", err);
            // Clear timeout since we got an error response
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
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
        // Clear timeout since we got an error
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
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
          // Clear timeout in finally block as well
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate, location.pathname]);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleApply = async (requestId) => {
    if (applyingTo) return; // Prevent multiple clicks

    if (!requestId) {
      setError("Invalid request ID. Please try again.");
      return;
    }

    setApplyingTo(requestId);
    setError("");
    setSuccessMessage("");

    try {
      console.log("📝 Applying to request:", requestId);
      const result = await applyToTutorRequest(requestId);
      console.log("✅ Apply result:", result);

      if (result.success) {
        setSuccessMessage("Application submitted successfully!");
        // Update the request to show it's been applied
        setRequests(requests.map(req =>
          req._id === requestId
            ? { ...req, hasApplied: true }
            : req
        ));
        // Update selected request if modal is open
        if (selectedRequest && selectedRequest._id === requestId) {
          setSelectedRequest({ ...selectedRequest, hasApplied: true });
        }
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
        // Close modal after successful application
        setShowModal(false);
      } else {
        setError(result.message || "Failed to submit application. Please try again.");
      }
    } catch (err) {
      console.error("❌ Apply error:", err);
      setError(err.message || "Failed to submit application. Please check your connection and try again.");
    } finally {
      setApplyingTo(null);
    }
  };

  const handleHideRequest = async (requestId) => {
    if (hidingRequestId) return;
    setHidingRequestId(requestId);
    setError("");

    try {
      await hideTutorRequest(requestId);
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
      if (selectedRequest && selectedRequest._id === requestId) {
        setShowModal(false);
        setSelectedRequest(null);
      }
    } catch (err) {
      setError(err.message || "Failed to remove this post. Please try again.");
    } finally {
      setHidingRequestId(null);
    }
  };

  const handleSeeMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  const displayedRequests = requests
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, displayCount);

  const hasMore = requests.length > displayCount;

  if (checking || isRedirectingState) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#05070a] pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-4 text-white rounded-lg flex-1">
            <h2 className="text-2xl font-bold mb-1">
              Available Tutor Positions
            </h2>
            <p className="text-white/80 text-sm">
              Browse and apply for tutor positions that match your expertise
            </p>
          </div>

        </div>

        {successMessage && (
          <div className="bg-green-500/20 border-2 border-green-500 text-green-300 p-4 rounded-xl mb-6 text-center">
            <p className="font-semibold">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border-2 border-red-500 text-red-300 p-6 rounded-xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <p className="mb-2 font-semibold text-lg">{error}</p>
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
              className="px-6 py-2.5 bg-red-500/30 hover:bg-red-500/40 rounded-lg text-sm font-semibold transition-all shadow-lg"
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
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-10 text-center text-white rounded-xl">
            <p className="text-2xl mb-4 text-red-400 font-bold">Unable to load tutor positions</p>
            <p className="text-white/70 mb-8 text-lg">
              Please check your connection and ensure the backend server is running.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl"
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
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-white transition-all shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-10 text-center text-white rounded-xl">
            <p className="text-2xl mb-4 font-bold">No tutor positions available at the moment.</p>
            <p className="text-white/70 text-lg">
              Check back later or contact admin for more information.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
              {displayedRequests.map((request) => (
                <div
                  key={request._id}
                  className={`bg-white text-gray-900 p-3 rounded-lg shadow-md border ${request.hasApplied
                      ? "border-green-300 bg-green-50/30"
                      : "border-gray-200"
                    } hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer`}
                  onClick={() => handleViewDetails(request)}
                >
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-gray-900">
                        Grade {request.studentGrade || "N/A"}
                      </h3>
                      {request.hasApplied && (
                        <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-2">
                    {request.subjects && (
                      <div>
                        <p className="text-gray-600 text-[10px] font-semibold mb-0.5">Subjects:</p>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(request.subjects) ? (
                            request.subjects.slice(0, 2).map((subject, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-100 text-blue-700 border border-blue-300 px-1.5 py-0.5 rounded text-[10px] font-medium"
                              >
                                {subject.length > 8 ? subject.substring(0, 8) + '...' : subject}
                              </span>
                            ))
                          ) : (
                            <span className="bg-blue-100 text-blue-700 border border-blue-300 px-1.5 py-0.5 rounded text-[10px] font-medium">
                              {request.subjects.length > 8 ? request.subjects.substring(0, 8) + '...' : request.subjects}
                            </span>
                          )}
                          {Array.isArray(request.subjects) && request.subjects.length > 2 && (
                            <span className="text-[10px] text-gray-500">+{request.subjects.length - 2}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {request.preferredLocation && (
                      <div>
                        <p className="text-gray-600 text-[10px] font-semibold mb-0.5">Location:</p>
                        <p className="text-gray-900 font-medium text-xs truncate">{request.preferredLocation}</p>
                      </div>
                    )}

                    {request.budget && (
                      <div>
                        <p className="text-gray-600 text-[10px] font-semibold mb-0.5">Budget:</p>
                        <p className="text-gray-900 font-bold text-sm text-blue-600">{request.budget}</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-2 mt-2 space-y-2">
                    <p className="text-gray-500 text-[10px] mb-2 text-center">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(request);
                      }}
                      disabled={request.hasApplied || applyingTo === request._id}
                      className={`w-full py-1.5 rounded text-xs font-semibold text-white shadow-sm transition-all ${request.hasApplied
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600"
                        }`}
                    >
                      {request.hasApplied ? "Applied" : "View & Apply"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHideRequest(request._id);
                      }}
                      disabled={hidingRequestId === request._id}
                      className="w-full py-1.5 rounded text-xs font-semibold text-red-700 bg-red-100 border border-red-300 hover:bg-red-200 transition-all disabled:opacity-60"
                    >
                      {hidingRequestId === request._id ? "Removing..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleSeeMore}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition-all shadow-lg"
                >
                  See More ({requests.length - displayCount} remaining)
                </button>
              </div>
            )}
          </>
        )}

        {/* Detail Modal */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-xl">
                <h3 className="text-2xl font-bold text-gray-900">Position Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      Grade: {selectedRequest.studentGrade || "N/A"}
                    </h3>
                    {selectedRequest.hasApplied && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Applied
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {selectedRequest.subjects && (
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-2">Subjects:</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(selectedRequest.subjects) ? (
                          selectedRequest.subjects.map((subject, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {subject}
                            </span>
                          ))
                        ) : (
                          <span className="bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                            {selectedRequest.subjects}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedRequest.preferredLocation && (
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">Location:</p>
                      <p className="text-gray-900 font-medium">{selectedRequest.preferredLocation}</p>
                    </div>
                  )}

                  {selectedRequest.preferredTiming && (
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">Timing:</p>
                      <p className="text-gray-900 font-medium">{selectedRequest.preferredTiming}</p>
                    </div>
                  )}

                  {selectedRequest.frequency && (
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">Frequency:</p>
                      <p className="text-gray-900 font-medium capitalize">{selectedRequest.frequency}</p>
                    </div>
                  )}

                  {selectedRequest.budget && (
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">Budget:</p>
                      <p className="text-gray-900 font-bold text-2xl text-blue-600">{selectedRequest.budget}</p>
                    </div>
                  )}

                  {selectedRequest.preferredTutorGender && (
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">Tutor Gender:</p>
                      <p className="text-gray-900 font-medium capitalize">{selectedRequest.preferredTutorGender}</p>
                    </div>
                  )}

                  {selectedRequest.additionalRequirements && (
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">Additional Requirements:</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{selectedRequest.additionalRequirements}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">Posted:</p>
                    <p className="text-gray-500 text-sm">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <button
                    onClick={() => handleApply(selectedRequest._id)}
                    disabled={selectedRequest.hasApplied || applyingTo === selectedRequest._id}
                    className={`w-full py-3 rounded-lg font-semibold text-white shadow-lg transition-all ${selectedRequest.hasApplied
                        ? "bg-gray-400 cursor-not-allowed"
                        : applyingTo === selectedRequest._id
                          ? "bg-blue-400 cursor-wait"
                          : "bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 hover:shadow-xl"
                      }`}
                  >
                    {applyingTo === selectedRequest._id
                      ? "Applying..."
                      : selectedRequest.hasApplied
                        ? "Already Applied"
                        : "Apply Now"}
                  </button>
                  <button
                    onClick={() => handleHideRequest(selectedRequest._id)}
                    disabled={hidingRequestId === selectedRequest._id}
                    className="w-full py-3 rounded-lg font-semibold text-red-700 bg-red-100 border border-red-300 hover:bg-red-200 transition-all disabled:opacity-60"
                  >
                    {hidingRequestId === selectedRequest._id ? "Removing..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

