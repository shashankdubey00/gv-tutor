import { BrowserRouter, Routes, Route, useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { verifyAuth } from "./services/authService";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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

// Component to handle Google OAuth verification
function AuthVerifier() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const authParam = searchParams.get("auth");
    const provider = searchParams.get("provider");

    if (authParam === "success" && provider === "google") {
      // Verify authentication after Google OAuth
      verifyAuth()
        .then((data) => {
          if (data.success) {
            console.log("✅ Google authentication verified:", data.user);
            const user = data.user;
            
            // Redirect based on role and profile completion
            if (user.role === "tutor" && !user.isTutorProfileComplete) {
              window.location.href = "/complete-profile";
            } else if (user.role === "tutor" && user.isTutorProfileComplete) {
              window.location.href = "/apply-tutor";
            }
            // For users, stay on home page
          }
        })
        .catch((error) => {
          console.error("❌ Authentication verification failed:", error);
        });
    }
  }, [searchParams]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

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

  return (
    <>
      <AuthVerifier />
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
