export default function About() {
  return (
    <div className="min-h-screen bg-black pt-28 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-8 sm:p-10 text-white rounded-xl">
          <h1 className="text-4xl font-bold text-center mb-6">About GV Tutor</h1>
          <div className="space-y-6 text-white/80">
            <p className="text-lg">
              Welcome to GV Tutor, your trusted platform for connecting students with experienced home tutors.
            </p>
            <p>
              We believe that personalized, one-on-one tutoring can make a significant difference in a student's academic journey. 
              Our platform makes it easy for parents to find qualified tutors and for tutors to connect with students who need their expertise.
            </p>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Our Mission</h2>
            <p>
              To provide accessible, quality education by connecting students with the best home tutors in their area, 
              fostering academic excellence and personal growth.
            </p>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">How It Works</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-2">For Students/Parents</h3>
                <p>Browse available tutors, submit your requirements, and get matched with qualified tutors who meet your needs.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-2">For Tutors</h3>
                <p>Create your profile, showcase your expertise, and connect with students looking for your teaching skills.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

