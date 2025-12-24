import { useNavigate } from "react-router-dom";
import { handleApplyAsTutor } from "../utils/authHelper";

export default function Hero() {
  const navigate = useNavigate();
  
  return (
    <section className="hero-bg text-white pt-24 pb-20 relative z-10">
      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Connecting students with the best home tutors in your area
        </h1>

        {/* Subtext */}
        <p className="mt-4 text-lg sm:text-xl text-gray-200">
          Choose a trusted tutor for your learning needs or start earning as a home tutor today.
        </p>
      </div>

      {/* Two columns */}
      <div className="max-w-6xl mx-auto px-6 mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Find Tutor */}
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/20 text-center md:text-left">
          <h2 className="text-2xl font-semibold">
            Find the right tutor for your learning
          </h2>
          <button 
            onClick={() => navigate("/find-tutor")}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
          >
            Find Tutor
          </button>
        </div>

        {/* Apply Tutor */}
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/20 text-center md:text-left">
          <h2 className="text-2xl font-semibold">
            Become a home tutor and start earning
          </h2>
          <button 
            onClick={() => handleApplyAsTutor(navigate)}
            className="mt-6 px-6 py-3 bg-rose-500 hover:bg-rose-600 rounded-lg font-medium"
          >
            Apply as Tutor
          </button>
        </div>

      </div>
    </section>
  );
}
