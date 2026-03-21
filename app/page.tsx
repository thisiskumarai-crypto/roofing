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

  /* Section divider pulse */
  @keyframes dividerPulse{0%,100%{opacity:0.3;transform:scaleX(0.7)} 50%{opacity:1;transform:scaleX(1)}}
  .divider-pulse{animation:dividerPulse 3s ease-in-out infinite}

  /* Float slow */
  @keyframes floatSlow{0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)}}
  .float-slow{animation:floatSlow 5s ease-in-out infinite}
  .float-slow-2{animation:floatSlow 6.5s ease-in-out infinite;animation-delay:-2s}
  .float-slow-3{animation:floatSlow 4s ease-in-out infinite;animation-delay:-1s}

  /* Number counter shimmer */
  @keyframes countShimmer{0%{color:rgba(249,115,22,0.4)} 50%{color:rgba(249,115,22,1)} 100%{color:rgba(249,115,22,0.4)}}

  /* Step connector line draw */
  @keyframes lineDraw{from{stroke-dashoffset:200} to{stroke-dashoffset:0}}
  .line-draw{animation:lineDraw 1.5s ease forwards}

  /* Spotlight sweep */
  @keyframes spotlight{0%{opacity:0;transform:translate(-20%,-20%) rotate(-15deg)} 40%{opacity:0.07} 100%{opacity:0;transform:translate(120%,80%) rotate(-15deg)}}
  .spotlight{animation:spotlight 8s ease-in-out infinite}

  /* Particle drift */
  @keyframes drift1{0%{transform:translate(0,0) scale(1);opacity:0} 15%{opacity:1} 85%{opacity:1} 100%{transform:translate(-60px,-180px) scale(0.4);opacity:0}}
  @keyframes drift2{0%{transform:translate(0,0) scale(1);opacity:0} 15%{opacity:0.7} 85%{opacity:0.7} 100%{transform:translate(80px,-220px) scale(0.3);opacity:0}}
  @keyframes drift3{0%{transform:translate(0,0);opacity:0} 20%{opacity:0.8} 80%{opacity:0.8} 100%{transform:translate(-30px,-160px);opacity:0}}
  .particle-1{animation:drift1 7s ease-in-out infinite}
  .particle-2{animation:drift2 9s ease-in-out infinite}
  .particle-3{animation:drift3 6s ease-in-out infinite}

  /* Roof city scroll */
  @keyframes cityScroll{0%{transform:translateX(0)} 100%{transform:translateX(-50%)}}
  .city-scroll{animation:cityScroll 60s linear infinite;will-change:transform}

  /* Star twinkle */
  @keyframes twinkle{0%,100%{opacity:0.15;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.4)}}

  /* Grid pulse */
  @keyframes gridPulse{0%,100%{opacity:0.018} 50%{opacity:0.038}}
  .grid-pulse{animation:gridPulse 6s ease-in-out infinite}

  /* Node orbit */
  @keyframes nodeOrbit{0%{transform:rotate(0deg) translateX(120px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(120px) rotate(-360deg)}}
  @keyframes nodeOrbit2{0%{transform:rotate(0deg) translateX(80px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(80px) rotate(-360deg)}}
  .node-orbit{animation:nodeOrbit 20s linear infinite;will-change:transform}
  .node-orbit-r{animation:nodeOrbit 28s linear infinite reverse;will-change:transform}
  .node-orbit-2{animation:nodeOrbit2 14s linear infinite;will-change:transform}
  .node-orbit-2r{animation:nodeOrbit2 18s linear infinite reverse;will-change:transform}

  /* Data rain */
  @keyframes rain1{0%{transform:translateY(-40px);opacity:0} 10%{opacity:0.6} 90%{opacity:0.6} 100%{transform:translateY(100vh);opacity:0}}
  @keyframes rain2{0%{transform:translateY(-60px);opacity:0} 15%{opacity:0.4} 85%{opacity:0.4} 100%{transform:translateY(100vh);opacity:0}}
  .rain-col-1{animation:rain1 8s linear infinite}
  .rain-col-2{animation:rain2 11s linear infinite}
  .rain-col-3{animation:rain1 9.5s linear infinite}

  /* Horizontal scan line */
  @keyframes scanLine{0%{transform:translateY(-2px);opacity:0} 3%{opacity:0.06} 97%{opacity:0.06} 100%{transform:translateY(100vh);opacity:0}}
  .scan-line{animation:scanLine 12s linear infinite}

  /* Pulse ring */
  @keyframes pulseRing{0%{transform:scale(0.6);opacity:0.5} 100%{transform:scale(2.2);opacity:0}}
  .pulse-ring-a{animation:pulseRing 3s ease-out infinite}
  .pulse-ring-b{animation:pulseRing 3s ease-out infinite;animation-delay:-1s}
  .pulse-ring-c{animation:pulseRing 3s ease-out infinite;animation-delay:-2s}

  /* Warp speed lines */
  @keyframes warpLine{0%{transform:scaleX(0);opacity:0;transform-origin:left} 30%{opacity:0.12} 70%{opacity:0.12} 100%{transform:scaleX(1);opacity:0}}
  .warp-1{animation:warpLine 4s ease-in-out infinite}
  .warp-2{animation:warpLine 5.5s ease-in-out infinite;animation-delay:-1.5s}
  .warp-3{animation:warpLine 3.8s ease-in-out infinite;animation-delay:-2.8s}

  /* Morse / data blink */
  @keyframes morse{0%,100%{opacity:0} 10%,20%{opacity:0.5} 30%,40%{opacity:0} 50%,70%{opacity:0.5} 80%,100%{opacity:0}}
  .morse{animation:morse 3s ease-in-out infinite}

  /* Float gentle */
  @keyframes floatGent{0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(2deg)}}
  .float-gent{animation:floatGent 7s ease-in-out infinite}
  .float-gent-2{animation:floatGent 9s ease-in-out infinite;animation-delay:-3s}

  /* City lights flicker */
  @keyframes flicker{0%,100%{opacity:0.6} 45%{opacity:0.2} 55%{opacity:0.6} 70%{opacity:0.3} 80%{opacity:0.6}}
  .flicker{animation:flicker 4s ease-in-out infinite}

  /* Slow rotate */
  @keyframes slowRot{0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)}}
  .slow-rot{animation:slowRot 80s linear infinite;will-change:transform}
  .slow-rot-r{animation:slowRot 60s linear infinite reverse;will-change:transform}
