"use client";

// ─── SEO METADATA (export from layout.tsx or page metadata) ──────────────────
// Title: "roofY | AI Lead Generation & Automation for Roofing Contractors"
// Description: "roofY builds AI automation systems for roofing companies — 24/7 AI call answering, automated follow-ups, Meta ads, and lead qualification. Go live in 48 hours. No contracts."
// Keywords: AI roofing leads, roofing automation, AI voice receptionist for roofers, Meta ads for roofing, storm damage leads, roofing CRM, automated follow-ups roofing
// OG image: /og-image.png | Twitter card: summary_large_image

import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useInView, animate } from "framer-motion";
import { useRef, useState, useEffect, useCallback, memo } from "react";

type Page = "home" | "pricing" | "services" | "contact" | "about";
type Msg  = { role: "user" | "ai"; text: string };

function trackLead() {
  if (typeof window !== "undefined" && (window as any).fbq)
    (window as any).fbq("track", "Lead");
}

const E = [0.16, 1, 0.3, 1] as const;
const SF = { fontFamily:"'Satoshi', sans-serif" };
const IF = { fontFamily:"'Instrument Serif', serif" };

const ORANGE      = "#f97316";
const ORANGE_DARK = "#ea580c";
const ORANGE_LIGHT  = "rgba(249,115,22,0.10)";
const ORANGE_BORDER = "rgba(249,115,22,0.22)";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TICKER = ["AI Roofing Leads","24/7 Call Answering","Storm Damage Leads","Meta Ads for Roofers","Automated Follow-Ups","No Missed Calls","Instant Lead Response","Facebook & Instagram Ads","Roofing CRM Automation","AI Voice Receptionist","Real-Time Lead Alerts","Roof Replacement Leads"];

const STATS = [
  { n: 78,  suffix: "%", l:"of roofing customers hire whoever responds first." },
  { n: 60,  suffix: "s", l:"ideal response window for a fresh storm damage lead." },
  { n: 3,   suffix: "×", l:"more revenue closed with automated follow-ups." },
];

const SERVICES = [
  { n:"01", title:"AI Website",            desc:"High-conversion roofing pages connected to AI — built to capture, qualify, and route leads around the clock.",       price:"$399/mo" },
  { n:"02", title:"AI Voice Receptionist", desc:"Every call answered 24/7. Qualifies leads, books estimates, routes urgent calls — in your brand's voice.",          price:"$699/mo" },
  { n:"03", title:"AI Chat & SMS",         desc:"Instant replies on WhatsApp, SMS, and web chat. Zero wait time. No missed messages.",                               price:"Included" },
  { n:"04", title:"Automated Follow-Ups",  desc:"Multi-step sequences that nurture leads until they sign. Runs on autopilot.",                                        price:"Included" },
  { n:"05", title:"Lead Qualification",    desc:"AI detects intent, asks the right questions, and sends only the best roofing leads to your team.",                   price:"Included" },
  { n:"06", title:"Meta Ads",              desc:"Facebook & Instagram ads engineered for roofing — storm damage, replacements, inspections. Weekly optimisation.",    price:"From $399/mo" },
];

const COMPARE = [
  ["Responds to leads","Instantly, 24/7","Hours or days"],
  ["Answers phone calls","Every single call","Missed when busy"],
  ["Follow-up messages","Automatic sequences","Manual, often skipped"],
  ["Live timeline","48 hours","Weeks of setup"],
  ["Scales with you","Unlimited capacity","Hire more staff"],
  ["Lock-in contract","None — cancel anytime","Varies"],
];

const STEPS = [
  { n:"01", title:"We onboard your business",  desc:"We learn your brand, your workflow, your process. One call is all it takes." },
  { n:"02", title:"We build and configure",    desc:"AI voice, chat, ads, follow-ups — all configured to your exact roofing process and tone." },
  { n:"03", title:"You go live in 48 hours",   desc:"Every call answered. Every lead followed up. You focus on closing roofing jobs." },
];

const FAQS = [
  { q:"How fast can I go live?",                    a:"Most roofing clients are fully live within 48 hours of onboarding. The Custom plan may take longer depending on workflow complexity." },
  { q:"Is there a long-term commitment?",           a:"No. All plans are month-to-month. Cancel at any time with no penalty." },
  { q:"How does the performance-based ads plan work?", a:"We run your Meta ads at zero upfront cost. You pay 15% only on closed deals. Perfect for testing before committing to a monthly plan." },
  { q:"What's included in the setup fee?",          a:"The setup fee covers system configuration, AI training on your business, integration testing, and go-live support." },
  { q:"Does the AI sound like a real person?",      a:"Yes. Our voice AI is trained to match your brand's tone and handles natural conversation including interruptions and follow-up questions." },
  { q:"What does '+ 10% per closed deal' mean?",   a:"On plans that include ads (Meta Ads and Full AI System + Lead Gen Ads), we take a 10% commission on every deal closed through our leads. This aligns our incentives with yours — we only win when you win." },
  { q:"What happens after the first client on the commission-only plan?", a:"Your first client is 100% commission-only — no upfront cost, just 13% of the closed deal. After that you move to $399/mo + 10% per deal." },
];

const PLANS = [
  {
    id:"commission-only",
    n:"01", title:"First Client — Commission Only", price:0, priceDisplay:"$0/mo",
    setup:0, setupDisplay:"No setup fee",
    commission:"13% per closed deal",
    desc:"Zero risk to start. We run your full AI system for free — you only pay 13% when a deal closes. First client only.",
    features:["AI Chat & SMS on your site","Lead qualification","Automated follow-ups","Call routing","13% on closed deals only"],
    hot:false, custom:false, commissionOnly:true, bundle:false, fullBundle:false,
  },
  {
    id:"ai-website",
    n:"02", title:"AI Website System", price:399, priceDisplay:"$399/mo",
    setup:250, setupDisplay:"$250 setup",
    commission:"",
    desc:"High-conversion roofing website with AI chat, lead capture, and analytics — built to convert visitors into booked jobs.",
    features:["Custom AI-connected landing page","Lead capture form + AI chat","Mobile-first design","Analytics & tracking"],
    hot:false, custom:false, commissionOnly:false, bundle:false, fullBundle:false,
  },
  {
    id:"meta-ads",
    n:"03", title:"AI Lead Generation Ads", price:399, priceDisplay:"$399/mo",
    setup:0, setupDisplay:"No setup fee",
    commission:"+10% per closed deal",
    desc:"Meta (Facebook & Instagram) ads for roofing companies. Storm damage, replacements, inspections — targeted and optimized weekly.",
    features:["Ad setup & creative strategy","Roofing-focused ad creatives","Geo & interest targeting","Lead form optimization","Weekly tracking & reporting","+ 10% per closed deal"],
    hot:false, custom:false, commissionOnly:false, bundle:false, fullBundle:false,
  },
  {
    id:"ai-receptionist",
    n:"04", title:"AI Voice & Chat Receptionist", price:699, priceDisplay:"$699/mo",
    setup:350, setupDisplay:"$350 setup",
    commission:"",
    desc:"Full AI phone receptionist, WhatsApp & SMS automation, lead qualification, and automated follow-ups — 24/7.",
    features:["AI phone receptionist (24/7)","WhatsApp & SMS automation","Lead qualification","Automated follow-up sequences","Weekly performance report"],
    hot:false, custom:false, commissionOnly:false, bundle:false, fullBundle:false,
  },
  {
    id:"full-system",
    n:"05", title:"Full AI System", price:1499, priceDisplay:"$1,499/mo",
    setup:400, setupDisplay:"$400 setup",
    commission:"",
    desc:"AI website, AI receptionist, chat & SMS, automated follow-ups, and lead qualification — without the ads. The complete system.",
    features:["AI-powered roofing website","AI phone receptionist (24/7)","WhatsApp, SMS & web chat AI","Automated follow-up sequences","Lead qualification","Lead tracking dashboard","Priority support"],
    hot:true, custom:false, commissionOnly:false, bundle:false, fullBundle:false, fullSystem:true,
  },
  {
    id:"full-bundle",
    n:"06", title:"Full AI System + Lead Gen Ads", price:2400, priceDisplay:"$2,400/mo",
    setup:500, setupDisplay:"$500 setup",
    commission:"+10% per closed deal",
    desc:"Everything in one: Meta ads, AI website, AI receptionist, chat & SMS, and automated follow-ups. The complete roofing machine.",
    features:["AI Lead Generation Ads (Facebook & Instagram)","AI-powered roofing website","AI phone receptionist (24/7)","WhatsApp, SMS & web chat AI","Automated follow-up sequences","Lead tracking dashboard","Priority support","+ 10% per closed deal"],
    hot:false, custom:false, commissionOnly:false, bundle:false, fullBundle:true,
  },
  {
    id:"custom",
    n:"07", title:"Custom / n8n", price:0, priceDisplay:"Tailored",
    setup:0, setupDisplay:"Quoted per scope",
    commission:"",
    desc:"Bespoke workflow automation built on n8n — engineered around your exact process.",
    features:["Full n8n workflow architecture","API & webhook integrations","Multi-system orchestration","Custom logic & conditional flows","Data transformation & routing","Dedicated build sprint","Ongoing maintenance option"],
    hot:false, custom:true, commissionOnly:false, bundle:false, fullBundle:false,
  },
];

// ─── GLOBAL CSS — injected once via <style> tag ────────────────────────────────
// PERF: Moved to a constant outside component to avoid re-creation on every render.
// PERF: Reduced wave animations from 6 layers to 3; removed feGaussianBlur filters (GPU killers).
// PERF: Removed will-change from elements that don't need it.
// PERF: Consolidated keyframes; removed redundant ones.
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');

  @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  @keyframes hammerSwing {
    0%,100% { transform: rotate(-30deg); transform-origin: 90% 90%; }
    50%      { transform: rotate(10deg);  transform-origin: 90% 90%; }
  }
  @keyframes cloudDrift {
    0%   { transform: translateX(0px); }
    100% { transform: translateX(80px); }
  }
  @keyframes sunPulse {
    0%,100% { opacity:0.7; transform: scale(1); }
    50%     { opacity:1;   transform: scale(1.08); }
  }
  @keyframes workerBob {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-6px); }
  }
  .anim-hammer   { animation: hammerSwing 0.7s ease-in-out infinite; }
  .anim-cloud1   { animation: cloudDrift 18s ease-in-out infinite alternate; }
  .anim-cloud2   { animation: cloudDrift 24s ease-in-out infinite alternate-reverse; }
  .anim-sun      { animation: sunPulse 4s ease-in-out infinite; }
  .anim-worker   { animation: workerBob 2s ease-in-out infinite; }

  /* PERF: Reduced to 3 wave layers, no blur filters, translateX only (compositor-friendly) */
  @keyframes wave1 {
    0%   { transform: translateX(0); }
    50%  { transform: translateX(-6%); }
    100% { transform: translateX(0); }
  }
  @keyframes wave2 {
    0%   { transform: translateX(0); }
    50%  { transform: translateX(8%); }
    100% { transform: translateX(0); }
  }
  @keyframes wave3 {
    0%   { transform: translateX(0); }
    50%  { transform: translateX(-10%); }
    100% { transform: translateX(0); }
  }
  .wave-1 { animation: wave1 14s ease-in-out infinite; will-change: transform; }
  .wave-2 { animation: wave2 18s ease-in-out infinite; will-change: transform; }
  .wave-3 { animation: wave3 22s ease-in-out infinite; will-change: transform; }

  @keyframes orb1 {
    0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-30px)}
  }
  @keyframes orb2 {
    0%,100%{transform:translate(0,0)} 50%{transform:translate(-35px,30px)}
  }
  .orb-1{animation:orb1 28s ease-in-out infinite;will-change:transform}
  .orb-2{animation:orb2 34s ease-in-out infinite;animation-delay:-6s;will-change:transform}

  @keyframes ping{75%,100%{transform:scale(2);opacity:0}}
  .ping{animation:ping 1s cubic-bezier(0,0,0.2,1) infinite}

  @keyframes voiceRing{0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.07;transform:scale(1.16)}}
  .voice-ring{animation:voiceRing 2.8s ease-in-out infinite}

  @keyframes voiceGlow{0%,100%{box-shadow:0 8px 28px rgba(249,115,22,0.4)} 50%{box-shadow:0 14px 50px rgba(249,115,22,0.65)}}
  .voice-btn{animation:voiceGlow 2s ease-in-out infinite}

  @keyframes typingBounce{0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)}}
  .typing-dot{animation:typingBounce .6s ease-in-out infinite}
  .typing-dot:nth-child(2){animation-delay:.15s}
  .typing-dot:nth-child(3){animation-delay:.30s}

  @keyframes scrollCue{0%,100%{transform:translateY(0)} 50%{transform:translateY(12px)}}
  .scroll-cue{animation:scrollCue 2s ease-in-out infinite}

  @keyframes shimmer{0%{background-position:-200% 0} 100%{background-position:200% 0}}
  .shimmer-text{
    background:linear-gradient(90deg,#f97316 0%,#fbbf24 40%,#f97316 60%,#ea580c 100%);
    background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
    animation:shimmer 3s linear infinite
  }

  @keyframes badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,0.4)} 50%{box-shadow:0 0 0 8px rgba(249,115,22,0)}}
  .badge-pulse{animation:badgePulse 2s ease-in-out infinite}

  @keyframes roofFloat{0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-14px) rotate(1deg)}}
