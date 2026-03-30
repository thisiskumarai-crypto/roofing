"use client";

import { motion } from "framer-motion";

const LINKS = {
  Product: ["Services", "Pricing", "Custom / n8n"],
  Company: ["About", "Contact"],
  Legal:   ["Privacy Policy", "Terms of Service"],
};

export default function Footer() {
  return (
    <footer className="relative z-10 mt-40 border-t border-white/[0.06]">

      {/* Top glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 pointer-events-none"
        style={{
          background: "linear-gradient(to right, transparent, rgba(139,92,246,0.35), transparent)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 md:px-10">

        {/* Main row */}
        <div className="grid grid-cols-2 gap-10 py-16 md:grid-cols-[2fr_1fr_1fr_1fr]">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="col-span-2 md:col-span-1"
          >
            <p className="mb-3 font-['Instrument_Serif'] italic text-xl text-white">
              brammaL
            </p>
            <p className="mb-6 max-w-[220px] font-mono text-[11px] leading-relaxed text-white/28">
              AI automation systems that respond, follow up, and convert — without you lifting a finger.
            </p>
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
                All systems operational
              </span>
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.08 }}
            >
              <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.24em] text-white/22">
                {title}
              </p>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="font-mono text-xs text-white/38 transition-colors duration-200 hover:text-white"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.05]" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 py-7 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[10px] text-white/18">
            © {new Date().getFullYear()} brammaL. All rights reserved.
          </p>
          <p className="font-mono text-[10px] text-white/12">
            Built by{" "}
            <span className="text-white/25">Michael Brito</span>
            {" & "}
            <span className="text-white/25">Badre Elkhammal</span>
          </p>
        </div>

      </div>
    </footer>
  );
}