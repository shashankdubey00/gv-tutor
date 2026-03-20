import { useState } from "react";
import quietZonesImg from "../assets/quiet zones.jpeg";
import collaborativeTablesImg from "../assets/photogood.jpeg";

const libraryCards = [
  {
    id: "jk-road",
    name: "GV Library",
    location: "JK Road, Bhopal",
    status: "Active Branch",
    image: quietZonesImg,
    summary: "A disciplined study environment for students who want consistency, quiet, and focused seat time.",
    details: [
      "This branch is positioned as a calm academic space for reading, revision, and long study sessions with minimum distraction.",
      "It can be presented to users as the ideal choice for students who want silent study desks, routine-based preparation, and a clean learning atmosphere."
    ],
    features: ["Silent seating", "Study-friendly environment", "Routine-based self study"]
  },
  {
    id: "branch-two",
    name: "GV Library",
    location: "Second Branch Location",
    status: "Branch Structure Ready",
    image: collaborativeTablesImg,
    summary: "A second GV Library card ready for your next location, with the same structure and a separate branch identity.",
    details: [
      "This card is intentionally structured so you can replace the location and branch-specific content when you finalize the second library address.",
      "The page layout is already ready for a multi-branch presentation, so adding future details will be straightforward."
    ],
    features: ["Clickable branch card", "Location-specific content", "Expandable for future branch updates"]
  }
];

export default function Library() {
  const [activeLibrary, setActiveLibrary] = useState(libraryCards[0].id);
  const selectedLibrary = libraryCards.find((card) => card.id === activeLibrary) || libraryCards[0];

  return (
    <div className="min-h-screen bg-[#05070a] pt-28 px-4 pb-20 text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-cyan-500/25 bg-gradient-to-br from-slate-950 via-[#07111c] to-slate-950 px-6 py-12 sm:px-10 sm:py-14 shadow-[0_30px_80px_rgba(8,145,178,0.12)]">
          <div className="absolute -top-20 left-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative z-10 max-w-4xl">
            <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              GV Library Network
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight">
              Show users both GV Library branches with a cleaner, more product-style layout.
            </h1>
            <p className="mt-4 max-w-3xl text-white/75 text-lg leading-relaxed">
              Each branch now appears as a clickable card with its own detail panel, so visitors can quickly compare locations and understand what each library offers.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.08fr_1.42fr]">
          <div className="space-y-4">
            {libraryCards.map((card) => {
              const isActive = activeLibrary === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActiveLibrary(card.id)}
                  className={`w-full overflow-hidden rounded-[1.6rem] border text-left transition-all duration-300 ${
                    isActive
                      ? "border-cyan-400/50 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 shadow-[0_20px_60px_rgba(34,211,238,0.16)]"
                      : "border-white/10 bg-white/5 hover:border-cyan-400/30 hover:bg-white/[0.07]"
                  }`}
                >
                  <div className="h-44 overflow-hidden border-b border-white/10">
                    <img src={card.image} alt={card.location} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-6">
                    <span className="text-xs uppercase tracking-[0.22em] text-cyan-300/90">{card.status}</span>
                    <h2 className="mt-3 text-2xl font-semibold">{card.name}</h2>
                    <p className="mt-1 text-white/60">{card.location}</p>
                    <p className="mt-4 text-white/70 leading-relaxed">{card.summary}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-slate-950 via-[#0a1320] to-slate-950 shadow-[0_24px_80px_rgba(2,6,23,0.34)]">
            <div className="grid lg:grid-cols-[1.05fr_1fr]">
              <div className="min-h-[300px] border-b border-white/10 lg:border-b-0 lg:border-r overflow-hidden">
                <img
                  src={selectedLibrary.image}
                  alt={selectedLibrary.location}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8">
                <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  {selectedLibrary.status}
                </span>
                <h3 className="mt-4 text-3xl font-bold">{selectedLibrary.name}</h3>
                <p className="mt-2 text-white/65 text-lg">{selectedLibrary.location}</p>
                <p className="mt-4 text-white/75 text-lg leading-relaxed">{selectedLibrary.summary}</p>

                <div className="mt-6 space-y-4 text-white/75">
                  {selectedLibrary.details.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-8 grid gap-3">
                  {selectedLibrary.features.map((feature) => (
                    <div
                      key={feature}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
