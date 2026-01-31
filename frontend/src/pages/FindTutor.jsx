import { useEffect, useState } from "react";
import { createTutorRequest } from "../services/tutorService";

export default function FindTutor() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentGrade: "",
    subjects: [],
    subjectInput: "",
    preferredLocation: "",
    preferredTiming: "",
    frequency: "weekly",
    budget: "",
    preferredTutorGender: "any",
    teacherExperience: "",
    additionalRequirements: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleAddSubject() {
    if (formData.subjectInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, prev.subjectInput.trim()],
        subjectInput: "",
      }));
    }
  }

  function handleRemoveSubject(index) {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (formData.subjects.length === 0) {
      setError("Please add at least one subject");
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        teacherExperience: parseInt(formData.teacherExperience, 10),
      };

      console.log("📤 FindTutor submit payload:", dataToSend);
      await createTutorRequest(dataToSend);
      setSuccess(true);
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        studentGrade: "",
        subjects: [],
        subjectInput: "",
        preferredLocation: "",
        preferredTiming: "",
        frequency: "weekly",
        budget: "",
        preferredTutorGender: "any",
        teacherExperience: "",
        additionalRequirements: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black pt-28 px-4 pb-20">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-8 sm:p-10 text-white rounded-xl">
          <h2 className="text-3xl font-bold text-center mb-2">
            Find a Tutor for Your Child
          </h2>
          <p className="text-center text-white/80 mb-6">
            Fill out the form below and our admin will help you find the perfect tutor
          </p>

          {success && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="w-full max-w-md bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 rounded-xl p-6 text-center">
                <p className="text-xl font-bold text-white mb-2">Request Submitted</p>
                <p className="text-white/80">
                  Your request has been submitted successfully. Admin will review and contact you soon.
                </p>
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Combined Parent/Student Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name (Parent/Guardian) *"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email *"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone *"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
              <input
                type="text"
                name="studentGrade"
                placeholder="Student Grade/Class *"
                value={formData.studentGrade}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Subjects */}
            <div>
              <label className="block text-white/80 mb-2">Subjects *</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  name="subjectInput"
                  placeholder="Add subject (e.g., Mathematics)"
                  value={formData.subjectInput}
                  onChange={handleChange}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSubject())}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 rounded-lg font-medium text-white"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {subject}
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Location & Timing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="preferredLocation"
                placeholder="Preferred Location *"
                value={formData.preferredLocation}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
              <input
                type="text"
                name="preferredTiming"
                placeholder="Preferred Timing (e.g., Evening 6-8 PM) *"
                value={formData.preferredTiming}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Row 1: Frequency + Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Frequency *
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 rounded-lg bg-gray-800 text-white border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget *
                </label>
                <input
                  type="text"
                  name="budget"
                  placeholder="e.g., ₹2000/month"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 rounded-lg bg-gray-800 text-white border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Row 2: Teacher Experience + Gender Preference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
              {/* Teacher Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Teacher Experience (yr) *
                </label>
                <input
                  type="number"
                  name="teacherExperience"
                  placeholder="e.g., 5"
                  value={formData.teacherExperience}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  required
                  className="w-full px-3 py-3 rounded-lg bg-gray-800 text-white border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base"
                />
              </div>

              {/* Gender Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tutor Gender
                </label>
                <select
                  name="preferredTutorGender"
                  value={formData.preferredTutorGender}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 rounded-lg bg-gray-800 text-white border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base"
                >
                  <option value="any">Any Gender</option>
                  <option value="male">Male Tutor</option>
                  <option value="female">Female Tutor</option>
                </select>
              </div>
            </div>

            {/* Additional Requirements */}
            <textarea
              name="additionalRequirements"
              placeholder="Additional Requirements *"
              value={formData.additionalRequirements}
              onChange={handleChange}
              rows="3"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 transition font-semibold text-white shadow-lg shadow-cyan-500/30"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

