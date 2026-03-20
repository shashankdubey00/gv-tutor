import { useState } from "react";
import quietZonesImg from "../assets/quiet zones.jpeg";
import collaborativeTablesImg from "../assets/photogood.jpeg";

const serviceCards = [
  {
    id: "home-tutor",
    tag: "Personalized Learning",
    title: "Goodwill Home Tutor",
    subtitle: "Trusted home tuition support for students who need focused, one-to-one guidance.",
    image: collaborativeTablesImg,
    highlights: ["Verified tutors", "Flexible timing", "At-home convenience"],
    details: [
      "Goodwill Home Tutor is built for students and parents who want personalized academic support at home. We focus on matching learners with tutors who can guide them consistently and adapt to their pace.",
      "This service works well for school support, concept-building, revision plans, and subject-specific help where one-to-one attention makes a real difference."
    ],
    points: [
      "Suitable for regular school support and exam preparation",
      "Dedicated tutor matching based on class, subject, and location",
      "Clear communication with families on schedules and expectations"
    ]
  },
  {
    id: "coaching",
    tag: "Structured Preparation",
    title: "Goodwill Coaching",
    subtitle: "A guided coaching setup for students who want discipline, momentum, and stronger academic results.",
    image: quietZonesImg,
    highlights: ["Small batches", "Mentor-led support", "Revision-focused sessions"],
    details: [
      "Goodwill Coaching is designed for students who perform better in a more structured environment with a clear study routine, regular teaching sessions, and stronger accountability.",
      "It is a good fit for concept revision, board preparation, weekly progress tracking, and academic consistency in a group-based format."
    ],
    points: [
      "Best for students who want a classroom-style flow with guidance",
      "Focused teaching plans with repeat practice and doubt support",
      "A more system-driven setup than individual home tutoring"
    ]
  }
];

export default function About() {
  const [activeCard, setActiveCard] = useState(serviceCards[0].id);
  const activeService = serviceCards.find((card) => card.id === activeCard) || serviceCards[0];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdf7_0%,#f9fbff_32%,#fef7ff_100%)] pt-28 px-4 pb-20 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-cyan-200/70 bg-gradient-to-br from-white via-cyan-50/80 to-fuchsia-50/80 px-6 py-12 sm:px-10 sm:py-14 shadow-[0_30px_80px_rgba(14,165,233,0.10)]">
          <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-fuchsia-300/25 blur-3xl" />
          <div className="relative z-10 max-w-4xl">
            <span className="inline-flex items-center rounded-full border border-cyan-300 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
              About GoodwillEdu
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
              Two core education experiences, designed for different student needs.
            </h1>
            <p className="mt-4 max-w-3xl text-slate-600 text-lg leading-relaxed">
              We now present Goodwill Home Tutor and Goodwill Coaching as two clear offerings so visitors can immediately understand where they fit best.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="space-y-4">
            {serviceCards.map((card) => {
              const isActive = activeCard === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActiveCard(card.id)}
                  className={`w-full text-left rounded-[1.6rem] border p-6 transition-all duration-300 ${
                    isActive
                      ? "border-cyan-300 bg-gradient-to-br from-white via-cyan-50 to-fuchsia-50 shadow-[0_20px_60px_rgba(34,211,238,0.14)]"
                      : "border-slate-200/80 bg-white/80 hover:border-cyan-300 hover:bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
                  }`}
                >
                  <span className="text-xs uppercase tracking-[0.22em] text-cyan-700">{card.tag}</span>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">{card.title}</h2>
                  <p className="mt-2 text-slate-600 leading-relaxed">{card.subtitle}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {card.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs text-slate-700"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-[1.8rem] border border-cyan-200/70 bg-gradient-to-br from-white via-cyan-50/70 to-fuchsia-50/70 shadow-[0_24px_80px_rgba(14,165,233,0.10)]">
            <div className="grid lg:grid-cols-[1.05fr_1fr]">
              <div className="min-h-[300px] border-b border-cyan-100 lg:border-b-0 lg:border-r overflow-hidden">
                <img
                  src={activeService.image}
                  alt={activeService.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8">
                <span className="inline-flex rounded-full border border-cyan-300 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                  {activeService.tag}
                </span>
                <h3 className="mt-4 text-3xl font-bold text-slate-900">{activeService.title}</h3>
                <p className="mt-3 text-slate-600 text-lg leading-relaxed">{activeService.subtitle}</p>

                <div className="mt-6 space-y-4 text-slate-600">
                  {activeService.details.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-8 grid gap-3">
                  {activeService.points.map((point) => (
                    <div
                      key={point}
                      className="rounded-2xl border border-cyan-100 bg-white/85 px-4 py-3 text-slate-700 shadow-sm"
                    >
                      {point}
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
