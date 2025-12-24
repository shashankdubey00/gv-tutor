export default function Library() {
  return (
    <div className="min-h-screen bg-black pt-28 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-8 sm:p-10 text-white rounded-xl mb-6">
          <h1 className="text-4xl font-bold text-center mb-6">Library</h1>
          <p className="text-center text-white/80 text-lg">
            Educational resources and study materials
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-8 text-center text-white rounded-xl">
          <p className="text-xl mb-4">Library content coming soon!</p>
          <p className="text-white/70">
            We're working on adding educational resources, study materials, and helpful guides for students and tutors.
          </p>
        </div>
      </div>
    </div>
  );
}