`;

// ─── RICH ANIMATED BACKGROUND ────────────────────────────────────────────────
const RoofingBackground = memo(function RoofingBackground() {

  // All data is static (no Math.random) — stable across renders
  const stars = [
    {x:8,y:7,r:1.5,d:0},{x:22,y:3,r:1,d:0.8},{x:40,y:5,r:2,d:1.5},{x:55,y:2,r:1,d:0.4},
    {x:68,y:6,r:1.5,d:2.1},{x:80,y:4,r:1,d:0.7},{x:92,y:8,r:2,d:1.2},{x:14,y:17,r:1,d:1.8},
    {x:34,y:13,r:1.5,d:0.3},{x:72,y:15,r:1,d:2.5},{x:87,y:19,r:1.5,d:0.9},{x:48,y:21,r:1,d:1.1},
    {x:5,y:25,r:1,d:2.2},{x:96,y:28,r:1.5,d:0.6},{x:28,y:30,r:1,d:1.3},{x:60,y:26,r:2,d:1.9},
    {x:18,y:38,r:1,d:0.2},{x:82,y:35,r:1.5,d:2.8},{x:44,y:42,r:1,d:1.7},{x:70,y:44,r:1,d:0.5},
  ];

  const particles = [
    {x:12,y:72,s:6,c:0.45,d:0,t:1},{x:28,y:65,s:4,c:0.3,d:1.2,t:2},{x:44,y:78,s:5,c:0.4,d:0.5,t:3},
    {x:58,y:68,s:3,c:0.25,d:2.1,t:1},{x:71,y:74,s:5,c:0.35,d:0.8,t:2},{x:83,y:70,s:4,c:0.3,d:1.6,t:3},
    {x:19,y:55,s:3,c:0.2,d:3.0,t:1},{x:67,y:60,s:4,c:0.4,d:0.3,t:2},{x:90,y:62,s:3,c:0.25,d:2.4,t:3},
    {x:38,y:50,s:5,c:0.35,d:1.8,t:1},{x:52,y:45,s:3,c:0.3,d:0.9,t:2},{x:76,y:48,s:4,c:0.2,d:1.4,t:3},
    {x:7,y:80,s:4,c:0.35,d:0.6,t:2},{x:33,y:85,s:3,c:0.25,d:2.0,t:1},{x:61,y:82,s:5,c:0.3,d:1.1,t:3},
    {x:88,y:88,s:4,c:0.2,d:0.4,t:1},{x:23,y:40,s:3,c:0.4,d:2.6,t:2},{x:49,y:36,s:4,c:0.35,d:1.0,t:3},
  ];

  // Data rain columns
  const rainCols = [
    {x:5,chars:["1","0","1","1","0","1"],delay:0,cl:"rain-col-1"},
    {x:12,chars:["0","1","0","1","1","0"],delay:2.4,cl:"rain-col-2"},
    {x:22,chars:["1","1","0","0","1","1"],delay:0.8,cl:"rain-col-3"},
    {x:31,chars:["0","1","1","0","1","0"],delay:3.5,cl:"rain-col-1"},
    {x:78,chars:["1","0","1","0","0","1"],delay:1.2,cl:"rain-col-2"},
    {x:85,chars:["0","0","1","1","0","1"],delay:4.0,cl:"rain-col-3"},
    {x:91,chars:["1","1","0","1","0","0"],delay:0.5,cl:"rain-col-1"},
    {x:96,chars:["0","1","0","0","1","1"],delay:2.9,cl:"rain-col-2"},
  ];

  // Warp speed lines
  const warpLines = [
    {y:15,w:180,cl:"warp-1"},{y:28,w:120,cl:"warp-2"},{y:42,w:220,cl:"warp-3"},
    {y:55,w:90,cl:"warp-1"},{y:67,w:160,cl:"warp-2"},{y:78,w:140,cl:"warp-3"},
    {y:88,w:200,cl:"warp-1"},
  ];

  return (
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden",background:"#fffaf5"}} aria-hidden>

      {/* ─ 1. Base warm gradient ─────────────────────────────────────── */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,#fffdf9 0%,#fff7ef 30%,#ffeedd 60%,#fff6ec 100%)"}}/>

      {/* ─ 2. Animated dot grid (subtle) ────────────────────────────── */}
      <div className="grid-pulse" style={{position:"absolute",inset:0,
        backgroundImage:"radial-gradient(circle,rgba(249,115,22,0.35) 1px,transparent 1px)",
        backgroundSize:"48px 48px"}}/>

      {/* ─ 3. Horizontal scan line sweep ────────────────────────────── */}
      <div className="scan-line" style={{position:"absolute",left:0,right:0,top:0,height:2,
        background:"linear-gradient(90deg,transparent,rgba(249,115,22,0.08),transparent)"}}/>

      {/* ─ 4. Warp speed lines (left side) ──────────────────────────── */}
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:"18%"}}>
        {warpLines.slice(0,4).map((l,i)=>(
          <div key={i} className={l.cl} style={{position:"absolute",top:`${l.y}%`,left:0,
            height:1,width:l.w,background:"linear-gradient(90deg,rgba(249,115,22,0.18),transparent)"}}/>
        ))}
      </div>

      {/* ─ 5. Warp speed lines (right side) ─────────────────────────── */}
      <div style={{position:"absolute",right:0,top:0,bottom:0,width:"18%"}}>
        {warpLines.slice(4).map((l,i)=>(
          <div key={i} className={l.cl} style={{position:"absolute",top:`${l.y}%`,right:0,
            height:1,width:l.w,background:"linear-gradient(270deg,rgba(249,115,22,0.18),transparent)",
            animationDelay:`${l.w/50}s`}}/>
        ))}
      </div>

      {/* ─ 6. Data rain columns (sides) ──────────────────────────────── */}
      {rainCols.map((col,i)=>(
        <div key={i} className={col.cl} style={{position:"absolute",left:`${col.x}%`,top:0,
          display:"flex",flexDirection:"column",gap:28,animationDelay:`${col.delay}s`,
          opacity:0.07+i%3*0.02}}>
          {col.chars.map((ch,j)=>(
            <span key={j} style={{fontFamily:"monospace",fontSize:10,color:"rgba(249,115,22,1)",lineHeight:1}}>{ch}</span>
          ))}
        </div>
      ))}

      {/* ─ 7. Star field ─────────────────────────────────────────────── */}
      {stars.map((s,i)=>(
        <div key={i} style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,
          width:s.r*2,height:s.r*2,borderRadius:"50%",
          background:"rgba(249,115,22,0.65)",
          animation:`twinkle ${2+i%4}s ease-in-out infinite`,
          animationDelay:`${s.d}s`,zIndex:1}}/>
      ))}

      {/* ─ 8. Diamond sparkles ───────────────────────────────────────── */}
      {[{x:15,y:32},{x:38,y:18},{x:62,y:28},{x:84,y:22},{x:48,y:48},{x:75,y:55}].map((s,i)=>(
        <div key={i} style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,
          width:6,height:6,background:"rgba(249,115,22,0.5)",
          transform:"rotate(45deg)",
          animation:`twinkle ${3+i%2}s ease-in-out infinite`,
          animationDelay:`${i*0.7}s`}}/>
      ))}

      {/* ─ 9. Floating particles ─────────────────────────────────────── */}
      {particles.map((p,i)=>(
        <div key={i} style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,
          width:p.s,height:p.s,borderRadius:"50%",
          background:`rgba(249,115,22,${p.c})`,
          animation:`drift${p.t} ${6+i%5}s ease-in-out infinite`,
          animationDelay:`${p.d}s`}}/>
      ))}

      {/* ─ 10. Pulse rings (3 locations) ─────────────────────────────── */}
      {[{x:"20%",y:"30%"},{x:"72%",y:"45%"},{x:"45%",y:"70%"}].map((pos,i)=>(
        <div key={i} style={{position:"absolute",left:pos.x,top:pos.y}}>
          <div className="pulse-ring-a" style={{position:"absolute",width:40,height:40,borderRadius:"50%",
            border:"1px solid rgba(249,115,22,0.25)",transform:"translate(-50%,-50%)"}}/>
          <div className="pulse-ring-b" style={{position:"absolute",width:40,height:40,borderRadius:"50%",
            border:"1px solid rgba(249,115,22,0.18)",transform:"translate(-50%,-50%)"}}/>
          <div className="pulse-ring-c" style={{position:"absolute",width:40,height:40,borderRadius:"50%",
            border:"1px solid rgba(249,115,22,0.12)",transform:"translate(-50%,-50%)"}}/>
        </div>
      ))}

      {/* ─ 11. Large rotating geometric rings ───────────────────────── */}
      <div className="slow-rot" style={{position:"absolute",top:"5%",left:"50%",
        width:600,height:600,marginLeft:-300,marginTop:0,opacity:0.04}}>
        <svg width="600" height="600" viewBox="0 0 600 600" fill="none">
          <circle cx="300" cy="300" r="250" stroke="rgba(249,115,22,1)" strokeWidth="1" strokeDasharray="8 12"/>
          <circle cx="300" cy="300" r="200" stroke="rgba(249,115,22,1)" strokeWidth="0.8" strokeDasharray="4 8"/>
          <polygon points="300,60 520,420 80,420" stroke="rgba(249,115,22,1)" strokeWidth="0.8" fill="none" strokeDasharray="6 10"/>
        </svg>
      </div>
      <div className="slow-rot-r" style={{position:"absolute",top:"20%",left:"50%",
        width:400,height:400,marginLeft:-200,opacity:0.03}}>
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
          <rect x="50" y="50" width="300" height="300" stroke="rgba(249,115,22,1)" strokeWidth="1" fill="none" strokeDasharray="6 8" rx="8"/>
          <rect x="100" y="100" width="200" height="200" stroke="rgba(249,115,22,1)" strokeWidth="0.8" fill="none" strokeDasharray="4 6" rx="4"/>
        </svg>
      </div>

      {/* ─ 12. Main AI node constellation (upper right) ──────────────── */}
      <div style={{position:"absolute",top:"4%",right:"4%",width:300,height:300,opacity:0.85}}>
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none">
          {/* Rings */}
          <circle cx="150" cy="150" r="55"  fill="none" stroke="rgba(249,115,22,0.1)" strokeWidth="1" strokeDasharray="5 5"/>
          <circle cx="150" cy="150" r="95"  fill="none" stroke="rgba(249,115,22,0.07)" strokeWidth="1" strokeDasharray="8 6"/>
          <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(249,115,22,0.04)" strokeWidth="1" strokeDasharray="10 8"/>
          {/* Center */}
          <circle cx="150" cy="150" r="24" fill="rgba(249,115,22,0.1)" stroke="rgba(249,115,22,0.3)" strokeWidth="1.5"/>
          <circle cx="150" cy="150" r="15" fill="rgba(249,115,22,0.18)" stroke="rgba(249,115,22,0.4)" strokeWidth="1"/>
          <text x="150" y="154" textAnchor="middle" fontSize="11" fill="rgba(249,115,22,0.65)" fontFamily="sans-serif" fontWeight="800">AI</text>
          {/* Spoke lines */}
          {[0,60,120,180,240,300].map((deg,i)=>{
            const r=Math.PI*deg/180;
            return <line key={i} x1={150+Math.cos(r)*25} y1={150+Math.sin(r)*25}
              x2={150+Math.cos(r)*125} y2={150+Math.sin(r)*125}
              stroke="rgba(249,115,22,0.06)" strokeWidth="1"/>;
          })}
          {/* Inner orbit nodes */}
          <g className="node-orbit-2" style={{transformOrigin:"150px 150px"}}>
            <g style={{transform:"translate(150px,150px)"}}>
              <circle r="10" fill="rgba(249,115,22,0.12)" stroke="rgba(249,115,22,0.3)" strokeWidth="1"/>
              <text y="3" textAnchor="middle" fontSize="6" fill="rgba(249,115,22,0.7)" fontFamily="sans-serif" fontWeight="700">SMS</text>
            </g>
          </g>
          <g className="node-orbit-2r" style={{transformOrigin:"150px 150px"}}>
            <g style={{transform:"translate(150px,150px)"}}>
              <circle r="9" fill="rgba(249,115,22,0.1)" stroke="rgba(249,115,22,0.25)" strokeWidth="1"/>
              <text y="3" textAnchor="middle" fontSize="6" fill="rgba(249,115,22,0.6)" fontFamily="sans-serif" fontWeight="700">CALL</text>
            </g>
          </g>
          {/* Outer orbit nodes */}
          <g className="node-orbit" style={{transformOrigin:"150px 150px"}}>
            <g style={{transform:"translate(150px,150px)"}}>
              <circle r="12" fill="rgba(249,115,22,0.09)" stroke="rgba(249,115,22,0.22)" strokeWidth="1"/>
              <text y="4" textAnchor="middle" fontSize="6" fill="rgba(249,115,22,0.55)" fontFamily="sans-serif" fontWeight="700">CRM</text>
            </g>
          </g>
          <g className="node-orbit-r" style={{transformOrigin:"150px 150px"}}>
            <g style={{transform:"translate(150px,150px)"}}>
              <circle r="11" fill="rgba(249,115,22,0.09)" stroke="rgba(249,115,22,0.2)" strokeWidth="1"/>
              <text y="4" textAnchor="middle" fontSize="6" fill="rgba(249,115,22,0.5)" fontFamily="sans-serif" fontWeight="700">ADS</text>
            </g>
          </g>
          {/* Satellite data points */}
          {[30,90,150,210,270,330].map((deg,i)=>{
            const r=Math.PI*deg/180, dist=93;
            return <circle key={i} cx={150+Math.cos(r)*dist} cy={150+Math.sin(r)*dist}
              r="4" fill="rgba(249,115,22,0.2)" stroke="rgba(249,115,22,0.35)" strokeWidth="0.8"/>;
          })}
        </svg>
      </div>

      {/* ─ 13. Second smaller constellation (lower left) ─────────────── */}
      <div style={{position:"absolute",bottom:"30%",left:"2%",width:180,height:180,opacity:0.7}}>
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
          <circle cx="90" cy="90" r="40" fill="none" stroke="rgba(249,115,22,0.09)" strokeWidth="1" strokeDasharray="4 5"/>
          <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(249,115,22,0.05)" strokeWidth="1" strokeDasharray="6 7"/>
          <circle cx="90" cy="90" r="15" fill="rgba(249,115,22,0.07)" stroke="rgba(249,115,22,0.2)" strokeWidth="1"/>
          <text x="90" y="94" textAnchor="middle" fontSize="8" fill="rgba(249,115,22,0.4)" fontFamily="sans-serif" fontWeight="700">n8n</text>
          <g className="node-orbit-2" style={{transformOrigin:"90px 90px"}}>
            <g style={{transform:"translate(90px,90px)"}}>
              <circle r="8" fill="rgba(249,115,22,0.08)" stroke="rgba(249,115,22,0.2)" strokeWidth="1"/>
              <text y="3" textAnchor="middle" fontSize="5" fill="rgba(249,115,22,0.5)" fontFamily="sans-serif" fontWeight="700">WA</text>
            </g>
          </g>
          {[0,72,144,216,288].map((deg,i)=>{
            const r=Math.PI*deg/180;
            return <circle key={i} cx={90+Math.cos(r)*68} cy={90+Math.sin(r)*68}
              r="5" fill="rgba(249,115,22,0.12)" stroke="rgba(249,115,22,0.25)" strokeWidth="0.8"/>;
          })}
        </svg>
      </div>

      {/* ─ 14. Morse / data blink strip (mid screen) ─────────────────── */}
      <div style={{position:"absolute",top:"48%",left:"50%",transform:"translateX(-50%)",
        display:"flex",gap:8,opacity:0.07}}>
        {[1,0,1,1,0,1,0,0,1,1,0,1,1,0,0,1].map((bit,i)=>(
          <div key={i} className="morse" style={{width:bit?12:4,height:4,borderRadius:2,
            background:"rgba(249,115,22,1)",animationDelay:`${i*0.18}s`}}/>
        ))}
      </div>

      {/* ─ 15. Animated rooftop city panorama (full richer version) ─── */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"36%",overflow:"hidden"}}>
        <div className="city-scroll" style={{display:"flex",alignItems:"flex-end",width:"200%",height:"100%"}}>
          <svg width="2880" height="240" viewBox="0 0 2880 240" fill="none" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
            {/* Background mountain/hill silhouette */}
            <path d="M0,200 C200,140 400,180 600,130 C800,80 1000,150 1200,110 C1400,70 1600,140 1800,100 C2000,60 2200,130 2400,90 C2600,50 2750,120 2880,100 L2880,240 L0,240Z"
              fill="rgba(249,115,22,0.03)"/>

            {/* Houses with more detail */}
            {[0,170,320,480,640,800,960,1110,1270,1440,1610,1760,1920,2080,2240,2400,2560,2720].map((x,i)=>{
              const h=[100,85,115,95,125,90,105,80,115,100,85,115,95,125,90,105,80,115][i%18];
              const w=130+[0,20,10,30,0,15,25,5,20,10,30,0,15,25,5,20,10,30][i%18];
              const v=i%4;
              const op=0.11+(i%5)*0.025;
              return (
                <g key={x} opacity={op}>
                  {/* Wall */}
                  <rect x={x+8} y={240-h} width={w} height={h} fill="rgba(249,115,22,0.55)" rx="2"/>
                  {/* Wall bricks pattern */}
                  {[0,1].map(row=>[0,1,2,3].map(col=>(
                    <rect key={`${row}${col}`} x={x+14+col*(w/4-2)} y={240-h+20+row*18}
                      width={w/4-4} height={12} rx="1" fill="rgba(180,80,20,0.2)"/>
                  )))}
                  {/* Roof variants */}
                  {v===0 && <polygon points={`${x},${240-h} ${x+w/2+8},${240-h-48} ${x+w+16},${240-h}`} fill="rgba(194,65,12,0.7)"/>}
                  {v===1 && <>
                    <polygon points={`${x+8},${240-h} ${x+w/2+8},${240-h-38} ${x+w+8},${240-h}`} fill="rgba(180,55,10,0.65)"/>
                    {/* Shingles */}
                    {[0,1,2,3].map(r=>[0,1,2,3,4].map(col=>{
                      const sx=x+12+col*(w/4), sy=240-h-30+r*8;
                      if(sy>240-h) return null;
                      return <rect key={`${r}${col}`} x={sx} y={sy} width={w/4-2} height={6} rx="1" fill={r%2===0?"rgba(154,52,18,0.5)":"rgba(194,65,12,0.4)"}/>;
                    }))}
                  </>}
                  {v===2 && <rect x={x+8} y={240-h-18} width={w} height={18} fill="rgba(160,50,10,0.55)" rx="2"/>}
                  {v===3 && <>
                    <polygon points={`${x+8},${240-h} ${x+w/2+8},${240-h-55} ${x+w+8},${240-h}`} fill="rgba(140,40,5,0.7)"/>
                    <polygon points={`${x+30},${240-h} ${x+w/2+8},${240-h-30} ${x+w-14},${240-h}`} fill="rgba(200,80,20,0.35)"/>
                  </>}
                  {/* Windows — 2 rows */}
                  {[0,1].map(row=>[0,1,w>140?2:null].filter(Boolean).map(col=>(
                    <rect key={`w${row}${col}`} x={x+20+(col as number)*42} y={240-h+22+row*28}
                      width={22} height={18} rx="2"
                      fill={`rgba(135,206,235,${0.25+row*0.05})`}
                      stroke="rgba(249,115,22,0.15)" strokeWidth="0.8"/>
                  )))}
                  {/* Window glow */}
                  {i%3===0 && <rect x={x+20} y={240-h+22} width={22} height={18} rx="2"
                    fill="rgba(255,220,100,0.12)" className="flicker"/>}
                  {/* Door */}
                  <rect x={x+w/2-8} y={240-24} width={24} height={24} rx="3" fill="rgba(120,60,20,0.55)"/>
                  <path d={`M${x+w/2-8},${240-24} Q${x+w/2+4},${240-30} ${x+w/2+16},${240-24}`}
                    fill="rgba(120,60,20,0.4)"/>
                  <circle cx={x+w/2+10} cy={240-14} r="2.5" fill="rgba(249,115,22,0.7)"/>
                  {/* Chimney */}
                  {i%2===0 && <>
                    <rect x={x+w-28} y={240-h-52} width={16} height={38} fill="rgba(100,55,25,0.5)" rx="1"/>
                    <rect x={x+w-32} y={240-h-54} width={24} height={5} fill="rgba(80,40,18,0.6)" rx="1"/>
                  </>}
                  {/* Antenna */}
                  {i%5===0 && <>
                    <line x1={x+w/2+8} y1={240-h-50} x2={x+w/2+8} y2={240-h} stroke="rgba(80,80,80,0.3)" strokeWidth="1.5"/>
                    <line x1={x+w/2-2} y1={240-h-40} x2={x+w/2+18} y2={240-h-40} stroke="rgba(80,80,80,0.3)" strokeWidth="1.5"/>
                  </>}
                  {/* Solar panel */}
                  {i%7===0 && <rect x={x+18} y={240-h+2} width={40} height={20} rx="2"
                    fill="rgba(30,100,180,0.15)" stroke="rgba(30,100,180,0.2)" strokeWidth="0.8"/>}
                </g>
              );
            })}

            {/* Trees (more detailed) */}
            {[140,290,440,590,740,890,1040,1200,1360,1520,1670,1820,1980,2140,2290,2440,2590,2740].map((x,i)=>(
              <g key={x} opacity={0.1+(i%3)*0.025}>
                {/* Trunk */}
                <rect x={x-3} y={190} width={6} height={50} fill="rgba(100,60,20,0.5)" rx="2"/>
                {/* Tree layers */}
                <polygon points={`${x-18},${205} ${x},${175} ${x+18},${205}`} fill="rgba(80,160,70,0.4)"/>
                <polygon points={`${x-14},${195} ${x},${162} ${x+14},${195}`} fill="rgba(90,175,80,0.45)"/>
                <polygon points={`${x-10},${185} ${x},${150} ${x+10},${185}`} fill="rgba(100,185,85,0.5)"/>
              </g>
            ))}

            {/* Street lamps */}
            {[100,450,780,1120,1450,1800,2150,2500,2820].map((x,i)=>(
              <g key={x} opacity={0.12}>
                <line x1={x} y1="239" x2={x} y2="185" stroke="rgba(150,100,50,0.6)" strokeWidth="2"/>
                <path d={`M${x},185 Q${x+15},175 ${x+25},180`} fill="none" stroke="rgba(150,100,50,0.6)" strokeWidth="2"/>
                <circle cx={x+25} cy={180} r="5" fill="rgba(255,220,100,0.3)" className="flicker" style={{animationDelay:`${i*0.4}s`}}/>
                <circle cx={x+25} cy={180} r="10" fill="rgba(255,220,100,0.06)" className="flicker" style={{animationDelay:`${i*0.4}s`}}/>
              </g>
            ))}

            {/* Flying birds */}
            {[300,700,1100,1500,1900,2300,2700].map((x,i)=>(
              <g key={x} opacity={0.13} style={{animation:`cloudDrift ${12+i*2}s ease-in-out infinite alternate`,animationDelay:`${i*0.8}s`}}>
                <path d={`M${x},${35+i*10} Q${x+9},${29+i*10} ${x+18},${35+i*10}`}
                  fill="none" stroke="rgba(80,80,80,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d={`M${x+20},${35+i*10} Q${x+29},${29+i*10} ${x+38},${35+i*10}`}
                  fill="none" stroke="rgba(80,80,80,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
              </g>
            ))}

            {/* Road */}
            <rect x="0" y="230" width="2880" height="10" fill="rgba(100,80,60,0.08)"/>
            {/* Road dashes */}
            {[0,120,240,360,480,600,720,840,960,1080,1200,1320,1440,1560,1680,1800,1920,2040,2160,2280,2400,2520,2640,2760].map((x,i)=>(
              <rect key={x} x={x+20} y="233" width="60" height="3" rx="1.5" fill="rgba(255,255,255,0.06)"/>
            ))}

            {/* Ground */}
            <rect x="0" y="238" width="2880" height="2" fill="rgba(249,115,22,0.08)"/>
          </svg>
        </div>
      </div>

      {/* ─ 16. Wave layers ───────────────────────────────────────────── */}
      <svg style={{position:"absolute",bottom:0,left:0,width:"110%",height:"40%",overflow:"visible"}}
        viewBox="0 0 1440 360" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <g className="wave-1">
          <path fill="rgba(180,50,5,0.065)" d="M0,280 C200,200 400,330 600,250 C800,170 1000,310 1200,230 C1360,165 1440,260 1440,230 L1440,360 L0,360Z"/>
        </g>
        <g className="wave-2">
          <path fill="rgba(249,115,22,0.055)" d="M0,310 C220,230 460,360 720,280 C980,200 1180,340 1380,265 C1430,245 1440,310 1440,290 L1440,360 L0,360Z"/>
        </g>
        <g className="wave-3">
          <path fill="rgba(251,146,60,0.05)" d="M0,330 C260,260 520,360 780,300 C1040,240 1240,360 1440,310 L1440,360 L0,360Z"/>
        </g>
      </svg>

      {/* ─ 17. Clouds ────────────────────────────────────────────────── */}
      <div className="anim-cloud1" style={{position:"absolute",top:"8%",left:"4%",opacity:0.2}}><SceneryCloud scale={1.6}/></div>
      <div className="anim-cloud2" style={{position:"absolute",top:"5%",left:"38%",opacity:0.14}}><SceneryCloud scale={1.1}/></div>
      <div className="anim-cloud1" style={{position:"absolute",top:"14%",right:"22%",opacity:0.12}}><SceneryCloud scale={0.8}/></div>
      <div className="anim-cloud2" style={{position:"absolute",top:"20%",left:"62%",opacity:0.09}}><SceneryCloud scale={0.6}/></div>

      {/* ─ 18. Sun ───────────────────────────────────────────────────── */}
      <div className="anim-sun" style={{position:"absolute",top:"4%",left:"6%",opacity:0.25}}><ScenerySun/></div>

      {/* ─ 19. Big soft glow orbs ────────────────────────────────────── */}
      <div className="orb-1" style={{position:"absolute",top:"-20%",left:"48%",width:800,height:800,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(249,115,22,0.07) 0%,transparent 65%)",filter:"blur(60px)"}}/>
      <div className="orb-2" style={{position:"absolute",top:"28%",left:"-14%",width:600,height:600,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(234,88,12,0.055) 0%,transparent 65%)",filter:"blur(50px)"}}/>
      <div style={{position:"absolute",bottom:"15%",right:"-10%",width:500,height:500,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(249,115,22,0.045) 0%,transparent 65%)",filter:"blur(45px)"}}/>
      <div style={{position:"absolute",top:"55%",left:"35%",width:350,height:350,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(249,115,22,0.03) 0%,transparent 65%)",filter:"blur(40px)"}}/>

      {/* ─ 20. Readable overlay ──────────────────────────────────────── */}
      <div style={{position:"absolute",inset:0,
        background:"linear-gradient(to bottom,rgba(255,250,245,0.65) 0%,rgba(255,250,245,0.04) 38%,rgba(255,250,245,0.02) 58%,rgba(255,250,245,0.5) 100%)"}}/>
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

// ─── HERO PORTRAIT — large detailed illustration ─────────────────────────────
const HeroPortrait = memo(function HeroPortrait() {
  return (
    <svg width="320" height="360" viewBox="0 0 320 360" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{filter:"drop-shadow(0 24px 48px rgba(249,115,22,0.16))"}}>
      <defs>
        <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff7f0"/><stop offset="100%" stopColor="#fde8d0"/>
        </linearGradient>
        <linearGradient id="roof1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c2410c"/><stop offset="100%" stopColor="#7c2d12"/>
        </linearGradient>
        <linearGradient id="roof2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ea580c"/><stop offset="100%" stopColor="#9a3412"/>
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="320" height="360" rx="20" fill="url(#sky)"/>

      {/* Sun */}
      <motion.circle cx="268" cy="52" r="28" fill="rgba(249,115,22,0.18)"
        animate={{scale:[1,1.08,1],opacity:[0.7,1,0.7]}} transition={{duration:4,repeat:Infinity}}/>
      <circle cx="268" cy="52" r="18" fill="rgba(249,115,22,0.3)"/>
      <circle cx="268" cy="52" r="11" fill="rgba(249,115,22,0.55)"/>
      {[0,45,90,135,180,225,270,315].map((deg,i)=>{
        const r=Math.PI*deg/180;
        return <line key={i} x1={268+Math.cos(r)*22} y1={52+Math.sin(r)*22}
          x2={268+Math.cos(r)*32} y2={52+Math.sin(r)*32}
          stroke="rgba(249,115,22,0.4)" strokeWidth="2" strokeLinecap="round"/>;
      })}

      {/* Clouds */}
      <motion.g animate={{x:[0,8,0]}} transition={{duration:12,repeat:Infinity,ease:"easeInOut"}}>
        <ellipse cx="80" cy="55" rx="38" ry="16" fill="rgba(255,255,255,0.7)"/>
        <ellipse cx="100" cy="46" rx="24" ry="15" fill="rgba(255,255,255,0.65)"/>
        <ellipse cx="62" cy="50" rx="20" ry="12" fill="rgba(255,255,255,0.6)"/>
      </motion.g>
      <motion.g animate={{x:[0,-6,0]}} transition={{duration:16,repeat:Infinity,ease:"easeInOut"}}>
        <ellipse cx="210" cy="38" rx="28" ry="12" fill="rgba(255,255,255,0.5)"/>
        <ellipse cx="226" cy="31" rx="18" ry="11" fill="rgba(255,255,255,0.45)"/>
      </motion.g>

      {/* Background house */}
      <rect x="10" y="200" width="100" height="120" fill="rgba(249,115,22,0.12)" rx="2"/>
      <polygon points="10,202 60,158 110,202" fill="rgba(194,65,12,0.2)"/>
      <rect x="20" y="218" width="24" height="20" fill="rgba(135,206,235,0.3)" rx="1"/>
      <rect x="54" y="218" width="24" height="20" fill="rgba(135,206,235,0.3)" rx="1"/>
      <rect x="38" y="278" width="22" height="42" fill="rgba(120,60,20,0.2)" rx="1"/>

      {/* Main house */}
      <rect x="82" y="210" width="180" height="150" rx="3" fill="rgba(255,252,248,0.9)" stroke="rgba(249,115,22,0.2)" strokeWidth="1"/>
      {/* Roof */}
      <polygon points="68,212 172,136 286,212" fill="url(#roof1)"/>
      {/* Roof shingles */}
      {[0,1,2,3,4,5,6].map(r=>[0,1,2,3,4,5,6,7,8].map(col=>{
        const x=74+col*24-r*3, y=156+r*8;
        if(y>211||x<68||x>278) return null;
        return <rect key={`${r}${col}`} x={x} y={y} width="22" height="6" rx="1"
          fill={r%2===0?"rgba(154,52,18,0.85)":"rgba(194,65,12,0.7)"}/>;
      }))}

      {/* Chimney */}
      <rect x="224" y="148" width="18" height="42" fill="rgba(100,55,25,0.7)" rx="1"/>
      <rect x="220" y="146" width="26" height="6" fill="rgba(80,40,18,0.8)" rx="1"/>
      {/* Smoke */}
      {[0,1,2].map(i=>(
        <motion.ellipse key={i} cx={233} cy={130-i*14} rx={5+i*3} ry={4+i*2}
          fill="rgba(200,180,160,0.25)"
          animate={{y:[-2,2,-2],opacity:[0.4,0.1,0.4]}}
          transition={{duration:2+i*0.5,repeat:Infinity,delay:i*0.6}}/>
      ))}

      {/* Windows */}
      <rect x="95" y="228" width="42" height="36" rx="3" fill="rgba(135,206,235,0.4)" stroke="rgba(249,115,22,0.25)" strokeWidth="1.2"/>
      <line x1="116" y1="228" x2="116" y2="264" stroke="rgba(249,115,22,0.2)" strokeWidth="1"/>
      <line x1="95" y1="246" x2="137" y2="246" stroke="rgba(249,115,22,0.2)" strokeWidth="1"/>
      <rect x="210" y="228" width="42" height="36" rx="3" fill="rgba(135,206,235,0.4)" stroke="rgba(249,115,22,0.25)" strokeWidth="1.2"/>
      <line x1="231" y1="228" x2="231" y2="264" stroke="rgba(249,115,22,0.2)" strokeWidth="1"/>
      <line x1="210" y1="246" x2="252" y2="246" stroke="rgba(249,115,22,0.2)" strokeWidth="1"/>

      {/* Door */}
      <rect x="155" y="282" width="34" height="78" rx="3" fill="rgba(120,65,25,0.55)"/>
      <path d="M155,284 Q172,272 189,284" fill="rgba(120,65,25,0.45)" stroke="rgba(100,55,20,0.3)" strokeWidth="1"/>
      <circle cx="182" cy="321" r="3" fill="rgba(249,115,22,0.8)"/>

      {/* ROOFER on roof */}
      <motion.g animate={{y:[0,-3,0]}} transition={{duration:2,repeat:Infinity,ease:"easeInOut"}}>
        {/* Body */}
        <rect x="188" y="173" width="14" height="20" fill="rgba(30,30,30,0.75)" rx="2"/>
        {/* Head */}
        <circle cx="195" cy="168" r="8" fill="rgba(220,175,135,0.95)"/>
        {/* Hard hat */}
        <ellipse cx="195" cy="163" rx="11" ry="5" fill="rgba(249,115,22,0.9)"/>
        <rect x="184" y="161" width="22" height="4" rx="2" fill="rgba(234,88,12,0.95)"/>
        {/* Hammer arm */}
        <motion.g animate={{rotate:[-20,15,-20]}} transition={{duration:0.65,repeat:Infinity,ease:"easeInOut"}}
          style={{transformOrigin:"196px 183px"}}>
          <line x1="202" y1="183" x2="218" y2="170" stroke="rgba(80,50,20,0.7)" strokeWidth="3" strokeLinecap="round"/>
          <rect x="216" y="166" width="10" height="7" rx="1.5" fill="rgba(60,60,60,0.85)"/>
        </motion.g>
        {/* Other arm */}
        <line x1="188" y1="180" x2="176" y2="175" stroke="rgba(220,175,135,0.8)" strokeWidth="3" strokeLinecap="round"/>
        {/* Legs */}
        <line x1="193" y1="193" x2="190" y2="208" stroke="rgba(30,30,30,0.7)" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="199" y1="193" x2="202" y2="208" stroke="rgba(30,30,30,0.7)" strokeWidth="3.5" strokeLinecap="round"/>
        {/* Safety rope */}
        <motion.path d="M195,192 Q210,215 210,230" fill="none" stroke="rgba(249,115,22,0.4)" strokeWidth="1.5" strokeDasharray="3 2"
          animate={{opacity:[0.4,0.8,0.4]}} transition={{duration:2,repeat:Infinity}}/>
      </motion.g>

      {/* AI badge floating */}
      <motion.g animate={{y:[-4,4,-4],x:[0,3,0]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}>
        <rect x="228" y="100" width="76" height="44" rx="10" fill="rgba(249,115,22,0.12)" stroke="rgba(249,115,22,0.35)" strokeWidth="1.2"/>
        <text x="266" y="118" textAnchor="middle" fontSize="9" fill="rgba(249,115,22,0.7)" fontFamily="sans-serif" fontWeight="700">CALL ANSWERED</text>
        <text x="266" y="132" textAnchor="middle" fontSize="8" fill="rgba(34,197,94,0.8)" fontFamily="sans-serif" fontWeight="600">✓ Lead qualified</text>
        <circle cx="240" cy="122" r="5" fill="rgba(34,197,94,0.3)"/>
        <motion.circle cx="240" cy="122" r="8" fill="none" stroke="rgba(34,197,94,0.4)" strokeWidth="1"
          animate={{scale:[1,1.5,1],opacity:[0.5,0,0.5]}} transition={{duration:1.5,repeat:Infinity}}/>
      </motion.g>

      {/* Phone signal */}
      <motion.g animate={{opacity:[0.3,0.9,0.3]}} transition={{duration:1.8,repeat:Infinity}}>
        <path d="M36,108 Q42,114 36,120" fill="none" stroke="rgba(249,115,22,0.5)" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M30,104 Q40,114 30,124" fill="none" stroke="rgba(249,115,22,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M24,100 Q38,114 24,128" fill="none" stroke="rgba(249,115,22,0.2)" strokeWidth="1.2" strokeLinecap="round"/>
      </motion.g>

      {/* Grass */}
      <ellipse cx="160" cy="356" rx="155" ry="12" fill="rgba(100,160,60,0.12)"/>
      <rect x="5" y="350" width="310" height="10" rx="0" fill="rgba(100,160,60,0.08)"/>

      {/* Ladder */}
      <line x1="82" y1="210" x2="74" y2="290" stroke="rgba(140,80,30,0.5)" strokeWidth="3" strokeLinecap="round"/>
      <line x1="96" y1="210" x2="88" y2="290" stroke="rgba(140,80,30,0.5)" strokeWidth="3" strokeLinecap="round"/>
      {[0,1,2,3,4].map(i=>(
        <line key={i} x1={83+i*0.5} y1={218+i*15} x2={95-i*0.5} y2={218+i*15}
          stroke="rgba(140,80,30,0.4)" strokeWidth="2" strokeLinecap="round"/>
      ))}

      {/* roofY watermark */}
      <text x="160" y="346" textAnchor="middle" fontSize="8" fill="rgba(249,115,22,0.25)" fontFamily="sans-serif" fontWeight="700" letterSpacing="0.15em">roofY.ai</text>
    </svg>
  );
});

// ── New section illustrations ─────────────────────────────────────────────────

// Animated phone call → AI → lead flow portrait
const IlluCallFlow = memo(function IlluCallFlow() {
  return (
    <svg width="100%" height="200" viewBox="0 0 360 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Phone ringing */}
      <rect x="20" y="60" width="60" height="100" rx="10" fill="rgba(249,115,22,0.08)" stroke="rgba(249,115,22,0.3)" strokeWidth="1.5"/>
      <rect x="28" y="72" width="44" height="68" rx="4" fill="rgba(249,115,22,0.12)"/>
      <circle cx="50" cy="65" r="3" fill="rgba(249,115,22,0.4)"/>
      <circle cx="50" cy="155" r="5" fill="rgba(249,115,22,0.25)"/>
      {/* Call waves */}
      {[1,2,3].map(i=>(
        <motion.path key={i} d={`M${84+i*14},90 Q${90+i*14},110 ${84+i*14},130`}
          fill="none" stroke="rgba(249,115,22,0.4)" strokeWidth="1.8" strokeLinecap="round"
          animate={{opacity:[0,1,0]}} transition={{duration:1.5,repeat:Infinity,delay:i*0.3}}/>
      ))}
      {/* Arrow */}
      <motion.path d="M138,110 L168,110" stroke="rgba(249,115,22,0.5)" strokeWidth="2"
        strokeDasharray="6 4" animate={{strokeDashoffset:[0,-20]}}
        transition={{duration:1,repeat:Infinity,ease:"linear"}}/>
      <polygon points="168,106 176,110 168,114" fill="rgba(249,115,22,0.6)"/>
      {/* AI brain */}
      <motion.circle cx="210" cy="110" r="32" fill="rgba(249,115,22,0.07)" stroke="rgba(249,115,22,0.25)" strokeWidth="1.5"
        animate={{scale:[1,1.06,1]}} transition={{duration:2.5,repeat:Infinity}}/>
      <motion.circle cx="210" cy="110" r="40" fill="none" stroke="rgba(249,115,22,0.1)" strokeWidth="1"
        animate={{scale:[1,1.1,1],opacity:[0.5,1,0.5]}} transition={{duration:3,repeat:Infinity}}/>
      <text x="210" y="115" textAnchor="middle" fontSize="18" fill="rgba(249,115,22,0.8)" fontFamily="sans-serif" fontWeight="800">AI</text>
      {/* Mini badges around AI */}
      {[{angle:0,label:"SMS"},{angle:72,label:"WA"},{angle:144,label:"CRM"},{angle:216,label:"ADS"},{angle:288,label:"CALL"}].map((b,i)=>{
        const r = Math.PI*2*i/5 - Math.PI/2;
        const x = 210+Math.cos(r)*54, y = 110+Math.sin(r)*54;
        return (
          <motion.g key={b.label} animate={{opacity:[0.5,1,0.5]}} transition={{duration:2,repeat:Infinity,delay:i*0.4}}>
            <circle cx={x} cy={y} r="13" fill="rgba(249,115,22,0.1)" stroke="rgba(249,115,22,0.25)" strokeWidth="1"/>
            <text x={x} y={y+3} textAnchor="middle" fontSize="6" fill="rgba(249,115,22,0.8)" fontFamily="sans-serif" fontWeight="700">{b.label}</text>
          </motion.g>
        );
      })}
      {/* Arrow out */}
      <motion.path d="M252,110 L282,110" stroke="rgba(249,115,22,0.5)" strokeWidth="2"
        strokeDasharray="6 4" animate={{strokeDashoffset:[0,-20]}}
        transition={{duration:1,repeat:Infinity,ease:"linear",delay:0.5}}/>
      <polygon points="282,106 290,110 282,114" fill="rgba(249,115,22,0.6)"/>
      {/* Booked badge */}
      <motion.rect x="296" y="82" width="56" height="56" rx="12" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.35)" strokeWidth="1.5"
        animate={{scale:[1,1.05,1]}} transition={{duration:2,repeat:Infinity,delay:1}}/>
      <motion.path d="M310,110 l7,7 14-14" fill="none" stroke="rgba(34,197,94,0.85)" strokeWidth="2.5" strokeLinecap="round"
        initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:0.6,repeat:Infinity,repeatDelay:2.5}}/>
      <text x="324" y="130" textAnchor="middle" fontSize="7" fill="rgba(34,197,94,0.8)" fontFamily="sans-serif" fontWeight="700">BOOKED</text>
    </svg>
  );
});

// Storm + response time clock illustration
const IlluStormClock = memo(function IlluStormClock() {
  return (
    <svg width="100%" height="160" viewBox="0 0 340 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Storm cloud */}
      <motion.g animate={{x:[0,4,0]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut"}}>
        <ellipse cx="90" cy="64" rx="50" ry="28" fill="rgba(100,100,130,0.15)" stroke="rgba(100,100,150,0.25)" strokeWidth="1.2"/>
        <ellipse cx="110" cy="52" rx="34" ry="22" fill="rgba(100,100,130,0.12)" stroke="rgba(100,100,150,0.2)" strokeWidth="1"/>
        <ellipse cx="70" cy="56" rx="26" ry="18" fill="rgba(100,100,130,0.1)"/>
        {/* Lightning */}
        <motion.path d="M95,80 L82,102 L90,102 L78,124" fill="none" stroke="rgba(249,115,22,0.9)" strokeWidth="2.5" strokeLinecap="round"
          animate={{opacity:[0,1,0,1,0]}} transition={{duration:2,repeat:Infinity,repeatDelay:1.5}}/>
      </motion.g>
      {/* "5 MIN" clock */}
      <circle cx="200" cy="80" r="42" fill="rgba(249,115,22,0.06)" stroke="rgba(249,115,22,0.25)" strokeWidth="1.5"/>
      <circle cx="200" cy="80" r="3" fill="rgba(249,115,22,0.6)"/>
      {/* Clock ticks */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg,i)=>{
        const r=Math.PI*deg/180, long=i%3===0;
        return <line key={i} x1={200+Math.cos(r)*32} y1={80+Math.sin(r)*32}
          x2={200+Math.cos(r)*(long?26:29)} y2={80+Math.sin(r)*(long?26:29)}
          stroke="rgba(249,115,22,0.3)" strokeWidth={long?1.5:1}/>;
      })}
      {/* Minute hand (at 5 min = 30deg) */}
      <motion.line x1="200" y1="80" x2="220" y2="63" stroke="rgba(249,115,22,0.8)" strokeWidth="2.5" strokeLinecap="round"
        animate={{rotate:[0,360]}} transition={{duration:10,repeat:Infinity,ease:"linear"}}
        style={{transformOrigin:"200px 80px"}}/>
      <line x1="200" y1="80" x2="200" y2="56" stroke="rgba(249,115,22,0.4)" strokeWidth="2" strokeLinecap="round"/>
      <text x="200" y="106" textAnchor="middle" fontSize="9" fill="rgba(249,115,22,0.7)" fontFamily="sans-serif" fontWeight="700">RESPOND IN 5 MIN</text>
      {/* X mark — "too late" */}
      <motion.g animate={{opacity:[1,0.3,1]}} transition={{duration:2,repeat:Infinity,delay:1}}>
        <circle cx="290" cy="80" r="30" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.25)" strokeWidth="1.2"/>
        <path d="M276,66 L304,94 M304,66 L276,94" stroke="rgba(239,68,68,0.6)" strokeWidth="2.5" strokeLinecap="round"/>
        <text x="290" y="122" textAnchor="middle" fontSize="8" fill="rgba(239,68,68,0.6)" fontFamily="sans-serif" fontWeight="600">5 HRS LATER</text>
      </motion.g>
    </svg>
  );
});

// Revenue bar + growth portrait  
const IlluRevenue = memo(function IlluRevenue() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const vals =   [22,   28,   24,   38,   45,   52,   48,   65,   72,   80,   88,   98];
  const max = 98;
  return (
    <svg width="100%" height="180" viewBox="0 0 380 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="revBar" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(249,115,22,0.8)"/>
          <stop offset="100%" stopColor="rgba(249,115,22,0.15)"/>
        </linearGradient>
        <linearGradient id="revArea" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(249,115,22,0.2)"/>
          <stop offset="100%" stopColor="rgba(249,115,22,0)"/>
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[25,50,75,100].map(pct=>{
        const y = 140-(pct/100)*110;
        return <line key={pct} x1="30" y1={y} x2="370" y2={y} stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>;
      })}
      {/* Bars */}
      {vals.map((v,i)=>{
        const h=(v/max)*110, x=34+i*28;
        return (
          <motion.rect key={i} x={x} y={140-h} width="18" height={h} rx="3" fill="url(#revBar)"
            initial={{scaleY:0}} whileInView={{scaleY:1}} viewport={{once:true}}
            transition={{delay:i*0.06,duration:0.5,ease:[0.16,1,0.3,1]}}
            style={{transformOrigin:`${x+9}px 140px`}}/>
        );
      })}
      {/* Area + line */}
      <motion.polyline points={vals.map((v,i)=>`${43+i*28},${140-(v/max)*110}`).join(" ")}
        fill="none" stroke="rgba(249,115,22,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        initial={{pathLength:0}} whileInView={{pathLength:1}} viewport={{once:true}}
        transition={{duration:1.5,ease:[0.16,1,0.3,1]}}/>
      {/* Labels */}
      {months.map((m,i)=>(
        <text key={m} x={43+i*28} y="158" textAnchor="middle" fontSize="6" fill="rgba(0,0,0,0.25)" fontFamily="sans-serif">{m}</text>
      ))}
      {/* Badge */}
      <motion.rect x="300" y="12" width="68" height="30" rx="8" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.3)" strokeWidth="1.2"
        animate={{scale:[1,1.05,1]}} transition={{duration:2,repeat:Infinity}}/>
      <text x="334" y="28" textAnchor="middle" fontSize="11" fill="rgba(34,197,94,0.9)" fontFamily="sans-serif" fontWeight="700">+247%</text>
      <text x="334" y="38" textAnchor="middle" fontSize="7" fill="rgba(34,197,94,0.6)" fontFamily="sans-serif">Revenue</text>
    </svg>
  );
});

// Step connector illustration for How It Works
const IlluStepConnector = memo(function IlluStepConnector() {
  return (
    <svg width="100%" height="40" viewBox="0 0 800 40" fill="none" className="hidden md:block" xmlns="http://www.w3.org/2000/svg">
      {/* Line connecting 3 steps */}
      <motion.line x1="133" y1="20" x2="400" y2="20" stroke="rgba(249,115,22,0.25)" strokeWidth="1.5" strokeDasharray="6 4"
        initial={{pathLength:0}} whileInView={{pathLength:1}} viewport={{once:true}}
        transition={{duration:1,delay:0.5}}/>
      <motion.line x1="400" y1="20" x2="667" y2="20" stroke="rgba(249,115,22,0.25)" strokeWidth="1.5" strokeDasharray="6 4"
        initial={{pathLength:0}} whileInView={{pathLength:1}} viewport={{once:true}}
        transition={{duration:1,delay:1}}/>
      {[133,400,667].map((x,i)=>(
        <motion.circle key={x} cx={x} cy={20} r={8} fill="rgba(249,115,22,0.15)" stroke="rgba(249,115,22,0.4)" strokeWidth="1.5"
          initial={{scale:0}} whileInView={{scale:1}} viewport={{once:true}}
          transition={{delay:0.3+i*0.5,type:"spring"}}/>
      ))}
    </svg>
  );
});

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

// ─── PLAN ILLUSTRATIONS — unique SVG per plan ────────────────────────────────
function IlluWebsite() {
  return (
    <svg width="100%" height="72" viewBox="0 0 320 72" fill="none">
      <rect x="20" y="8" width="200" height="56" rx="8" fill="rgba(249,115,22,0.06)" stroke="rgba(249,115,22,0.18)" strokeWidth="1.2"/>
      <rect x="20" y="8" width="200" height="16" rx="8" fill="rgba(249,115,22,0.1)"/>
      <rect x="20" y="16" width="200" height="8" fill="rgba(249,115,22,0.1)"/>
      <circle cx="30" cy="16" r="3" fill="rgba(249,115,22,0.4)"/>
      <circle cx="40" cy="16" r="3" fill="rgba(249,115,22,0.25)"/>
      <circle cx="50" cy="16" r="3" fill="rgba(249,115,22,0.15)"/>
      <rect x="30" y="30" width="80" height="6" rx="3" fill="rgba(249,115,22,0.2)"/>
      <rect x="30" y="40" width="120" height="4" rx="2" fill="rgba(249,115,22,0.12)"/>
      <rect x="30" y="48" width="90" height="4" rx="2" fill="rgba(249,115,22,0.08)"/>
      <rect x="155" y="38" width="50" height="18" rx="5" fill="rgba(249,115,22,0.3)" stroke="rgba(249,115,22,0.5)" strokeWidth="1"/>
      <text x="180" y="50" textAnchor="middle" fontSize="7" fill="rgba(249,115,22,0.9)" fontFamily="sans-serif" fontWeight="700">BOOK NOW</text>
      {/* Cursor */}
      <motion.g animate={{x:[0,8,0],y:[0,4,0]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}>
        <polygon points="238,18 238,36 243,31 247,40 250,39 246,30 252,28" fill="rgba(249,115,22,0.7)" stroke="rgba(249,115,22,0.4)" strokeWidth="0.8"/>
      </motion.g>
      {/* Conversion pulse */}
      <motion.circle cx="280" cy="36" r="14" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.35)" strokeWidth="1.2"
        animate={{scale:[1,1.15,1],opacity:[0.7,1,0.7]}} transition={{duration:2,repeat:Infinity}}/>
      <text x="280" y="40" textAnchor="middle" fontSize="11" fill="rgba(34,197,94,0.9)" fontFamily="serif" fontWeight="700">+</text>
    </svg>
  );
}

function IlluPhone() {
  return (
    <svg width="100%" height="72" viewBox="0 0 320 72" fill="none">
      {/* Phone */}
      <rect x="16" y="6" width="36" height="60" rx="6" fill="rgba(249,115,22,0.08)" stroke="rgba(249,115,22,0.25)" strokeWidth="1.2"/>
      <rect x="20" y="14" width="28" height="40" rx="2" fill="rgba(249,115,22,0.12)"/>
      <circle cx="34" cy="10" r="2" fill="rgba(249,115,22,0.3)"/>
      <circle cx="34" cy="61" r="3" fill="rgba(249,115,22,0.2)"/>
      {/* Sound waves */}
      {[1,2,3].map(i=>(
        <motion.path key={i}
          d={`M${58+i*14},20 Q${64+i*14},36 ${58+i*14},52`}
          fill="none" stroke="rgba(249,115,22,0.35)" strokeWidth="1.5" strokeLinecap="round"
          animate={{opacity:[0.2,0.8,0.2],scaleX:[0.8,1,0.8]}} transition={{duration:1.8,repeat:Infinity,delay:i*0.3}}/>
      ))}
      {/* AI brain */}
      <circle cx="180" cy="36" r="20" fill="rgba(249,115,22,0.08)" stroke="rgba(249,115,22,0.22)" strokeWidth="1.2"/>
      <motion.circle cx="180" cy="36" r="26" fill="none" stroke="rgba(249,115,22,0.1)" strokeWidth="1"
        animate={{scale:[1,1.1,1]}} transition={{duration:2.5,repeat:Infinity}}/>
      <text x="180" y="40" textAnchor="middle" fontSize="13" fill="rgba(249,115,22,0.75)" fontFamily="sans-serif" fontWeight="700">AI</text>
      {/* Arrow */}
      <motion.path d="M208,36 L224,36" stroke="rgba(249,115,22,0.4)" strokeWidth="1.8" strokeLinecap="round"
        strokeDasharray="4 3" animate={{strokeDashoffset:[0,-14]}} transition={{duration:1,repeat:Infinity,ease:"linear"}}/>
      <polygon points="224,32 232,36 224,40" fill="rgba(249,115,22,0.5)"/>
      {/* Checkmark */}
      <circle cx="268" cy="36" r="16" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.3)" strokeWidth="1.2"/>
      <motion.path d="M260,36 l6,6 10-10" fill="none" stroke="rgba(34,197,94,0.8)" strokeWidth="2" strokeLinecap="round"
        initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:0.8,repeat:Infinity,repeatDelay:2}}/>
    </svg>
  );
}

function IlluChat() {
  return (
    <svg width="100%" height="72" viewBox="0 0 320 72" fill="none">
      {/* Bubbles */}
      <motion.rect x="16" y="10" width="110" height="20" rx="10" fill="rgba(249,115,22,0.12)" stroke="rgba(249,115,22,0.25)" strokeWidth="1"
        animate={{y:[0,-2,0]}} transition={{duration:2,repeat:Infinity}}/>
      <rect x="20" y="17" width="70" height="5" rx="2.5" fill="rgba(249,115,22,0.25)"/>
      <rect x="20" y="26" width="45" height="3" rx="1.5" fill="rgba(249,115,22,0.15)"/>
      <motion.rect x="140" y="32" width="130" height="20" rx="10" fill="rgba(249,115,22,0.2)" stroke="rgba(249,115,22,0.35)" strokeWidth="1"
        animate={{y:[0,-2,0]}} transition={{duration:2,repeat:Infinity,delay:0.5}}/>
      <rect x="146" y="39" width="85" height="5" rx="2.5" fill="rgba(249,115,22,0.4)"/>
      <motion.rect x="16" y="44" width="90" height="18" rx="9" fill="rgba(249,115,22,0.08)" stroke="rgba(249,115,22,0.18)" strokeWidth="1"
        animate={{y:[0,-2,0]}} transition={{duration:2,repeat:Infinity,delay:1}}/>
      <rect x="22" y="51" width="55" height="4" rx="2" fill="rgba(249,115,22,0.18)"/>
      {/* Platforms */}
      {[{x:262,label:"SMS"},{x:290,label:"WA"}].map((p,i)=>(
        <motion.g key={p.label} animate={{y:[0,-3,0]}} transition={{duration:2,repeat:Infinity,delay:i*0.6}}>
          <circle cx={p.x} cy="22" r="12" fill="rgba(249,115,22,0.1)" stroke="rgba(249,115,22,0.25)" strokeWidth="1"/>
          <text x={p.x} y="26" textAnchor="middle" fontSize="6" fill="rgba(249,115,22,0.8)" fontFamily="sans-serif" fontWeight="700">{p.label}</text>
        </motion.g>
      ))}
      <motion.circle cx="276" cy="54" r="10" fill="rgba(249,115,22,0.1)" stroke="rgba(249,115,22,0.25)" strokeWidth="1"
        animate={{y:[0,-3,0]}} transition={{duration:2,repeat:Infinity,delay:1.2}}>
      </motion.circle>
      <text x="276" y="58" textAnchor="middle" fontSize="6" fill="rgba(249,115,22,0.8)" fontFamily="sans-serif" fontWeight="700">IG</text>
    </svg>
  );
}

function IlluAds() {
  const bars = [28,42,35,55,48,68,62,80];
  const max = 80;
  return (
    <svg width="100%" height="72" viewBox="0 0 320 72" fill="none">
      <defs>
        <linearGradient id="adBar" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(249,115,22,0.75)"/>
          <stop offset="100%" stopColor="rgba(249,115,22,0.15)"/>
        </linearGradient>
      </defs>
      {bars.map((v,i)=>{
        const h=(v/max)*48;
        return (
          <motion.rect key={i} x={20+i*28} y={60-h} width="18" height={h} rx="3" fill="url(#adBar)"
            initial={{scaleY:0,originY:"bottom"}} animate={{scaleY:1}} transition={{delay:i*0.08,duration:0.5,ease:[0.16,1,0.3,1]}}
            style={{transformOrigin:`${20+i*28+9}px 60px`}}/>
        );
      })}
      <polyline points={bars.map((v,i)=>`${29+i*28},${60-(v/max)*48}`).join(" ")}
        fill="none" stroke="rgba(249,115,22,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <motion.circle cx={29+7*28} cy={60-(80/max)*48} r="5" fill="rgba(249,115,22,0.9)"
        animate={{scale:[1,1.3,1]}} transition={{duration:1.5,repeat:Infinity}}/>
      <text x="290" y="14" fontSize="10" fill="rgba(249,115,22,0.8)" fontFamily="sans-serif" fontWeight="700" textAnchor="end">+leads</text>
      <text x="290" y="26" fontSize="8" fill="rgba(249,115,22,0.5)" fontFamily="sans-serif" textAnchor="end">roofing ads</text>
    </svg>
  );
}

function IlluFollowUp() {
  return (
    <svg width="100%" height="72" viewBox="0 0 320 72" fill="none">
      {/* Timeline nodes */}
      {[{x:28,label:"Day 1",color:"rgba(249,115,22,0.9)"},{x:96,label:"Day 3",color:"rgba(249,115,22,0.7)"},{x:164,label:"Day 7",color:"rgba(249,115,22,0.5)"},{x:232,label:"Day 14",color:"rgba(34,197,94,0.8)"}].map((n,i)=>(
        <g key={n.x}>
          <motion.circle cx={n.x} cy="28" r="12" fill={`rgba(249,115,22,0.08)`} stroke={n.color} strokeWidth="1.5"
            animate={{scale:[1,1.12,1]}} transition={{duration:2,repeat:Infinity,delay:i*0.5}}/>
          <text x={n.x} y="32" textAnchor="middle" fontSize="7" fill={n.color} fontFamily="sans-serif" fontWeight="700">SMS</text>
          <text x={n.x} y="48" textAnchor="middle" fontSize="6.5" fill="rgba(0,0,0,0.3)" fontFamily="sans-serif">{n.label}</text>
          {i < 3 && (
            <motion.line x1={n.x+12} y1="28" x2={n.x+56} y2="28" stroke="rgba(249,115,22,0.2)" strokeWidth="1.2" strokeDasharray="4 3"
              animate={{strokeDashoffset:[0,-14]}} transition={{duration:1.2,repeat:Infinity,ease:"linear"}}/>
          )}
        </g>
      ))}
      {/* Closed badge */}
      <motion.rect x="248" y="14" width="52" height="28" rx="6" fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.35)" strokeWidth="1.2"
        animate={{scale:[1,1.05,1]}} transition={{duration:2,repeat:Infinity,delay:2}}/>
      <text x="274" y="32" textAnchor="middle" fontSize="8" fill="rgba(34,197,94,0.9)" fontFamily="sans-serif" fontWeight="700">CLOSED</text>
    </svg>
  );
}

function IlluQualify() {
  return (
    <svg width="100%" height="72" viewBox="0 0 320 72" fill="none">
      {/* Funnel */}
      <path d="M20,12 L80,12 L65,36 L35,36Z" fill="rgba(249,115,22,0.12)" stroke="rgba(249,115,22,0.25)" strokeWidth="1.2"/>
      <path d="M35,36 L65,36 L57,52 L43,52Z" fill="rgba(249,115,22,0.2)" stroke="rgba(249,115,22,0.35)" strokeWidth="1.2"/>
      <path d="M43,52 L57,52 L53,64 L47,64Z" fill="rgba(249,115,22,0.35)" stroke="rgba(249,115,22,0.5)" strokeWidth="1.2"/>
      <text x="50" y="22" textAnchor="middle" fontSize="6.5" fill="rgba(249,115,22,0.6)" fontFamily="sans-serif" fontWeight="600">ALL LEADS</text>
      <text x="50" y="46" textAnchor="middle" fontSize="6" fill="rgba(249,115,22,0.7)" fontFamily="sans-serif" fontWeight="600">WARM</text>
      <text x="50" y="61" textAnchor="middle" fontSize="5.5" fill="rgba(249,115,22,0.9)" fontFamily="sans-serif" fontWeight="700">HOT</text>
      {/* Arrow */}
      <motion.path d="M90,36 L110,36" stroke="rgba(249,115,22,0.4)" strokeWidth="1.8" strokeLinecap="round"
        strokeDasharray="4 3" animate={{strokeDashoffset:[0,-14]}} transition={{duration:1,repeat:Infinity,ease:"linear"}}/>
      <polygon points="110,32 118,36 110,40" fill="rgba(249,115,22,0.5)"/>
      {/* AI badge */}
      <circle cx="148" cy="36" r="22" fill="rgba(249,115,22,0.07)" stroke="rgba(249,115,22,0.2)" strokeWidth="1.2"/>
      <motion.circle cx="148" cy="36" r="28" fill="none" stroke="rgba(249,115,22,0.08)" strokeWidth="1"
        animate={{scale:[1,1.08,1]}} transition={{duration:2.5,repeat:Infinity}}/>
      <text x="148" y="40" textAnchor="middle" fontSize="12" fill="rgba(249,115,22,0.75)" fontFamily="sans-serif" fontWeight="700">AI</text>
      {/* Output: hot leads */}
      <motion.path d="M178,36 L198,36" stroke="rgba(249,115,22,0.4)" strokeWidth="1.8" strokeLinecap="round"
        strokeDasharray="4 3" animate={{strokeDashoffset:[0,-14]}} transition={{duration:1,repeat:Infinity,ease:"linear"}}/>
      <polygon points="198,32 206,36 198,40" fill="rgba(249,115,22,0.5)"/>
      {/* Person icon */}
      <circle cx="228" cy="24" r="8" fill="rgba(249,115,22,0.15)" stroke="rgba(249,115,22,0.3)" strokeWidth="1.2"/>
      <path d="M214,50 Q228,40 242,50" fill="rgba(249,115,22,0.15)" stroke="rgba(249,115,22,0.3)" strokeWidth="1.2"/>
      <motion.circle cx="244" cy="18" r="8" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.5)" strokeWidth="1.2"
        animate={{scale:[1,1.15,1]}} transition={{duration:1.8,repeat:Infinity}}>
      </motion.circle>
      <path d="M240,18 l3,3 5-5" stroke="rgba(34,197,94,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* n8n logo area */}
      <rect x="268" y="16" width="40" height="40" rx="8" fill="rgba(249,115,22,0.06)" stroke="rgba(249,115,22,0.15)" strokeWidth="1"/>
      <text x="288" y="40" textAnchor="middle" fontSize="8" fill="rgba(249,115,22,0.5)" fontFamily="sans-serif" fontWeight="700">n8n</text>
    </svg>
  );
}

function IlluCustom() {
  return (
    <svg width="100%" height="72" viewBox="0 0 320 72" fill="none">
      {/* Nodes */}
      {[{cx:36,cy:20},{cx:36,cy:52},{cx:110,cy:36},{cx:184,cy:20},{cx:184,cy:52},{cx:258,cy:36}].map((n,i)=>(
        <motion.circle key={i} cx={n.cx} cy={n.cy} r="10" fill="rgba(249,115,22,0.08)" stroke="rgba(249,115,22,0.25)" strokeWidth="1.2"
          animate={{scale:[1,1.1,1]}} transition={{duration:2,repeat:Infinity,delay:i*0.35}}/>
      ))}
      {/* Edges */}
      {[[36,20,110,36],[36,52,110,36],[110,36,184,20],[110,36,184,52],[184,20,258,36],[184,52,258,36]].map(([x1,y1,x2,y2],i)=>(
        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(249,115,22,0.2)" strokeWidth="1.2" strokeDasharray="4 3"
          animate={{strokeDashoffset:[0,-14]}} transition={{duration:1.2,repeat:Infinity,ease:"linear",delay:i*0.15}}/>
      ))}
      {/* Labels */}
      {[{cx:36,cy:20,t:"CRM"},{cx:36,cy:52,t:"SMS"},{cx:110,cy:36,t:"AI"},{cx:184,cy:20,t:"GHL"},{cx:184,cy:52,t:"WA"},{cx:258,cy:36,t:"OUT"}].map((n,i)=>(
        <text key={i} x={n.cx} y={n.cy+3} textAnchor="middle" fontSize="6" fill="rgba(249,115,22,0.7)" fontFamily="sans-serif" fontWeight="700">{n.t}</text>
      ))}
    </svg>
  );
}

// ─── PRICING CARD ─────────────────────────────────────────────────────────────
function PricingCard({ plan, annual, goto, index=0 }: { plan: typeof PLANS[0]; annual: boolean; goto:(p:Page)=>void; index?:number }) {
  const getPrice = () => {
    if (plan.commissionOnly || plan.custom) return null;
    return annual ? Math.round(plan.price * 0.8) : plan.price;
  };
  const displayedPrice = getPrice();
  const annualSaving = (!plan.commissionOnly && !plan.custom && annual) ? plan.price - Math.round(plan.price * 0.8) : 0;

  if (plan.fullBundle) {
    const bundleFeatures = [
      "AI Lead Generation Ads (Facebook & Instagram)",
      "AI-powered roofing website",
      "AI phone receptionist — 24/7",
      "WhatsApp, SMS & web chat AI",
      "Automated follow-up sequences",
      "Lead tracking dashboard",
      "Priority support",
      "+10% per closed deal",
    ];
    return (
      <Reveal y={40} delay={index*0.07}>
        <motion.div style={{
          background:"linear-gradient(135deg,#111 0%,#1c1c1c 100%)",
          border:`2px solid ${ORANGE}`,borderRadius:24,
          position:"relative",overflow:"hidden",
          boxShadow:`0 0 60px rgba(249,115,22,0.18)`,
        }}
        whileHover={{boxShadow:`0 32px 80px rgba(249,115,22,0.32)`,y:-4}}
        transition={{duration:0.38}}>
          {/* Grid texture */}
          <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:`linear-gradient(rgba(249,115,22,1) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,1) 1px,transparent 1px)`,backgroundSize:"40px 40px",borderRadius:24}}/>
          {/* Glow orb top-right */}
          <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 70%)",pointerEvents:"none"}}/>

          {/* Badge */}
          <motion.div className="badge-pulse" initial={{scale:0,rotate:-10}} animate={{scale:1,rotate:0}} transition={{delay:0.5,type:"spring"}}
            style={{position:"absolute",top:-14,left:32,...SF,background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`,padding:"5px 18px",borderRadius:9999,fontSize:11,fontWeight:700,color:"white",zIndex:10}}>
            Best Value — Everything Included
          </motion.div>

          {/* Illustration strip */}
          <div style={{padding:"44px 32px 0 32px"}}>
            <div style={{borderRadius:12,overflow:"hidden",background:"rgba(249,115,22,0.04)",border:"1px solid rgba(249,115,22,0.1)",marginBottom:24,padding:"8px 0"}}>
              <IlluAds/>
            </div>
          </div>

          <div style={{padding:"0 32px 36px 32px",display:"grid",gap:28}} className="md:grid-cols-[1fr_1.4fr]">
            <div>
              <p style={{...SF,color:ORANGE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>{plan.n}</p>
              <h2 style={{...IF,fontStyle:"italic",color:"white",fontSize:28,lineHeight:1.1,marginBottom:10}}>Full AI System<br/>+ Lead Gen Ads</h2>
              <p style={{...SF,color:"rgba(255,255,255,0.5)",fontSize:13,lineHeight:1.7,marginBottom:18}}>{plan.desc}</p>
              <div style={{marginBottom:20}}>
                <p style={{...SF,color:"rgba(255,255,255,0.35)",fontSize:11,marginBottom:4}}>{plan.setupDisplay}</p>
                <AnimatePresence mode="wait">
                  <motion.div key={annual?"annual":"monthly"} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.2}}>
                    <p style={{...IF,fontStyle:"italic",color:"white",fontSize:46,lineHeight:1}}>
                      {annual ? `$${(Math.round(plan.price*0.8)).toLocaleString()}` : `$${plan.price.toLocaleString()}`}
                      <span style={{...SF,fontSize:16,color:"rgba(255,255,255,0.35)",fontStyle:"normal"}}>/mo</span>
                    </p>
                    {plan.commission && (
                      <div style={{display:"inline-flex",alignItems:"center",gap:6,background:ORANGE_LIGHT,border:`1px solid ${ORANGE_BORDER}`,borderRadius:9999,padding:"4px 12px",marginTop:8}}>
                        <span style={{...SF,color:ORANGE,fontSize:11,fontWeight:700}}>◆ {plan.commission}</span>
                      </div>
                    )}
                    {annual && <p style={{...SF,color:"rgba(249,115,22,0.8)",fontSize:11,marginTop:6,fontWeight:600}}>You save ${annualSaving.toLocaleString()}/mo</p>}
                  </motion.div>
                </AnimatePresence>
              </div>
              <MagBtn orange onClick={()=>{ trackLead(); goto("contact"); }}>Get the full system →</MagBtn>
              {/* Features mobile */}
              <div style={{marginTop:20,borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:16,display:"flex",flexDirection:"column",gap:7}} className="md:hidden">
                {bundleFeatures.map((f,i)=>(
                  <motion.div key={f} style={{display:"flex",alignItems:"center",gap:10}}
                    initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.3+i*0.06}}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{flexShrink:0}}><path d="M2 5l2.5 2.5L8 3" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{...SF,color:"rgba(255,255,255,0.7)",fontSize:12,lineHeight:1.5}}>{f}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Features desktop */}
            <div style={{borderLeft:"1px solid rgba(255,255,255,0.07)",paddingLeft:28}} className="hidden md:flex md:flex-col md:justify-center">
              <p style={{...SF,color:"rgba(255,255,255,0.3)",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:16}}>Everything included</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {bundleFeatures.map((f,i)=>(
                  <motion.div key={f} style={{display:"flex",alignItems:"center",gap:10}}
                    initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:0.2+i*0.07,ease:E}}
                    whileHover={{x:6}}>
                    <div style={{width:18,height:18,borderRadius:5,background:"rgba(249,115,22,0.15)",border:"1px solid rgba(249,115,22,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span style={{...SF,color:"rgba(255,255,255,0.75)",fontSize:13,lineHeight:1.5}}>{f}</span>
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
      <Reveal y={40} delay={index*0.07}>
        <div style={{position:"relative",paddingTop:18}}>
          <motion.div className="badge-pulse" initial={{scale:0,rotate:-10}} animate={{scale:1,rotate:0}} transition={{delay:0.4,type:"spring"}}
            style={{position:"absolute",top:0,left:32,zIndex:10,...SF,background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`,padding:"5px 18px",borderRadius:9999,fontSize:11,fontWeight:700,color:"white"}}>
            Most Popular
          </motion.div>
          <motion.div style={{
            background:"linear-gradient(135deg,#1a0e00 0%,#2d1500 100%)",
            border:`2px solid ${ORANGE}`,borderRadius:24,
            position:"relative",overflow:"hidden",
            boxShadow:`0 0 50px rgba(249,115,22,0.2)`,
          }} whileHover={{boxShadow:`0 32px 80px rgba(249,115,22,0.3)`,y:-4}} transition={{duration:0.38}}>
            <div style={{position:"absolute",inset:0,opacity:0.05,backgroundImage:`linear-gradient(rgba(249,115,22,1) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,1) 1px,transparent 1px)`,backgroundSize:"40px 40px"}}/>
            <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"radial-gradient(circle,rgba(249,115,22,0.12) 0%,transparent 70%)",pointerEvents:"none"}}/>
            <div style={{padding:"32px 32px 0 32px"}}>
              <div style={{borderRadius:12,overflow:"hidden",background:"rgba(249,115,22,0.04)",border:"1px solid rgba(249,115,22,0.1)",marginBottom:24,padding:"8px 0"}}>
                <IlluPhone/>
              </div>
            </div>
            <div style={{padding:"0 32px 32px 32px",display:"grid",gap:28}} className="md:grid-cols-[1fr_1.4fr]">
              <div>
                <p style={{...SF,color:ORANGE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>{plan.n}</p>
                <h2 style={{...IF,fontStyle:"italic",color:"white",fontSize:28,lineHeight:1.1,marginBottom:10}}>Full AI System</h2>
                <p style={{...SF,color:"rgba(255,255,255,0.5)",fontSize:13,lineHeight:1.7,marginBottom:18}}>{plan.desc}</p>
                <div style={{marginBottom:20}}>
                  <p style={{...SF,color:"rgba(255,255,255,0.35)",fontSize:11,marginBottom:4}}>{plan.setupDisplay}</p>
                  <AnimatePresence mode="wait">
                    <motion.div key={annual?"a":"m"} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.2}}>
                      <p style={{...IF,fontStyle:"italic",color:"white",fontSize:46,lineHeight:1}}>
                        ${dp.toLocaleString()}<span style={{...SF,fontSize:16,color:"rgba(255,255,255,0.35)",fontStyle:"normal"}}>/mo</span>
                      </p>
                      {annual && <p style={{...SF,color:"rgba(249,115,22,0.8)",fontSize:11,marginTop:6,fontWeight:600}}>You save ${saving.toLocaleString()}/mo</p>}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <MagBtn orange onClick={()=>{ trackLead(); goto("contact"); }}>Get started →</MagBtn>
                <div style={{marginTop:20,borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:16,display:"flex",flexDirection:"column",gap:7}} className="md:hidden">
                  {systemFeatures.map((f,i)=>(
                    <motion.div key={f} style={{display:"flex",alignItems:"center",gap:10}}
                      initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.3+i*0.06}}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{flexShrink:0}}><path d="M2 5l2.5 2.5L8 3" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span style={{...SF,color:"rgba(255,255,255,0.7)",fontSize:12}}>{f}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div style={{borderLeft:"1px solid rgba(255,255,255,0.07)",paddingLeft:28}} className="hidden md:flex md:flex-col md:justify-center">
                <p style={{...SF,color:"rgba(255,255,255,0.3)",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:16}}>What's included</p>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {systemFeatures.map((f,i)=>(
                    <motion.div key={f} style={{display:"flex",alignItems:"center",gap:10}}
                      initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:0.2+i*0.07,ease:E}}
                      whileHover={{x:6}}>
                      <div style={{width:18,height:18,borderRadius:5,background:"rgba(249,115,22,0.15)",border:"1px solid rgba(249,115,22,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <span style={{...SF,color:"rgba(255,255,255,0.75)",fontSize:13}}>{f}</span>
                    </motion.div>
                  ))}
                </div>
                <div style={{marginTop:16,padding:"12px 14px",background:"rgba(249,115,22,0.07)",border:`1px solid ${ORANGE_BORDER}`,borderRadius:10}}>
                  <p style={{...SF,color:ORANGE,fontSize:11,fontWeight:700,marginBottom:2}}>No ads included</p>
                  <p style={{...SF,color:"rgba(255,255,255,0.4)",fontSize:11,lineHeight:1.5}}>Want Meta ads too? See Full AI System + Ads below.</p>
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
          <div style={{position:"relative",height:88,overflow:"hidden",background:"rgba(16,185,129,0.05)",borderBottom:"1px solid rgba(16,185,129,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{position:"absolute",inset:0,opacity:0.06,backgroundImage:`linear-gradient(rgba(16,185,129,1) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,1) 1px,transparent 1px)`,backgroundSize:"20px 20px"}}/>
            <svg width="280" height="72" viewBox="0 0 280 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* $0 pill */}
              <rect x="10" y="20" width="60" height="32" rx="8" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" strokeWidth="1.2"/>
              <text x="40" y="38" textAnchor="middle" style={{fontFamily:"'Instrument Serif',serif",fontStyle:"italic"}} fontSize="20" fill="rgba(16,185,129,0.8)">$0</text>
              <text x="40" y="58" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.2)" fontFamily="sans-serif" fontWeight="600" letterSpacing="0.08em">UPFRONT</text>
              {/* Animated arrow */}
              <motion.path d="M76 36 L110 36" stroke="rgba(16,185,129,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="5 3"
                animate={{strokeDashoffset:[0,-16]}} transition={{duration:1,repeat:Infinity,ease:"linear"}}/>
              <polygon points="110,32 118,36 110,40" fill="rgba(16,185,129,0.5)"/>
              {/* AI circle */}
              <motion.circle cx="140" cy="36" r="18" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.25)" strokeWidth="1.2"
                animate={{scale:[1,1.08,1]}} transition={{duration:2,repeat:Infinity}}/>
              <text x="140" y="40" textAnchor="middle" fontSize="11" fill="rgba(16,185,129,0.75)" fontFamily="sans-serif" fontWeight="700">AI</text>
              {/* Arrow 2 */}
              <motion.path d="M162 36 L196 36" stroke="rgba(16,185,129,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="5 3"
                animate={{strokeDashoffset:[0,-16]}} transition={{duration:1,repeat:Infinity,ease:"linear",delay:0.5}}/>
              <polygon points="196,32 204,36 196,40" fill="rgba(16,185,129,0.5)"/>
              {/* 13% pill */}
              <motion.rect x="210" y="20" width="60" height="32" rx="8" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.2"
                animate={{scale:[1,1.05,1]}} transition={{duration:2,repeat:Infinity,delay:1}}/>
              <text x="240" y="38" textAnchor="middle" style={{fontFamily:"'Instrument Serif',serif",fontStyle:"italic"}} fontSize="18" fill="rgba(16,185,129,0.9)">13%</text>
              <text x="240" y="58" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.2)" fontFamily="sans-serif" fontWeight="600" letterSpacing="0.08em">ON CLOSE</text>
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

  // pick illustration per plan
  const PlanIllu = plan.id==="ai-website" ? IlluWebsite
    : plan.id==="meta-ads" ? IlluAds
    : plan.id==="ai-receptionist" ? IlluPhone
    : plan.id==="custom" ? IlluCustom
    : null;
  // (follow-up and qualify are standalone plans not in PLANS array — IlluFollowUp/IlluQualify available if needed)

  return (
    <Reveal y={55} delay={index*0.07}>
      <div style={{position:"relative", paddingTop: plan.custom ? 18 : 0}}>
        {plan.custom && (
          <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",zIndex:10,...SF,background:"#111",color:"white",padding:"5px 16px",borderRadius:9999,fontSize:11,fontWeight:700,whiteSpace:"nowrap",letterSpacing:"0.08em"}}>BESPOKE</div>
        )}
      <GlowCard className="rounded-2xl flex flex-col relative cursor-default h-full"
        style={{background:"rgba(255,255,255,0.72)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.92)",overflow:"hidden"}}>
        {/* Illustration strip — every card gets one */}
        {PlanIllu && (
          <div style={{borderBottom:"1px solid rgba(249,115,22,0.08)",background:"linear-gradient(135deg,rgba(249,115,22,0.04),rgba(234,88,12,0.02))",padding:"10px 0 6px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,opacity:0.03,backgroundImage:`linear-gradient(rgba(249,115,22,1) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,1) 1px,transparent 1px)`,backgroundSize:"18px 18px"}}/>
            <PlanIllu/>
          </div>
        )}
        <div style={{padding:"20px 24px 24px",display:"flex",flexDirection:"column",flex:1}}>
          <p style={{...SF,color:ORANGE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:4}}>{plan.n}</p>
          <h3 style={{...IF,fontStyle:"italic"}} className="text-xl text-gray-900 mb-2">{plan.title}</h3>
          <p style={SF} className="text-sm text-gray-500 mb-4 leading-relaxed">{plan.desc}</p>

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
        <motion.div style={{y:heroY,opacity:heroO,position:"relative",zIndex:4}} className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-16 items-center">

            {/* Left — text */}
            <div className="text-center lg:text-left">
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,ease:E}}>
                <motion.span style={{...SF,color:ORANGE,background:ORANGE_LIGHT,border:`1px solid ${ORANGE_BORDER}`}}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8"
                  whileHover={{scale:1.06}}>
                  <motion.span animate={{rotate:[0,360]}} transition={{duration:8,repeat:Infinity,ease:"linear"}}>✦</motion.span>
                  AI Automation for Roofing Contractors
                </motion.span>
              </motion.div>

              <h1 style={{...IF,fontStyle:"italic",fontSize:"clamp(46px,6.5vw,96px)",lineHeight:1.1}} className="text-gray-900 tracking-tight mb-6">
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
                style={{...IF,fontStyle:"italic",fontSize:"clamp(17px,1.9vw,26px)"}} className="text-gray-400 mb-4">
                AI automation built exclusively for roofing companies.
              </motion.p>
              <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.8,ease:E,delay:0.88}}
                style={SF} className="text-base text-gray-500 leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10">
                <span style={{color:ORANGE}}>roofY</span> builds AI systems that answer every call, respond to every lead, run your Meta ads, and follow up automatically — so your roofing company never loses a job to slow response time.
              </motion.p>

              <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.8,ease:E,delay:1}}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <MagBtn orange onClick={()=>goto("pricing")}>See pricing</MagBtn>
                <MagBtn dark onClick={()=>{ trackLead(); goto("contact"); }}>Contact us</MagBtn>
                <motion.button onClick={()=>document.getElementById("demo-section")?.scrollIntoView({behavior:"smooth"})}
                  whileHover={{scale:1.06,y:-3}} whileTap={{scale:0.96}}
                  style={{...SF,background:ORANGE_LIGHT,border:`1px solid ${ORANGE_BORDER}`,color:ORANGE,borderRadius:9999,padding:"14px 32px"}}
                  className="text-sm font-semibold">Try our AI ↓</motion.button>
              </motion.div>

              <motion.div className="flex flex-col items-center lg:items-start mt-16" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8}}>
                <div className="scroll-cue" style={{width:1,height:48,background:`linear-gradient(to bottom,rgba(249,115,22,0.7),transparent)`}}/>
              </motion.div>
            </div>

            {/* Right — portrait */}
            <motion.div initial={{opacity:0,x:40,scale:0.92}} animate={{opacity:1,x:0,scale:1}}
              transition={{delay:0.5,duration:1,ease:E}}
              className="hidden lg:flex items-center justify-center flex-shrink-0">
              <HeroPortrait/>
            </motion.div>

          </div>
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
              <div className="mt-10 flex justify-center">
                <motion.div whileHover={{scale:1.06}} transition={{duration:0.3}}>
                  <RoofHouseIllustration size={140}/>
                </motion.div>
              </div>
              <p style={SF} className="mt-3 text-xs uppercase tracking-widest text-gray-300">Each missed call = lost job</p>
              {/* Mini stat */}
              <motion.div style={{marginTop:20,background:"rgba(249,115,22,0.06)",border:`1px solid ${ORANGE_BORDER}`,borderRadius:12,padding:"12px 16px"}}
                initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.4}}>
                <p style={{...IF,fontStyle:"italic",color:ORANGE,fontSize:28,lineHeight:1}}>78%</p>
                <p style={{...SF,fontSize:11,color:"#6b7280",marginTop:4}}>of homeowners hire the first contractor to respond</p>
              </motion.div>
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
      <section className="py-28 px-6 overflow-hidden" style={{background:"rgba(255,255,255,0.28)",backdropFilter:"blur(8px)",position:"relative",zIndex:4}}>
        {/* Spotlight sweep */}
        <div className="spotlight absolute inset-0 pointer-events-none" style={{background:"linear-gradient(135deg,rgba(249,115,22,0.06) 0%,transparent 60%)",width:"60%",height:"60%",top:"10%",left:"5%"}}/>
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center mb-6">
            <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-4">How it works</p>
            <h2 style={{...IF,fontStyle:"italic",fontSize:"clamp(32px,4vw,56px)"}} className="text-gray-900 leading-tight">Every lead.<br/><em style={{color:ORANGE}}>Handled automatically.</em></h2>
            <p style={SF} className="mt-4 text-gray-500 max-w-lg mx-auto">From the moment a homeowner calls or clicks — roofY's AI takes over instantly, qualifies them, and books the estimate without you lifting a finger.</p>
          </Reveal>

          {/* Big call-flow illustration */}
          <Reveal y={30} delay={0.1} className="mb-12">
            <div className="rounded-2xl px-6 pt-6 pb-2" style={{background:"rgba(255,255,255,0.62)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,0.92)"}}>
              <p style={{...SF,color:ORANGE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:4}}>Live call flow</p>
              <IlluCallFlow/>
            </div>
          </Reveal>

          {/* Step connector */}
          <IlluStepConnector/>

          <div className="grid gap-5 md:grid-cols-3 mb-14">
            {STEPS.map((s,i)=>(
              <Reveal key={i} delay={i*0.15} y={55}>
                <GlowCard className="rounded-2xl p-8 cursor-default h-full" style={{background:"rgba(255,255,255,0.72)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,0.92)"}}>
                  {/* Animated number */}
                  <motion.span style={{...IF,fontStyle:"italic",fontSize:"3.5rem",color:"rgba(249,115,22,0.18)",display:"block",lineHeight:1,marginBottom:16}}
                    initial={{opacity:0,scale:0.5}} whileInView={{opacity:1,scale:1}} viewport={{once:true}}
                    transition={{delay:0.2+i*0.15,type:"spring",stiffness:200}}>
                    {s.n}
                  </motion.span>
                  <h3 style={{...IF,fontStyle:"italic"}} className="text-xl text-gray-900 mb-3">{s.title}</h3>
                  <p style={SF} className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                  {/* Bottom accent line */}
                  <motion.div style={{height:2,background:`linear-gradient(90deg,${ORANGE},transparent)`,borderRadius:2,marginTop:20}}
                    initial={{scaleX:0,originX:0}} whileInView={{scaleX:1}} viewport={{once:true}}
                    transition={{delay:0.5+i*0.15,duration:0.8}}/>
                </GlowCard>
              </Reveal>
            ))}
          </div>

          {/* 3-panel data cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Reveal y={30} delay={0.0}>
              <div className="rounded-2xl p-6 h-full" style={{background:"rgba(255,255,255,0.62)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,0.92)"}}>
                <p style={{...SF,color:ORANGE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>Response speed</p>
                <p style={{...IF,fontStyle:"italic",fontSize:20}} className="text-gray-900 mb-4">Reply in <em style={{color:ORANGE}}>under 60 sec.</em></p>
                <IlluStormClock/>
              </div>
            </Reveal>
            <Reveal y={30} delay={0.1}>
              <div className="rounded-2xl p-6 h-full" style={{background:"rgba(255,255,255,0.62)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,0.92)"}}>
                <p style={{...SF,color:ORANGE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>Traffic growth</p>
                <p style={{...IF,fontStyle:"italic",fontSize:20}} className="text-gray-900 mb-4">Leads find you <em style={{color:ORANGE}}>24/7.</em></p>
                <IllustrationViewsChart/>
              </div>
            </Reveal>
            <Reveal y={30} delay={0.2}>
              <div className="rounded-2xl p-6 h-full" style={{background:"rgba(255,255,255,0.62)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,0.92)"}}>
                <p style={{...SF,color:ORANGE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>Revenue impact</p>
                <p style={{...IF,fontStyle:"italic",fontSize:20}} className="text-gray-900 mb-4">Clients who <em style={{color:ORANGE}}>close more.</em></p>
                <IlluRevenue/>
              </div>
            </Reveal>
          </div>

          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            <MagBtn orange onClick={()=>{ trackLead(); goto("contact"); }}>Start the conversation</MagBtn>
            <MagBtn onClick={()=>goto("pricing")}>See pricing</MagBtn>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-28 px-6 overflow-hidden" style={{position:"relative",zIndex:4}}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-4">What we build</p>
              <h2 style={{...IF,fontStyle:"italic",fontSize:"clamp(36px,5vw,70px)"}} className="text-gray-900 leading-[0.93]">AI tools built<br/><em style={{color:ORANGE}}>for roofers.</em></h2>
            </Reveal>
            <motion.button onClick={()=>goto("services")} whileHover={{scale:1.05,x:-4}}
              style={{...SF,background:"rgba(255,255,255,0.55)",backdropFilter:"blur(10px)",border:"1px solid rgba(0,0,0,0.08)",borderRadius:12,padding:"10px 20px"}}
              className="text-xs font-medium uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors self-start">All services →</motion.button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s,i)=>(
              <Reveal key={i} delay={i*0.09} y={52}>
                <GlowCard className="rounded-2xl cursor-default h-full overflow-hidden" style={{background:"rgba(255,255,255,0.72)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,0.92)"}}>
                  {/* Top accent bar */}
                  <motion.div style={{height:3,background:`linear-gradient(90deg,${ORANGE},${ORANGE_DARK},transparent)`}}
                    initial={{scaleX:0,originX:0}} whileInView={{scaleX:1}} viewport={{once:true}}
                    transition={{delay:0.1+i*0.09,duration:0.7}}/>
                  <div style={{padding:"24px 28px 28px"}}>
                    {/* Number + price row */}
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16}}>
                      <motion.span style={{...IF,fontStyle:"italic",fontSize:"2.8rem",color:"rgba(249,115,22,0.18)",lineHeight:1}}
                        initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
                        transition={{delay:0.15+i*0.09}}>
                        {s.n}
                      </motion.span>
                      <motion.span whileHover={{scale:1.08,y:-2}} style={{...SF,background:ORANGE_LIGHT,color:ORANGE,border:`1px solid ${ORANGE_BORDER}`,borderRadius:9999,padding:"4px 12px",fontSize:11,fontWeight:700,marginTop:6}}>
                        {s.price}
                      </motion.span>
                    </div>
                    <h3 style={{...IF,fontStyle:"italic"}} className="text-xl text-gray-900 mb-2">{s.title}</h3>
                    <p style={SF} className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                    {/* Bottom CTA link */}
                    <motion.button onClick={()=>{ trackLead(); goto("contact"); }}
                      style={{...SF,marginTop:18,display:"inline-flex",alignItems:"center",gap:6,color:ORANGE,fontSize:12,fontWeight:700,background:"none",border:"none",cursor:"pointer",padding:0}}
                      whileHover={{x:4}}>
                      Get started <span style={{fontSize:14}}>→</span>
                    </motion.button>
                  </div>
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
      <section className="py-28 px-6 overflow-hidden" style={{position:"relative",zIndex:4}}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 md:grid-cols-[1fr_1.8fr] md:gap-24">
            {/* Left sticky */}
            <div className="md:sticky md:top-32 md:self-start">
              <Reveal>
                <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-4">Why roofY</p>
                <h2 style={{...IF,fontStyle:"italic",fontSize:"clamp(36px,4.5vw,62px)"}} className="text-gray-900 leading-[0.93] mb-8">roofY vs.<br/><em style={{color:ORANGE}}>doing it<br/>manually.</em></h2>
                {/* Animated score cards */}
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[
                    {label:"Response time",roofY:"< 60s",manual:"Hours",pct:96},
                    {label:"Lead capture",roofY:"100%",manual:"~40%",pct:85},
                    {label:"Follow-ups sent",roofY:"Automatic",manual:"Manual",pct:92},
                  ].map((row,i)=>(
                    <motion.div key={row.label} style={{background:"rgba(255,255,255,0.62)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.9)",borderRadius:12,padding:"12px 16px"}}
                      initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.12}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{...SF,fontSize:11,color:"#6b7280"}}>{row.label}</span>
                        <span style={{...SF,fontSize:11,fontWeight:700,color:ORANGE}}>{row.roofY}</span>
                      </div>
                      <div style={{height:4,background:"rgba(0,0,0,0.06)",borderRadius:9999,overflow:"hidden"}}>
                        <motion.div style={{height:"100%",background:`linear-gradient(90deg,${ORANGE},${ORANGE_DARK})`,borderRadius:9999}}
                          initial={{width:0}} whileInView={{width:`${row.pct}%`}} viewport={{once:true}}
                          transition={{delay:0.3+i*0.12,duration:1,ease:[0.16,1,0.3,1]}}/>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Reveal>
            </div>
            {/* Right table */}
            <Reveal y={38}>
              <div className="overflow-hidden rounded-2xl" style={{background:"rgba(255,255,255,0.68)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.92)",boxShadow:"0 8px 40px rgba(0,0,0,0.05)"}}>
                <div className="grid grid-cols-[1.6fr_1fr_1fr]" style={{borderBottom:"1px solid rgba(0,0,0,0.07)",background:"rgba(249,115,22,0.03)"}}>
                  {["Feature","roofY AI","Without AI"].map((h,i)=>(
                    <div key={h} style={{...SF,borderLeft:i>0?"1px solid rgba(0,0,0,0.05)":undefined}}
                      className={`px-6 py-4 text-xs font-semibold uppercase tracking-widest ${i===1?"text-orange-500":"text-gray-400"}`}>{h}</div>
                  ))}
                </div>
                {COMPARE.map(([feat,ours,theirs],i)=>(
                  <motion.div key={i} initial={{opacity:0,x:-18}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:0.06*i,duration:0.5}}
                    whileHover={{background:"rgba(249,115,22,0.03)"}} className="grid grid-cols-[1.6fr_1fr_1fr]" style={{borderBottom:"1px solid rgba(0,0,0,0.04)"}}>
                    <div style={SF} className="flex items-center px-6 py-4 text-sm text-gray-500">{feat}</div>
                    <div style={{...SF,borderLeft:"1px solid rgba(0,0,0,0.04)"}} className="flex items-center gap-2 px-6 py-4 text-sm font-semibold text-orange-600">
                      <motion.span style={{display:"inline-block"}} animate={{rotate:[0,15,0,-15,0]}} transition={{duration:1,delay:i*0.2+1,repeat:Infinity,repeatDelay:4}}>◆</motion.span>
                      {ours}
                    </div>
                    <div style={{...SF,borderLeft:"1px solid rgba(0,0,0,0.04)"}} className="flex items-center px-6 py-4 text-sm text-gray-400 line-through decoration-red-300">{theirs}</div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-36 pt-10 overflow-hidden" style={{position:"relative",zIndex:4}}>
        <div className="mx-auto max-w-6xl">
          <DrawLine className="mb-20 w-full"/>
          <div className="grid gap-14 md:grid-cols-2 md:gap-24">
            <Reveal y={65}>
              <h2 style={{...IF,fontStyle:"italic",fontSize:"clamp(52px,7.5vw,110px)"}} className="text-gray-900 leading-[0.88]">A calmer<br/>way to<br/><em style={{color:ORANGE}}>grow.</em></h2>
              {/* Floating stat pills */}
              <div style={{marginTop:32,display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {icon:"📞",stat:"100%",label:"of calls answered"},
                  {icon:"⚡",stat:"< 60s",label:"average response time"},
                  {icon:"🔁",stat:"3×",label:"more revenue with follow-ups"},
                ].map((item,i)=>(
                  <motion.div key={item.label} className="float-slow" style={{animationDelay:`${i*0.8}s`}}
                    initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:0.2+i*0.12}}>
                    <div style={{display:"inline-flex",alignItems:"center",gap:12,background:"rgba(255,255,255,0.65)",backdropFilter:"blur(10px)",border:`1px solid ${ORANGE_BORDER}`,borderRadius:16,padding:"10px 18px"}}>
                      <span style={{fontSize:18}}>{item.icon}</span>
                      <span style={{...IF,fontStyle:"italic",fontSize:22,color:ORANGE,lineHeight:1}}>{item.stat}</span>
                      <span style={{...SF,fontSize:12,color:"#6b7280"}}>{item.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
            <Reveal y={42} delay={0.16} className="flex flex-col justify-center">
              {/* Revenue illustration */}
              <div style={{borderRadius:16,overflow:"hidden",background:"rgba(255,255,255,0.55)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.9)",padding:"16px 16px 8px",marginBottom:28}}>
                <p style={{...SF,color:ORANGE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:4}}>Typical client revenue after roofY</p>
                <IlluRevenue/>
              </div>
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
            {PLANS.filter(p=>["commission-only","ai-website","meta-ads"].includes(p.id)).map((p,i)=>(
              <PricingCard key={p.id} plan={p} annual={annual} goto={goto} index={i}/>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2" style={{alignItems:"stretch"}}>
            {PLANS.filter(p=>["ai-receptionist","custom"].includes(p.id)).map((p,i)=>(
              <PricingCard key={p.id} plan={p} annual={annual} goto={goto} index={i}/>
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
            initial={{opacity:0,y:24,scale:0.99}}
            animate={{opacity:1,y:0,scale:1}}
            exit={{opacity:0,y:-24,scale:0.99}}
            transition={{duration:0.4,ease:E}}>
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