`;

// ─── OPTIMIZED BACKGROUND — memoized, no blur filters, fewer layers ────────────
// PERF: memo() prevents re-render when parent state changes (page, annual toggle, etc.)
// PERF: Removed feGaussianBlur SVG filters — these force software rasterization and kill FPS
// PERF: Reduced wave layers from 7 to 3
// PERF: Reduced scenery pieces from 14 to 6 (the ones with most visual impact)
// PERF: Background is position:fixed so it never repaints on scroll
const RoofingBackground = memo(function RoofingBackground() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden",background:"#fff8f2"}} aria-hidden>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(165deg,#fffcf8 0%,#fff6ed 40%,#ffecd6 70%,#fff5ec 100%)"}}/>

      {/* Simplified wave layers — no blur filters */}
      <svg style={{position:"absolute",bottom:0,left:0,width:"110%",height:"65%",overflow:"visible"}}
        viewBox="0 0 1440 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <g className="wave-1">
          <path fill="rgba(180,50,5,0.09)"
            d="M0,420 C180,320 360,500 540,400 C720,300 900,460 1080,360 C1260,260 1380,400 1440,340 L1440,600 L0,600Z"/>
        </g>
        <g className="wave-2">
          <path fill="rgba(249,115,22,0.08)"
            d="M0,460 C200,360 420,520 660,420 C900,320 1100,480 1300,380 C1420,320 1440,420 1440,380 L1440,600 L0,600Z"/>
        </g>
        <g className="wave-3">
          <path fill="rgba(251,146,60,0.07)"
            d="M0,490 C240,400 480,540 720,450 C960,360 1140,500 1340,410 C1420,375 1440,450 1440,430 L1440,600 L0,600Z"/>
        </g>
      </svg>

      {/* Reduced scenery — 5 pieces instead of 14 */}
      <div style={{position:"absolute",inset:0}}>
        <div style={{position:"absolute",bottom:"7%",left:"3%",opacity:0.16}}><SceneryHouse variant="A" scale={0.9}/></div>
        <div style={{position:"absolute",bottom:"6%",left:"35%",opacity:0.10}}><SceneryHouse variant="C" scale={1.0}/></div>
        <div style={{position:"absolute",bottom:"7%",left:"48%",opacity:0.14}}><SceneryTruck/></div>
        <div style={{position:"absolute",bottom:"5%",right:"3%",opacity:0.13}}><SceneryHouse variant="B" scale={0.9}/></div>
        <div className="anim-sun" style={{position:"absolute",top:"6%",right:"6%",opacity:0.2}}><ScenerySun/></div>
        <div className="anim-cloud1" style={{position:"absolute",top:"12%",left:"18%",opacity:0.15}}><SceneryCloud scale={1.1}/></div>
      </div>

      {/* Orbs — reduced blur radius for less GPU work */}
      <div className="orb-1" style={{position:"absolute",top:"-15%",left:"55%",width:700,height:700,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(249,115,22,0.07) 0%,transparent 65%)",filter:"blur(60px)"}}/>
      <div className="orb-2" style={{position:"absolute",top:"25%",left:"-10%",width:500,height:500,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(234,88,12,0.06) 0%,transparent 65%)",filter:"blur(50px)"}}/>

      <div style={{position:"absolute",inset:0,
        background:"linear-gradient(to bottom,rgba(255,248,242,0.72) 0%,rgba(255,248,242,0.08) 45%,rgba(255,248,242,0.04) 65%,rgba(255,248,242,0.6) 100%)"}}/>
    </div>
  );
});

// ── Scenery pieces (unchanged, already lightweight SVGs) ──────────────────────
const OM = "rgba(234,88,12,1)";
const OD = "rgba(194,65,12,1)";
const OL = "rgba(251,146,60,1)";
const O  = "rgba(249,115,22,1)";

function SceneryHouse({ variant="A", scale=1 }: { variant?:"A"|"B"|"C"; scale?:number }) {
  const w = 180*scale, h = 160*scale;
  if (variant === "A") return (
    <svg width={w} height={h} viewBox="0 0 180 160" fill="none">
      <rect x="20" y="90" width="140" height="70" fill="rgba(249,115,22,0.15)" stroke={OM} strokeWidth="1.5"/>
      <polygon points="8,92 90,28 172,92" fill={OD} opacity="0.55"/>
      {[0,1,2,3,4].map(r=>[0,1,2,3,4,5,6].map(c=>{
        const x=12+c*23-r*2.5, y=46+r*8;
        if(y>91||x<8||x>163) return null;
        return <rect key={`${r}${c}`} x={x} y={y} width="22" height="7" rx="1" fill={r%2===0?OD:OM} opacity="0.65"/>;
      }))}
      <rect x="73" y="118" width="28" height="42" fill="rgba(120,60,20,0.45)" rx="2"/>
      <rect x="28" y="100" width="30" height="24" fill="rgba(135,206,235,0.35)" stroke={OM} strokeWidth="1" rx="1"/>
      <rect x="122" y="100" width="30" height="24" fill="rgba(135,206,235,0.35)" stroke={OM} strokeWidth="1" rx="1"/>
    </svg>
  );
  if (variant === "B") return (
    <svg width={w} height={h} viewBox="0 0 180 160" fill="none">
      <rect x="10" y="100" width="160" height="60" fill="rgba(249,115,22,0.12)" stroke={OM} strokeWidth="1.5"/>
      <polygon points="0,102 90,55 180,102" fill={OM} opacity="0.5"/>
      {[0,1,2,3].map(r=>[0,1,2,3,4,5,6,7].map(c=>{
        const x=4+c*22-r*2.5, y=64+r*8;
        if(y>101||x<0||x>175) return null;
        return <rect key={`${r}${c}`} x={x} y={y} width="20" height="6.5" rx="1" fill={r%2===0?OD:OM} opacity="0.6"/>;
      }))}
      <rect x="72" y="124" width="32" height="36" fill="rgba(120,60,20,0.4)" rx="2"/>
      <rect x="16" y="108" width="35" height="26" fill="rgba(135,206,235,0.3)" stroke={OM} strokeWidth="1" rx="1"/>
      <rect x="130" y="108" width="35" height="26" fill="rgba(135,206,235,0.3)" stroke={OM} strokeWidth="1" rx="1"/>
    </svg>
  );
  return (
    <svg width={w} height={h} viewBox="0 0 180 160" fill="none">
      <rect x="25" y="70" width="130" height="90" fill="rgba(249,115,22,0.12)" stroke={OM} strokeWidth="1.5"/>
      <polygon points="12,72 90,18 168,72" fill={OD} opacity="0.52"/>
      {[0,1,2,3,4,5].map(r=>[0,1,2,3,4,5,6].map(c=>{
        const x=16+c*22-r*2, y=30+r*7;
        if(y>71||x<12||x>160) return null;
        return <rect key={`${r}${c}`} x={x} y={y} width="20" height="6" rx="1" fill={r%2===0?OD:OM} opacity="0.6"/>;
      }))}
      <rect x="72" y="130" width="30" height="30" fill="rgba(120,60,20,0.4)" rx="2"/>
      <rect x="32" y="80" width="28" height="22" fill="rgba(135,206,235,0.35)" stroke={OM} strokeWidth="1" rx="1"/>
      <rect x="120" y="80" width="28" height="22" fill="rgba(135,206,235,0.35)" stroke={OM} strokeWidth="1" rx="1"/>
    </svg>
  );
}

function SceneryWorker({ flip=false }: { flip?:boolean }) {
  return (
    <svg width="80" height="100" viewBox="0 0 80 100" fill="none" style={{transform:flip?"scaleX(-1)":"none"}} className="anim-worker">
      <line x1="0" y1="80" x2="80" y2="44" stroke={OM} strokeWidth="2" opacity="0.5"/>
      <rect x="34" y="52" width="12" height="18" fill="rgba(40,40,40,0.7)" rx="2"/>
      <circle cx="40" cy="48" r="8" fill="rgba(220,180,140,0.9)"/>
      <ellipse cx="40" cy="43" rx="11" ry="6" fill={O} opacity="0.85"/>
      <g className="anim-hammer" style={{transformOrigin:"40px 60px"}}>
        <line x1="44" y1="57" x2="60" y2="44" stroke="rgba(40,40,40,0.6)" strokeWidth="3" strokeLinecap="round"/>
        <rect x="58" y="40" width="9" height="6" rx="1.5" fill="rgba(60,60,60,0.8)"/>
      </g>
    </svg>
  );
}

function SceneryTruck() {
  return (
    <svg width="160" height="80" viewBox="0 0 160 80" fill="none" className="anim-worker">
      <rect x="0" y="32" width="110" height="30" fill={OD} opacity="0.45" rx="2"/>
      <rect x="110" y="20" width="46" height="42" fill={O} opacity="0.5" rx="3"/>
      <rect x="116" y="24" width="32" height="20" fill="rgba(135,206,235,0.4)" rx="2"/>
      <circle cx="28" cy="66" r="12" fill="rgba(30,20,10,0.7)"/>
      <circle cx="28" cy="66" r="7" fill="rgba(80,70,60,0.6)"/>
      <circle cx="90" cy="66" r="12" fill="rgba(30,20,10,0.7)"/>
      <circle cx="90" cy="66" r="7" fill="rgba(80,70,60,0.6)"/>
      <circle cx="138" cy="66" r="12" fill="rgba(30,20,10,0.7)"/>
      <circle cx="138" cy="66" r="7" fill="rgba(80,70,60,0.6)"/>
    </svg>
  );
}

function ScenerySun() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="14" fill={O} opacity="0.4"/>
      <circle cx="30" cy="30" r="9" fill={O} opacity="0.55"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg,i)=>{
        const r = Math.PI*deg/180;
        return <line key={i} x1={30+Math.cos(r)*16} y1={30+Math.sin(r)*16}
          x2={30+Math.cos(r)*24} y2={30+Math.sin(r)*24}
          stroke={O} strokeWidth="2" strokeLinecap="round" opacity="0.45"/>;
      })}
    </svg>
  );
}

function SceneryCloud({ scale=1 }: { scale?:number }) {
  const w=120*scale, h=50*scale;
  return (
    <svg width={w} height={h} viewBox="0 0 120 50" fill="none">
      <ellipse cx="60" cy="32" rx="50" ry="18" fill={OL} opacity="0.18"/>
      <ellipse cx="75" cy="24" rx="32" ry="20" fill={OL} opacity="0.14"/>
      <ellipse cx="42" cy="26" rx="26" ry="16" fill={OL} opacity="0.12"/>
    </svg>
  );
}

// PERF: Memoized — heavy SVG that never changes
const RoofHouseIllustration = memo(function RoofHouseIllustration({ size = 200 }: { size?: number }) {
  return (
    <svg width={size} height={size*1.05} viewBox="0 0 200 210" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{animation:"roofFloat 6s ease-in-out infinite",filter:"drop-shadow(0 20px 40px rgba(249,115,22,0.18))"}}>
      <defs>
        <linearGradient id="hRoof" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c2410c"/><stop offset="100%" stopColor="#7c2d12"/>
        </linearGradient>
        <linearGradient id="hWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff7f0"/><stop offset="100%" stopColor="#fde8d0"/>
        </linearGradient>
        <filter id="hDrop"><feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(194,65,12,0.2)"/></filter>
      </defs>
      <ellipse cx="100" cy="204" rx="70" ry="6" fill="rgba(194,65,12,0.12)"/>
      <rect x="28" y="108" width="144" height="92" rx="2" fill="url(#hWall)" stroke="rgba(234,88,12,0.2)" strokeWidth="1"/>
      <polygon points="14,110 100,22 186,110" fill="url(#hRoof)" filter="url(#hDrop)"/>
      {[0,1,2,3,4,5,6,7].map(r=>[0,1,2,3,4,5,6,7,8,9].map(c=>{
        const x=18+c*19-r*2.2, y=40+r*9.2;
        if(y>109||x<13||x>180) return null;
        return <rect key={`${r}${c}`} x={x} y={y} width="18" height="7.5" rx="1.5"
          fill={r%2===0?"rgba(154,52,18,0.85)":"rgba(194,65,12,0.75)"}/>;
      }))}
      <line x1="14" y1="110" x2="186" y2="110" stroke="rgba(249,115,22,0.35)" strokeWidth="3"/>
      <rect x="80" y="148" width="40" height="52" fill="rgba(120,65,25,0.65)" rx="3"/>
      <circle cx="116" cy="174" r="3" fill="rgba(249,115,22,0.9)"/>
      <rect x="34" y="122" width="36" height="30" fill="rgba(135,206,235,0.32)" stroke="rgba(234,88,12,0.3)" strokeWidth="1.5" rx="2"/>
      <line x1="52" y1="122" x2="52" y2="152" stroke="rgba(234,88,12,0.25)" strokeWidth="1"/>
      <line x1="34" y1="137" x2="70" y2="137" stroke="rgba(234,88,12,0.25)" strokeWidth="1"/>
      <rect x="130" y="122" width="36" height="30" fill="rgba(135,206,235,0.32)" stroke="rgba(234,88,12,0.3)" strokeWidth="1.5" rx="2"/>
      <line x1="148" y1="122" x2="148" y2="152" stroke="rgba(234,88,12,0.25)" strokeWidth="1"/>
      <line x1="130" y1="137" x2="166" y2="137" stroke="rgba(234,88,12,0.25)" strokeWidth="1"/>
      <circle cx="174" cy="118" r="5" fill="rgba(34,197,94,0.9)"/>
      <circle cx="174" cy="118" r="2.5" fill="rgba(255,255,255,0.9)"/>
    </svg>
  );
});

// PERF: Memoized static illustrations
const IllustrationLeadFlow = memo(function IllustrationLeadFlow() {
  return (
    <svg width="100%" height="120" viewBox="0 0 520 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(249,115,22,0.0)"/>
          <stop offset="50%" stopColor="rgba(249,115,22,0.7)"/>
          <stop offset="100%" stopColor="rgba(249,115,22,0.0)"/>
        </linearGradient>
      </defs>
      <g transform="translate(30,20)">
        <rect x="0" y="10" width="80" height="80" rx="16" fill="rgba(249,115,22,0.07)" stroke="rgba(249,115,22,0.2)" strokeWidth="1.5"/>
        <rect x="28" y="22" width="24" height="40" rx="4" fill="rgba(249,115,22,0.15)" stroke="rgba(249,115,22,0.4)" strokeWidth="1.5"/>
        <rect x="31" y="27" width="18" height="26" rx="2" fill="rgba(249,115,22,0.2)"/>
        <circle cx="40" cy="57" r="2.5" fill="rgba(249,115,22,0.5)"/>
        <path d="M58,35 Q65,42 58,49" stroke="rgba(249,115,22,0.5)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <text x="40" y="77" textAnchor="middle" fontSize="9" fill="rgba(249,115,22,0.7)" fontFamily="sans-serif" fontWeight="600" letterSpacing="0.05em">LEAD IN</text>
      </g>
      <g transform="translate(118,55)">
        <line x1="0" y1="0" x2="60" y2="0" stroke="url(#lg1)" strokeWidth="2" strokeDasharray="5 3"/>
        <polygon points="60,0 52,-4 52,4" fill="rgba(249,115,22,0.5)"/>
      </g>
      <g transform="translate(185,10)">
        <rect x="0" y="0" width="90" height="90" rx="16" fill="rgba(249,115,22,0.1)" stroke="rgba(249,115,22,0.3)" strokeWidth="1.5"/>
        <circle cx="45" cy="38" r="18" fill="rgba(249,115,22,0.12)" stroke="rgba(249,115,22,0.4)" strokeWidth="1.5"/>
        <text x="45" y="42" textAnchor="middle" fontSize="18" fill="rgba(249,115,22,0.8)" fontFamily="sans-serif" fontWeight="700">AI</text>
        <rect x="8" y="62" width="18" height="12" rx="3" fill="rgba(249,115,22,0.2)"/>
        <text x="17" y="71" textAnchor="middle" fontSize="7" fill="rgba(249,115,22,0.8)" fontFamily="sans-serif">SMS</text>
        <rect x="34" y="62" width="22" height="12" rx="3" fill="rgba(249,115,22,0.2)"/>
        <text x="45" y="71" textAnchor="middle" fontSize="7" fill="rgba(249,115,22,0.8)" fontFamily="sans-serif">CALL</text>
        <rect x="64" y="62" width="18" height="12" rx="3" fill="rgba(249,115,22,0.2)"/>
        <text x="73" y="71" textAnchor="middle" fontSize="7" fill="rgba(249,115,22,0.8)" fontFamily="sans-serif">ADS</text>
        <text x="45" y="87" textAnchor="middle" fontSize="9" fill="rgba(249,115,22,0.7)" fontFamily="sans-serif" fontWeight="600" letterSpacing="0.05em">roofY AI</text>
      </g>
      <g transform="translate(283,55)">
        <line x1="0" y1="0" x2="60" y2="0" stroke="url(#lg1)" strokeWidth="2" strokeDasharray="5 3"/>
        <polygon points="60,0 52,-4 52,4" fill="rgba(249,115,22,0.5)"/>
      </g>
      <g transform="translate(350,20)">
        <rect x="0" y="10" width="80" height="80" rx="16" fill="rgba(249,115,22,0.07)" stroke="rgba(249,115,22,0.2)" strokeWidth="1.5"/>
        <circle cx="40" cy="38" r="12" fill="rgba(249,115,22,0.15)" stroke="rgba(249,115,22,0.35)" strokeWidth="1.5"/>
        <circle cx="40" cy="35" r="5" fill="rgba(249,115,22,0.3)"/>
        <path d="M26,52 Q40,44 54,52" fill="rgba(249,115,22,0.2)" stroke="rgba(249,115,22,0.35)" strokeWidth="1.5"/>
        <circle cx="54" cy="28" r="8" fill="rgba(34,197,94,0.9)"/>
        <path d="M50,28 l3,3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <text x="40" y="77" textAnchor="middle" fontSize="9" fill="rgba(249,115,22,0.7)" fontFamily="sans-serif" fontWeight="600" letterSpacing="0.05em">BOOKED</text>
      </g>
      <g transform="translate(438,20)">
        <rect x="0" y="10" width="60" height="80" rx="16" fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5"/>
        <text x="30" y="52" textAnchor="middle" fontSize="28" fill="rgba(34,197,94,0.7)" fontFamily="serif">$</text>
        <text x="30" y="77" textAnchor="middle" fontSize="9" fill="rgba(34,197,94,0.7)" fontFamily="sans-serif" fontWeight="600" letterSpacing="0.05em">CLOSED</text>
      </g>
    </svg>
  );
});

const IllustrationViewsChart = memo(function IllustrationViewsChart() {
  const bars = [18,28,22,38,32,52,48,65,58,72,80,95];
  const max = 95;
  return (
    <svg width="100%" height="80" viewBox="0 0 280 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(249,115,22,0.7)"/>
          <stop offset="100%" stopColor="rgba(249,115,22,0.15)"/>
        </linearGradient>
      </defs>
      {bars.map((v,i)=>{
        const h = (v/max)*52;
        const x = 8+i*22;
        return <rect key={i} x={x} y={60-h} width="14" height={h} rx="3" fill="url(#barGrad)"/>;
      })}
      <polyline
        points={bars.map((v,i)=>`${15+i*22},${60-(v/max)*52}`).join(' ')}
        fill="none" stroke="rgba(249,115,22,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={15+11*22} cy={60-(95/max)*52} r="4" fill="rgba(249,115,22,0.9)"/>
      <text x="0" y="75" fontSize="8" fill="rgba(0,0,0,0.3)" fontFamily="sans-serif">Mon</text>
      <text x="230" y="75" fontSize="8" fill="rgba(0,0,0,0.3)" fontFamily="sans-serif">Sun</text>
      <text x="240" y="10" fontSize="9" fill="rgba(249,115,22,0.7)" fontFamily="sans-serif" fontWeight="700">+147%</text>
    </svg>
  );
});

const IllustrationClientFunnel = memo(function IllustrationClientFunnel() {
  return (
    <svg width="100%" height="140" viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[
        { label:"Website visitors", count:"1,200", w:280, color:"rgba(249,115,22,0.12)", border:"rgba(249,115,22,0.25)" },
        { label:"AI-qualified leads", count:"186", w:200, color:"rgba(249,115,22,0.18)", border:"rgba(249,115,22,0.35)" },
        { label:"Booked estimates", count:"64", w:130, color:"rgba(249,115,22,0.28)", border:"rgba(249,115,22,0.5)" },
        { label:"Closed jobs", count:"38", w:72, color:"rgba(249,115,22,0.45)", border:"rgba(249,115,22,0.7)" },
      ].map((s,i)=>(
        <g key={i} transform={`translate(${(280-s.w)/2+20},${i*30+4})`}>
          <rect width={s.w} height="22" rx="5" fill={s.color} stroke={s.border} strokeWidth="1"/>
          <text x={s.w/2} y="14" textAnchor="middle" fontSize="9" fill="rgba(60,30,10,0.75)" fontFamily="sans-serif" fontWeight="600">{s.label}</text>
          <text x={s.w-8} y="14" textAnchor="end" fontSize="9" fill="rgba(249,115,22,0.9)" fontFamily="sans-serif" fontWeight="700">{s.count}</text>
        </g>
      ))}
    </svg>
  );
});

const RoofYLogo = memo(function RoofYLogo({ size = 36 }: { size?: number }) {
  // roofY logo: roof glyph (triangle peak) + stylized Y
  const h = Math.round(size * 0.65);
  return (
    <svg width={size * 1.6} height={h} viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Roof peak icon */}
      <polygon points="8,58 34,20 60,58" fill="none" stroke="#111" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round"/>
      <line x1="20" y1="58" x2="48" y2="58" stroke="#111" strokeWidth="9" strokeLinecap="round"/>
      {/* r */}
      <line x1="72" y1="38" x2="72" y2="62" stroke="#111" strokeWidth="7.5" strokeLinecap="round"/>
      <path d="M72 46 Q80 36 90 40" stroke="#111" strokeWidth="7.5" fill="none" strokeLinecap="round"/>
      {/* o */}
      <rect x="95" y="38" width="18" height="24" rx="9" fill="none" stroke="#111" strokeWidth="7.5"/>
      {/* o */}
      <rect x="119" y="38" width="18" height="24" rx="9" fill="none" stroke="#111" strokeWidth="7.5"/>
      {/* f */}
      <line x1="146" y1="28" x2="146" y2="62" stroke="#111" strokeWidth="7.5" strokeLinecap="round"/>
      <path d="M140 42 L154 42" stroke="#111" strokeWidth="7" strokeLinecap="round"/>
      <path d="M146 28 Q152 22 158 26" stroke="#111" strokeWidth="7" fill="none" strokeLinecap="round"/>
      {/* Y — orange accent */}
      <line x1="168" y1="28" x2="178" y2="44" stroke={ORANGE} strokeWidth="8" strokeLinecap="round"/>
      <line x1="192" y1="28" x2="178" y2="44" stroke={ORANGE} strokeWidth="8" strokeLinecap="round"/>
      <line x1="178" y1="44" x2="178" y2="62" stroke={ORANGE} strokeWidth="8" strokeLinecap="round"/>
    </svg>
  );
});

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

// PERF: Removed filter:"blur(10px)" from Reveal — blur animations are extremely GPU-expensive.
// They force the browser to composite the element separately and re-blur every frame.
// Replaced with simpler opacity+y which runs on the compositor thread.
function Reveal({ children, delay=0, y=60, className, style }: {
  children:React.ReactNode; delay?:number; y?:number; className?:string; style?:React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity:0, y }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.75, ease:E, delay }}>
      {children}
    </motion.div>
  );
}

function MagBtn({ children, onClick, dark, href, orange }: {
  children:React.ReactNode; onClick?:()=>void; dark?:boolean; href?:string; orange?:boolean;
}) {
  // PERF: Removed useMotionValue/useSpring magnetic effect — was causing continuous re-renders
  // on every mouse move. Replaced with simple scale-only hover (much cheaper).
  const base: React.CSSProperties = orange
    ? { ...SF, background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`, boxShadow:"0 4px 20px rgba(249,115,22,0.35)", borderRadius:9999, border:"none", padding:"14px 32px", cursor:"pointer", display:"inline-block" }
    : dark
    ? { ...SF, background:"linear-gradient(135deg,#111,#2d2d2d)", boxShadow:"0 4px 20px rgba(0,0,0,0.25)", borderRadius:9999, border:"none", padding:"14px 32px", cursor:"pointer", display:"inline-block" }
    : { ...SF, background:"rgba(255,255,255,0.6)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.9)", boxShadow:"0 4px 20px rgba(0,0,0,0.07)", borderRadius:9999, padding:"14px 32px", cursor:"pointer", display:"inline-block" };
  const tc = (orange||dark) ? "text-white" : "text-gray-700";
  const inner = <span style={{display:"block"}} className={`text-sm font-semibold ${tc}`}>{children}</span>;
  if (href) return (
    <div style={base}>
      <motion.a href={href} target="_blank" rel="noopener noreferrer" whileHover={{scale:1.06}} whileTap={{scale:0.96}} style={{display:"block"}}>{inner}</motion.a>
    </div>
  );
  return (
    <div style={base}>
      <motion.button onClick={onClick} whileHover={{scale:1.06}} whileTap={{scale:0.96}}>{inner}</motion.button>
    </div>
  );
}

