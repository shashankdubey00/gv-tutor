import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, CheckCircle } from 'lucide-react';
import { handleApplyAsTutor } from '../utils/authHelper';

const Hero = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Navigate to contact page or handle form submission
    navigate('/contact', { state: { formData } });
  };

  return (
    <div className="bg-[#05070a] text-white selection:bg-blue-500/30">
      
      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden pt-32 md:pt-40">
        {/* Animated Background Glows */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10"
        >
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            <span className="block md:hidden">Connect with the <br/><span className="text-blue-500">best tutors</span> <br/>in your area</span>
            <span className="hidden md:block">Connecting students with the <br/><span className="text-blue-500">best home tutors</span> in your area</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Choose a trusted tutor for your learning needs or start earning as a home tutor today.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div whileHover={{ y: -5 }} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl font-bold mb-4">Find the right tutor</h3>
              <button 
                onClick={() => navigate("/find-tutor")}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20"
              >
                Find Tutor
              </button>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="p-8 rounded-3xl bg-white/5 border border-pink-500/20 backdrop-blur-xl">
              <h3 className="text-xl font-bold mb-4">Become a home tutor</h3>
              <button 
                onClick={() => handleApplyAsTutor(navigate)}
                className="w-full py-4 bg-pink-600 hover:bg-pink-700 rounded-xl font-semibold transition-all shadow-lg shadow-pink-600/20"
              >
                Apply as Tutor
              </button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: ABOUT MISSION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div {...fadeIn} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our GV Ready & Mission</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Providing quiet spaces for focused reading and connecting the brightest minds through personalized tutoring.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            { title: "Quiet Zones", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644" },
            { title: "Collaborative Tables", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f" },
            { title: "Individual Pods", img: "https://images.unsplash.com/photo-1497493292307-31c376b6e479" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.05 }}
              className="group text-center"
            >
              <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-2 border-blue-500/20 group-hover:border-blue-500 transition-colors mb-6">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="text-2xl font-bold">{item.title}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: ABOUT HOME TUTOR */}
      <section className="py-24 bg-blue-600/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl font-bold mb-6 italic">Premium Home Tuition</h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              We bridge the gap between quality education and accessibility. Our platform ensures that every student gets the undivided attention they deserve in the comfort of their home.
            </p>
            <div className="space-y-4">
              {['Verified Subject Experts', 'Flexible Schedules', 'Regular Progress Tracking'].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="text-blue-500" size={20} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeIn} className="relative">
             <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
             <img 
               src="https://images.unsplash.com/photo-1577896851231-70ef1460371e" 
               className="rounded-3xl relative z-10 border border-white/10 shadow-2xl" 
               alt="Tutor"
             />
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: GET IN TOUCH & MAP */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden grid md:grid-cols-2">
          <div className="p-12">
            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 ring-blue-500 outline-none transition-all text-white placeholder-gray-400" 
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 ring-blue-500 outline-none transition-all text-white placeholder-gray-400" 
              />
              <textarea 
                placeholder="Your Message" 
                rows="4" 
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 ring-blue-500 outline-none transition-all text-white placeholder-gray-400"
              ></textarea>
              <button 
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
          
          <div className="relative min-h-[400px] bg-gray-900">
            {/* Real Google Map Integration */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.223391312741!2d77.06889751508011!3d28.50290968246803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDMwJzEwLjUiTiA3N8KwMDQnMTYuMCJF!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin" 
              className="absolute inset-0 w-full h-full grayscale invert opacity-50"
              style={{ border: 0 }}
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
            <div className="absolute bottom-8 left-8 p-6 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl">
              <div className="flex items-center gap-3 mb-2"><MapPin size={18} className="text-blue-500" /> <span>Knowledge City, KW 12495</span></div>
              <div className="flex items-center gap-3 mb-2"><Phone size={18} className="text-blue-500" /> <span>+1 (555) 123-687</span></div>
              <div className="flex items-center gap-3"><Mail size={18} className="text-blue-500" /> <span>contact@gvtutor.com</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-500">
        <p>© 2025 GV Tutor. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Hero;
