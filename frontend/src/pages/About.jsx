import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";
import { aboutShowcases } from "../data/showcaseContent";

export default function About() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdf7_0%,#f7fbff_38%,#fff8fb_100%)] pt-28 text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-24 overflow-hidden">
        <motion.div
          animate={{ x: [0, 32, 0], y: [0, -18, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[7%] top-12 h-44 w-44 rounded-full bg-cyan-200/40 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -26, 0], y: [0, 24, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[8%] top-0 h-56 w-56 rounded-full bg-fuchsia-200/35 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 18, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-48 h-28 w-28 -translate-x-1/2 rounded-full bg-amber-200/25 blur-2xl"
        />
      </div>

      <div className="mx-auto max-w-7xl space-y-10 px-4 pb-20">
        <section className="relative overflow-hidden rounded-[2rem] border border-cyan-200/80 bg-gradient-to-br from-white via-cyan-50/80 to-fuchsia-50/70 px-6 py-12 shadow-[0_30px_80px_rgba(14,165,233,0.10)] sm:px-10 sm:py-14">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6),transparent_70%)]" />
          <div className="relative z-10 max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
              <Sparkles size={14} />
              About GoodwillEdu
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Choose the right Goodwill experience through two modern, focused education journeys.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
              Instead of a simple section, About now works like a product entry page. Each card opens into its own detail page with richer media, stronger storytelling, and room for future videos.
            </p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Experiences", value: "2 premium education paths" },
            { label: "Structure", value: "Clickable detail pages" },
            { label: "Ready for", value: "Images, video, and content growth" }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-[1.4rem] border border-white/80 bg-white/80 px-5 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">{item.label}</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{item.value}</p>
            </motion.div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {aboutShowcases.map((item, index) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group"
            >
              <Link
                to={`/about/${item.slug}`}
                className="block overflow-hidden rounded-[2rem] border border-cyan-200/80 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.eyebrow}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.accent} opacity-75 mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                  <div className="absolute left-6 right-6 top-6 flex items-center justify-between">
                    <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                      {item.tag}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1">
                      <Play size={18} />
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-sm font-semibold uppercase tracking-[0.26em] text-cyan-100">{item.eyebrow}</p>
                    <h2 className="mt-3 max-w-xl text-3xl font-bold leading-tight">{item.title}</h2>
                  </div>
                </div>

                <div className="grid gap-6 p-6 sm:p-7">
                  <p className="text-base leading-relaxed text-slate-600">{item.summary}</p>

                  <div className="flex flex-wrap gap-2">
                    {item.previewPoints.map((point) => (
                      <span
                        key={point}
                        className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {point}
                      </span>
                    ))}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {item.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{metric.label}</p>
                        <p className="mt-2 text-base font-semibold text-slate-900">{metric.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                    <span className="text-sm font-medium text-slate-500">Open the full content page</span>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700">
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