// PERF: GlowCard — throttled RAF, but also added touch check so mobile never runs it
function GlowCard({ children, className, style, hot }: {
  children:React.ReactNode; className?:string; style?:React.CSSProperties; hot?:boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [gp, setGp] = useState<{x:number,y:number}|null>(null);
  const rafRef = useRef<number>(0);
  // PERF: Skip glow entirely on touch/mobile devices
  const isTouch = useRef(typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches);
  const onMove = useCallback((e:React.MouseEvent)=>{
    if(isTouch.current || rafRef.current) return;
    rafRef.current = requestAnimationFrame(()=>{
      rafRef.current=0;
      if(!ref.current) return;
      const r=ref.current.getBoundingClientRect();
      setGp({x:e.clientX-r.left,y:e.clientY-r.top});
    });
  },[]);
  const onLeave = useCallback(()=>{ if(!isTouch.current) setGp(null); },[]);
  const glowBg = gp ? `radial-gradient(320px circle at ${gp.x}px ${gp.y}px, rgba(249,115,22,0.13), transparent 70%)` : "none";
  return (
    <motion.div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{...style, position:"relative", overflow:"hidden"}}
      whileHover={{y:-8, boxShadow: hot ? "0 28px 70px rgba(249,115,22,0.25)" : "0 28px 70px rgba(249,115,22,0.08)"}}
      transition={{duration:0.3,ease:E}}>
      {gp && <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:1,background:glowBg}}/>}
      <div style={{position:"relative",zIndex:2}}>{children}</div>
    </motion.div>
  );
}

