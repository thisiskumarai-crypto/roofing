"use client";

import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useInView, animate } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

type Page = "home" | "pricing" | "services" | "contact" | "about";
type Msg  = { role: "user" | "ai"; text: string };

function trackLead() {
  if (typeof window !== "undefined" && (window as any).fbq)
    (window as any).fbq("track", "Lead");
}

const E = [0.16, 1, 0.3, 1] as const;
const SF = { fontFamily:"'Satoshi', sans-serif" };
const IF = { fontFamily:"'Instrument Serif', serif" };

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TICKER = ["AI Voice Receptionist","24/7 Availability","WhatsApp & SMS","CRM Integration","Follow-Up Sequences","No Missed Calls","Instant Response","AI-Powered Websites","n8n Workflows","Custom Automation","Real-Time Alerts"];
const STATS = [
  { n: 78,  suffix: "%", l:"of customers buy from whoever responds first." },
  { n: 60,  suffix: "s", l:"ideal response window for a fresh inbound lead." },
  { n: 3,   suffix: "×", l:"more revenue closed with automated follow-ups." },
];
const SERVICES = [
  { n:"01", title:"AI Website",            desc:"High-conversion pages connected to AI — built to capture, qualify, and route leads around the clock.",       price:"$399/mo" },
  { n:"02", title:"AI Voice Receptionist", desc:"Every call answered 24/7. Qualifies leads, books appointments, routes urgent calls — in your brand's voice.", price:"$699/mo" },
  { n:"03", title:"AI Chat & SMS",         desc:"Instant replies on WhatsApp, SMS, and web chat. Zero wait time. No missed messages.",                         price:"Included" },
  { n:"04", title:"Automated Follow-Ups",  desc:"Multi-step sequences that nurture leads until they buy. Runs on autopilot.",                                   price:"Included" },
  { n:"05", title:"Lead Qualification",    desc:"AI detects intent, asks the right questions, and sends only the best leads to your team.",                    price:"Included" },
  { n:"06", title:"CRM Integration",       desc:"Plugs into GoHighLevel, HubSpot, Salesforce and more. Your data stays where it lives.",                       price:"Included" },
];
const COMPARE = [
  ["Responds to leads","Instantly, 24/7","Hours or days"],
  ["Answers phone calls","Every single call","Missed when busy"],
  ["Follow-up messages","Automatic sequences","Manual, often skipped"],
  ["Live timeline","48 hours","Weeks of setup"],
  ["Scales with you","Unlimited capacity","Hire more staff"],
  ["Lock-in contract","None — cancel anytime","Varies"],
];
const PLANS = [
  { n:"01", title:"AI Website System",           price:"$399",   setup:"$250",   desc:"High-conversion website, lead capture, AI integrations, mobile optimization, and analytics.", features:["Custom AI-connected landing page","Lead capture form","Mobile-first design","AI integrations","Analytics & tracking"], hot:false, custom:false },
  { n:"02", title:"AI Voice & Chat Receptionist", price:"$699",   setup:"$350",   desc:"24/7 AI phone receptionist, WhatsApp & SMS automation, lead qualification, CRM integration, and reporting.", features:["AI phone receptionist (24/7)","WhatsApp & SMS automation","Lead qualification","CRM integration","Weekly report"], hot:true, custom:false },
  { n:"03", title:"Full AI Automation System",    price:"$1,299", setup:"$500",   desc:"Website + AI receptionist + automated follow-ups — the complete system.", features:["Everything in AI Website System","Everything in AI Voice & Chat","Follow-up sequences","Lead tracking dashboard","Priority support"], hot:false, custom:false },
  { n:"04", title:"Custom / n8n",                 price:"Custom", setup:"Custom", desc:"Bespoke workflow automation built on n8n — engineered around your exact process.", features:["Full n8n workflow architecture","API & webhook integrations","Multi-system orchestration","Custom logic & conditional flows","Data transformation & routing","Dedicated build sprint","Ongoing maintenance option"], hot:false, custom:true },
];
const N8N_FEATURES = [
  { title:"Workflow Architecture", desc:"We design end-to-end automation graphs tailored to your exact business logic — not templates, not shortcuts." },
  { title:"API Orchestration",     desc:"Connect any tool, any API, any database. If it has a webhook or endpoint, we can wire it in." },
  { title:"Conditional Logic",     desc:"Branching flows, fallback paths, error handling, retry queues — production-grade reliability built in." },
  { title:"Data Transformation",   desc:"Parse, reshape, filter, enrich. Your data moves through pipelines the way it should." },
  { title:"Multi-System Sync",     desc:"CRM, ERP, billing, email, Slack, spreadsheets — all talking to each other automatically." },
  { title:"Monitoring & Alerting", desc:"Real-time visibility into every run. Alerts when something breaks. Logs for everything." },
];
const STEPS = [
  { n:"01", title:"We onboard your business",  desc:"We learn your brand, your workflow, your CRM. One call is all it takes." },
  { n:"02", title:"We build and configure",    desc:"AI voice, chat, follow-ups — all configured to your exact process and tone." },
  { n:"03", title:"You go live in 48 hours",   desc:"Every call answered. Every lead followed up. You focus on closing." },
];
const FAQS = [
  { q:"How fast can I go live?",               a:"Most clients are fully live within 48 hours of onboarding. The Custom plan may take longer depending on workflow complexity." },
  { q:"Is there a long-term commitment?",      a:"No. All plans are month-to-month. Cancel at any time with no penalty." },
  { q:"Can I upgrade or change plans later?",  a:"Yes. You can move between plans at any time. Changes take effect on your next billing cycle." },
  { q:"What's included in the setup fee?",     a:"The setup fee covers system configuration, AI training on your business, integration testing, and go-live support." },
  { q:"Does the AI sound like a real person?", a:"Yes. Our voice AI is trained to match your brand's tone and handles natural conversation including interruptions and follow-up questions." },
];

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
  @keyframes orb1 {
    0%,100% { transform: translate(0px, 0px) scale(1); }
    40%     { transform: translate(55px, -35px) scale(1.09); }
    70%     { transform: translate(-30px, 20px) scale(0.94); }
  }
  @keyframes orb2 {
    0%,100% { transform: translate(0px, 0px) scale(1); }
    40%     { transform: translate(-45px, 35px) scale(0.92); }
    70%     { transform: translate(28px, -22px) scale(1.1); }
  }
  @keyframes orb3 {
    0%,100% { transform: translate(0px, 0px) scale(1); }
    40%     { transform: translate(28px, -22px) scale(1.12); }
    70%     { transform: translate(-40px, 34px) scale(0.92); }
  }
  .orb-1 { animation: orb1 28s ease-in-out infinite; will-change: transform; }
  .orb-2 { animation: orb2 34s ease-in-out infinite; animation-delay: -6s; will-change: transform; }
  .orb-3 { animation: orb3 25s ease-in-out infinite; animation-delay: -11s; will-change: transform; }
  @keyframes wave1 { 0%{ transform:translateX(0) } 100%{ transform:translateX(-50%) } }
  @keyframes wave2 { 0%{ transform:translateX(-50%) } 100%{ transform:translateX(0) } }
  @keyframes wave3 { 0%{ transform:translateX(0) } 100%{ transform:translateX(-50%) } }
  @keyframes wave4 { 0%{ transform:translateX(-50%) } 100%{ transform:translateX(0) } }
  .lw1 { animation: wave1 18s linear infinite; will-change: transform; }
  .lw2 { animation: wave2 24s linear infinite; will-change: transform; }
  .lw3 { animation: wave3 14s linear infinite; will-change: transform; }
  .lw4 { animation: wave4 30s linear infinite; will-change: transform; }
  @keyframes ping { 75%,100%{ transform:scale(2); opacity:0; } }
  .ping { animation: ping 1s cubic-bezier(0,0,0.2,1) infinite; }
  @keyframes dotPulse {
    0%,100% { opacity: 0.15; transform: scale(0.6); }
    50%     { opacity: 1;    transform: scale(1.3); }
  }
  .problem-dot {
    height: 8px; width: 8px; border-radius: 50%;
    background: rgba(124,58,237,0.25);
    animation: dotPulse 2.5s ease-in-out infinite;
    will-change: opacity, transform;
  }
  @keyframes voiceRing {
    0%,100% { opacity: 0.5; transform: scale(1); }
    50%     { opacity: 0.07; transform: scale(1.16); }
  }
  .voice-ring { animation: voiceRing 2.8s ease-in-out infinite; }
  @keyframes voiceGlow {
    0%,100% { box-shadow: 0 8px 28px rgba(124,58,237,0.4); }
    50%     { box-shadow: 0 14px 50px rgba(124,58,237,0.65); }
  }
  .voice-btn { animation: voiceGlow 2s ease-in-out infinite; }
  @keyframes typingBounce { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-5px) } }
  .typing-dot { animation: typingBounce 0.6s ease-in-out infinite; }
  .typing-dot:nth-child(2) { animation-delay: 0.15s; }
  .typing-dot:nth-child(3) { animation-delay: 0.30s; }
  @keyframes scrollCue { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(12px) } }
  .scroll-cue { animation: scrollCue 2s ease-in-out infinite; }
  @keyframes badgePop { 0%,100%{ transform:scale(1) } 50%{ transform:scale(1.6) } }
