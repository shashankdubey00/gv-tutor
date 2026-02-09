import { useState } from "react";
import { submitContactForm } from "../services/contactService";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      // Combine subject and message for the backend
      const fullMessage = formData.subject 
        ? `Subject: ${formData.subject}\n\n${formData.message}`
        : formData.message;

      await submitContactForm({
        name: formData.name,
        email: formData.email,
        message: fullMessage
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black pt-28 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-8 sm:p-10 text-white rounded-xl">
          <h1 className="text-4xl font-bold text-center mb-6">Contact Us</h1>
          <p className="text-center text-white/80 mb-8">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>

          {submitted ? (
            <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-lg mb-6">
              <p className="text-center">✅ Thank you for your message! We'll get back to you soon.</p>
            </div>
          ) : null}

          {error ? (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
              <p className="text-center">❌ {error}</p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name *"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email *"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject *"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <textarea
              name="message"
              placeholder="Your Message *"
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 disabled:from-cyan-700 disabled:to-green-700 disabled:cursor-not-allowed transition font-semibold text-white shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-cyan-500/30">
            <h2 className="text-2xl font-semibold mb-4">Other Ways to Reach Us</h2>
            <div className="space-y-2 text-white/80">
              <p><strong>Email:</strong> goodwill2404@gmail.com</p>
              <p><strong>Phone:</strong> +91 9691569239</p>
              <p><strong>Address:</strong> Neerja Nagar, Durgesh Vihar JK Road, Bhopal, Madhya Pradesh 462022</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