// PERF: CustomCursor — disabled on touch, only runs on fine-pointer devices
// Added cleanup for event listener and RAF
function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [isTouch, setIsTouch] = useState(true);
  const target  = useRef({x:-200,y:-200});
  const current = useRef({x:-200,y:-200});
  const rafId   = useRef<number>(0);
  useEffect(()=>{
    if(!window.matchMedia("(pointer: fine)").matches) return;
    setIsTouch(false);
    const loop=()=>{
      current.current.x+=(target.current.x-current.current.x)*0.12;
      current.current.y+=(target.current.y-current.current.y)*0.12;
      if(ringRef.current) ringRef.current.style.transform=`translate(${current.current.x-(hover?22:14)}px,${current.current.y-(hover?22:14)}px)`;
      rafId.current=requestAnimationFrame(loop);
    };
    const onMove=(e:MouseEvent)=>{
      target.current={x:e.clientX,y:e.clientY};
      if(dotRef.current) dotRef.current.style.transform=`translate(${e.clientX-2.5}px,${e.clientY-2.5}px)`;
      setHover(!!(e.target as HTMLElement).closest("button,a,[data-hover]"));
    };
    rafId.current=requestAnimationFrame(loop);
    window.addEventListener("mousemove",onMove,{passive:true});
    return()=>{ cancelAnimationFrame(rafId.current); window.removeEventListener("mousemove",onMove); };
  },[hover]);
  if(isTouch) return null;
  return (
    <>
      <div ref={ringRef} style={{position:"fixed",top:0,left:0,pointerEvents:"none",zIndex:9998,borderRadius:"50%",border:`1.5px solid rgba(249,115,22,0.55)`,width:hover?44:28,height:hover?44:28,transition:"width .25s,height .25s",willChange:"transform"}}/>
      <div ref={dotRef} style={{position:"fixed",top:0,left:0,pointerEvents:"none",zIndex:9999,width:5,height:5,borderRadius:"50%",background:ORANGE,willChange:"transform"}}/>
    </>
  );
}

function DrawLine({ className }: { className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} className={className}
      style={{ height:1, background:"linear-gradient(to right,transparent,rgba(249,115,22,0.45),transparent)", transformOrigin:"left" }}
      initial={{ scaleX:0, opacity:0 }}
      animate={inView ? { scaleX:1, opacity:1 } : {}}
      transition={{ duration:1.5, ease:E }}/>
  );
}

// ─── NAV — memoized so it doesn't re-render on page state changes ─────────────
const Nav = memo(function Nav({ current, goto }: { current:Page; goto:(p:Page)=>void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links: [string,Page][] = [["Services","services"],["Pricing","pricing"],["About","about"],["Contact","contact"]];
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>40);
    window.addEventListener("scroll",fn,{passive:true});
    return()=>window.removeEventListener("scroll",fn);
  },[]);
  const pill: React.CSSProperties = {
    background: scrolled?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.7)",
    backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
    border:"1px solid rgba(255,255,255,0.9)", transition:"background .4s",
  };
  return (
    <>
      <motion.div initial={{opacity:0,y:-24}} animate={{opacity:1,y:0}} transition={{duration:0.9,ease:E}}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-max">
        <nav className="hidden md:flex items-center gap-1 px-2 py-2 rounded-full"
          style={{...pill, boxShadow:"0 8px 40px rgba(0,0,0,0.07),0 1px 0 rgba(255,255,255,0.95) inset"}}>
          <motion.button onClick={()=>goto("home")} whileHover={{scale:1.07}} whileTap={{scale:0.93}}
            className="flex items-center px-2 py-1.5 rounded-full" style={{background:"rgba(255,255,255,0.5)"}}>
            <RoofYLogo size={34}/>
          </motion.button>
          <div style={{width:1,height:20,background:"rgba(0,0,0,0.09)",margin:"0 4px"}}/>
          {links.map(([label,page])=>(
            <motion.button key={page} onClick={()=>goto(page)} whileHover={{scale:1.05}} whileTap={{scale:0.96}}
              style={current===page
                ? {...SF,background:"rgba(255,255,255,0.92)",boxShadow:"0 2px 10px rgba(0,0,0,0.08)",borderRadius:9999,padding:"8px 16px"}
                : {...SF,background:"transparent",borderRadius:9999,padding:"8px 16px"}}
              className={`text-sm font-medium transition-all ${current===page?"text-gray-900":"text-gray-500 hover:text-gray-900"}`}>
              {label}
            </motion.button>
          ))}
          <div style={{width:1,height:20,background:"rgba(0,0,0,0.09)",margin:"0 4px"}}/>
          <motion.button onClick={()=>{ trackLead(); goto("contact"); }}
            whileHover={{scale:1.07,boxShadow:"0 8px 28px rgba(249,115,22,0.4)"}} whileTap={{scale:0.95}}
            style={{...SF,background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`,boxShadow:"0 3px 14px rgba(249,115,22,0.3)",borderRadius:9999,padding:"10px 20px",border:"none"}}
            className="text-sm font-semibold text-white">Get started</motion.button>
        </nav>
        <nav className="flex md:hidden items-center gap-3 px-4 py-2.5 rounded-full"
          style={{...pill,boxShadow:"0 6px 28px rgba(0,0,0,0.08)"}}>
          <button onClick={()=>goto("home")}><RoofYLogo size={28}/></button>
          <div className="flex-1"/>
          <button onClick={()=>setOpen(!open)} className="flex flex-col gap-1.5 p-1">
            <motion.span animate={{rotate:open?45:0,y:open?6:0}} className="block h-0.5 w-5 bg-gray-800 origin-center"/>
            <motion.span animate={{opacity:open?0:1}} className="block h-0.5 w-5 bg-gray-800"/>
            <motion.span animate={{rotate:open?-45:0,y:open?-6:0}} className="block h-0.5 w-5 bg-gray-800 origin-center"/>
          </button>
        </nav>
      </motion.div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:-12,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-12,scale:0.95}}
            transition={{duration:0.22,ease:E}}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[min(320px,90vw)] rounded-3xl md:hidden"
            style={{background:"rgba(255,255,255,0.92)",backdropFilter:"blur(28px)",border:"1px solid rgba(255,255,255,0.95)",boxShadow:"0 24px 64px rgba(0,0,0,0.1)"}}>
            <div className="p-3 flex flex-col gap-1">
              {links.map(([label,page])=>(
                <motion.button key={page} onClick={()=>{ goto(page); setOpen(false); }} style={SF} whileHover={{x:6}}
                  className="text-left px-4 py-3 rounded-2xl text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900 transition-colors">{label}</motion.button>
              ))}
              <div className="my-1.5 h-px" style={{background:"rgba(0,0,0,0.06)"}}/>
              <motion.button onClick={()=>{ trackLead(); goto("contact"); setOpen(false); }} whileTap={{scale:0.97}}
                style={{...SF,background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`,borderRadius:16,border:"none",padding:"12px 16px"}}
                className="text-sm font-semibold text-white text-center">Get started</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

const Footer = memo(function Footer({ goto }: { goto:(p:Page)=>void }) {
  return (
    <footer style={{borderTop:"1px solid rgba(0,0,0,0.07)",background:"rgba(255,255,255,0.55)",backdropFilter:"blur(24px)"}}>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr] mb-12">
          <div>
            <div className="mb-5"><RoofYLogo size={44}/></div>
            <p style={SF} className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">AI-powered lead generation and automation for roofing contractors — 24/7 call answering, instant follow-ups, and Meta ads that close roofing jobs.</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                {href:"https://www.instagram.com/roofy.ai",label:"@roofy.ai"},
                {href:"https://www.facebook.com/profile.php?id=61585053252637",label:"Facebook"},
              ].map(s=>(
                <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  whileHover={{scale:1.05,y:-2}} whileTap={{scale:0.96}}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  style={{background:"rgba(255,255,255,0.7)",backdropFilter:"blur(8px)",border:"1px solid rgba(0,0,0,0.08)"}}>
                  <span style={SF}>{s.label}</span>
                </motion.a>
              ))}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)"}}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"/>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"/>
              </span>
              <span style={SF} className="text-xs font-medium text-emerald-700">All systems operational</span>
            </div>
          </div>
          {[
            {title:"Product",links:[{l:"Services",p:"services"},{l:"Pricing",p:"pricing"}]},
            {title:"Company",links:[{l:"About",p:"about"},{l:"Contact",p:"contact"}]},
            {title:"Legal",  links:[{l:"Privacy",p:"home"},{l:"Terms",p:"home"}]},
          ].map(col=>(
            <div key={col.title}>
              <p style={SF} className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">{col.title}</p>
              <div className="flex flex-col gap-2.5">
                {col.links.map(lnk=>(
                  <motion.button key={lnk.l} onClick={()=>goto(lnk.p as Page)} style={SF} whileHover={{x:4}}
                    className="w-fit text-sm text-gray-500 hover:text-gray-900 transition-colors">{lnk.l}</motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 pt-8 md:flex-row md:items-center md:justify-between" style={{borderTop:"1px solid rgba(0,0,0,0.06)"}}>
          <p style={SF} className="text-xs text-gray-400">© {new Date().getFullYear()} roofY. All rights reserved.</p>
          <p style={SF} className="text-xs text-gray-400">Built by <span className="text-gray-600">Michael Brito</span> & <span className="text-gray-600">Badre Elkhammal</span></p>
        </div>
      </div>
    </footer>
  );
});

// ─── CHAT DEMO ────────────────────────────────────────────────────────────────
function ChatDemo() {
  const INIT: Msg = {role:"ai",text:"Hi! I'm the roofY AI assistant. Are you a homeowner looking for roofing help, or do you run a roofing company?"};
  const [msgs,setMsgs] = useState<Msg[]>([INIT]);
  const [input,setInput] = useState("");
  const [typing,setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);
  const send = async()=>{
    const text=input.trim(); if(!text||typing) return;
    setInput("");
    const updated=[...msgs,{role:"user" as const,text}];
    setMsgs(updated); setTyping(true);
    try {
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:updated.map(m=>({role:m.role==="ai"?"assistant":"user",content:m.text}))})});
      const data=await res.json();
      setMsgs(m=>[...m,{role:"ai",text:data.reply||"Sorry, something went wrong."}]);
    } catch { setMsgs(m=>[...m,{role:"ai",text:"Sorry, I couldn't connect. Please try again."}]); }
    finally { setTyping(false); }
  };
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-4" style={{borderBottom:"1px solid rgba(0,0,0,0.06)"}}>
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full text-white text-xs font-bold"
          style={{background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`}}>
          AI<span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400"/>
        </div>
        <div>
          <p style={SF} className="text-sm font-semibold text-gray-900">Riley — roofY AI</p>
          <p style={SF} className="text-xs text-emerald-600">Online · responds instantly</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        <AnimatePresence>
          {msgs.map((m,i)=>(
            <motion.div key={i} initial={{opacity:0,y:14,scale:0.94}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.35,ease:E}}
              className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
              <div style={{...SF,...(m.role==="user"?{background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`}:{background:"rgba(0,0,0,0.04)",border:"1px solid rgba(0,0,0,0.06)"})}}
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role==="user"?"rounded-br-sm text-white":"rounded-bl-sm text-gray-700"}`}>{m.text}</div>
            </motion.div>
          ))}
          {typing && (
            <motion.div key="t" initial={{opacity:0,scale:0.94}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm px-4 py-3" style={{background:"rgba(0,0,0,0.04)",border:"1px solid rgba(0,0,0,0.06)"}}>
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gray-400 block"/>
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gray-400 block"/>
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gray-400 block"/>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef}/>
      </div>
      <div className="p-4 flex gap-2" style={{borderTop:"1px solid rgba(0,0,0,0.06)"}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }}
          placeholder="Type a message..." disabled={typing}
          style={{...SF,background:"rgba(0,0,0,0.04)",border:"1px solid rgba(0,0,0,0.08)"}}
          className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition disabled:opacity-50"/>
        <motion.button onClick={send} disabled={typing||!input.trim()} whileHover={{scale:1.06}} whileTap={{scale:0.94}}
          style={{...SF,background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`,borderRadius:12,border:"none",padding:"10px 16px"}}
          className="text-sm font-semibold text-white disabled:opacity-40">Send</motion.button>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q:string; a:string }) {
  const [open,setOpen] = useState(false);
  return (
    <motion.div className="py-5" style={{borderBottom:"1px solid rgba(0,0,0,0.06)"}}>
      <motion.button onClick={()=>setOpen(!open)} whileHover={{x:3}} className="flex w-full items-center justify-between gap-4 text-left">
        <span style={{...IF,fontStyle:"italic"}} className="text-lg text-gray-800">{q}</span>
        <motion.span animate={{rotate:open?45:0,color:open?ORANGE:"#9ca3af"}} transition={{duration:0.25}} className="flex-shrink-0 text-2xl font-light">+</motion.span>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.38,ease:E}} className="overflow-hidden">
            <p style={SF} className="mt-4 text-sm leading-relaxed text-gray-500">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── PRICING CARD ─────────────────────────────────────────────────────────────
