import { motion } from "framer-motion";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";
import { libraryShowcases } from "../data/showcaseContent";

export default function Library() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f7fdff_28%,#fff4f8_64%,#fff9f1_100%)] pt-28 text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-24 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[6%] top-10 h-44 w-44 rounded-full bg-cyan-200/35 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -26, 0], y: [0, 18, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[8%] top-0 h-56 w-56 rounded-full bg-amber-200/35 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 18, 0], y: [0, 16, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-48 h-28 w-28 -translate-x-1/2 rounded-full bg-sky-200/25 blur-2xl"
        />
      </div>

      <div className="mx-auto max-w-7xl space-y-10 px-4 pb-20">
        <section className="relative overflow-hidden rounded-[2rem] border border-rose-200/80 bg-gradient-to-br from-white via-sky-50/80 to-rose-50 px-6 py-12 shadow-[0_30px_80px_rgba(244,114,182,0.12)] sm:px-10 sm:py-14">
          <div className="relative z-10 max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
              <Building2 size={14} />
              GV Library Network
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Find the right GV Library space for exam prep, daily self-study, and focused co-working space.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-rose-700">
              GV branches are built for students and professionals who need discipline, comfort, and consistency. Compare each location by environment, purpose, and facilities, then choose the space that fits your routine and goals.
            </p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Activity 24/7", value: "Open 24/7 for focused study and productive work sessions." },
            { label: "Experience", value: "Silent study zones with structured productivity" },
            { label: "Ready for", value: "Board prep, competitive exams, and remote work" }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-[1.4rem] border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-lime-50 to-teal-50 px-5 py-5 shadow-[0_24px_55px_rgba(16,185,129,0.24),0_10px_24px_rgba(15,23,42,0.09)] backdrop-blur-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">{item.label}</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{item.value}</p>
            </motion.div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {libraryShowcases.map((item, index) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group h-full"
            >
              <Link
                to={`/library/${item.slug}`}
                className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-rose-100/80 bg-white/90 shadow-[0_34px_88px_rgba(251,191,36,0.24),0_12px_30px_rgba(244,114,182,0.14)] backdrop-blur-sm"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.eyebrow}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-6 right-6 top-6 flex items-center justify-between">
                    <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                      {item.tag}
                    </span>
                    <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      Click here for more info
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-rose-100">
                      <MapPin size={14} />
                      {item.address || item.eyebrow}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-6 p-6 sm:p-7">
                  <p className="text-base leading-relaxed text-slate-600">{item.summary}</p>

                  <div className="flex flex-wrap gap-2">
                    {item.previewPoints.map((point) => (
                      <span
                        key={point}
                        className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700"
                      >
                        {point}
                      </span>
                    ))}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {item.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="min-w-0 rounded-2xl border border-rose-100/80 bg-gradient-to-br from-white to-rose-50/70 px-3 py-3"
                      >
                        <p className="break-words text-[10px] font-semibold uppercase tracking-[0.12em] text-rose-400 sm:text-xs sm:tracking-[0.22em]">{metric.label}</p>
                        <p className="mt-1.5 break-words text-sm font-semibold leading-snug text-slate-900">{metric.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-2">
                    <span className="text-sm font-medium text-slate-500">Open the full details</span>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600">
                      Explore details
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
