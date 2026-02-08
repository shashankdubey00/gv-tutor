export default function Library() {
  return (
    <div className="min-h-screen bg-[#05070a] pt-28 px-4 pb-20 text-white">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-black to-slate-900 p-10 sm:p-12 shadow-2xl shadow-cyan-500/20">
          <div className="absolute -top-20 -right-10 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative z-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Library</h1>
            <p className="text-white/80 text-lg sm:text-xl max-w-3xl mx-auto">
              A calm, focused space where students come to read, study, and grow with the support of books, quiet rooms, and dedicated desks.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-3">Purpose</h2>
            <p className="text-white/75 leading-relaxed">
              Our library is designed to provide a good study environment where students can concentrate without distractions, explore books, and build strong study habits.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-3">What You Get</h2>
            <p className="text-white/75 leading-relaxed">
              Access to books, separate desks for focused learning, and quiet study rooms that help students maintain discipline and consistency.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Books Availability",
              desc: "A growing collection of study materials to support regular learning.",
            },
            {
              title: "Quiet Study Rooms",
              desc: "Dedicated rooms for silent, distraction‑free preparation.",
            },
            {
              title: "Separate Desks",
              desc: "Individual desks to help students stay comfortable and focused.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/70 via-black/70 to-slate-900/70 p-6 shadow-lg hover:shadow-cyan-500/20 transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-white/70">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-8 text-center">
          <h3 className="text-2xl font-semibold mb-2">Visit the Library</h3>
          <p className="text-white/75">
            A peaceful place to read, revise, and stay consistent with your studies.
          </p>
        </div>
      </div>
    </div>
  );
}