function PricingCard({ plan, annual, goto }: { plan: typeof PLANS[0]; annual: boolean; goto:(p:Page)=>void }) {
  const getPrice = () => {
    if (plan.commissionOnly || plan.custom) return null;
    return annual ? Math.round(plan.price * 0.8) : plan.price;
  };
  const displayedPrice = getPrice();
  const annualSaving = (!plan.commissionOnly && !plan.custom && annual) ? plan.price - Math.round(plan.price * 0.8) : 0;

  if (plan.fullBundle) {
    const bundleFeatures = [
      { text:"AI Lead Generation Ads (Facebook & Instagram)" },
      { text:"AI-powered roofing website" },
      { text:"AI phone receptionist — 24/7" },
      { text:"WhatsApp, SMS & web chat AI" },
      { text:"Automated follow-up sequences" },
      { text:"Lead tracking dashboard" },
      { text:"Priority support" },
      { text:"+10% per closed deal" },
    ];
    return (
      <Reveal y={40}>
        <motion.div style={{
          background:"linear-gradient(135deg,#111 0%,#1c1c1c 100%)",
          border:`2px solid ${ORANGE}`,borderRadius:20,padding:"32px",paddingTop:42,
          position:"relative",
          boxShadow:`0 0 60px rgba(249,115,22,0.18)`,
        }} whileHover={{boxShadow:`0 32px 80px rgba(249,115,22,0.3)`}}
        transition={{duration:0.38}}>
          <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:`linear-gradient(rgba(249,115,22,1) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,1) 1px,transparent 1px)`,backgroundSize:"40px 40px"}}/>
          <motion.div className="badge-pulse" initial={{scale:0,rotate:-10}} animate={{scale:1,rotate:0}} transition={{delay:0.5,type:"spring"}}
            style={{position:"absolute",top:-14,left:32,...SF,background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`,padding:"5px 18px",borderRadius:9999,fontSize:11,fontWeight:700,color:"white"}}>
            Best Value — With Ads
          </motion.div>
          <div style={{position:"relative",zIndex:2,display:"grid",gap:28}} className="md:grid-cols-[1fr_1.4fr]">
            <div>
              <p style={{...SF,color:ORANGE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginTop:12,marginBottom:6}}>{plan.n}</p>
              <h2 style={{...IF,fontStyle:"italic",color:"white",fontSize:28,lineHeight:1.1,marginBottom:10}}>Full AI System<br/>+ Lead Gen Ads</h2>
              <p style={{...SF,color:"rgba(255,255,255,0.5)",fontSize:13,lineHeight:1.7,marginBottom:18}}>{plan.desc}</p>
              <div style={{marginBottom:16}}>
                <p style={{...SF,color:"rgba(255,255,255,0.35)",fontSize:11}}>{plan.setupDisplay}</p>
                <AnimatePresence mode="wait">
                  <motion.div key={annual?"annual":"monthly"} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.2}}>
                    <p style={{...IF,fontStyle:"italic",color:"white",fontSize:42,lineHeight:1}}>
                      {annual ? `$${(Math.round(plan.price*0.8)).toLocaleString()}` : `$${plan.price.toLocaleString()}`}
                      <span style={{...SF,fontSize:16,color:"rgba(255,255,255,0.4)",fontStyle:"normal"}}>/mo</span>
                    </p>
                    {plan.commission && (
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,background:ORANGE_LIGHT,border:`1px solid ${ORANGE_BORDER}`,borderRadius:9999,padding:"3px 10px",marginTop:6}}>
                      <span style={{...SF,color:ORANGE,fontSize:11,fontWeight:700}}>◆ {plan.commission}</span>
                    </div>
                    )}
                    {annual && <p style={{...SF,color:"rgba(249,115,22,0.8)",fontSize:11,marginTop:6,fontWeight:600}}>Save ${annualSaving.toLocaleString()}/mo with annual</p>}
                  </motion.div>
                </AnimatePresence>
              </div>
              <MagBtn orange onClick={()=>{ trackLead(); goto("contact"); }}>Get the full system →</MagBtn>
              <div style={{marginTop:20,borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:16,display:"flex",flexDirection:"column",gap:8}} className="md:hidden">
                {bundleFeatures.map(f=>(
                  <div key={f.text} style={{display:"flex",alignItems:"center",gap:10}}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{flexShrink:0}}><path d="M2 5l2.5 2.5L8 3" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{...SF,color:"rgba(255,255,255,0.7)",fontSize:12,lineHeight:1.5}}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{borderLeft:"1px solid rgba(255,255,255,0.07)",paddingLeft:24}} className="hidden md:flex md:flex-col md:justify-center">
              <p style={{...SF,color:"rgba(255,255,255,0.3)",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:16}}>Everything included</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {bundleFeatures.map(f=>(
                  <motion.div key={f.text} style={{display:"flex",alignItems:"center",gap:10}} whileHover={{x:5}}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{flexShrink:0}}><path d="M2 5l2.5 2.5L8 3" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{...SF,color:"rgba(255,255,255,0.75)",fontSize:13,lineHeight:1.5}}>{f.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </Reveal>
    );
  }

  if ((plan as any).fullSystem) {
    const systemFeatures = [
      "AI-powered roofing website",
      "AI phone receptionist — 24/7",
      "WhatsApp, SMS & web chat AI",
      "Automated follow-up sequences",
      "Lead qualification AI",
      "Lead tracking dashboard",
      "Priority support",
    ];
    const dp = annual ? Math.round(plan.price*0.8) : plan.price;
    const saving = annual ? plan.price - Math.round(plan.price*0.8) : 0;
    return (
      <Reveal y={40}>
        <div style={{position:"relative",paddingTop:16}}>
          <motion.div className="badge-pulse" initial={{scale:0,rotate:-10}} animate={{scale:1,rotate:0}} transition={{delay:0.4,type:"spring"}}
            style={{position:"absolute",top:0,left:32,zIndex:10,...SF,background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`,padding:"5px 18px",borderRadius:9999,fontSize:11,fontWeight:700,color:"white"}}>
            Most Popular
          </motion.div>
          <motion.div style={{
            background:"linear-gradient(135deg,#1a0e00 0%,#2d1500 100%)",
            border:`2px solid ${ORANGE}`,borderRadius:20,padding:"32px",
            position:"relative",overflow:"hidden",
            boxShadow:`0 0 50px rgba(249,115,22,0.2)`,
          }} whileHover={{boxShadow:`0 32px 80px rgba(249,115,22,0.28)`}}
          transition={{duration:0.38}}>
            <div style={{position:"absolute",inset:0,opacity:0.05,backgroundImage:`linear-gradient(rgba(249,115,22,1) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,1) 1px,transparent 1px)`,backgroundSize:"40px 40px"}}/>
            <div style={{position:"relative",zIndex:2,display:"grid",gap:28}} className="md:grid-cols-[1fr_1.4fr]">
              <div>
                <p style={{...SF,color:ORANGE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>{plan.n}</p>
                <h2 style={{...IF,fontStyle:"italic",color:"white",fontSize:28,lineHeight:1.1,marginBottom:10}}>Full AI System</h2>
                <p style={{...SF,color:"rgba(255,255,255,0.5)",fontSize:13,lineHeight:1.7,marginBottom:18}}>{plan.desc}</p>
                <div style={{marginBottom:16}}>
                  <p style={{...SF,color:"rgba(255,255,255,0.35)",fontSize:11}}>{plan.setupDisplay}</p>
                  <AnimatePresence mode="wait">
                    <motion.div key={annual?"a":"m"} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.2}}>
                      <p style={{...IF,fontStyle:"italic",color:"white",fontSize:42,lineHeight:1}}>
                        ${dp.toLocaleString()}<span style={{...SF,fontSize:16,color:"rgba(255,255,255,0.4)",fontStyle:"normal"}}>/mo</span>
                      </p>
                      {annual && <p style={{...SF,color:"rgba(249,115,22,0.8)",fontSize:11,marginTop:6,fontWeight:600}}>Save ${saving.toLocaleString()}/mo with annual</p>}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <MagBtn orange onClick={()=>{ trackLead(); goto("contact"); }}>Get started →</MagBtn>
                <div style={{marginTop:20,borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:16,display:"flex",flexDirection:"column",gap:8}} className="md:hidden">
                  {systemFeatures.map(f=>(
                    <div key={f} style={{display:"flex",alignItems:"center",gap:10}}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{flexShrink:0}}><path d="M2 5l2.5 2.5L8 3" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span style={{...SF,color:"rgba(255,255,255,0.7)",fontSize:12,lineHeight:1.5}}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{borderLeft:"1px solid rgba(255,255,255,0.07)",paddingLeft:24}} className="hidden md:flex md:flex-col md:justify-center">
                <p style={{...SF,color:"rgba(255,255,255,0.3)",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:16}}>What's included</p>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {systemFeatures.map(f=>(
                    <motion.div key={f} style={{display:"flex",alignItems:"center",gap:10}} whileHover={{x:5}}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{flexShrink:0}}><path d="M2 5l2.5 2.5L8 3" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span style={{...SF,color:"rgba(255,255,255,0.75)",fontSize:13,lineHeight:1.5}}>{f}</span>
                    </motion.div>
                  ))}
                </div>
                <div style={{marginTop:16,padding:"10px 14px",background:"rgba(249,115,22,0.08)",border:`1px solid ${ORANGE_BORDER}`,borderRadius:10}}>
                  <p style={{...SF,color:ORANGE,fontSize:11,fontWeight:700,marginBottom:2}}>No ads included</p>
                  <p style={{...SF,color:"rgba(255,255,255,0.4)",fontSize:11,lineHeight:1.5}}>Want Meta ads too? See the Full AI System + Lead Gen Ads plan below.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Reveal>
    );
  }

  if (plan.commissionOnly) {
    return (
      <Reveal y={55} delay={0}>
        <GlowCard className="rounded-2xl flex flex-col relative cursor-default h-full"
          style={{background:"linear-gradient(135deg,#0f0f0f,#1a1a1a)",border:`1.5px solid rgba(16,185,129,0.35)`,
            boxShadow:"0 0 40px rgba(16,185,129,0.07)"}}>
          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.3,type:"spring"}}
            style={{position:"absolute",top:10,right:16,...SF,background:"linear-gradient(135deg,#10b981,#059669)",padding:"4px 14px",borderRadius:9999,fontSize:11,fontWeight:700,color:"white",zIndex:3}}>
            Zero Risk
          </motion.div>
          <div style={{position:"relative",height:100,overflow:"hidden",background:"rgba(16,185,129,0.05)",borderBottom:"1px solid rgba(16,185,129,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{position:"absolute",inset:0,opacity:0.06,backgroundImage:`linear-gradient(rgba(16,185,129,1) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,1) 1px,transparent 1px)`,backgroundSize:"20px 20px"}}/>
            <svg width="240" height="72" viewBox="0 0 240 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="18" y="42" style={{fontFamily:"'Instrument Serif',serif",fontStyle:"italic"}} fontSize="26" fill="rgba(16,185,129,0.6)" fontWeight="400">$0</text>
              <text x="18" y="56" fontSize="9" fill="rgba(255,255,255,0.2)" fontFamily="sans-serif" fontWeight="600" letterSpacing="0.08em">UPFRONT</text>
              <path d="M72 36h18m-6-6l6 6-6 6" stroke="rgba(16,185,129,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <text x="165" y="38" style={{fontFamily:"'Instrument Serif',serif",fontStyle:"italic"}} fontSize="22" fill="rgba(16,185,129,0.6)" fontWeight="400">13%</text>
              <text x="165" y="52" fontSize="9" fill="rgba(255,255,255,0.2)" fontFamily="sans-serif" fontWeight="600" letterSpacing="0.08em">ON CLOSE</text>
            </svg>
          </div>
          <div style={{padding:"20px 24px 24px",display:"flex",flexDirection:"column",flex:1}}>
            <p style={{...SF,color:"rgba(16,185,129,0.7)",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:4}}>{plan.n}</p>
            <h3 style={{...IF,fontStyle:"italic",color:"white",fontSize:19,lineHeight:1.15,marginBottom:6}}>{plan.title}</h3>
            <p style={{...SF,color:"rgba(255,255,255,0.45)",fontSize:11,lineHeight:1.6,marginBottom:14}}>{plan.desc}</p>
            <div style={{marginBottom:14}}>
              <p style={{...SF,color:"rgba(255,255,255,0.25)",fontSize:10}}>No setup fee</p>
              <p style={{...IF,fontStyle:"italic",color:"white",fontSize:30,lineHeight:1.1}}>$0<span style={{...SF,fontSize:13,color:"rgba(255,255,255,0.3)",fontStyle:"normal"}}>/mo</span></p>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:9999,padding:"3px 10px",marginTop:6}}>
                <span style={{...SF,color:"#10b981",fontSize:11,fontWeight:700}}>◆ {plan.commission}</span>
              </div>
            </div>
            <div style={{background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.15)",borderRadius:10,padding:"10px 12px",marginBottom:14}}>
              <p style={{...SF,color:"rgba(16,185,129,0.9)",fontSize:11,fontWeight:700,marginBottom:4}}>How it works</p>
              <p style={{...SF,color:"rgba(255,255,255,0.4)",fontSize:11,lineHeight:1.6}}>We run your full AI system at zero cost. You pay <strong style={{color:"rgba(255,255,255,0.65)"}}>13% only when a deal closes</strong>. After your first client, you move to the $399/mo plan.</p>
            </div>
            <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:10,display:"flex",flexDirection:"column",gap:5,flex:1}}>
              {plan.features.map(f=>(
                <div key={f} style={{...SF,display:"flex",alignItems:"center",gap:8,fontSize:11,color:"rgba(255,255,255,0.55)"}}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </div>
              ))}
            </div>
            <motion.button onClick={()=>{ trackLead(); goto("contact"); }} whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.96}}
              style={{...SF,marginTop:14,width:"100%",background:"linear-gradient(135deg,#10b981,#059669)",borderRadius:10,border:"none",padding:"11px",fontSize:13,fontWeight:700,color:"white",cursor:"pointer",boxShadow:"0 4px 16px rgba(16,185,129,0.3)"}}>
              Start for free
            </motion.button>
          </div>
        </GlowCard>
      </Reveal>
    );
  }

  const isMetaAds = plan.id === "meta-ads";
  return (
    <Reveal y={55} delay={0.08}>
      <div style={{position:"relative", paddingTop: plan.custom ? 16 : 0}}>
        {plan.custom && (
          <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",zIndex:10,...SF,background:"#111",color:"white",padding:"4px 14px",borderRadius:9999,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>Bespoke</div>
        )}
      <GlowCard className="rounded-2xl flex flex-col relative cursor-default h-full"
        style={{background:"rgba(255,255,255,0.68)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.9)",overflow:"hidden"}}>
        {isMetaAds && (
          <div style={{height:76,background:"linear-gradient(135deg,rgba(249,115,22,0.05),rgba(234,88,12,0.02))",borderBottom:"1px solid rgba(249,115,22,0.09)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:`linear-gradient(rgba(249,115,22,1) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,1) 1px,transparent 1px)`,backgroundSize:"18px 18px"}}/>
            <svg width="220" height="52" viewBox="0 0 220 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="3" width="34" height="46" rx="5" stroke="rgba(249,115,22,0.35)" strokeWidth="1.5" fill="rgba(249,115,22,0.04)"/>
              <rect x="10" y="9" width="26" height="18" rx="2" fill="rgba(249,115,22,0.1)"/>
              <rect x="10" y="39" width="26" height="6" rx="3" fill="rgba(249,115,22,0.28)"/>
              <circle cx="88" cy="26" r="13" stroke="rgba(249,115,22,0.28)" strokeWidth="1.5"/>
              <circle cx="88" cy="26" r="3" fill="rgba(249,115,22,0.65)"/>
              <circle cx="145" cy="26" r="15" stroke="rgba(249,115,22,0.25)" strokeWidth="1.5" fill="rgba(249,115,22,0.04)"/>
              <text x="138" y="31" fontSize="15" fill="rgba(249,115,22,0.65)" fontFamily="serif">$</text>
              <rect x="174" y="38" width="5" height="10" rx="1" fill="rgba(249,115,22,0.28)"/>
              <rect x="181" y="30" width="5" height="18" rx="1" fill="rgba(249,115,22,0.42)"/>
              <rect x="188" y="22" width="5" height="26" rx="1" fill="rgba(249,115,22,0.56)"/>
              <rect x="195" y="14" width="5" height="34" rx="1" fill="rgba(249,115,22,0.7)"/>
              <rect x="202" y="6" width="5" height="42" rx="1" fill="rgba(249,115,22,0.85)"/>
            </svg>
          </div>
        )}
        <div style={{padding:"20px 24px 24px",display:"flex",flexDirection:"column",flex:1}}>
          <p style={{...SF,color:ORANGE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:4}}>{plan.n}</p>
          <h3 style={{...IF,fontStyle:"italic"}} className="text-xl text-gray-900 mb-2">{plan.title}</h3>
          <p style={SF} className="text-sm text-gray-500 mb-4 leading-relaxed">{plan.desc}</p>
          {isMetaAds && (
            <div style={{background:"rgba(249,115,22,0.05)",border:`1px solid ${ORANGE_BORDER}`,borderRadius:10,padding:"10px 12px",marginBottom:12}}>
              <p style={{...SF,color:ORANGE,fontSize:11,fontWeight:700,marginBottom:4}}>How it works</p>
              <p style={{...SF,color:"#6b7280",fontSize:11,lineHeight:1.6}}>We build and manage your Facebook & Instagram campaigns targeting storm damage, roof replacement, and inspection leads in your area. Creatives, audiences, and optimization — all handled weekly.</p>
            </div>
          )}
          <div style={{marginBottom:14}}>
            {plan.custom ? (
              <>
                <p style={{...IF,fontStyle:"italic"}} className="text-3xl text-gray-900">Tailored</p>
                <p style={SF} className="text-xs text-gray-400 mt-1">Quoted per scope</p>
              </>
            ) : (
              <>
                <p style={SF} className="text-xs text-gray-400">{plan.setupDisplay}</p>
                <AnimatePresence mode="wait">
                  <motion.div key={annual?"a":"m"} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:0.2}}>
                    <p style={{...IF,fontStyle:"italic"}} className="text-3xl text-gray-900">
                      ${displayedPrice?.toLocaleString()}<span style={SF} className="text-base font-normal text-gray-400">/mo</span>
                    </p>
                    {plan.commission && (
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,background:ORANGE_LIGHT,border:`1px solid ${ORANGE_BORDER}`,borderRadius:9999,padding:"3px 10px",marginTop:6}}>
                      <span style={{...SF,color:ORANGE,fontSize:11,fontWeight:700}}>◆ {plan.commission}</span>
                    </div>
                    )}
                    {annual && annualSaving > 0 && (
                      <p style={SF} className="text-xs font-medium mt-2 text-emerald-600">Saving ${annualSaving}/mo</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>
          <ul style={{borderTop:"1px solid rgba(0,0,0,0.06)",paddingTop:"1.25rem"}} className="mb-5 space-y-2.5 flex-1">
            {plan.features.map(f=>(
              <motion.li key={f} style={SF} className="flex items-start gap-2 text-sm text-gray-600" whileHover={{x:5}}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{flexShrink:0,marginTop:3}}><path d="M2 6l3 3 5-5" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>{f}
              </motion.li>
            ))}
          </ul>
          <motion.button onClick={()=>{ trackLead(); goto("contact"); }} whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.96}}
            style={{...SF,background:plan.hot?`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`:"rgba(255,255,255,0.65)",backdropFilter:"blur(8px)",border:plan.hot?"none":"1px solid rgba(0,0,0,0.09)",borderRadius:12,padding:12,boxShadow:plan.hot?"0 4px 18px rgba(249,115,22,0.35)":undefined}}
            className={`w-full text-sm font-semibold ${plan.hot?"text-white":"text-gray-700"}`}>
            {plan.custom?"Request a quote":"Get started"}
          </motion.button>
        </div>
      </GlowCard>
      </div>
    </Reveal>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────