`;

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function QZLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size*0.7)} viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="38" r="20" stroke="#111" strokeWidth="12" fill="none"/>
      <line x1="52" y1="38" x2="52" y2="72" stroke="#111" strokeWidth="12" strokeLinecap="round"/>
      <line x1="68" y1="16" x2="104" y2="16" stroke="#111" strokeWidth="10" strokeLinecap="round"/>
      <line x1="104" y1="16" x2="68" y2="68" stroke="#111" strokeWidth="10" strokeLinecap="round"/>
      <line x1="68" y1="68" x2="104" y2="68" stroke="#111" strokeWidth="10" strokeLinecap="round"/>
    </svg>
  );
}

function AnimatedCounter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: [0.16,1,0.3,1], onUpdate: v => setVal(Math.round(v)) });
    return c.stop;
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function SplitWords({ text, delay = 0, style, className }: {
  text: string; delay?: number; style?: React.CSSProperties; className?: string;
}) {
  const ref = useRef(null);
  return (
    <span ref={ref} className={className} style={style}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          style={{ display:"inline-block", marginRight:"0.2em" }}
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: E, delay: delay + i * 0.06 }}>
          {word}
        </motion.span>
      ))}
    </span>
  );
}

function Reveal({ children, delay = 0, y = 60, className, style }: {
  children: React.ReactNode; delay?: number; y?: number; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1, ease: E, delay }}>
      {children}
    </motion.div>
  );
}

function MagBtn({ children, onClick, dark, href, className }: {
  children: React.ReactNode; onClick?: () => void; dark?: boolean; href?: string; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 400, damping: 28 });
  const sy = useSpring(y, { stiffness: 400, damping: 28 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const base: React.CSSProperties = dark
    ? { ...SF, background:"linear-gradient(135deg,#111,#2d2d2d)", boxShadow:"0 4px 20px rgba(0,0,0,0.25)", borderRadius:9999, border:"none", padding:"14px 32px", cursor:"pointer", display:"inline-block" }
    : { ...SF, background:"rgba(255,255,255,0.6)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.9)", boxShadow:"0 4px 20px rgba(0,0,0,0.07)", borderRadius:9999, padding:"14px 32px", cursor:"pointer", display:"inline-block" };

  const inner = (
    <motion.span style={{ x: sx, y: sy, display:"block" }}
      className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-700"} ${className ?? ""}`}>
      {children}
    </motion.span>
  );

  if (href) return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={base}>
      <motion.a href={href} target="_blank" rel="noopener noreferrer" whileHover={{ scale:1.06 }} whileTap={{ scale:0.96 }} style={{ display:"block" }}>{inner}</motion.a>
    </div>
  );
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={base}>
      <motion.button onClick={onClick} whileHover={{ scale:1.06 }} whileTap={{ scale:0.96 }}>{inner}</motion.button>
    </div>
  );
}

function GlowCard({ children, className, style, hot }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; hot?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState<{x:number,y:number}|null>(null);

  const rafRef = useRef<number>(0);
  const onMove = useCallback((e: React.MouseEvent) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setGlowPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    });
  }, []);
  const onLeave = useCallback(() => setGlowPos(null), []);

  const glowBg = glowPos
    ? `radial-gradient(320px circle at ${glowPos.x}px ${glowPos.y}px, rgba(124,58,237,0.15), transparent 70%)`
    : "none";

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ ...style, position:"relative", overflow:"hidden" }}
      whileHover={{ y:-12, scale:1.02, boxShadow: hot ? "0 32px 80px rgba(124,58,237,0.28)" : "0 32px 80px rgba(124,58,237,0.14)" }}
      transition={{ duration:0.38, ease:E }}>
      {glowPos && (
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:1, background: glowBg, transition:"background 0.1s" }}/>
      )}
      <div style={{ position:"relative", zIndex:2 }}>{children}</div>
    </motion.div>
  );
}

function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  const target = useRef({ x: -200, y: -200 });
  const current = useRef({ x: -200, y: -200 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;
    setIsTouch(false);

    const STIFFNESS = 0.12;
    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * STIFFNESS;
      current.current.y += (target.current.y - current.current.y) * STIFFNESS;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${current.current.x - (hover ? 22 : 14)}px, ${current.current.y - (hover ? 22 : 14)}px)`;
      }
      rafId.current = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 2.5}px, ${e.clientY - 2.5}px)`;
      }
      const isHover = !!(e.target as HTMLElement).closest("button,a,[data-hover]");
      setHover(isHover);
    };

    rafId.current = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
    };
  }, [hover]);

  if (isTouch) return null;

  return (
    <>
      <div ref={ringRef} style={{
        position:"fixed", top:0, left:0, pointerEvents:"none", zIndex:9998,
        borderRadius:"50%", border:"1.5px solid rgba(124,58,237,0.55)",
        width: hover ? 44 : 28, height: hover ? 44 : 28,
        transition:"width 0.25s, height 0.25s",
        willChange:"transform",
      }}/>
      <div ref={dotRef} style={{
        position:"fixed", top:0, left:0, pointerEvents:"none", zIndex:9999,
        width:5, height:5, borderRadius:"50%", background:"#7c3aed",
        willChange:"transform",
      }}/>
    </>
  );
}

function LiquidWaves() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1, pointerEvents:"none", overflow:"hidden" }} aria-hidden>
      <div style={{ position:"absolute", bottom:"-2%", left:0, width:"200%", height:"38%", opacity:0.18 }} className="lw1">
        <svg viewBox="0 0 1440 260" preserveAspectRatio="none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,160 C180,220 360,80 540,140 C720,200 900,60 1080,130 C1260,200 1350,100 1440,150 L1440,260 L0,260 Z" fill="url(#wg1)"/>
          <defs><linearGradient id="wg1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(167,110,255,0.7)"/><stop offset="100%" stopColor="rgba(124,58,237,0.15)"/>
          </linearGradient></defs>
        </svg>
      </div>
      <div style={{ position:"absolute", bottom:"-4%", left:0, width:"200%", height:"32%", opacity:0.13 }} className="lw2">
        <svg viewBox="0 0 1440 240" preserveAspectRatio="none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,120 C200,60 400,180 600,110 C800,40 1000,160 1200,100 C1320,70 1380,140 1440,120 L1440,240 L0,240 Z" fill="url(#wg2)"/>
          <defs><linearGradient id="wg2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(236,72,153,0.6)"/><stop offset="100%" stopColor="rgba(167,110,255,0.1)"/>
          </linearGradient></defs>
        </svg>
      </div>
      <div style={{ position:"absolute", top:"-2%", left:0, width:"200%", height:"28%", opacity:0.1 }} className="lw3">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 C160,40 320,160 480,90 C640,20 800,140 960,80 C1120,20 1300,120 1440,70 L1440,0 L0,0 Z" fill="url(#wg3)"/>
          <defs><linearGradient id="wg3" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(130,180,255,0.6)"/><stop offset="100%" stopColor="rgba(167,110,255,0.08)"/>
          </linearGradient></defs>
        </svg>
      </div>
      <div style={{ position:"absolute", top:"38%", left:0, width:"200%", height:"22%", opacity:0.07 }} className="lw4">
        <svg viewBox="0 0 1440 180" preserveAspectRatio="none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,90 C240,30 480,150 720,90 C960,30 1200,150 1440,90 L1440,180 L0,180 Z" fill="rgba(124,58,237,1)"/>
        </svg>
      </div>
    </div>
  );
}

