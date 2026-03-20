import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, MapPinned, PlayCircle } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";
import { libraryShowcases } from "../data/showcaseContent";

export default function LibraryDetail() {
  const { slug } = useParams();
  const item = libraryShowcases.find((entry) => entry.slug === slug);

  if (!item) {
    return <Navigate to="/library" replace />;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fefcf7_0%,#f7fbff_38%,#fff8fb_100%)] pt-28 text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-24 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[7%] top-10 h-44 w-44 rounded-full bg-cyan-200/35 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -22, 0], y: [0, 18, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[8%] top-0 h-52 w-52 rounded-full bg-amber-200/35 blur-3xl"
        />
      </div>

      <div className="mx-auto max-w-7xl space-y-10 px-4 pb-20">
        <section className="relative overflow-hidden rounded-[2.2rem] border border-cyan-200/80 bg-white/85 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[360px] overflow-hidden">
              <img src={item.image} alt={item.eyebrow} className="h-full w-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-tr ${item.accent} opacity-70 mix-blend-multiply`} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/10 to-transparent" />
              <div className="absolute left-6 top-6">
                <Link
                  to="/library"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
                >
                  <ArrowLeft size={16} />
                  Back to Library
                </Link>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                <MapPinned size={14} />
                {item.eyebrow}
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">{item.title}</h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{item.subtitle}</p>

              <div className="mt-8 grid gap-3">
                {item.heroPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-2xl border border-cyan-100 bg-cyan-50/60 px-4 py-4"
                  >
                    <CheckCircle2 className="mt-0.5 text-cyan-700" size={18} />
                    <p className="text-slate-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-cyan-200/80 bg-gradient-to-br from-white via-cyan-50/70 to-amber-50/60 p-6 shadow-[0_24px_80px_rgba(59,130,246,0.10)] sm:p-8">
            <h2 className="text-2xl font-bold">Branch Story Structure</h2>
            <div className="mt-6 space-y-6">
              {item.sections.map((section) => (
                <div key={section.heading} className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-sm">
                  <h3 className="text-xl font-semibold text-slate-900">{section.heading}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{section.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-cyan-200/80 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <h2 className="text-2xl font-bold">Branch Highlights</h2>
              <div className="mt-5 grid gap-4">
                {item.featureCards.map((card) => (
                  <div key={card.title} className="rounded-[1.4rem] border border-slate-200/80 bg-slate-50/80 p-5">
                    <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                    <p className="mt-2 leading-relaxed text-slate-600">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-cyan-200/80 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <h2 className="text-2xl font-bold">Branch Metrics</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {item.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-cyan-100 bg-cyan-50/70 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">{metric.label}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-cyan-200/80 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
          <h2 className="text-2xl font-bold">Branch Gallery</h2>
          <p className="mt-2 text-slate-600">A richer visual layout for branch photos, atmosphere shots, and future updates.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {item.gallery.map((image, index) => (
              <motion.div
                key={`${item.slug}-${index}`}
                whileHover={{ y: -4, scale: 1.01 }}
                className="overflow-hidden rounded-[1.6rem] border border-cyan-100 bg-slate-50 shadow-sm"
              >
                <img src={image} alt={`${item.eyebrow} gallery ${index + 1}`} className="h-72 w-full object-cover" />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-cyan-200/80 bg-gradient-to-br from-white via-cyan-50/60 to-amber-50/60 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                <PlayCircle size={14} />
                Video Section
              </span>
              <h2 className="mt-4 text-3xl font-bold">{item.videoTitle}</h2>
              <p className="mt-3 text-lg leading-relaxed text-slate-600">{item.videoDescription}</p>
            </div>

            {item.videoUrl ? (
              <div className="overflow-hidden rounded-[1.6rem] border border-white/80 bg-white shadow-sm">
                <iframe
                  src={item.videoUrl}
                  title={`${item.eyebrow} video`}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-[1.6rem] border border-dashed border-cyan-300 bg-white/70 p-8 text-center">
                <div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                    <PlayCircle size={28} />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900">Video placeholder ready</h3>
                  <p className="mt-2 max-w-md text-slate-600">
                    Add a branch walkthrough, seating tour, student testimonial, or launch video here later without redesigning the page.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