function HomePage({ goto }: { goto:(p:Page)=>void }) {
  const heroRef = useRef<HTMLElement>(null);
  const {scrollYProgress} = useScroll({target:heroRef,offset:["start start","end start"]});
  // PERF: Reduced parallax transforms — fewer simultaneous transforms = less compositor work
  const heroY = useTransform(scrollYProgress,[0,1],["0%","18%"]);
  const heroO = useTransform(scrollYProgress,[0,0.72],[1,0]);

  return (
    <>
      <section ref={heroRef} className="relative px-6 overflow-hidden"
        style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",paddingTop:"10rem",paddingBottom:"7rem",position:"relative",zIndex:4}}>
        <motion.div style={{y:heroY,opacity:heroO,position:"relative",zIndex:4}} className="mx-auto max-w-5xl text-center">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,ease:E}}>
            <motion.span style={{...SF,color:ORANGE,background:ORANGE_LIGHT,border:`1px solid ${ORANGE_BORDER}`}}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8"
              whileHover={{scale:1.06}}>
              <motion.span animate={{rotate:[0,360]}} transition={{duration:8,repeat:Infinity,ease:"linear"}}>✦</motion.span>
              AI Automation for Roofing Contractors
            </motion.span>
          </motion.div>
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.6,duration:0.8,ease:E}}
            className="absolute right-8 top-20 hidden lg:block" style={{zIndex:3}}>
            <RoofHouseIllustration size={170}/>
          </motion.div>
          <h1 style={{...IF,fontStyle:"italic",fontSize:"clamp(50px,8vw,112px)",lineHeight:1.15}} className="text-gray-900 tracking-tight mb-6">
            <motion.span style={{display:"block",paddingBottom:"0.05em"}}
              initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.55,ease:E,delay:0.05}}>
              More leads.
            </motion.span>
            <span style={{display:"block",paddingBottom:"0.15em"}}>
              <motion.span style={{display:"inline-block",marginRight:"0.2em"}} initial={{y:28}} animate={{y:0}} transition={{duration:0.55,ease:E,delay:0.15}}>
                <span className="shimmer-text">Zero</span>
              </motion.span>
              <motion.span style={{display:"inline-block"}} initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.55,ease:E,delay:0.22}}>
                missed calls.
              </motion.span>
            </span>
          </h1>
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.9,ease:E,delay:0.75}}
            style={{...IF,fontStyle:"italic",fontSize:"clamp(18px,2.2vw,28px)"}} className="text-gray-400 mb-4">AI automation built exclusively for roofing companies.</motion.p>
          <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.8,ease:E,delay:0.88}}
            style={SF} className="text-base text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10">
            <span style={{color:ORANGE}}>roofY</span> builds AI systems that answer every call, respond to every lead, run your Meta ads, and follow up automatically — so your roofing company never loses a job to slow response time.
          </motion.p>
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.8,ease:E,delay:1}} className="flex flex-wrap items-center justify-center gap-4">
            <MagBtn orange onClick={()=>goto("pricing")}>See pricing</MagBtn>
            <MagBtn dark onClick={()=>{ trackLead(); goto("contact"); }}>Contact us</MagBtn>
            <motion.button onClick={()=>document.getElementById("demo-section")?.scrollIntoView({behavior:"smooth"})}
              whileHover={{scale:1.06,y:-3}} whileTap={{scale:0.96}}
              style={{...SF,background:ORANGE_LIGHT,border:`1px solid ${ORANGE_BORDER}`,color:ORANGE,borderRadius:9999,padding:"14px 32px"}}
              className="text-sm font-semibold">Try our AI ↓</motion.button>
          </motion.div>
          <motion.div className="flex flex-col items-center mt-20" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8}}>
            <div className="scroll-cue" style={{width:1,height:48,background:`linear-gradient(to bottom,rgba(249,115,22,0.7),transparent)`}}/>
          </motion.div>
        </motion.div>

        <motion.div initial={{opacity:0,y:65,scale:0.93}} animate={{opacity:1,y:0,scale:1}} transition={{duration:1.2,ease:E,delay:1.1}}
          className="mx-auto mt-24 max-w-4xl rounded-3xl overflow-hidden"
          style={{position:"relative",zIndex:4,background:"rgba(255,255,255,0.58)",backdropFilter:"blur(26px)",border:"1px solid rgba(255,255,255,0.92)",boxShadow:`0 30px 80px rgba(249,115,22,0.1),0 2px 0 rgba(255,255,255,0.8) inset`}}>
          <div className="p-8 md:p-14">
            <div className="grid gap-8 md:grid-cols-3">
              {STATS.map((s,i)=>(
                <motion.div key={i} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:1.3+i*0.15,ease:E}}
                  whileHover={{scale:1.07,y:-5}} className="text-center cursor-default">
                  <p style={{...IF,fontStyle:"italic",fontSize:"clamp(38px,5vw,64px)",background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                    <AnimatedCounter to={s.n} suffix={s.suffix}/>
                  </p>
                  <p style={SF} className="text-sm text-gray-500 leading-snug mt-2">{s.l}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:1,ease:E,delay:1.5}}
          className="mx-auto mt-8 max-w-4xl px-6" style={{position:"relative",zIndex:4}}>
          <IllustrationLeadFlow/>
          <p style={SF} className="text-center text-xs text-gray-400 mt-2 tracking-widest uppercase">Every lead — captured, qualified, and followed up automatically</p>
        </motion.div>
      </section>

      {/* Ticker */}
      <div className="overflow-hidden border-y py-4" style={{borderColor:ORANGE_BORDER,background:"rgba(255,255,255,0.35)",backdropFilter:"blur(8px)",position:"relative",zIndex:4}}>
        <div className="flex gap-10" style={{width:"max-content",animation:"ticker 32s linear infinite"}}>
          {[...TICKER,...TICKER].map((t,i)=>(
            <span key={i} style={SF} className="flex shrink-0 items-center gap-3 text-xs uppercase tracking-widest text-gray-400">
              {t}<span style={{color:`rgba(249,115,22,0.5)`,fontSize:"0.4rem"}}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Problem section */}
      <section className="py-36 px-6" style={{position:"relative",zIndex:4}}>
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1fr_1.9fr] md:gap-28">
          <div className="md:sticky md:top-32 md:self-start">
            <Reveal>
              <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-4">The problem</p>
              <h2 style={{...IF,fontStyle:"italic",fontSize:"clamp(36px,4.5vw,64px)"}} className="text-gray-900 leading-[0.93]">Roofing leads<br/>go cold <em style={{color:ORANGE}}>in minutes.</em></h2>
              <div className="mt-10 flex justify-center"><RoofHouseIllustration size={140}/></div>
              <p style={SF} className="mt-3 text-xs uppercase tracking-widest text-gray-300">Each missed call = lost job</p>
            </Reveal>
          </div>
          <div style={{borderTop:"1px solid rgba(0,0,0,0.06)"}}>
            {[
              "Most roofing companies don't lose jobs because their work is bad.",
              <><strong className="font-semibold text-gray-900">They lose them because responses arrive too late.</strong> Calls come in during a job. Texts wait while you're on a roof. Leads disappear — not because you don't care, but because you're busy doing actual roofing.</>,
              "After a storm, speed is everything. The first company to respond gets the contract.",
              <>The average roofing lead expects a reply <strong className="text-gray-900">within 5 minutes.</strong> Most contractors respond in 5 hours — or never. That gap is where thousands of dollars quietly disappear.</>,
              <>Our AI systems close that gap permanently. <strong className="text-gray-900">Every call answered. Every message replied to. Every lead followed up.</strong> Without you climbing down from the roof.</>,
            ].map((t,i)=>(
              <Reveal key={i} delay={i*0.07} y={28}>
                <p style={{...SF,borderBottom:"1px solid rgba(0,0,0,0.05)"}} className="py-7 text-sm leading-[1.95] text-gray-500">{t}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6" style={{background:"rgba(255,255,255,0.28)",backdropFilter:"blur(8px)",position:"relative",zIndex:4}}>
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center mb-16">
            <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-4">How it works</p>
            <h2 style={{...IF,fontStyle:"italic",fontSize:"clamp(32px,4vw,56px)"}} className="text-gray-900 leading-tight">Every lead.<br/><em style={{color:ORANGE}}>Handled.</em></h2>
            <p style={SF} className="mt-4 text-gray-500 max-w-lg mx-auto">A roofing lead comes in. The AI picks it up instantly, qualifies it, and follows up automatically — all without you touching a thing.</p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s,i)=>(
              <Reveal key={i} delay={i*0.15} y={55}>
                <GlowCard className="rounded-2xl p-8 cursor-default h-full" style={{background:"rgba(255,255,255,0.62)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,0.92)"}}>
                  <span style={{...IF,fontStyle:"italic",fontSize:"3.5rem",color:`rgba(249,115,22,0.18)`}} className="block mb-4 leading-none">{s.n}</span>
                  <h3 style={{...IF,fontStyle:"italic"}} className="text-xl text-gray-900 mb-3">{s.title}</h3>
                  <p style={SF} className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <Reveal y={30} delay={0.1}>
              <div className="rounded-2xl p-6" style={{background:"rgba(255,255,255,0.62)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,0.92)"}}>
                <p style={{...SF,color:ORANGE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>Website traffic growth</p>
                <p style={{...IF,fontStyle:"italic",fontSize:22}} className="text-gray-900 mb-4">Leads find you<br/><em style={{color:ORANGE}}>around the clock.</em></p>
                <IllustrationViewsChart/>
              </div>
            </Reveal>
            <Reveal y={30} delay={0.2}>
              <div className="rounded-2xl p-6" style={{background:"rgba(255,255,255,0.62)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,0.92)"}}>
                <p style={{...SF,color:ORANGE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>Client acquisition funnel</p>
                <p style={{...IF,fontStyle:"italic",fontSize:22}} className="text-gray-900 mb-4">Visitors become<br/><em style={{color:ORANGE}}>paying clients.</em></p>
                <IllustrationClientFunnel/>
              </div>
            </Reveal>
          </div>
          <div className="mt-12 flex justify-center gap-4 flex-wrap">
            <MagBtn orange onClick={()=>{ trackLead(); goto("contact"); }}>Start the conversation</MagBtn>
            <MagBtn onClick={()=>goto("pricing")}>See pricing</MagBtn>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-6" style={{position:"relative",zIndex:4}}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-4">What we build</p>
              <h2 style={{...IF,fontStyle:"italic",fontSize:"clamp(36px,5vw,70px)"}} className="text-gray-900 leading-[0.93]">AI tools built<br/><em style={{color:ORANGE}}>for roofers.</em></h2>
            </Reveal>
            <motion.button onClick={()=>goto("services")} whileHover={{scale:1.05}}
              style={{...SF,background:"rgba(255,255,255,0.55)",backdropFilter:"blur(10px)",border:"1px solid rgba(0,0,0,0.08)",borderRadius:12,padding:"10px 20px"}}
              className="text-xs font-medium uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors self-start">All services →</motion.button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s,i)=>(
              <Reveal key={i} delay={i*0.09} y={52}>
                <GlowCard className="rounded-2xl p-8 cursor-default h-full" style={{background:"rgba(255,255,255,0.62)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,0.9)"}}>
                  <p style={{...IF,fontStyle:"italic",fontSize:"2.2rem",color:`rgba(249,115,22,0.2)`}} className="mb-4 leading-none">{s.n}</p>
                  <h3 style={{...IF,fontStyle:"italic"}} className="text-xl text-gray-900 mb-2">{s.title}</h3>
                  <p style={SF} className="text-sm text-gray-500 leading-relaxed mb-4">{s.desc}</p>
                  <motion.span whileHover={{scale:1.07}} style={{...SF,background:ORANGE_LIGHT,color:ORANGE,border:`1px solid ${ORANGE_BORDER}`,borderRadius:9999,padding:"4px 12px",display:"inline-block",fontSize:11,fontWeight:600}}>
                    {s.price}
                  </motion.span>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo-section" className="py-24 px-6" style={{background:"rgba(255,255,255,0.28)",backdropFilter:"blur(8px)",position:"relative",zIndex:4}}>
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center mb-16">
            <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-4">Live demo</p>
            <h2 style={{...IF,fontStyle:"italic",fontSize:"clamp(32px,4vw,60px)"}} className="text-gray-900 leading-tight">Try our AI <em style={{color:ORANGE}}>systems</em></h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal y={44}>
              <div className="rounded-3xl overflow-hidden" style={{background:"rgba(255,255,255,0.68)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.92)",minHeight:520,boxShadow:"0 8px 40px rgba(0,0,0,0.06)"}}>
                <div className="px-7 py-6" style={{borderBottom:"1px solid rgba(0,0,0,0.06)"}}>
                  <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest">AI Chat</p>
                  <h3 style={{...IF,fontStyle:"italic"}} className="text-2xl text-gray-900 mt-1">Chat with our AI</h3>
                  <p style={SF} className="text-sm text-gray-500 mt-1">See how our AI responds instantly to roofing leads</p>
                </div>
                <div style={{height:420}}><ChatDemo/></div>
              </div>
            </Reveal>
            <Reveal y={44} delay={0.14}>
              <div className="rounded-3xl p-10 flex flex-col items-center justify-center text-center" style={{background:"rgba(255,255,255,0.68)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.92)",minHeight:520,boxShadow:"0 8px 40px rgba(0,0,0,0.06)"}}>
                <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-4">AI Voice</p>
                <h3 style={{...IF,fontStyle:"italic",fontSize:"clamp(22px,3vw,34px)"}} className="text-gray-900 mb-3">Call our AI receptionist</h3>
                <p style={SF} className="text-sm text-gray-500 max-w-xs leading-relaxed mb-10">Experience a real AI answering roofing calls 24/7. Pick up the phone — it's live right now.</p>
                <div className="relative flex items-center justify-center mb-10">
                  {[70,100,130,165].map((s,i)=>(
                    <div key={s} className="voice-ring absolute rounded-full" style={{width:s,height:s,border:`1px solid rgba(249,115,22,0.18)`,animationDelay:`${i*0.58}s`}}/>
                  ))}
                  <div className="voice-btn relative z-10 flex h-14 w-14 items-center justify-center rounded-full" style={{background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`}}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="white"/></svg>
                  </div>
                </div>
                <MagBtn orange href="tel:+15186623244">Call now</MagBtn>
                <p style={SF} className="text-xs text-gray-400 mt-3">Test our AI voice agent live</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Compare */}
      <section className="py-24 px-6" style={{position:"relative",zIndex:4}}>
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-14">
            <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-4">Why roofY</p>
            <h2 style={{...IF,fontStyle:"italic",fontSize:"clamp(36px,5vw,72px)"}} className="text-gray-900 leading-[0.93]">roofY vs.<br/><em style={{color:ORANGE}}>doing it manually.</em></h2>
          </Reveal>
          <Reveal y={38}>
            <div className="overflow-hidden rounded-2xl" style={{background:"rgba(255,255,255,0.58)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.88)",boxShadow:"0 8px 40px rgba(0,0,0,0.05)"}}>
              <div className="grid grid-cols-[1.6fr_1fr_1fr]" style={{borderBottom:"1px solid rgba(0,0,0,0.07)",background:`rgba(249,115,22,0.03)`}}>
                {["Feature","roofY AI","Without AI"].map((h,i)=>(
                  <div key={h} style={{...SF,borderLeft:i>0?"1px solid rgba(0,0,0,0.05)":undefined}}
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-widest ${i===1?"text-orange-500":"text-gray-400"}`}>{h}</div>
                ))}
              </div>
              {COMPARE.map(([feat,ours,theirs],i)=>(
                <motion.div key={i} initial={{opacity:0,x:-18}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:0.06*i,duration:0.5}}
                  whileHover={{background:`rgba(249,115,22,0.03)`}} className="grid grid-cols-[1.6fr_1fr_1fr]" style={{borderBottom:"1px solid rgba(0,0,0,0.04)"}}>
                  <div style={SF} className="flex items-center px-6 py-4 text-sm text-gray-500">{feat}</div>
                  <div style={{...SF,borderLeft:"1px solid rgba(0,0,0,0.04)"}} className="flex items-center gap-2 px-6 py-4 text-sm font-medium text-orange-600"><span className="text-orange-400 text-xs">◆</span>{ours}</div>
                  <div style={{...SF,borderLeft:"1px solid rgba(0,0,0,0.04)"}} className="flex items-center px-6 py-4 text-sm text-gray-400">{theirs}</div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-36 pt-10" style={{position:"relative",zIndex:4}}>
        <div className="mx-auto max-w-6xl">
          <DrawLine className="mb-20 w-full"/>
          <div className="grid gap-14 md:grid-cols-2 md:gap-24">
            <Reveal y={65}>
              <h2 style={{...IF,fontStyle:"italic",fontSize:"clamp(52px,7.5vw,110px)"}} className="text-gray-900 leading-[0.88]">A calmer<br/>way to<br/><em style={{color:ORANGE}}>grow.</em></h2>
            </Reveal>
            <Reveal y={42} delay={0.16} className="flex flex-col justify-center">
              <p style={SF} className="mb-8 text-sm leading-[1.9] text-gray-500">No pressure. No obligation. Just a real conversation about your roofing business and whether roofY is the right fit.<br/><br/><span className="text-gray-900">Most roofing contractors go live within 48 hours.</span> We handle every technical detail — you keep closing jobs.</p>
              <div className="flex flex-wrap gap-3">
                <MagBtn orange onClick={()=>{ trackLead(); goto("contact"); }}>Start the conversation</MagBtn>
                <MagBtn onClick={()=>goto("pricing")}>See pricing</MagBtn>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {["No contracts","Live in 48h","Cancel anytime"].map((t,i)=>(
                  <motion.span key={t} initial={{opacity:0,scale:0.8}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:0.3+i*0.1,type:"spring"}}
                    whileHover={{scale:1.09,y:-2}} style={{...SF,background:"rgba(255,255,255,0.58)",backdropFilter:"blur(8px)",border:`1px solid ${ORANGE_BORDER}`,borderRadius:9999,padding:"4px 12px",fontSize:12,color:"#6b7280",cursor:"default"}}
                    className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full" style={{background:ORANGE}}/>
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
  const fullBundle = PLANS.find(p=>p.fullBundle)!;
  return (
    <div className="pt-32 pb-24 px-6" style={{position:"relative",zIndex:4}}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center mb-16">
          <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-4">Pricing</p>
          <h1 style={{...IF,fontStyle:"italic",fontSize:"clamp(40px,6vw,80px)"}} className="text-gray-900 leading-tight mb-4">Simple pricing.<br/><em style={{color:ORANGE}}>Real roofing results.</em></h1>
          <p style={SF} className="text-gray-500 max-w-xl mx-auto mb-8">No hidden fees. No long-term contracts. AI automation for roofing contractors — go live in 48 hours and only pay for what you use.</p>
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.3}}
            className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full"
            style={{background:"rgba(255,255,255,0.75)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.9)",boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
            <span style={{...SF,fontSize:13,fontWeight:500,color:!annual?"#111":"#9ca3af",transition:"color .2s"}}>Monthly</span>
            <div onClick={()=>setAnnual(a=>!a)}
              style={{position:"relative",width:46,height:26,borderRadius:13,cursor:"pointer",
                background:annual?`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`:"rgba(0,0,0,0.12)",
                transition:"background 0.3s",flexShrink:0}}>
              <motion.div animate={{x:annual?22:2}} transition={{type:"spring",stiffness:500,damping:35}}
                style={{position:"absolute",top:3,width:20,height:20,borderRadius:"50%",background:"white",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
            </div>
            <span style={{...SF,fontSize:13,fontWeight:500,color:annual?"#111":"#9ca3af",transition:"color .2s"}}>
              Annual <span style={{color:ORANGE,fontWeight:700}}>−20%</span>
            </span>
          </motion.div>
          {annual && (
            <motion.p initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} style={SF}
              className="text-sm text-emerald-600 font-medium mt-4">
              Annual pricing active — saving 20% on all monthly plans
            </motion.p>
          )}
        </Reveal>
        <div className="flex flex-col gap-5 mb-10">
          <div className="grid gap-5 md:grid-cols-3" style={{alignItems:"stretch"}}>
            {PLANS.filter(p=>["commission-only","ai-website","meta-ads"].includes(p.id)).map(p=>(
              <PricingCard key={p.id} plan={p} annual={annual} goto={goto}/>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2" style={{alignItems:"stretch"}}>
            {PLANS.filter(p=>["ai-receptionist","custom"].includes(p.id)).map(p=>(
              <PricingCard key={p.id} plan={p} annual={annual} goto={goto}/>
            ))}
          </div>
          {PLANS.filter(p=>p.id==="full-system").map(p=>(
            <PricingCard key={p.id} plan={p} annual={annual} goto={goto}/>
          ))}
          <PricingCard plan={fullBundle} annual={annual} goto={goto}/>
        </div>
        <Reveal y={20}>
          <div className="rounded-2xl px-8 py-6 mb-12 flex flex-col md:flex-row items-start md:items-center gap-4"
            style={{background:"linear-gradient(135deg,rgba(249,115,22,0.06),rgba(234,88,12,0.04))",border:`1px solid ${ORANGE_BORDER}`}}>
            <span style={{flexShrink:0}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={ORANGE} strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
            <div>
              <p style={{...SF,fontWeight:700,color:"#111",marginBottom:4}}>About our commission model</p>
              <p style={SF} className="text-sm text-gray-500 leading-relaxed">On plans that include ads, we charge <strong style={{color:"#111"}}>+10% per closed deal</strong>. Your first client is commission-only at <strong style={{color:"#111"}}>13%</strong> — no monthly fee. After that, plans with ads include a 10% commission, while AI system plans have no commission on top.</p>
            </div>
          </div>
        </Reveal>
        <div className="mt-4">
          <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-8">FAQ</p>
          {FAQS.map((item,i)=><FAQItem key={i} q={item.q} a={item.a}/>)}
        </div>
      </div>
    </div>
  );
}

function ServicesPage({ goto }: { goto:(p:Page)=>void }) {
  const items = [
    {n:"01",title:"AI Website",           headline:"Your 24/7 roofing sales machine.", desc:"We build high-conversion roofing websites that actively capture and qualify leads around the clock.", details:["Custom design aligned to your brand","Lead capture with instant AI response","Mobile-first, performance-optimised","Built-in analytics and tracking","Dedicated landing pages for storm/repair/replacement"]},
    {n:"02",title:"AI Voice Receptionist",headline:"Never miss a roofing call again.",  desc:"An AI receptionist that answers every call, qualifies the lead, books estimates — sounding exactly like your brand.", details:["Natural conversation handling","Lead qualification scripting","Appointment booking integration","Urgent call escalation routing","Full call logging and summaries"]},
    {n:"03",title:"AI Chat & SMS",        headline:"Instant replies, every channel.",   desc:"We deploy AI on WhatsApp, SMS, and your website chat. Every inbound message gets an immediate response — even at 3am after a storm.", details:["WhatsApp Business API integration","SMS automation","Web chat widget","Lead capture and qualification","Handoff to human when needed"]},
    {n:"04",title:"Meta Ads",             headline:"Roofing leads from Meta.",           desc:"Facebook & Instagram ad campaigns built specifically for roofing companies. Storm damage, replacement, and inspection leads — targeted and optimized weekly.", details:["Ad setup & creative strategy","Roofing-focused ad creatives","Geo & interest targeting","Lead form optimization","Weekly performance reports"]},
    {n:"05",title:"Automated Follow-Ups", headline:"Persistence without effort.",        desc:"Multi-step follow-up sequences that run automatically after every lead interaction.", details:["Multi-channel sequences (email, SMS, WhatsApp)","Personalised message logic","Time-delay and behaviour triggers","Lead scoring integration","Full sequence analytics"]},
    {n:"06",title:"Lead Qualification",   headline:"Only talk to the right people.",     desc:"AI-powered screening that identifies intent, asks qualifying questions, and scores leads before they ever reach your team.", details:["Custom qualification criteria","AI scoring and tagging","Automatic data enrichment","Disqualification handling","Hot lead alerts"]},
    {n:"07",title:"Custom n8n Workflows", headline:"Automation without limits.",         desc:"For roofing businesses with complex, multi-system needs. We architect bespoke automation workflows using n8n.", details:["Full workflow architecture","API and webhook integration","Conditional logic and branching","Data transformation pipelines","Monitoring and alerting"]},
  ];
  return (
    <div className="pt-32 pb-24 px-6" style={{position:"relative",zIndex:4}}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-24">
          <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-4">Services</p>
          <h1 style={{...IF,fontStyle:"italic",fontSize:"clamp(44px,7vw,100px)"}} className="text-gray-900 leading-[0.88] mb-4">AI services built<br/><em style={{color:ORANGE}}>for roofing.</em></h1>
          <p style={SF} className="text-gray-500 max-w-xl">Every roofY service is purpose-built for roofing contractors — AI call answering, automated lead follow-up, Meta ads, and custom workflow automation. We configure, deploy, and maintain everything.</p>
        </Reveal>
        <div style={{borderTop:"1px solid rgba(0,0,0,0.07)"}}>
          {items.map((s,i)=>(
            <Reveal key={i} delay={0.04*i} y={32}>
              <div className="grid gap-8 py-14 md:grid-cols-[1fr_2fr] md:gap-20" style={{borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
                <div>
                  <p style={SF} className="text-xs font-semibold uppercase tracking-widest mb-2 text-gray-400">{s.n}</p>
                  <h2 style={{...IF,fontStyle:"italic"}} className="text-2xl text-gray-900 mb-1">{s.title}</h2>
                  <p style={{...SF,color:ORANGE}} className="text-sm font-medium">{s.headline}</p>
                </div>
                <div>
                  <p style={SF} className="text-gray-500 leading-relaxed mb-6">{s.desc}</p>
                  <ul className="space-y-2.5 mb-8">
                    {s.details.map(d=>(
                      <motion.li key={d} style={SF} whileHover={{x:5}} className="flex items-start gap-2 text-sm text-gray-600">
                        <span style={{color:ORANGE}} className="mt-0.5 shrink-0">✓</span>{d}
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
    {title:"Calm over chaos",   desc:"We build systems that reduce noise, not add to it. Every decision is guided by what creates the most clarity."},
    {title:"Precision",          desc:"We don't ship until it works exactly as intended. We'd rather take an extra day than deliver something that's almost right."},
    {title:"No hype",            desc:"We say what we mean. No inflated promises, no manufactured urgency. If something isn't the right fit, we say so."},
    {title:"Human at the core",  desc:"AI should handle the repetitive so roofers can focus on what only humans can do. That's the only version of automation worth building."},
  ];
  return (
    <div className="pt-32 pb-24 px-6" style={{position:"relative",zIndex:4}}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-32">
          <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-4">About</p>
          <h1 style={{...IF,fontStyle:"italic",fontSize:"clamp(44px,7vw,100px)"}} className="text-gray-900 leading-[0.88] mb-8">Built with<br/><em style={{color:ORANGE}}>intention.</em></h1>
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
            <p style={SF} className="text-gray-500 leading-relaxed">roofY started from a simple observation: great roofing contractors were losing jobs not because of their craftsmanship — but because no one answered the phone fast enough after a storm.</p>
            <p style={SF} className="text-gray-500 leading-relaxed">Michael and Badre built roofY to close that gap permanently. Not with another app that adds to your to-do list, but with AI systems that run silently in the background — answering every call, qualifying every lead, and following up until the deal is closed.</p>
          </div>
        </Reveal>
        <div className="mb-32">
          <Reveal><p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-8">The team</p></Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {name:"Michael Brito",   role:"Co-founder",bio:"Systems architect with a background in automation engineering and product design. Obsessed with removing friction from complex workflows."},
              {name:"Badre Elkhammal", role:"Co-founder",bio:"Growth operator and AI integration specialist. Has built and scaled sales automation systems for dozens of service businesses."},
            ].map((f,i)=>(
              <Reveal key={i} delay={i*0.12} y={40}>
                <GlowCard className="rounded-2xl p-8" style={{background:"rgba(255,255,255,0.62)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,0.9)"}}>
                  <div className="h-px w-10 mb-6 rounded-full" style={{background:`linear-gradient(90deg,${ORANGE},${ORANGE_DARK})`}}/>
                  <h3 style={{...IF,fontStyle:"italic"}} className="text-2xl text-gray-900 mb-1">{f.name}</h3>
                  <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-4">{f.role}</p>
                  <p style={SF} className="text-sm text-gray-500 leading-relaxed">{f.bio}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mb-32">
          <Reveal><p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-8">Our values</p></Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {values.map((v,i)=>(
              <Reveal key={i} delay={i*0.1} y={32}>
                <GlowCard className="rounded-2xl p-7" style={{background:"rgba(255,255,255,0.62)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,0.9)"}}>
                  <p style={{...IF,fontStyle:"italic"}} className="text-xl text-gray-900 mb-2">{v.title}</p>
                  <p style={SF} className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal y={42}>
          <div className="rounded-3xl p-14 text-center relative overflow-hidden" style={{background:"linear-gradient(135deg,#111,#2d2d2d)"}}>
            <div style={{position:"absolute",inset:0,opacity:0.08,backgroundImage:`linear-gradient(rgba(249,115,22,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.3) 1px,transparent 1px)`,backgroundSize:"40px 40px"}}/>
            <blockquote style={{...IF,fontStyle:"italic",fontSize:"clamp(20px,2.5vw,32px)"}} className="font-light text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed relative z-10">
              &ldquo;Roofing contractors deserve technology that works as hard as they do — quietly, reliably, and without drama.&rdquo;
            </blockquote>
            <p style={SF} className="text-sm text-white/50 mb-8 relative z-10">Michael &amp; Badre, roofY</p>
            <motion.button onClick={()=>{ trackLead(); goto("contact"); }} whileHover={{scale:1.06,y:-3}} whileTap={{scale:0.96}}
              style={{...SF,background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`,borderRadius:9999,padding:"14px 32px",border:"none",boxShadow:"0 4px 20px rgba(249,115,22,0.4)"}}
              className="text-sm font-semibold text-white relative z-10">Work with us</motion.button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="pt-32 pb-24 px-6" style={{position:"relative",zIndex:4}}>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-[1fr_1.4fr]">
          <Reveal y={32}>
            <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-4">Contact</p>
            <h1 style={{...IF,fontStyle:"italic",fontSize:"clamp(36px,5.5vw,80px)"}} className="text-gray-900 leading-[0.88] mb-6">
              Grow your<br/><em style={{color:ORANGE}}>roofing business.</em>
            </h1>
            <p style={SF} className="text-gray-500 leading-relaxed mb-12">No sales pitch. No pressure. Just a straightforward conversation about how roofY's AI automation can help your roofing company answer every call, close more leads, and scale without hiring. Most contractors are live in 48 hours.</p>
            <div className="space-y-6 mb-10">
              {[{label:"Email",value:"roofy.ai@gmail.com"},{label:"Phone / WhatsApp",value:"(518) 662-3244"},{label:"Based in",value:"Available worldwide"}].map(c=>(
                <motion.div key={c.label} whileHover={{x:5}}>
                  <p style={SF} className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{c.label}</p>
                  <p style={SF} className="text-gray-700 font-medium">{c.value}</p>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {["No contracts","Live in 48h","Cancel anytime"].map(t=>(
                <span key={t} style={{...SF,background:ORANGE_LIGHT,border:`1px solid ${ORANGE_BORDER}`,borderRadius:9999,padding:"8px 16px",fontSize:14,color:"#6b7280"}} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{background:ORANGE}}/>{t}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal y={42} delay={0.16}>
            <div className="rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-8"
              style={{background:"rgba(255,255,255,0.62)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.92)",boxShadow:`0 24px 64px rgba(249,115,22,0.09)`}}>
              <div>
                <div className="h-1 w-14 mx-auto mb-6 rounded-full" style={{background:`linear-gradient(90deg,${ORANGE},${ORANGE_DARK})`}}/>
                <h3 style={{...IF,fontStyle:"italic",fontSize:"clamp(26px,3.5vw,40px)"}} className="text-gray-900 mb-3">
                  Book a free<br/><em style={{color:ORANGE}}>20-min call.</em>
                </h3>
                <p style={SF} className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">Pick a time that works. We'll talk about your roofing business and how roofY can help. No pressure.</p>
              </div>
              <div className="flex flex-col gap-3 w-full max-w-xs">
                {["No contracts","Live in 48h","Cancel anytime"].map(t=>(
                  <motion.div key={t} whileHover={{x:5,scale:1.02}} className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{background:ORANGE_LIGHT,border:`1px solid ${ORANGE_BORDER}`}}>
                    <span className="h-2 w-2 rounded-full shrink-0" style={{background:ORANGE}}/>
                    <span style={SF} className="text-sm text-gray-600">{t}</span>
                  </motion.div>
                ))}
              </div>
              <MagBtn orange href="https://api.leadconnectorhq.com/widget/booking/qJg74N6UCUVhwWV1yBKG" onClick={trackLead}>
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

// ─── ROOT ─────────────────────────────────────────────────────────────────────
// PERF: style tag is static — inject once, never re-creates
export default function Home() {
  const [page,setPage] = useState<Page>("home");
  const goto = useCallback((p:Page)=>{ window.scrollTo({top:0,behavior:"smooth"}); setTimeout(()=>setPage(p),120); },[]);
  useEffect(()=>{ window.scrollTo({top:0,behavior:"instant" as any}); },[]);
  return (
    <div className="min-h-screen text-gray-900 selection:bg-orange-100" style={{...SF,cursor:"auto"}}>
      <style dangerouslySetInnerHTML={{__html:GLOBAL_CSS}}/>
      <RoofingBackground/>
      <CustomCursor/>
      <div style={{position:"relative",zIndex:4}}>
        <Nav current={page} goto={goto}/>
        <AnimatePresence mode="wait">
          <motion.main key={page}
            initial={{opacity:0,y:18}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-18}}
            transition={{duration:0.35,ease:E}}>
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