function AuroraOrbs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(175deg,#f9f5ff 0%,#ede4ff 18%,#e3eeff 40%,#f5e8ff 65%,#fff9f0 88%,#fdfcff 100%)" }}/>
      <div className="orb-1" style={{ position:"absolute", top:"-20%", left:"48%", width:1000, height:1000, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(167,110,255,0.22) 0%,transparent 68%)", filter:"blur(90px)", willChange:"transform" }}/>
      <div className="orb-2" style={{ position:"absolute", top:"28%", left:"-18%", width:800, height:800, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(252,180,220,0.2) 0%,transparent 68%)", filter:"blur(80px)", willChange:"transform" }}/>
      <div className="orb-3" style={{ position:"absolute", bottom:"-22%", right:"-2%", width:1100, height:1100, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(130,180,255,0.16) 0%,transparent 68%)", filter:"blur(100px)", willChange:"transform" }}/>
      <div style={{ position:"absolute", inset:0, opacity:0.014,
        backgroundImage:"linear-gradient(rgba(124,58,237,1) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,1) 1px,transparent 1px)",
        backgroundSize:"80px 80px" }}/>
      <div style={{ position:"absolute", inset:0, opacity:0.018,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize:"128px" }}/>
    </div>
  );
}

function DrawLine({ className }: { className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} className={className}
      style={{ height:1, background:"linear-gradient(to right,transparent,rgba(124,58,237,0.45),transparent)", transformOrigin:"left" }}
      initial={{ scaleX:0, opacity:0 }}
      animate={inView ? { scaleX:1, opacity:1 } : {}}
      transition={{ duration:1.5, ease:E }}/>
  );
}

function Nav({ current, goto }: { current:Page; goto:(p:Page)=>void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links: [string,Page][] = [["Services","services"],["Pricing","pricing"],["About","about"],["Contact","contact"]];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const pill: React.CSSProperties = {
    background: scrolled ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.6)",
    backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
    border:"1px solid rgba(255,255,255,0.9)", transition:"background 0.4s",
  };

  return (
    <>
      <motion.div initial={{ opacity:0, y:-24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9, ease:E }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-max">
        <nav className="hidden md:flex items-center gap-1 px-2 py-2 rounded-full"
          style={{ ...pill, boxShadow:"0 8px 40px rgba(0,0,0,0.07),0 1px 0 rgba(255,255,255,0.95) inset" }}>
          <motion.button onClick={()=>goto("home")} whileHover={{ scale:1.07 }} whileTap={{ scale:0.93 }}
            className="flex items-center px-2 py-1.5 rounded-full" style={{ background:"rgba(255,255,255,0.5)" }}>
            <QZLogo size={34}/>
          </motion.button>
          <div style={{ width:1, height:20, background:"rgba(0,0,0,0.09)", margin:"0 4px" }}/>
          {links.map(([label,page])=>(
            <motion.button key={page} onClick={()=>goto(page)} whileHover={{ scale:1.05 }} whileTap={{ scale:0.96 }}
              style={ current===page
                ? { ...SF, background:"rgba(255,255,255,0.92)", boxShadow:"0 2px 10px rgba(0,0,0,0.08)", borderRadius:9999, padding:"8px 16px" }
                : { ...SF, background:"transparent", borderRadius:9999, padding:"8px 16px" }}
              className={`text-sm font-medium transition-all ${current===page?"text-gray-900":"text-gray-500 hover:text-gray-900"}`}>
              {label}
            </motion.button>
          ))}
          <div style={{ width:1, height:20, background:"rgba(0,0,0,0.09)", margin:"0 4px" }}/>
          <motion.button onClick={()=>{ trackLead(); goto("contact"); }}
            whileHover={{ scale:1.07, boxShadow:"0 8px 28px rgba(0,0,0,0.3)" }} whileTap={{ scale:0.95 }}
            style={{ ...SF, background:"linear-gradient(135deg,#111,#2d2d2d)", boxShadow:"0 3px 14px rgba(0,0,0,0.22)", borderRadius:9999, padding:"10px 20px", border:"none" }}
            className="text-sm font-semibold text-white">Get started</motion.button>
        </nav>
        <nav className="flex md:hidden items-center gap-3 px-4 py-2.5 rounded-full"
          style={{ ...pill, boxShadow:"0 6px 28px rgba(0,0,0,0.08)" }}>
          <button onClick={()=>goto("home")}><QZLogo size={28}/></button>
          <div className="flex-1"/>
          <button onClick={()=>setOpen(!open)} className="flex flex-col gap-1.5 p-1">
            <motion.span animate={{ rotate:open?45:0, y:open?6:0 }} className="block h-0.5 w-5 bg-gray-800 origin-center"/>
            <motion.span animate={{ opacity:open?0:1 }} className="block h-0.5 w-5 bg-gray-800"/>
            <motion.span animate={{ rotate:open?-45:0, y:open?-6:0 }} className="block h-0.5 w-5 bg-gray-800 origin-center"/>
          </button>
        </nav>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:-12, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-12, scale:0.95 }}
            transition={{ duration:0.22, ease:E }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[min(320px,90vw)] rounded-3xl md:hidden"
            style={{ background:"rgba(255,255,255,0.92)", backdropFilter:"blur(28px)", border:"1px solid rgba(255,255,255,0.95)", boxShadow:"0 24px 64px rgba(0,0,0,0.1)" }}>
            <div className="p-3 flex flex-col gap-1">
              {links.map(([label,page])=>(
                <motion.button key={page} onClick={()=>{ goto(page); setOpen(false); }} style={SF} whileHover={{ x:6 }}
                  className="text-left px-4 py-3 rounded-2xl text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900 transition-colors">{label}</motion.button>
              ))}
              <div className="my-1.5 h-px" style={{ background:"rgba(0,0,0,0.06)" }}/>
              <motion.button onClick={()=>{ trackLead(); goto("contact"); setOpen(false); }} whileTap={{ scale:0.97 }}
                style={{ ...SF, background:"linear-gradient(135deg,#111,#333)", borderRadius:16, border:"none", padding:"12px 16px" }}
                className="text-sm font-semibold text-white text-center">Get started</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Footer({ goto }: { goto:(p:Page)=>void }) {
  return (
    <footer style={{ borderTop:"1px solid rgba(0,0,0,0.07)", background:"rgba(255,255,255,0.55)", backdropFilter:"blur(24px)" }}>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr] mb-12">
          <div>
            <div className="mb-5"><QZLogo size={44}/></div>
            <p style={SF} className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">AI automation systems that respond, follow up, and convert — without you lifting a finger.</p>
            <div className="flex flex-wrap gap-2 mb-6">
              <motion.a href="https://www.instagram.com/quazier.ai" target="_blank" rel="noopener noreferrer"
                whileHover={{ scale:1.05, y:-2 }} whileTap={{ scale:0.96 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                style={{ background:"rgba(255,255,255,0.7)", backdropFilter:"blur(8px)", border:"1px solid rgba(0,0,0,0.08)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none"/>
                </svg>
                <span style={SF}>@quazier.ai</span>
              </motion.a>
              <motion.a href="https://www.facebook.com/profile.php?id=61585053252637" target="_blank" rel="noopener noreferrer"
                whileHover={{ scale:1.05, y:-2 }} whileTap={{ scale:0.96 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                style={{ background:"rgba(255,255,255,0.7)", backdropFilter:"blur(8px)", border:"1px solid rgba(0,0,0,0.08)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                <span style={SF}>Facebook</span>
              </motion.a>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)" }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"/>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"/>
              </span>
              <span style={SF} className="text-xs font-medium text-emerald-700">All systems operational</span>
            </div>
          </div>
          {[
            { title:"Product", links:[{l:"Services",p:"services"},{l:"Pricing",p:"pricing"}] },
            { title:"Company", links:[{l:"About",p:"about"},{l:"Contact",p:"contact"}] },
            { title:"Legal",   links:[{l:"Privacy",p:"home"},{l:"Terms",p:"home"}] },
          ].map(col=>(
            <div key={col.title}>
              <p style={SF} className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">{col.title}</p>
              <div className="flex flex-col gap-2.5">
                {col.links.map(lnk=>(
                  <motion.button key={lnk.l} onClick={()=>goto(lnk.p as Page)} style={SF} whileHover={{ x:4 }}
                    className="w-fit text-sm text-gray-500 hover:text-gray-900 transition-colors">{lnk.l}</motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 pt-8 md:flex-row md:items-center md:justify-between" style={{ borderTop:"1px solid rgba(0,0,0,0.06)" }}>
          <p style={SF} className="text-xs text-gray-400">© {new Date().getFullYear()} quazieR. All rights reserved.</p>
          <p style={SF} className="text-xs text-gray-400">Built by <span className="text-gray-600">Michael Brito</span> & <span className="text-gray-600">Badre Elkhammal</span></p>
        </div>
      </div>
    </footer>
  );
}

function ChatDemo() {
  const INIT: Msg = { role:"ai", text:"Hi! I'm the quazieR AI. What kind of business do you run?" };
  const [msgs, setMsgs] = useState<Msg[]>([INIT]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const send = async () => {
    const text = input.trim(); if (!text||typing) return;
    setInput("");
    const updated = [...msgs, { role:"user" as const, text }];
    setMsgs(updated); setTyping(true);
    try {
      const res = await fetch("/api/chat", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ messages:updated.map(m=>({ role:m.role==="ai"?"assistant":"user", content:m.text })) }) });
      const data = await res.json();
      setMsgs(m=>[...m,{ role:"ai", text:data.reply||"Sorry, something went wrong." }]);
    } catch { setMsgs(m=>[...m,{ role:"ai", text:"Sorry, I couldn't connect. Please try again." }]); }
    finally { setTyping(false); }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full text-white text-xs font-bold" style={{ background:"linear-gradient(135deg,#7c3aed,#a855f7)" }}>
          AI<span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400"/>
        </div>
        <div>
          <p style={SF} className="text-sm font-semibold text-gray-900">Summer — quazieR AI</p>
          <p style={SF} className="text-xs text-emerald-600">Online · responds instantly</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        <AnimatePresence>
          {msgs.map((m,i)=>(
            <motion.div key={i} initial={{ opacity:0, y:14, scale:0.94 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ duration:0.35, ease:E }}
              className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
              <div style={{ ...SF, ...(m.role==="user" ? { background:"linear-gradient(135deg,#7c3aed,#a855f7)" } : { background:"rgba(0,0,0,0.04)", border:"1px solid rgba(0,0,0,0.06)" }) }}
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role==="user"?"rounded-br-sm text-white":"rounded-bl-sm text-gray-700"}`}>{m.text}</div>
            </motion.div>
          ))}
          {typing && (
            <motion.div key="t" initial={{ opacity:0, scale:0.94 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }} className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm px-4 py-3" style={{ background:"rgba(0,0,0,0.04)", border:"1px solid rgba(0,0,0,0.06)" }}>
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gray-400 block"/>
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gray-400 block"/>
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gray-400 block"/>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef}/>
      </div>
      <div className="p-4 flex gap-2" style={{ borderTop:"1px solid rgba(0,0,0,0.06)" }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(); }}}
          placeholder="Type a message..." disabled={typing}
          style={{ ...SF, background:"rgba(0,0,0,0.04)", border:"1px solid rgba(0,0,0,0.08)" }}
          className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition disabled:opacity-50"/>
        <motion.button onClick={send} disabled={typing||!input.trim()} whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }}
          style={{ ...SF, background:"linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius:12, border:"none", padding:"10px 16px" }}
          className="text-sm font-semibold text-white disabled:opacity-40">Send</motion.button>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q:string; a:string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div className="py-5" style={{ borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
      <motion.button onClick={()=>setOpen(!open)} whileHover={{ x:3 }} className="flex w-full items-center justify-between gap-4 text-left">
        <span style={{ ...IF, fontStyle:"italic" }} className="text-lg text-gray-800">{q}</span>
        <motion.span animate={{ rotate:open?45:0, color:open?"#7c3aed":"#9ca3af" }} transition={{ duration:0.25 }} className="flex-shrink-0 text-2xl font-light">+</motion.span>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.38, ease:E }} className="overflow-hidden">
            <p style={SF} className="mt-4 text-sm leading-relaxed text-gray-500">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function HomePage({ goto }: { goto:(p:Page)=>void }) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target:heroRef, offset:["start start","end start"] });
  const heroY     = useTransform(scrollYProgress, [0,1], ["0%","22%"]);
  const heroO     = useTransform(scrollYProgress, [0,0.72], [1,0]);
  const heroScale = useTransform(scrollYProgress, [0,1], [1,0.91]);

  return (
    <>
      <section ref={heroRef} className="relative px-6 overflow-hidden"
        style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", paddingTop:"10rem", paddingBottom:"7rem", position:"relative", zIndex:4 }}>
        <motion.div style={{ y:heroY, opacity:heroO, scale:heroScale, position:"relative", zIndex:4 }}
          className="mx-auto max-w-5xl text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, ease:E }}>
            <motion.span
              style={{ ...SF, color:"#7c3aed", background:"rgba(124,58,237,0.09)", border:"1px solid rgba(124,58,237,0.18)" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8"
              whileHover={{ scale:1.06, background:"rgba(124,58,237,0.15)" }}>
              <motion.span animate={{ rotate:[0,360] }} transition={{ duration:8, repeat:Infinity, ease:"linear" }}>✦</motion.span>
              AI Automation Studio
            </motion.span>
          </motion.div>
          <h1 style={{ ...IF, fontStyle:"italic", fontSize:"clamp(50px,8vw,112px)", lineHeight:1.15, perspective:600, overflow:"visible" }}
            className="text-gray-900 tracking-tight mb-6">
            <motion.span style={{ display:"block", paddingBottom:"0.05em" }}
              initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.55, ease:E, delay:0.05 }}>
              quazieR,
            </motion.span>
            <span style={{ display:"block", paddingBottom:"0.15em" }}>
              <motion.span
                style={{ display:"inline-block", marginRight:"0.2em" }}
                initial={{ y:28 }} animate={{ y:0 }}
                transition={{ duration:0.55, ease:E, delay:0.15 }}>
                <span style={{ background:"linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  quicker
                </span>
              </motion.span>
              <motion.span
                style={{ display:"inline-block" }}
                initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:0.55, ease:E, delay:0.22 }}>
                and easier
              </motion.span>
            </span>
          </h1>
          <motion.p initial={{ opacity:0, y:20, filter:"blur(6px)" }} animate={{ opacity:1, y:0, filter:"blur(0px)" }}
            transition={{ duration:0.9, ease:E, delay:0.75 }}
            style={{ ...IF, fontStyle:"italic", fontSize:"clamp(18px,2.2vw,28px)" }}
            className="text-gray-400 mb-4">Work smarter. Not harder.</motion.p>
          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, ease:E, delay:0.88 }}
            style={SF} className="text-base text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10">
            At <span style={{ color:"#7c3aed" }}>quazieR</span>, we build AI automation systems that answer calls, respond to messages, and follow up with leads automatically — so your business never misses an opportunity.
          </motion.p>
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, ease:E, delay:1 }}
            className="flex flex-wrap items-center justify-center gap-4">
            <MagBtn dark onClick={()=>goto("pricing")}>See pricing</MagBtn>
            <MagBtn onClick={()=>{ trackLead(); goto("contact"); }}>Contact us</MagBtn>
            <motion.button onClick={()=>document.getElementById("demo-section")?.scrollIntoView({ behavior:"smooth" })}
              whileHover={{ scale:1.06, y:-3 }} whileTap={{ scale:0.96 }}
              style={{ ...SF, background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.22)", color:"#7c3aed", borderRadius:9999, padding:"14px 32px" }}
              className="text-sm font-semibold">Try our AI ↓</motion.button>
          </motion.div>
          <motion.div className="flex flex-col items-center mt-20"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.8 }}>
            <div className="scroll-cue" style={{ width:1, height:48, background:"linear-gradient(to bottom,rgba(124,58,237,0.7),transparent)" }}/>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity:0, y:65, scale:0.93 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ duration:1.2, ease:E, delay:1.1 }}
          className="mx-auto mt-24 max-w-4xl rounded-3xl overflow-hidden"
          style={{ position:"relative", zIndex:4, background:"rgba(255,255,255,0.58)", backdropFilter:"blur(26px)", border:"1px solid rgba(255,255,255,0.92)", boxShadow:"0 30px 80px rgba(124,58,237,0.12),0 2px 0 rgba(255,255,255,0.8) inset" }}>
          <div className="p-8 md:p-14">
            <div className="grid gap-8 md:grid-cols-3">
              {STATS.map((s,i)=>(
                <motion.div key={i} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.3+i*0.15, ease:E }}
                  whileHover={{ scale:1.07, y:-5 }} className="text-center cursor-default">
                  <p style={{ ...IF, fontStyle:"italic", fontSize:"clamp(38px,5vw,64px)", background:"linear-gradient(135deg,#7c3aed,#a855f7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                    <AnimatedCounter to={s.n} suffix={s.suffix}/>
                  </p>
                  <p style={SF} className="text-sm text-gray-500 leading-snug mt-2">{s.l}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <div className="overflow-hidden border-y py-4" style={{ borderColor:"rgba(124,58,237,0.08)", background:"rgba(255,255,255,0.35)", backdropFilter:"blur(8px)", position:"relative", zIndex:4 }}>
        <div className="flex gap-10" style={{ width:"max-content", animation:"ticker 32s linear infinite" }}>
          {[...TICKER,...TICKER].map((t,i)=>(
            <span key={i} style={SF} className="flex shrink-0 items-center gap-3 text-xs uppercase tracking-widest text-gray-400">
              {t}<span style={{ color:"rgba(124,58,237,0.5)", fontSize:"0.4rem" }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      <section className="py-36 px-6" style={{ position:"relative", zIndex:4 }}>
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1fr_1.9fr] md:gap-28">
          <div className="md:sticky md:top-32 md:self-start">
            <Reveal>
              <p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-4">The problem</p>
              <h2 style={{ ...IF, fontStyle:"italic", fontSize:"clamp(36px,4.5vw,64px)" }} className="text-gray-900 leading-[0.93]">Good businesses<br/>lose <em style={{ color:"#7c3aed" }}>quietly.</em></h2>
              <div className="mt-10 grid gap-1.5" style={{ gridTemplateColumns:"repeat(8,1fr)", width:"fit-content" }}>
                {Array.from({ length:40 }, (_,i)=>(
                  <div key={i} className="problem-dot" style={{ animationDelay:`${i*0.08}s` }}/>
                ))}
              </div>
              <p style={SF} className="mt-3 text-xs uppercase tracking-widest text-gray-300">Each dot — a missed lead</p>
            </Reveal>
          </div>
          <div style={{ borderTop:"1px solid rgba(0,0,0,0.06)" }}>
            {[
              "Most businesses don't lose customers because they're bad at what they do.",
              <><strong className="font-semibold text-gray-900">They lose them because responses arrive too late.</strong> Calls come in while you&apos;re busy. Messages wait while your attention is elsewhere. Leads disappear quietly — not because you don&apos;t care, but because you&apos;re human and time is limited.</>,
              "In today's market, speed matters. Consistency matters. Availability matters.",
              <>The average lead expects a reply <strong className="text-gray-900">within 5 minutes.</strong> Most businesses respond in 5 hours — or never. That gap is where revenue quietly disappears.</>,
              <>Our AI systems close that gap permanently. <strong className="text-gray-900">Every call answered. Every message replied to. Every lead followed up.</strong> Without you lifting a finger.</>,
            ].map((t,i)=>(
              <Reveal key={i} delay={i*0.07} y={28}>
                <p style={{ ...SF, borderBottom:"1px solid rgba(0,0,0,0.05)" }} className="py-7 text-sm leading-[1.95] text-gray-500">{t}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ background:"rgba(255,255,255,0.28)", backdropFilter:"blur(8px)", position:"relative", zIndex:4 }}>
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center mb-16">
            <p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-4">How it works</p>
            <h2 style={{ ...IF, fontStyle:"italic", fontSize:"clamp(32px,4vw,56px)" }} className="text-gray-900 leading-tight">Every lead.<br/><em style={{ color:"#7c3aed" }}>Handled.</em></h2>
            <p style={SF} className="mt-4 text-gray-500 max-w-lg mx-auto">A lead comes in. The AI picks it up instantly, qualifies it, logs it to your CRM, and follows up automatically — all without you touching a thing.</p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s,i)=>(
              <Reveal key={i} delay={i*0.15} y={55}>
                <GlowCard className="rounded-2xl p-8 cursor-default h-full"
                  style={{ background:"rgba(255,255,255,0.62)", backdropFilter:"blur(14px)", border:"1px solid rgba(255,255,255,0.92)" }}>
                  <span style={{ ...IF, fontStyle:"italic", fontSize:"3.5rem", color:"rgba(124,58,237,0.18)" }} className="block mb-4 leading-none">{s.n}</span>
                  <h3 style={{ ...IF, fontStyle:"italic" }} className="text-xl text-gray-900 mb-3">{s.title}</h3>
                  <p style={SF} className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex justify-center gap-4 flex-wrap">
            <MagBtn dark onClick={()=>{ trackLead(); goto("contact"); }}>Start the conversation</MagBtn>
            <MagBtn onClick={()=>goto("pricing")}>See pricing</MagBtn>
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ position:"relative", zIndex:4 }}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-4">What we build</p>
              <h2 style={{ ...IF, fontStyle:"italic", fontSize:"clamp(36px,5vw,70px)" }} className="text-gray-900 leading-[0.93]">AI that works<br/><em style={{ color:"#7c3aed" }}>while you don&apos;t.</em></h2>
            </Reveal>
            <motion.button onClick={()=>goto("services")} whileHover={{ scale:1.05 }}
              style={{ ...SF, background:"rgba(255,255,255,0.55)", backdropFilter:"blur(10px)", border:"1px solid rgba(0,0,0,0.08)", borderRadius:12, padding:"10px 20px" }}
              className="text-xs font-medium uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors self-start">All services →</motion.button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s,i)=>(
              <Reveal key={i} delay={i*0.09} y={52}>
                <GlowCard className="rounded-2xl p-8 cursor-default h-full"
                  style={{ background:"rgba(255,255,255,0.62)", backdropFilter:"blur(14px)", border:"1px solid rgba(255,255,255,0.9)" }}>
                  <p style={{ ...IF, fontStyle:"italic", fontSize:"2.2rem", color:"rgba(124,58,237,0.2)" }} className="mb-4 leading-none">{s.n}</p>
                  <h3 style={{ ...IF, fontStyle:"italic" }} className="text-xl text-gray-900 mb-2">{s.title}</h3>
                  <p style={SF} className="text-sm text-gray-500 leading-relaxed mb-4">{s.desc}</p>
                  <motion.span whileHover={{ scale:1.07 }}
                    style={{ ...SF, background:"rgba(124,58,237,0.08)", color:"#7c3aed", border:"1px solid rgba(124,58,237,0.14)", borderRadius:9999, padding:"4px 12px", display:"inline-block", fontSize:11, fontWeight:600 }}>
                    {s.price}
                  </motion.span>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="demo-section" className="py-24 px-6" style={{ background:"rgba(255,255,255,0.28)", backdropFilter:"blur(8px)", position:"relative", zIndex:4 }}>
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center mb-16">
            <p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-4">Live demo</p>
            <h2 style={{ ...IF, fontStyle:"italic", fontSize:"clamp(32px,4vw,60px)" }} className="text-gray-900 leading-tight">Try our AI <em style={{ color:"#7c3aed" }}>systems</em></h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal y={44}>
              <div className="rounded-3xl overflow-hidden"
                style={{ background:"rgba(255,255,255,0.68)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.92)", minHeight:520, boxShadow:"0 8px 40px rgba(0,0,0,0.06)" }}>
                <div className="px-7 py-6" style={{ borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
                  <p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest">AI Chat</p>
                  <h3 style={{ ...IF, fontStyle:"italic" }} className="text-2xl text-gray-900 mt-1">Chat with our AI</h3>
                  <p style={SF} className="text-sm text-gray-500 mt-1">See how our AI responds instantly to leads</p>
                </div>
                <div style={{ height:420 }}><ChatDemo/></div>
              </div>
            </Reveal>
            <Reveal y={44} delay={0.14}>
              <div className="rounded-3xl p-10 flex flex-col items-center justify-center text-center"
                style={{ background:"rgba(255,255,255,0.68)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.92)", minHeight:520, boxShadow:"0 8px 40px rgba(0,0,0,0.06)" }}>
                <p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-4">AI Voice</p>
                <h3 style={{ ...IF, fontStyle:"italic", fontSize:"clamp(22px,3vw,34px)" }} className="text-gray-900 mb-3">Call our AI receptionist</h3>
                <p style={SF} className="text-sm text-gray-500 max-w-xs leading-relaxed mb-10">Experience a real AI answering calls 24/7. Pick up the phone — it&apos;s live right now.</p>
                <div className="relative flex items-center justify-center mb-10">
                  {[70,100,130,165].map((s,i)=>(
                    <div key={s} className="voice-ring absolute rounded-full"
                      style={{ width:s, height:s, border:"1px solid rgba(124,58,237,0.18)", animationDelay:`${i*0.58}s` }}/>
                  ))}
                  <div className="voice-btn relative z-10 flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ background:"linear-gradient(135deg,#7c3aed,#a855f7)" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="white"/></svg>
                  </div>
                </div>
                <MagBtn dark href="tel:+15186623244">Call now</MagBtn>
                <p style={SF} className="text-xs text-gray-400 mt-3">Test our AI voice agent live</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ position:"relative", zIndex:4 }}>
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-14">
            <p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-4">Why quazieR</p>
            <h2 style={{ ...IF, fontStyle:"italic", fontSize:"clamp(36px,5vw,72px)" }} className="text-gray-900 leading-[0.93]">vs. doing it<br/><em style={{ color:"#7c3aed" }}>manually.</em></h2>
          </Reveal>
          <Reveal y={38}>
            <div className="overflow-hidden rounded-2xl"
              style={{ background:"rgba(255,255,255,0.58)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.88)", boxShadow:"0 8px 40px rgba(0,0,0,0.05)" }}>
              <div className="grid grid-cols-[1.6fr_1fr_1fr]" style={{ borderBottom:"1px solid rgba(0,0,0,0.07)", background:"rgba(124,58,237,0.03)" }}>
                {["Feature","quazieR AI","Without AI"].map((h,i)=>(
                  <div key={h} style={{ ...SF, borderLeft:i>0?"1px solid rgba(0,0,0,0.05)":undefined }}
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-widest ${i===1?"text-purple-600":"text-gray-400"}`}>{h}</div>
                ))}
              </div>
              {COMPARE.map(([feat,ours,theirs],i)=>(
                <motion.div key={i} initial={{ opacity:0, x:-18 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:0.06*i, duration:0.5 }}
                  whileHover={{ background:"rgba(124,58,237,0.03)" }}
                  className="grid grid-cols-[1.6fr_1fr_1fr]" style={{ borderBottom:"1px solid rgba(0,0,0,0.04)" }}>
                  <div style={SF} className="flex items-center px-6 py-4 text-sm text-gray-500">{feat}</div>
                  <div style={{ ...SF, borderLeft:"1px solid rgba(0,0,0,0.04)" }} className="flex items-center gap-2 px-6 py-4 text-sm font-medium text-purple-700"><span className="text-purple-400 text-xs">◆</span>{ours}</div>
                  <div style={{ ...SF, borderLeft:"1px solid rgba(0,0,0,0.04)" }} className="flex items-center px-6 py-4 text-sm text-gray-400">{theirs}</div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 px-6" style={{ background:"rgba(255,255,255,0.28)", backdropFilter:"blur(8px)", position:"relative", zIndex:4 }}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-4">Pricing</p>
              <h2 style={{ ...IF, fontStyle:"italic", fontSize:"clamp(36px,5vw,72px)" }} className="text-gray-900 leading-[0.93]">Simple pricing.<br/><em style={{ color:"#7c3aed" }}>Real automation.</em></h2>
            </Reveal>
            <p style={SF} className="text-sm text-gray-400 md:text-right">No hidden fees.<br/>No long-term contracts.<br/>Cancel anytime.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((p,i)=>(
              <Reveal key={i} delay={i*0.1} y={55}>
                <GlowCard hot={p.hot}
                  className={`rounded-2xl p-7 flex flex-col relative cursor-default h-full ${p.hot?"ring-2 ring-purple-400":""}`}
                  style={{ background:p.hot?"rgba(124,58,237,0.05)":"rgba(255,255,255,0.62)", backdropFilter:"blur(14px)", border:"1px solid rgba(255,255,255,0.9)" }}>
                  {p.hot && <motion.span initial={{ scale:0, rotate:-10 }} animate={{ scale:1, rotate:0 }} transition={{ delay:0.5, type:"spring" }}
                    style={{ ...SF, background:"linear-gradient(135deg,#7c3aed,#a855f7)", position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", padding:"4px 14px", borderRadius:9999, fontSize:11, fontWeight:700, color:"white" }}>Popular</motion.span>}
                  {p.custom && <span style={{ ...SF, background:"#f3f4f6", color:"#6b7280", position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", padding:"4px 14px", borderRadius:9999, fontSize:11, fontWeight:700 }}>Custom</span>}
                  <p style={SF} className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">{p.n}</p>
                  <h3 style={{ ...IF, fontStyle:"italic" }} className="text-xl text-gray-900 mb-2">{p.title}</h3>
                  <p style={SF} className="text-sm text-gray-500 mb-5 leading-relaxed">{p.desc}</p>
                  <div className="mb-5">
                    {p.custom ? <p style={{ ...IF, fontStyle:"italic" }} className="text-3xl text-gray-900">Let&apos;s talk</p>
                      : <><p style={SF} className="text-xs text-gray-400">{p.setup} setup</p>
                          <p style={{ ...IF, fontStyle:"italic" }} className="text-3xl text-gray-900">{p.price}<span style={SF} className="text-base font-normal text-gray-400">/mo</span></p></>
                    }
                  </div>
                  <ul className="mb-6 space-y-2.5 flex-1" style={{ borderTop:"1px solid rgba(0,0,0,0.06)", paddingTop:"1.25rem" }}>
                    {p.features.map(f=>(
                      <motion.li key={f} style={SF} className="flex items-start gap-2 text-sm text-gray-600" whileHover={{ x:5 }}>
                        <span style={{ color:"#7c3aed" }} className="mt-0.5 shrink-0">✓</span>{f}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.button onClick={()=>{ trackLead(); goto("contact"); }} whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.96 }}
                    style={p.hot
                      ? { ...SF, background:"linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius:12, border:"none", padding:12 }
                      : { ...SF, background:"rgba(255,255,255,0.65)", backdropFilter:"blur(8px)", border:"1px solid rgba(0,0,0,0.09)", borderRadius:12, padding:12 }}
                    className={`w-full text-sm font-semibold ${p.hot?"text-white":"text-gray-700"}`}>
                    {p.custom?"Get a quote":"Get started"}
                  </motion.button>
                </GlowCard>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <motion.button onClick={()=>goto("pricing")} style={SF} whileHover={{ scale:1.05 }}
              className="text-sm text-gray-400 underline underline-offset-4 hover:text-gray-700 transition-colors">View full pricing details</motion.button>
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ position:"relative", zIndex:4 }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:gap-24">
            <div className="md:sticky md:top-32 md:self-start">
              <Reveal>
                <p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-4">The founders</p>
                <h2 style={{ ...IF, fontStyle:"italic", fontSize:"clamp(32px,4vw,56px)" }} className="text-gray-900 leading-[0.93]">Built by people<br/><em style={{ color:"#7c3aed" }}>who care.</em></h2>
                <div className="mt-8 flex flex-wrap gap-2">
                  {["Michael Brito","Badre Elkhammal"].map(name=>(
                    <motion.span key={name} whileHover={{ scale:1.06, y:-2 }}
                      style={{ ...SF, background:"rgba(255,255,255,0.6)", backdropFilter:"blur(8px)", border:"1px solid rgba(124,58,237,0.12)", borderRadius:9999, padding:"6px 16px", fontSize:14, color:"#4b5563", cursor:"default" }}>{name}</motion.span>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal y={42} delay={0.1}>
              <blockquote style={{ ...IF, fontStyle:"italic", fontSize:"clamp(18px,2.2vw,26px)" }} className="font-light leading-[1.55] text-gray-500 mb-8">
                &ldquo;Automation should feel human, calm, and trustworthy — not aggressive, robotic, or overwhelming.&rdquo;
              </blockquote>
              <div className="space-y-5">
                <p style={SF} className="text-sm leading-[1.95] text-gray-500">quazieR was founded by <span className="text-gray-700">Michael Brito</span> and <span className="text-gray-700">Badre Elkhammal</span> — two builders who got tired of watching great businesses lose opportunities simply because nobody picked up the phone.</p>
                <p style={SF} className="text-sm leading-[1.95] text-gray-500">After seeing countless teams burn out trying to manually respond to every lead, they built systems that quietly handle communication so owners can focus on real work.</p>
                <p style={SF} className="text-sm leading-[1.95] text-gray-500">No hype. No shortcuts. Just well-designed systems that do exactly what they&apos;re supposed to do.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="px-6 pb-36 pt-10" style={{ position:"relative", zIndex:4 }}>
        <div className="mx-auto max-w-6xl">
          <DrawLine className="mb-20 w-full"/>
          <div className="grid gap-14 md:grid-cols-2 md:gap-24">
            <Reveal y={65}>
              <h2 style={{ ...IF, fontStyle:"italic", fontSize:"clamp(52px,7.5vw,110px)" }} className="text-gray-900 leading-[0.88]">
                A calmer<br/>way to<br/><em style={{ color:"#7c3aed" }}>grow.</em>
              </h2>
            </Reveal>
            <Reveal y={42} delay={0.16} className="flex flex-col justify-center">
              <p style={SF} className="mb-8 text-sm leading-[1.9] text-gray-500">No pressure. No obligation. Just a clear conversation about your business, your workflow, and whether quazieR is the right system for you.<br/><br/><span className="text-gray-900">Most clients are live within 48 hours.</span> We handle everything — you just show up.</p>
              <div className="flex flex-wrap gap-3">
                <MagBtn dark onClick={()=>{ trackLead(); goto("contact"); }}>Start the conversation</MagBtn>
                <MagBtn onClick={()=>goto("pricing")}>See pricing</MagBtn>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {["No contracts","Live in 48h","Cancel anytime"].map((t,i)=>(
                  <motion.span key={t}
                    initial={{ opacity:0, scale:0.8 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:0.3+i*0.1, type:"spring" }}
                    whileHover={{ scale:1.09, y:-2 }}
                    style={{ ...SF, background:"rgba(255,255,255,0.58)", backdropFilter:"blur(8px)", border:"1px solid rgba(124,58,237,0.14)", borderRadius:9999, padding:"4px 12px", fontSize:12, color:"#6b7280", cursor:"default" }}
                    className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-purple-400"/>
                    {t}
                  </motion.span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function PricingPage({ goto }: { goto:(p:Page)=>void }) {
  const [annual, setAnnual] = useState(false);
  return (
    <div className="pt-32 pb-24 px-6" style={{ position:"relative", zIndex:4 }}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center mb-16">
          <p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-4">Pricing</p>
          <h1 style={{ ...IF, fontStyle:"italic", fontSize:"clamp(40px,6vw,80px)" }} className="text-gray-900 leading-tight mb-4">Honest pricing.<br/><em style={{ color:"#7c3aed" }}>Real results.</em></h1>
          <p style={SF} className="text-gray-500 max-w-xl mx-auto mb-8">No hidden fees. No long-term contracts. No sales games. Pick the plan that fits and be live within 48 hours.</p>
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.3 }}
            className="inline-flex items-center gap-4 px-5 py-3 rounded-full"
            style={{ background:"rgba(255,255,255,0.62)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.9)", boxShadow:"0 4px 20px rgba(0,0,0,0.06)" }}>
            <span style={SF} className={`text-sm font-medium ${!annual?"text-gray-900":"text-gray-400"}`}>Monthly</span>
            <motion.button onClick={()=>setAnnual(!annual)} className="relative h-7 w-12 rounded-full"
              style={{ background:annual?"linear-gradient(135deg,#7c3aed,#a855f7)":"rgba(0,0,0,0.1)", border:"none" }}>
              <motion.span animate={{ x:annual?22:2 }} transition={{ type:"spring", stiffness:500, damping:35 }}
                className="absolute top-[3px] left-0 h-[22px] w-[22px] rounded-full bg-white shadow-sm"/>
            </motion.button>
            <span style={SF} className={`text-sm font-medium ${annual?"text-gray-900":"text-gray-400"}`}>Annual <span style={{ color:"#7c3aed" }}>−20%</span></span>
          </motion.div>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p,i)=>{
            const mp = p.custom ? null : parseInt(p.price.replace("$","").replace(",",""));
            const dp = mp ? (annual ? `$${Math.round(mp*0.8).toLocaleString()}` : p.price) : null;
            return (
              <Reveal key={i} delay={i*0.1} y={55}>
                <GlowCard hot={p.hot}
                  className={`rounded-2xl p-8 flex flex-col relative cursor-default h-full ${p.hot?"ring-2 ring-purple-400":""}`}
                  style={{ background:p.hot?"rgba(124,58,237,0.05)":"rgba(255,255,255,0.68)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.9)" }}>
                  {p.hot && <motion.span initial={{ scale:0, rotate:-10 }} animate={{ scale:1, rotate:0 }} transition={{ delay:0.5, type:"spring" }}
                    style={{ ...SF, background:"linear-gradient(135deg,#7c3aed,#a855f7)", position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", padding:"4px 14px", borderRadius:9999, fontSize:11, fontWeight:700, color:"white" }}>Most popular</motion.span>}
                  {p.custom && <span style={{ ...SF, background:"#f3f4f6", color:"#6b7280", position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", padding:"4px 14px", borderRadius:9999, fontSize:11, fontWeight:700 }}>Bespoke</span>}
                  <p style={SF} className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">{p.n}</p>
                  <h3 style={{ ...IF, fontStyle:"italic" }} className="text-2xl text-gray-900 mb-2">{p.title}</h3>
                  <p style={SF} className="text-sm text-gray-500 mb-6 leading-relaxed">{p.desc}</p>
                  <div className="mb-6">
                    {p.custom ? <><p style={{ ...IF, fontStyle:"italic" }} className="text-4xl text-gray-900">Tailored</p><p style={SF} className="text-xs text-gray-400 mt-1">Quoted per scope</p></>
                      : <><p style={SF} className="text-xs text-gray-400">{p.setup} setup</p>
                          <p style={{ ...IF, fontStyle:"italic" }} className="text-4xl text-gray-900">{dp}<span style={SF} className="text-base font-normal text-gray-400">/mo</span></p>
                          {annual && <motion.p initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} style={SF} className="text-xs font-medium mt-1 text-emerald-600">Saving ${(mp!-Math.round(mp!*0.8)).toLocaleString()}/mo</motion.p>}
                        </>
                    }
                  </div>
                  <ul className="mb-8 space-y-2.5 flex-1" style={{ borderTop:"1px solid rgba(0,0,0,0.06)", paddingTop:"1.25rem" }}>
                    {p.features.map(f=>(
                      <motion.li key={f} style={SF} className="flex items-start gap-2 text-sm text-gray-600" whileHover={{ x:5 }}>
                        <span style={{ color:"#7c3aed" }} className="mt-0.5 shrink-0">✓</span>{f}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.button onClick={()=>{ trackLead(); goto("contact"); }} whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.96 }}
                    style={p.hot
                      ? { ...SF, background:"linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius:12, border:"none", padding:14 }
                      : { ...SF, background:"rgba(255,255,255,0.65)", backdropFilter:"blur(8px)", border:"1px solid rgba(0,0,0,0.09)", borderRadius:12, padding:14 }}
                    className={`w-full text-sm font-semibold ${p.hot?"text-white":"text-gray-700"}`}>
                    {p.custom?"Request a quote":"Get started"}
                  </motion.button>
                </GlowCard>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-8 overflow-hidden rounded-2xl p-10 md:p-14" y={38}
          style={{ background:"rgba(255,255,255,0.58)", backdropFilter:"blur(16px)", border:"1px solid rgba(124,58,237,0.12)", boxShadow:"0 8px 40px rgba(124,58,237,0.07)" }}>
          <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
            <div>
              <p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-3">Custom plan</p>
              <h2 style={{ ...IF, fontStyle:"italic", fontSize:"clamp(28px,4vw,52px)" }} className="text-gray-900 leading-[0.93]">Built on<br/><em style={{ color:"#7c3aed" }}>n8n.</em></h2>
            </div>
            <div>
              <p style={SF} className="mb-8 text-sm leading-[1.9] text-gray-500">Not every business fits a template. The Custom plan is for companies with complex, multi-system workflows that need to be engineered from scratch — using n8n as the orchestration layer.</p>
              <div className="grid gap-4 md:grid-cols-2">
                {N8N_FEATURES.map((f,i)=>(
                  <Reveal key={i} delay={i*0.08} y={22}>
                    <GlowCard className="rounded-xl p-5"
                      style={{ background:"rgba(255,255,255,0.65)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.9)" }}>
                      <p style={SF} className="text-sm font-semibold text-gray-900 mb-1">{f.title}</p>
                      <p style={SF} className="text-xs leading-relaxed text-gray-500">{f.desc}</p>
                    </GlowCard>
                  </Reveal>
                ))}
              </div>
              <div className="mt-8"><MagBtn onClick={()=>{ trackLead(); goto("contact"); }}>Discuss your workflow</MagBtn></div>
            </div>
          </div>
        </Reveal>
        <div className="mt-20">
          <p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-8">FAQ</p>
          {FAQS.map((item,i)=><FAQItem key={i} q={item.q} a={item.a}/>)}
        </div>
      </div>
    </div>
  );
}

function ServicesPage({ goto }: { goto:(p:Page)=>void }) {
  const items = [
    { n:"01", title:"AI Website",           headline:"Your 24/7 sales machine.",       desc:"We build high-conversion websites that don't just look good — they actively capture and qualify leads around the clock.", details:["Custom design aligned to your brand","Lead capture with instant AI response","Mobile-first, performance-optimised","Connected to your CRM from day one","Built-in analytics and tracking"] },
    { n:"02", title:"AI Voice Receptionist",headline:"Never miss a call again.",        desc:"An AI receptionist that answers every call, qualifies the lead, books appointments, and routes urgent matters — sounding exactly like your brand.", details:["Natural conversation handling","Lead qualification scripting","Appointment booking integration","Urgent call escalation routing","Full call logging and summaries"] },
    { n:"03", title:"AI Chat & SMS",        headline:"Instant replies, every channel.", desc:"We deploy AI on WhatsApp, SMS, and your website chat. Every inbound message gets an immediate, intelligent response — even at 3am.", details:["WhatsApp Business API integration","SMS automation","Web chat widget","Lead capture and qualification","Handoff to human when needed"] },
    { n:"04", title:"Automated Follow-Ups", headline:"Persistence without effort.",     desc:"Multi-step follow-up sequences that run automatically after every lead interaction.", details:["Multi-channel sequences (email, SMS, WhatsApp)","Personalised message logic","Time-delay and behaviour triggers","Lead scoring integration","Full sequence analytics"] },
    { n:"05", title:"Lead Qualification",   headline:"Only talk to the right people.",  desc:"AI-powered screening that identifies intent, asks qualifying questions, and scores leads before they ever reach your team.", details:["Custom qualification criteria","AI scoring and tagging","Automatic CRM enrichment","Disqualification handling","Hot lead alerts"] },
    { n:"06", title:"CRM Integration",      headline:"Your stack, connected.",          desc:"We wire your automation systems into your existing CRM so nothing falls through the cracks.", details:["GoHighLevel integration","HubSpot integration","Salesforce integration","Custom API connections","Bi-directional data sync"] },
    { n:"07", title:"Custom n8n Workflows", headline:"Automation without limits.",      desc:"For businesses with complex, multi-system needs. We architect bespoke automation workflows using n8n — connecting any tool, any API, any process.", details:["Full workflow architecture","API and webhook integration","Conditional logic and branching","Data transformation pipelines","Monitoring and alerting"] },
  ];
  return (
    <div className="pt-32 pb-24 px-6" style={{ position:"relative", zIndex:4 }}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-24">
          <p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-4">Services</p>
          <h1 style={{ ...IF, fontStyle:"italic", fontSize:"clamp(44px,7vw,100px)" }} className="text-gray-900 leading-[0.88] mb-4">Systems that<br/><em style={{ color:"#7c3aed" }}>do the work.</em></h1>
          <p style={SF} className="text-gray-500 max-w-xl">Each service is a purpose-built system, not a generic tool. We configure, deploy, and maintain everything — you get results without the overhead.</p>
        </Reveal>
        <div style={{ borderTop:"1px solid rgba(0,0,0,0.07)" }}>
          {items.map((s,i)=>(
            <Reveal key={i} delay={0.04*i} y={32}>
              <div className="grid gap-8 py-14 md:grid-cols-[1fr_2fr] md:gap-20" style={{ borderBottom:"1px solid rgba(0,0,0,0.07)" }}>
                <div>
                  <p style={SF} className="text-xs font-semibold uppercase tracking-widest mb-2 text-gray-400">{s.n}</p>
                  <h2 style={{ ...IF, fontStyle:"italic" }} className="text-2xl text-gray-900 mb-1">{s.title}</h2>
                  <p style={{ ...SF, color:"#7c3aed" }} className="text-sm font-medium">{s.headline}</p>
                </div>
                <div>
                  <p style={SF} className="text-gray-500 leading-relaxed mb-6">{s.desc}</p>
                  <ul className="space-y-2.5 mb-8">
                    {s.details.map(d=>(
                      <motion.li key={d} style={SF} whileHover={{ x:5 }} className="flex items-start gap-2 text-sm text-gray-600">
                        <span style={{ color:"#7c3aed" }} className="mt-0.5 shrink-0">✓</span>{d}
                      </motion.li>
                    ))}
                  </ul>
                  <MagBtn onClick={()=>{ trackLead(); goto("contact"); }}>Enquire about this</MagBtn>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutPage({ goto }: { goto:(p:Page)=>void }) {
  const values = [
    { title:"Calm over chaos",   desc:"We build systems that reduce noise, not add to it. Every decision is guided by what creates the most clarity." },
    { title:"Precision",          desc:"We don't ship until it works exactly as intended. We'd rather take an extra day than deliver something that's almost right." },
    { title:"No hype",            desc:"We say what we mean. No inflated promises, no manufactured urgency. If something isn't the right fit, we say so." },
    { title:"Human at the core",  desc:"AI should handle the repetitive so people can focus on what only humans can do. That's the only version of automation worth building." },
  ];
  return (
    <div className="pt-32 pb-24 px-6" style={{ position:"relative", zIndex:4 }}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-32">
          <p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-4">About</p>
          <h1 style={{ ...IF, fontStyle:"italic", fontSize:"clamp(44px,7vw,100px)" }} className="text-gray-900 leading-[0.88] mb-8">Built with<br/><em style={{ color:"#7c3aed" }}>intention.</em></h1>
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
            <p style={SF} className="text-gray-500 leading-relaxed">quazieR started with a simple observation: great businesses were losing customers not because of their product or service — but because they couldn&apos;t respond fast enough.</p>
            <p style={SF} className="text-gray-500 leading-relaxed">Michael and Badre built quazieR to close that gap permanently. Not with an app that creates more to-do items, but with systems that operate in the background, silently handling communication.</p>
          </div>
        </Reveal>
        <div className="mb-32">
          <Reveal><p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-8">The team</p></Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { name:"Michael Brito",   role:"Co-founder", bio:"Systems architect with a background in automation engineering and product design. Obsessed with removing friction from complex workflows." },
              { name:"Badre Elkhammal", role:"Co-founder", bio:"Growth operator and AI integration specialist. Has built and scaled sales automation systems for dozens of service businesses." },
            ].map((f,i)=>(
              <Reveal key={i} delay={i*0.12} y={40}>
                <GlowCard className="rounded-2xl p-8"
                  style={{ background:"rgba(255,255,255,0.62)", backdropFilter:"blur(14px)", border:"1px solid rgba(255,255,255,0.9)" }}>
                  <div className="h-px w-10 mb-6" style={{ background:"linear-gradient(90deg,#7c3aed,#a855f7)" }}/>
                  <h3 style={{ ...IF, fontStyle:"italic" }} className="text-2xl text-gray-900 mb-1">{f.name}</h3>
                  <p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-4">{f.role}</p>
                  <p style={SF} className="text-sm text-gray-500 leading-relaxed">{f.bio}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mb-32">
          <Reveal><p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-8">Our values</p></Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {values.map((v,i)=>(
              <Reveal key={i} delay={i*0.1} y={32}>
                <GlowCard className="rounded-2xl p-7"
                  style={{ background:"rgba(255,255,255,0.62)", backdropFilter:"blur(14px)", border:"1px solid rgba(255,255,255,0.9)" }}>
                  <p style={{ ...IF, fontStyle:"italic" }} className="text-xl text-gray-900 mb-2">{v.title}</p>
                  <p style={SF} className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal y={42}>
          <div className="rounded-3xl p-14 text-center relative overflow-hidden" style={{ background:"linear-gradient(135deg,#111,#2d2d2d)" }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize:"40px 40px" }}/>
            <blockquote style={{ ...IF, fontStyle:"italic", fontSize:"clamp(20px,2.5vw,32px)" }} className="font-light text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed relative z-10">
              &ldquo;Automation should feel human, calm, and trustworthy — not aggressive, robotic, or overwhelming.&rdquo;
            </blockquote>
            <p style={SF} className="text-sm text-white/50 mb-8 relative z-10">Michael &amp; Badre, quazieR</p>
            <motion.button onClick={()=>{ trackLead(); goto("contact"); }} whileHover={{ scale:1.06, y:-3 }} whileTap={{ scale:0.96 }}
              style={{ ...SF, background:"rgba(255,255,255,0.12)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:9999, padding:"14px 32px" }}
              className="text-sm font-semibold text-white relative z-10">Work with us</motion.button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="pt-32 pb-24 px-6" style={{ position:"relative", zIndex:4 }}>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-[1fr_1.4fr]">
          <Reveal y={32}>
            <p style={{ ...SF, color:"#7c3aed" }} className="text-xs font-semibold uppercase tracking-widest mb-4">Contact</p>
            <h1 style={{ ...IF, fontStyle:"italic", fontSize:"clamp(36px,5.5vw,80px)" }} className="text-gray-900 leading-[0.88] mb-6">
              Let&apos;s talk<br/><em style={{ color:"#7c3aed" }}>about your business.</em>
            </h1>
            <p style={SF} className="text-gray-500 leading-relaxed mb-12">
              No pressure. No sales pitch. Just a real conversation about where you&apos;re losing time and how automation might help.
              Most clients are live within 48 hours.
            </p>
            <div className="space-y-6 mb-10">
              {[{label:"Email",value:"quazier.ai@gmail.com"},
                {label:"Phone / WhatsApp",value:"(518) 662-3244"},
                {label:"Based in",value:"Available worldwide"}].map(c=>(
                <motion.div key={c.label} whileHover={{ x:5 }}>
                  <p style={SF} className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{c.label}</p>
                  <p style={SF} className="text-gray-700 font-medium">{c.value}</p>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mb-6">
              <motion.a href="https://www.instagram.com/quazier.ai" target="_blank" rel="noopener noreferrer"
                whileHover={{ scale:1.06, y:-2 }} whileTap={{ scale:0.95 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                style={{ background:"rgba(255,255,255,0.68)", backdropFilter:"blur(10px)", border:"1px solid rgba(0,0,0,0.08)" }}>Instagram</motion.a>
              <motion.a href="https://www.facebook.com/profile.php?id=61585053252637" target="_blank" rel="noopener noreferrer"
                whileHover={{ scale:1.06, y:-2 }} whileTap={{ scale:0.95 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                style={{ background:"rgba(255,255,255,0.68)", backdropFilter:"blur(10px)", border:"1px solid rgba(0,0,0,0.08)" }}>Facebook</motion.a>
            </div>
            <div className="flex flex-wrap gap-3">
              {["No contracts","Live in 48h","Cancel anytime"].map(t=>(
                <span key={t} style={{ ...SF, background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.16)", borderRadius:9999, padding:"8px 16px", fontSize:14, color:"#6b7280" }}
                  className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400"/>
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal y={42} delay={0.16}>
            <div className="rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-8"
              style={{ background:"rgba(255,255,255,0.62)", backdropFilter:"blur(24px)", border:"1px solid rgba(255,255,255,0.92)", boxShadow:"0 24px 64px rgba(124,58,237,0.09)" }}>
              <div>
                <div className="h-1 w-14 mx-auto mb-6 rounded-full" style={{ background:"linear-gradient(90deg,#7c3aed,#a855f7)" }}/>
                <h3 style={{ ...IF, fontStyle:"italic", fontSize:"clamp(26px,3.5vw,40px)" }} className="text-gray-900 mb-3">
                  Book a free<br/><em style={{ color:"#7c3aed" }}>20-min call.</em>
                </h3>
                <p style={SF} className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                  Pick a time that works for you. We&apos;ll talk about your business, your workflow, and how quazieR can help. No pressure.
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full max-w-xs">
                {["No contracts","Live in 48h","Cancel anytime"].map(t=>(
                  <motion.div key={t} whileHover={{ x:5, scale:1.02 }}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ background:"rgba(124,58,237,0.04)", border:"1px solid rgba(124,58,237,0.1)" }}>
                    <span className="h-2 w-2 rounded-full shrink-0 bg-purple-400"/>
                    <span style={SF} className="text-sm text-gray-600">{t}</span>
                  </motion.div>
                ))}
              </div>
              <MagBtn dark href="https://api.leadconnectorhq.com/widget/booking/qJg74N6UCUVhwWV1yBKG" onClick={trackLead}>
                Book your free call →
              </MagBtn>
              <p style={SF} className="text-xs text-gray-400">Opens our scheduling page — pick any available slot</p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [page, setPage] = useState<Page>("home");
  const goto = (p: Page) => { window.scrollTo({ top:0, behavior:"smooth" }); setTimeout(()=>setPage(p), 120); };

  useEffect(() => { window.scrollTo({ top:0, behavior:"instant" as any }); }, []);

  return (
    <div className="min-h-screen text-gray-900 selection:bg-purple-200" style={{ ...SF, cursor: "auto" }}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }}/>
      <AuroraOrbs/>
      <LiquidWaves/>
      <CustomCursor/>
      <div style={{ position:"relative", zIndex:4 }}>
        <Nav current={page} goto={goto}/>
        <AnimatePresence mode="wait">
          <motion.main key={page}
            initial={{ opacity:0, y:18, filter:"blur(6px)" }}
            animate={{ opacity:1, y:0, filter:"blur(0px)" }}
            exit={{ opacity:0, y:-18, filter:"blur(6px)" }}
            transition={{ duration:0.4, ease:E }}>
            {page==="home"     && <HomePage    goto={goto}/>}
            {page==="pricing"  && <PricingPage goto={goto}/>}
            {page==="services" && <ServicesPage goto={goto}/>}
            {page==="about"    && <AboutPage   goto={goto}/>}
            {page==="contact"  && <ContactPage/>}
          </motion.main>
        </AnimatePresence>
        <Footer goto={goto}/>
      </div>
    </div>
  );
}