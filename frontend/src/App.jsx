import { BrowserRouter, Routes, Route, useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { verifyAuth } from "./services/authService";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import SetPassword from "./pages/SetPassword";
import ChangePassword from "./pages/ChangePassword";
import FindTutor from "./pages/FindTutor";
import CompleteProfile from "./pages/CompleteProfile";
import ApplyAsTutor from "./pages/ApplyAsTutor";
import TutorProfile from "./pages/TutorProfile";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Library from "./pages/Library";
import Contact from "./pages/Contact";
import LoadingSpinner from "./components/LoadingSpinner";

function AppContent() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isOAuthProcessing, setIsOAuthProcessing] = useState(false);

  // Handle OAuth callback BEFORE rendering anything
  useEffect(() => {
    const authParam = searchParams.get("auth");
    const provider = searchParams.get("provider");

    if (authParam === "success" && provider === "google") {
      setIsOAuthProcessing(true);
      console.log("🔵 OAuth processing - blocking page render");
      
      // Verify immediately
      verifyAuth()
        .then((data) => {
          console.log("✅ Auth verified:", data.user.role);
          
          if (data.success) {
            const user = data.user;
            
            // Redirect immediately - don't render landing page
            if (user.role === "tutor" && !user.isTutorProfileComplete) {
              console.log("➡️ Tutor redirect to complete-profile");
              navigate("/complete-profile", { replace: true });
            } else if (user.role === "tutor" && user.isTutorProfileComplete) {
              console.log("➡️ Tutor redirect to apply-tutor");
              navigate("/apply-tutor", { replace: true });
            } else if (user.role === "admin") {
              console.log("➡️ Admin redirect to dashboard");
              navigate("/admin/dashboard", { replace: true });
            } else {
              console.log("➡️ Regular user - clean redirect");
              // Use window.location to completely replace history
              window.location.href = "/";
            }
          }
        })
        .catch((error) => {
          console.error("Auth verification failed:", error.message);
          setIsOAuthProcessing(false);
        });
    }
  }, [searchParams, navigate]);

  // Handle initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Small delay for smooth transition

    return () => clearTimeout(timer);
  }, []);

  // Handle route changes (but skip for pages that handle their own loading)
  useEffect(() => {
    // Don't show loading for pages that handle their own redirects
    const pagesWithOwnLoading = ['/apply-tutor', '/complete-profile', '/admin/dashboard'];
    if (pagesWithOwnLoading.includes(location.pathname)) {
      setIsNavigating(false);
      return;
    }
    
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 200); // Short delay for route transitions

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // BLOCK rendering if OAuth is processing - show loading spinner instead
  if (isOAuthProcessing) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {(loading || isNavigating) && <LoadingSpinner />}
      <Routes>
        {/* Admin routes without Navbar */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Routes with Navbar */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                {/* Public pages - no authentication required */}
                <Route path="/" element={<Hero />} />
                <Route path="/about" element={<About />} />
                <Route path="/library" element={<Library />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Auth pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/set-password" element={<SetPassword />} />
                <Route path="/change-password" element={<ChangePassword />} />
                
                {/* Protected pages */}
                <Route path="/find-tutor" element={<FindTutor />} />
                <Route path="/complete-profile" element={<CompleteProfile />} />
                <Route path="/apply-tutor" element={<ApplyAsTutor />} />
                <Route path="/profile" element={<TutorProfile />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
