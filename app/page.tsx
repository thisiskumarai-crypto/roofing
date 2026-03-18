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

const ORANGE      = "#f97316";
const ORANGE_DARK = "#ea580c";
const ORANGE_LIGHT  = "rgba(249,115,22,0.10)";
const ORANGE_BORDER = "rgba(249,115,22,0.22)";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TICKER = ["AI Voice Receptionist","24/7 Availability","Roofing Leads","Meta Ads","Follow-Up Sequences","No Missed Calls","Instant Response","Facebook & Instagram","n8n Workflows","Custom Automation","Real-Time Alerts","Storm Damage Leads"];

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

// PLANS — no CRM card, new bundle card
const PLANS = [
  {
    n:"01", title:"AI Website System", price:"$399", setup:"$250",
    desc:"High-conversion roofing website with lead capture, AI chat, and analytics.",
    features:["Custom AI-connected landing page","Lead capture form","Mobile-first design","AI integrations","Analytics & tracking"],
    hot:false, custom:false, ads:false, bundle:false,
  },
  {
    n:"02", title:"AI Lead Generation Ads", price:"$399", setup:"$0",
    desc:"Meta (Facebook & Instagram) ads for roofing companies. Performance-based or flat monthly.",
    features:["Ad setup & strategy","Roofing-focused creatives","Audience targeting","Lead form optimization","Weekly tracking & optimization"],
    hot:false, custom:false, ads:true, bundle:false,
  },
  {
    n:"03", title:"AI Voice & Chat Receptionist", price:"$699", setup:"$350",
    desc:"24/7 AI phone receptionist, WhatsApp & SMS automation, lead qualification, and reporting.",
    features:["AI phone receptionist (24/7)","WhatsApp & SMS automation","Lead qualification","Automated follow-ups","Weekly report"],
    hot:false, custom:false, ads:false, bundle:false,
  },
  {
    n:"04", title:"Full AI System + Ads", price:"$1,499", setup:"$500",
    desc:"Everything in one: ads, website, AI receptionist, chat & SMS, follow-ups. The complete roofing machine.",
    features:["AI Lead Generation Ads","AI-powered website","AI phone receptionist (24/7)","WhatsApp & SMS + chat AI","Automated follow-up sequences","Lead tracking dashboard","Priority support"],
    hot:true, custom:false, ads:false, bundle:true,
  },
  {
    n:"05", title:"Custom / n8n", price:"Custom", setup:"Custom",
    desc:"Bespoke workflow automation built on n8n — engineered around your exact process.",
    features:["Full n8n workflow architecture","API & webhook integrations","Multi-system orchestration","Custom logic & conditional flows","Data transformation & routing","Dedicated build sprint","Ongoing maintenance option"],
    hot:false, custom:true, ads:false, bundle:false,
  },
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
];

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');

  @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  /* Animated roofing background */
  @keyframes roofSlide {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-640px); }
  }
  @keyframes hammerSwing {
    0%,100% { transform: rotate(-30deg); transform-origin: 90% 90%; }
    50%     { transform: rotate(10deg);  transform-origin: 90% 90%; }
  }
  @keyframes shingleFall {
    0%   { transform: translateY(-60px) rotate(-8deg); opacity:0; }
    20%  { opacity:0.8; }
    100% { transform: translateY(0px) rotate(0deg); opacity:1; }
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
  @keyframes planeProp {
    0%   { stroke-dashoffset: 200; }
    100% { stroke-dashoffset: 0; }
  }
  .bg-roof-scene { animation: roofSlide 28s linear infinite; will-change: transform; }
  .anim-hammer   { animation: hammerSwing 0.7s ease-in-out infinite; }
  .anim-cloud1   { animation: cloudDrift 18s ease-in-out infinite alternate; }
  .anim-cloud2   { animation: cloudDrift 24s ease-in-out infinite alternate-reverse; }
  .anim-sun      { animation: sunPulse 4s ease-in-out infinite; }
  .anim-worker   { animation: workerBob 2s ease-in-out infinite; }

  @keyframes orb1 {
    0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(55px,-35px) scale(1.09)} 70%{transform:translate(-30px,20px) scale(0.94)}
  }
  @keyframes orb2 {
    0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-45px,35px) scale(0.92)} 70%{transform:translate(28px,-22px) scale(1.1)}
  }
  .orb-1{animation:orb1 28s ease-in-out infinite;will-change:transform}
  .orb-2{animation:orb2 34s ease-in-out infinite;animation-delay:-6s;will-change:transform}

  @keyframes ping{75%,100%{transform:scale(2);opacity:0}}
  .ping{animation:ping 1s cubic-bezier(0,0,0.2,1) infinite}

  @keyframes dotPulse{0%,100%{opacity:.15;transform:scale(.6)} 50%{opacity:1;transform:scale(1.3)}}
  .problem-dot{height:8px;width:8px;border-radius:2px;background:rgba(249,115,22,0.25);animation:dotPulse 2.5s ease-in-out infinite;will-change:opacity,transform}

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

// ─── ANIMATED ROOFING BACKGROUND ─────────────────────────────────────────────
function RoofingBackground() {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden",
      background:"linear-gradient(180deg,#fff9f4 0%,#fff4e8 40%,#fff8f2 100%)"
    }} aria-hidden>
      {/* Warm gradient base */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(175deg,#fafafa 0%,#fff7f0 25%,#fef3e2 55%,#fff8f0 80%,#ffffff 100%)"
      }}/>

      {/* Subtle grid */}
      <div style={{ position:"absolute", inset:0, opacity:0.012,
        backgroundImage:`linear-gradient(rgba(249,115,22,1) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,1) 1px,transparent 1px)`,
        backgroundSize:"80px 80px" }}/>

      {/* Animated roofing scene strip */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"46%", overflow:"hidden" }}>
        <div className="bg-roof-scene" style={{ display:"flex", alignItems:"flex-end", width:"1280px", height:"100%" }}>
          <RoofSceneSVG/>
          <RoofSceneSVG/>
        </div>
      </div>

      {/* Floating orbs */}
      <div className="orb-1" style={{ position:"absolute", top:"-18%", left:"52%", width:900, height:900, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(249,115,22,0.07) 0%,transparent 68%)", filter:"blur(90px)" }}/>
      <div className="orb-2" style={{ position:"absolute", top:"30%", left:"-15%", width:700, height:700, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(251,191,36,0.08) 0%,transparent 68%)", filter:"blur(80px)" }}/>

      {/* Fade overlay so content is readable */}
      <div style={{ position:"absolute", inset:0,
        background:"linear-gradient(to bottom, rgba(255,249,244,0.55) 0%, rgba(255,249,244,0.15) 50%, rgba(255,249,244,0.72) 100%)" }}/>
    </div>
  );
}

function RoofSceneSVG() {
  return (
    <svg width="640" height="260" viewBox="0 0 640 260" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink:0, opacity:0.13 }}>
      {/* Ground */}
      <rect x="0" y="220" width="640" height="40" fill="rgba(249,115,22,0.15)" rx="2"/>

      {/* House 1 */}
      <g>
        <rect x="30" y="155" width="100" height="65" fill="rgba(249,115,22,0.12)" stroke="rgba(249,115,22,0.35)" strokeWidth="1.5"/>
        <polygon points="20,158 80,105 140,158" fill="rgba(249,115,22,0.25)" stroke="rgba(249,115,22,0.5)" strokeWidth="1.5"/>
        {/* Shingles */}
        {[0,1,2,3].map(r=>[0,1,2,3,4,5].map(c=>{
          const x=22+c*20-r*2, y=122+r*9;
          if(y>157) return null;
          return <rect key={`${r}-${c}`} x={x} y={y} width="18" height="7" rx="1"
            fill={r%2===0?"rgba(249,115,22,0.35)":"rgba(234,88,12,0.4)"}/>;
        }))}
        {/* Chimney */}
        <rect x="100" y="118" width="16" height="28" fill="rgba(0,0,0,0.25)" rx="1"/>
        <rect x="97" y="116" width="22" height="5" fill="rgba(0,0,0,0.3)" rx="1"/>
        {/* Door */}
        <rect x="62" y="185" width="24" height="35" fill="rgba(0,0,0,0.3)" rx="2"/>
        {/* Window */}
        <rect x="37" y="170" width="22" height="18" fill="rgba(249,115,22,0.2)" stroke="rgba(249,115,22,0.3)" strokeWidth="1" rx="1"/>
        <rect x="115" y="170" width="22" height="18" fill="rgba(249,115,22,0.2)" stroke="rgba(249,115,22,0.3)" strokeWidth="1" rx="1"/>
      </g>

      {/* Worker on House 1 roof */}
      <g className="anim-worker" style={{transformOrigin:"75px 130px"}}>
        {/* Body */}
        <rect x="70" y="118" width="10" height="16" fill="rgba(0,0,0,0.4)" rx="2"/>
        {/* Head */}
        <circle cx="75" cy="114" r="6" fill="rgba(249,244,240,0.8)"/>
        {/* Hard hat */}
        <ellipse cx="75" cy="110" rx="8" ry="4.5" fill="rgba(249,115,22,0.8)"/>
        <rect x="69" y="108" width="12" height="3" rx="1.5" fill="rgba(234,88,12,0.9)"/>
        {/* Hammer arm */}
        <g className="anim-hammer" style={{transformOrigin:"75px 125px"}}>
          <line x1="78" y1="122" x2="90" y2="112" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" strokeLinecap="round"/>
          <rect x="88" y="108" width="7" height="5" rx="1" fill="rgba(0,0,0,0.5)"/>
        </g>
        {/* Other arm */}
        <line x1="72" y1="122" x2="64" y2="116" stroke="rgba(249,244,240,0.6)" strokeWidth="2" strokeLinecap="round"/>
        {/* Legs */}
        <line x1="73" y1="134" x2="71" y2="146" stroke="rgba(0,0,0,0.4)" strokeWidth="3" strokeLinecap="round"/>
        <line x1="77" y1="134" x2="79" y2="146" stroke="rgba(0,0,0,0.4)" strokeWidth="3" strokeLinecap="round"/>
      </g>

      {/* House 2 (bigger) */}
      <g>
        <rect x="200" y="140" width="130" height="80" fill="rgba(249,115,22,0.08)" stroke="rgba(249,115,22,0.25)" strokeWidth="1.5"/>
        <polygon points="188,143 265,78 342,143" fill="rgba(249,115,22,0.2)" stroke="rgba(249,115,22,0.4)" strokeWidth="1.5"/>
        {[0,1,2,3,4].map(r=>[0,1,2,3,4,5,6,7].map(c=>{
          const x=191+c*20-r*2.5, y=98+r*9;
          if(y>142) return null;
          return <rect key={`${r}-${c}`} x={x} y={y} width="18" height="7" rx="1"
            fill={r%2===0?"rgba(249,115,22,0.3)":"rgba(234,88,12,0.35)"}/>;
        }))}
        <rect x="300" y="100" width="18" height="32" fill="rgba(0,0,0,0.2)" rx="1"/>
        <rect x="297" y="98" width="24" height="5" fill="rgba(0,0,0,0.25)" rx="1"/>
        <rect x="237" y="175" width="28" height="45" fill="rgba(0,0,0,0.25)" rx="2"/>
        <rect x="208" y="156" width="26" height="20" fill="rgba(249,115,22,0.15)" stroke="rgba(249,115,22,0.25)" strokeWidth="1" rx="1"/>
        <rect x="296" y="156" width="26" height="20" fill="rgba(249,115,22,0.15)" stroke="rgba(249,115,22,0.25)" strokeWidth="1" rx="1"/>
      </g>

      {/* Second worker on house 2 */}
      <g className="anim-worker" style={{transformOrigin:"250px 110px", animationDelay:"1s"}}>
        <rect x="245" y="98" width="10" height="16" fill="rgba(0,0,0,0.35)" rx="2"/>
        <circle cx="250" cy="94" r="6" fill="rgba(249,244,240,0.8)"/>
        <ellipse cx="250" cy="90" rx="8" ry="4.5" fill="rgba(249,115,22,0.8)"/>
        <rect x="244" y="88" width="12" height="3" rx="1.5" fill="rgba(234,88,12,0.9)"/>
        <line x1="253" y1="102" x2="265" y2="112" stroke="rgba(249,244,240,0.5)" strokeWidth="2" strokeLinecap="round"/>
        <g className="anim-hammer" style={{transformOrigin:"247px 105px", animationDelay:"0.35s"}}>
          <line x1="247" y1="102" x2="235" y2="92" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" strokeLinecap="round"/>
          <rect x="228" y="88" width="7" height="5" rx="1" fill="rgba(0,0,0,0.5)"/>
        </g>
        <line x1="248" y1="114" x2="246" y2="126" stroke="rgba(0,0,0,0.35)" strokeWidth="3" strokeLinecap="round"/>
        <line x1="252" y1="114" x2="254" y2="126" stroke="rgba(0,0,0,0.35)" strokeWidth="3" strokeLinecap="round"/>
      </g>

      {/* Scaffolding */}
      <g opacity="0.35">
        <line x1="345" y1="220" x2="345" y2="130" stroke="rgba(249,115,22,0.6)" strokeWidth="2"/>
        <line x1="365" y1="220" x2="365" y2="130" stroke="rgba(249,115,22,0.6)" strokeWidth="2"/>
        <line x1="340" y1="195" x2="370" y2="195" stroke="rgba(249,115,22,0.6)" strokeWidth="1.5"/>
        <line x1="340" y1="165" x2="370" y2="165" stroke="rgba(249,115,22,0.6)" strokeWidth="1.5"/>
        <line x1="340" y1="135" x2="370" y2="135" stroke="rgba(249,115,22,0.6)" strokeWidth="1.5"/>
        {/* Planks */}
        <rect x="337" y="192" width="36" height="4" fill="rgba(180,120,60,0.5)" rx="1"/>
        <rect x="337" y="162" width="36" height="4" fill="rgba(180,120,60,0.5)" rx="1"/>
      </g>

      {/* Worker on scaffolding */}
      <g className="anim-worker" style={{transformOrigin:"355px 155px", animationDelay:"0.7s"}}>
        <rect x="350" y="148" width="10" height="14" fill="rgba(0,0,0,0.4)" rx="2"/>
        <circle cx="355" cy="144" r="5.5" fill="rgba(249,244,240,0.8)"/>
        <ellipse cx="355" cy="140" rx="7.5" ry="4" fill="rgba(249,115,22,0.8)"/>
        <line x1="360" y1="154" x2="370" y2="148" stroke="rgba(249,244,240,0.5)" strokeWidth="2" strokeLinecap="round"/>
        <line x1="350" y1="154" x2="343" y2="160" stroke="rgba(249,244,240,0.5)" strokeWidth="2" strokeLinecap="round"/>
        <line x1="353" y1="162" x2="351" y2="173" stroke="rgba(0,0,0,0.4)" strokeWidth="3" strokeLinecap="round"/>
        <line x1="357" y1="162" x2="359" y2="173" stroke="rgba(0,0,0,0.4)" strokeWidth="3" strokeLinecap="round"/>
      </g>

      {/* House 3 (small) */}
      <g>
        <rect x="420" y="175" width="80" height="45" fill="rgba(249,115,22,0.1)" stroke="rgba(249,115,22,0.22)" strokeWidth="1.5"/>
        <polygon points="412,177 460,132 508,177" fill="rgba(249,115,22,0.18)" stroke="rgba(249,115,22,0.38)" strokeWidth="1.5"/>
        {[0,1,2].map(r=>[0,1,2,3,4].map(c=>{
          const x=415+c*19-r*2, y=148+r*8;
          if(y>176) return null;
          return <rect key={`${r}-${c}`} x={x} y={y} width="17" height="6" rx="1"
            fill={r%2===0?"rgba(249,115,22,0.32)":"rgba(234,88,12,0.38)"}/>;
        }))}
        <rect x="443" y="192" width="20" height="28" fill="rgba(0,0,0,0.25)" rx="2"/>
        <rect x="424" y="180" width="18" height="15" fill="rgba(249,115,22,0.15)" stroke="rgba(249,115,22,0.22)" strokeWidth="1" rx="1"/>
        <rect x="470" y="180" width="18" height="15" fill="rgba(249,115,22,0.15)" stroke="rgba(249,115,22,0.22)" strokeWidth="1" rx="1"/>
      </g>

      {/* Clouds */}
      <g className="anim-cloud1" opacity="0.5">
        <ellipse cx="550" cy="40" rx="35" ry="18" fill="rgba(249,115,22,0.08)"/>
        <ellipse cx="575" cy="34" rx="25" ry="14" fill="rgba(249,115,22,0.06)"/>
        <ellipse cx="528" cy="42" rx="20" ry="12" fill="rgba(249,115,22,0.06)"/>
      </g>
      <g className="anim-cloud2" opacity="0.4">
        <ellipse cx="120" cy="30" rx="28" ry="14" fill="rgba(249,115,22,0.07)"/>
        <ellipse cx="142" cy="24" rx="20" ry="11" fill="rgba(249,115,22,0.05)"/>
      </g>

      {/* Sun */}
      <g className="anim-sun">
        <circle cx="590" cy="25" r="18" fill="rgba(249,115,22,0.15)"/>
        <circle cx="590" cy="25" r="12" fill="rgba(249,115,22,0.22)"/>
        {[0,45,90,135,180,225,270,315].map((deg,i)=>{
          const rad = deg * Math.PI / 180;
          return <line key={i}
            x1={590 + Math.cos(rad)*15} y1={25 + Math.sin(rad)*15}
            x2={590 + Math.cos(rad)*22} y2={25 + Math.sin(rad)*22}
            stroke="rgba(249,115,22,0.3)" strokeWidth="1.5" strokeLinecap="round"/>;
        })}
      </g>

      {/* Truck */}
      <g opacity="0.4" transform="translate(575, 195)">
        <rect x="0" y="10" width="55" height="20" fill="rgba(249,115,22,0.3)" rx="2"/>
        <rect x="35" y="4" width="20" height="14" fill="rgba(249,115,22,0.4)" rx="2"/>
        <circle cx="12" cy="31" r="6" fill="rgba(0,0,0,0.4)"/>
        <circle cx="12" cy="31" r="3" fill="rgba(150,150,150,0.5)"/>
        <circle cx="43" cy="31" r="6" fill="rgba(0,0,0,0.4)"/>
        <circle cx="43" cy="31" r="3" fill="rgba(150,150,150,0.5)"/>
        <text x="5" y="24" style={{fontSize:5, fill:"rgba(255,255,255,0.8)", fontWeight:"bold"}}>ROOFING</text>
      </g>

      {/* Shingles pile on ground */}
      <g opacity="0.5">
        <rect x="160" y="208" width="30" height="6" fill="rgba(249,115,22,0.4)" rx="1" transform="rotate(-3 160 208)"/>
        <rect x="162" y="215" width="28" height="5" fill="rgba(234,88,12,0.45)" rx="1"/>
        <rect x="158" y="220" width="32" height="5" fill="rgba(249,115,22,0.35)" rx="1" transform="rotate(2 158 220)"/>
      </g>

      {/* Ladder */}
      <g opacity="0.4">
        <line x1="390" y1="220" x2="402" y2="155" stroke="rgba(180,120,60,0.7)" strokeWidth="2"/>
        <line x1="400" y1="220" x2="412" y2="155" stroke="rgba(180,120,60,0.7)" strokeWidth="2"/>
        {[0,1,2,3,4,5,6].map(i=>(
          <line key={i} x1={391+i*1.6} y1={215-i*9.5} x2={401+i*1.6} y2={215-i*9.5}
            stroke="rgba(180,120,60,0.7)" strokeWidth="1.5"/>
        ))}
      </g>
    </svg>
  );
}

// ─── ILLUSTRATIONS ────────────────────────────────────────────────────────────
function RoofHouseIllustration({ size = 200 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 200 170" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ animation:"roofFloat 6s ease-in-out infinite" }}>
      <defs>
        <linearGradient id="rGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#c2410c"/>
        </linearGradient>
      </defs>
      <rect x="30" y="90" width="140" height="80" rx="2" fill="#f5f5f5" stroke="#ddd" strokeWidth="1.5"/>
      <polygon points="15,92 100,20 185,92" fill="url(#rGrad)"/>
      {[0,1,2,3,4].map(row=>[0,1,2,3,4,5,6,7].map(col=>{
        const x=20+col*21-row*2, y=55+row*8;
        if(y>=92||x<=15||x>=175) return null;
        return <rect key={`${row}-${col}`} x={x} y={y} width="20" height="7" rx="1"
          fill={row%2===0?"#ea580c":"#f97316"} opacity="0.7"/>;
      }))}
      <rect x="130" y="35" width="22" height="38" fill="#555" rx="1"/>
      <rect x="127" y="33" width="28" height="6" rx="1" fill="#444"/>
      <circle cx="141" cy="22" r="6" fill="rgba(200,200,200,0.3)"/>
      <circle cx="137" cy="13" r="4" fill="rgba(200,200,200,0.2)"/>
      <rect x="83" y="125" width="34" height="45" rx="2" fill="#333"/>
      <circle cx="113" cy="148" r="2" fill="#f97316"/>
      <rect x="40" y="105" width="30" height="25" rx="2" fill="#87ceeb" stroke="#ddd" strokeWidth="1"/>
      <line x1="55" y1="105" x2="55" y2="130" stroke="#ddd" strokeWidth="1"/>
      <line x1="40" y1="117" x2="70" y2="117" stroke="#ddd" strokeWidth="1"/>
      <rect x="130" y="105" width="30" height="25" rx="2" fill="#87ceeb" stroke="#ddd" strokeWidth="1"/>
      <line x1="145" y1="105" x2="145" y2="130" stroke="#ddd" strokeWidth="1"/>
      <line x1="130" y1="117" x2="160" y2="117" stroke="#ddd" strokeWidth="1"/>
      <rect x="0" y="168" width="200" height="4" rx="2" fill="rgba(249,115,22,0.3)"/>
    </svg>
  );
}

function MetaAdsIllustration({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#fbbf24"/>
        </linearGradient>
      </defs>
      <rect x="25" y="10" width="70" height="100" rx="10" fill="#1a1a1a" stroke="#333" strokeWidth="2"/>
      <rect x="30" y="18" width="60" height="84" rx="4" fill="#111"/>
      <rect x="32" y="20" width="56" height="35" rx="3" fill="rgba(249,115,22,0.15)"/>
      <polygon points="38,44 60,28 82,44" fill="rgba(249,115,22,0.5)"/>
      <rect x="38" y="44" width="44" height="10" rx="1" fill="#333"/>
      <rect x="33" y="58" width="40" height="3" rx="1.5" fill="#555"/>
      <rect x="33" y="64" width="30" height="2" rx="1" fill="#444"/>
      <rect x="33" y="70" width="54" height="10" rx="5" fill="url(#mGrad)"/>
      <rect x="45" y="73" width="30" height="4" rx="2" fill="white" opacity="0.8"/>
      {[0,1,2,3].map(i=>(
        <rect key={i} x={88+i*5} y={100-i*4} width="3" height={6+i*4} rx="1"
          fill="#f97316" opacity={0.4+i*0.15}/>
      ))}
    </svg>
  );
}

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

function Reveal({ children, delay=0, y=60, className, style }: {
  children:React.ReactNode; delay?:number; y?:number; className?:string; style?:React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity:0, y, filter:"blur(10px)" }}
      animate={inView ? { opacity:1, y:0, filter:"blur(0px)" } : {}}
      transition={{ duration:1, ease:E, delay }}>
      {children}
    </motion.div>
  );
}

function MagBtn({ children, onClick, dark, href, orange }: {
  children:React.ReactNode; onClick?:()=>void; dark?:boolean; href?:string; orange?:boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const sx = useSpring(mx,{stiffness:400,damping:28});
  const sy = useSpring(my,{stiffness:400,damping:28});
  const onMove = (e:React.MouseEvent)=>{
    const r=ref.current!.getBoundingClientRect();
    mx.set((e.clientX-r.left-r.width/2)*0.35); my.set((e.clientY-r.top-r.height/2)*0.35);
  };
  const onLeave = ()=>{ mx.set(0); my.set(0); };
  const base: React.CSSProperties = orange
    ? { ...SF, background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`, boxShadow:"0 4px 20px rgba(249,115,22,0.35)", borderRadius:9999, border:"none", padding:"14px 32px", cursor:"pointer", display:"inline-block" }
    : dark
    ? { ...SF, background:"linear-gradient(135deg,#111,#2d2d2d)", boxShadow:"0 4px 20px rgba(0,0,0,0.25)", borderRadius:9999, border:"none", padding:"14px 32px", cursor:"pointer", display:"inline-block" }
    : { ...SF, background:"rgba(255,255,255,0.6)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.9)", boxShadow:"0 4px 20px rgba(0,0,0,0.07)", borderRadius:9999, padding:"14px 32px", cursor:"pointer", display:"inline-block" };
  const tc = (orange||dark) ? "text-white" : "text-gray-700";
  const inner = <motion.span style={{x:sx,y:sy,display:"block"}} className={`text-sm font-semibold ${tc}`}>{children}</motion.span>;
  if (href) return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={base}>
      <motion.a href={href} target="_blank" rel="noopener noreferrer" whileHover={{scale:1.06}} whileTap={{scale:0.96}} style={{display:"block"}}>{inner}</motion.a>
    </div>
  );
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={base}>
      <motion.button onClick={onClick} whileHover={{scale:1.06}} whileTap={{scale:0.96}}>{inner}</motion.button>
    </div>
  );
}

function GlowCard({ children, className, style, hot }: {
  children:React.ReactNode; className?:string; style?:React.CSSProperties; hot?:boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [gp, setGp] = useState<{x:number,y:number}|null>(null);
  const rafRef = useRef<number>(0);
  const onMove = useCallback((e:React.MouseEvent)=>{
    if(rafRef.current) return;
    rafRef.current = requestAnimationFrame(()=>{
      rafRef.current=0;
      if(!ref.current) return;
      const r=ref.current.getBoundingClientRect();
      setGp({x:e.clientX-r.left,y:e.clientY-r.top});
    });
  },[]);
  const onLeave = useCallback(()=>setGp(null),[]);
  const glowBg = gp ? `radial-gradient(320px circle at ${gp.x}px ${gp.y}px, rgba(249,115,22,0.13), transparent 70%)` : "none";
  return (
    <motion.div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{...style, position:"relative", overflow:"hidden"}}
      whileHover={{y:-10, scale:1.02, boxShadow: hot ? "0 32px 80px rgba(249,115,22,0.28)" : "0 32px 80px rgba(249,115,22,0.1)"}}
      transition={{duration:0.38,ease:E}}>
      {gp && <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:1,background:glowBg,transition:"background 0.1s"}}/>}
      <div style={{position:"relative",zIndex:2}}>{children}</div>
    </motion.div>
  );
}

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

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ current, goto }: { current:Page; goto:(p:Page)=>void }) {
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
            <QZLogo size={34}/>
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
          <button onClick={()=>goto("home")}><QZLogo size={28}/></button>
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
}

function Footer({ goto }: { goto:(p:Page)=>void }) {
  return (
    <footer style={{borderTop:"1px solid rgba(0,0,0,0.07)",background:"rgba(255,255,255,0.55)",backdropFilter:"blur(24px)"}}>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr] mb-12">
          <div>
            <div className="mb-5"><QZLogo size={44}/></div>
            <p style={SF} className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">AI automation systems for roofing companies — built to respond, follow up, and convert without you lifting a finger.</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                {href:"https://www.instagram.com/quazier.ai",label:"@quazier.ai"},
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
          <p style={SF} className="text-xs text-gray-400">© {new Date().getFullYear()} quazieR. All rights reserved.</p>
          <p style={SF} className="text-xs text-gray-400">Built by <span className="text-gray-600">Michael Brito</span> & <span className="text-gray-600">Badre Elkhammal</span></p>
        </div>
      </div>
    </footer>
  );
}

// ─── CHAT DEMO ────────────────────────────────────────────────────────────────
function ChatDemo() {
  const INIT: Msg = {role:"ai",text:"Hi! I'm the quazieR AI. Are you looking for roofing services, or do you run a roofing company?"};
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
          <p style={SF} className="text-sm font-semibold text-gray-900">Summer — quazieR AI</p>
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

// ─── META ADS PLAN TOGGLE ─────────────────────────────────────────────────────
function AdsTogglePlan({ goto }: { goto:(p:Page)=>void }) {
  const [opt,setOpt] = useState<0|1>(0);
  const options = [
    {label:"Performance",price:"$0/mo",note:"15% per closed deal",sub:"First client — zero risk"},
    {label:"Monthly",    price:"$399/mo",note:"+10% per closed deal",sub:"Flat rate + performance"},
  ];
  const cur = options[opt];
  return (
    <div style={{background:"linear-gradient(135deg,#0f0f0f,#1a1a1a)",border:`2px solid ${ORANGE}`,borderRadius:20,padding:"28px",display:"flex",flexDirection:"column",gap:16,position:"relative",overflow:"hidden",
      boxShadow:`0 0 40px rgba(249,115,22,0.18),0 0 80px rgba(249,115,22,0.07)`}}>
      {/* bg grid */}
      <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:`linear-gradient(rgba(249,115,22,1) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,1) 1px,transparent 1px)`,backgroundSize:"30px 30px"}}/>
      {/* Hot badge */}
      <motion.div className="badge-pulse" initial={{scale:0}} animate={{scale:1}} transition={{delay:0.4,type:"spring"}}
        style={{position:"absolute",top:-12,right:20,...SF,background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`,padding:"4px 14px",borderRadius:9999,fontSize:11,fontWeight:700,color:"white",zIndex:3}}>
        🔥 Most Popular
      </motion.div>
      <div style={{position:"relative",zIndex:2}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
          <MetaAdsIllustration size={52}/>
          <div>
            <p style={{...SF,color:ORANGE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:2}}>02</p>
            <h3 style={{...IF,fontStyle:"italic",color:"white",fontSize:20,lineHeight:1.15}}>AI Lead Generation Ads</h3>
          </div>
        </div>
        <p style={{...SF,color:"rgba(255,255,255,0.5)",fontSize:12,lineHeight:1.6,marginBottom:14}}>Meta (Facebook & Instagram) ads for roofing companies.</p>

        {/* Toggle — fixed */}
        <div style={{display:"flex",gap:4,padding:"4px",borderRadius:12,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.08)",marginBottom:14}}>
          {options.map((o,i)=>(
            <motion.button key={i} onClick={()=>setOpt(i as 0|1)}
              style={{...SF,flex:1,borderRadius:8,padding:"7px 0",border:"none",cursor:"pointer",
                background:opt===i?`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`:"transparent",
                color:opt===i?"white":"rgba(255,255,255,0.45)",fontSize:12,fontWeight:600,transition:"color 0.2s"}}
              whileTap={{scale:0.97}}>
              {o.label}
            </motion.button>
          ))}
        </div>

        {/* Price display */}
        <AnimatePresence mode="wait">
          <motion.div key={opt} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.2}}>
            <p style={{...IF,fontStyle:"italic",color:"white",fontSize:30,marginBottom:2}}>{cur.price}</p>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:ORANGE_LIGHT,border:`1px solid ${ORANGE_BORDER}`,borderRadius:9999,padding:"3px 10px",marginBottom:4}}>
              <span style={{...SF,color:ORANGE,fontSize:11,fontWeight:700}}>◆ {cur.note}</span>
            </div>
            <p style={{...SF,color:"rgba(255,255,255,0.4)",fontSize:11,marginTop:4}}>{cur.sub}</p>
          </motion.div>
        </AnimatePresence>

        {/* Features */}
        <div style={{borderTop:"1px solid rgba(255,255,255,0.07)",marginTop:12,paddingTop:12,display:"flex",flexDirection:"column",gap:6}}>
          {["Ad setup & strategy","Roofing-focused creatives","Audience targeting","Lead form optimization","Weekly tracking & optimization"].map(f=>(
            <motion.div key={f} style={{...SF,display:"flex",alignItems:"center",gap:8,fontSize:12,color:"rgba(255,255,255,0.7)"}} whileHover={{x:4}}>
              <span style={{color:ORANGE}}>✓</span>{f}
            </motion.div>
          ))}
        </div>

        <motion.button onClick={()=>{ trackLead(); goto("contact"); }} whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.96}}
          style={{...SF,marginTop:16,width:"100%",background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`,borderRadius:10,border:"none",padding:"12px",fontSize:13,fontWeight:700,color:"white",cursor:"pointer",boxShadow:"0 4px 18px rgba(249,115,22,0.4)"}}>
          Get more leads →
        </motion.button>
      </div>
    </div>
  );
}

// ─── BUNDLE CARD ──────────────────────────────────────────────────────────────
function BundleCard({ goto }: { goto:(p:Page)=>void }) {
  return (
    <Reveal y={40}>
      <motion.div style={{
        background:"linear-gradient(135deg,#111 0%,#1c1c1c 100%)",
        border:`2px solid ${ORANGE}`,borderRadius:20,padding:"32px",
        position:"relative",overflow:"hidden",
        boxShadow:`0 0 60px rgba(249,115,22,0.18),0 0 100px rgba(249,115,22,0.06)`,
      }} whileHover={{boxShadow:`0 32px 80px rgba(249,115,22,0.3),0 0 60px rgba(249,115,22,0.12)`}}
      transition={{duration:0.38}}>
        {/* bg pattern */}
        <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:`linear-gradient(rgba(249,115,22,1) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,1) 1px,transparent 1px)`,backgroundSize:"40px 40px"}}/>
        <motion.div className="badge-pulse" initial={{scale:0,rotate:-10}} animate={{scale:1,rotate:0}} transition={{delay:0.5,type:"spring"}}
          style={{position:"absolute",top:-14,left:32,...SF,background:`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`,padding:"5px 18px",borderRadius:9999,fontSize:11,fontWeight:700,color:"white"}}>
          ⚡ Best Value — Full System
        </motion.div>

        <div style={{position:"relative",zIndex:2,display:"grid",gap:28}} className="md:grid-cols-[1fr_1.4fr]">
          {/* Left */}
          <div>
            <p style={{...SF,color:ORANGE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginTop:12,marginBottom:6}}>04</p>
            <h2 style={{...IF,fontStyle:"italic",color:"white",fontSize:28,lineHeight:1.1,marginBottom:10}}>
              Full AI System<br/>+ Ads
            </h2>
            <p style={{...SF,color:"rgba(255,255,255,0.5)",fontSize:13,lineHeight:1.7,marginBottom:18}}>Everything in one: ads, website, AI receptionist, chat & SMS, and automated follow-ups. The complete roofing machine.</p>
            <div style={{marginBottom:16}}>
              <p style={{...SF,color:"rgba(255,255,255,0.35)",fontSize:11}}>$500 setup</p>
              <p style={{...IF,fontStyle:"italic",color:"white",fontSize:42,lineHeight:1}}>$1,499<span style={{...SF,fontSize:16,color:"rgba(255,255,255,0.4)",fontStyle:"normal"}}>/mo</span></p>
              <p style={{...SF,color:"rgba(249,115,22,0.8)",fontSize:11,marginTop:4,fontWeight:600}}>Save $598/mo vs buying separately</p>
            </div>
            <MagBtn orange onClick={()=>{ trackLead(); goto("contact"); }}>Get the full system →</MagBtn>
          </div>

          {/* Right — feature list */}
          <div style={{borderLeft:"1px solid rgba(255,255,255,0.07)",paddingLeft:24}} className="hidden md:block">
            <p style={{...SF,color:"rgba(255,255,255,0.3)",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:16}}>Everything included</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[
                {icon:"📢", text:"AI Lead Generation Ads (Facebook & Instagram)"},
                {icon:"🌐", text:"AI-powered roofing website"},
                {icon:"📞", text:"AI phone receptionist — 24/7"},
                {icon:"💬", text:"WhatsApp, SMS & web chat AI"},
                {icon:"🔄", text:"Automated follow-up sequences"},
                {icon:"📊", text:"Lead tracking dashboard"},
                {icon:"⚡", text:"Priority support"},
              ].map(f=>(
                <motion.div key={f.text} style={{display:"flex",alignItems:"flex-start",gap:10}} whileHover={{x:5}}>
                  <span style={{fontSize:14,flexShrink:0,marginTop:1}}>{f.icon}</span>
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

// ─── PAGES ────────────────────────────────────────────────────────────────────
function HomePage({ goto }: { goto:(p:Page)=>void }) {
  const heroRef = useRef<HTMLElement>(null);
  const {scrollYProgress} = useScroll({target:heroRef,offset:["start start","end start"]});
  const heroY     = useTransform(scrollYProgress,[0,1],["0%","22%"]);
  const heroO     = useTransform(scrollYProgress,[0,0.72],[1,0]);
  const heroScale = useTransform(scrollYProgress,[0,1],[1,0.91]);

  return (
    <>
      <section ref={heroRef} className="relative px-6 overflow-hidden"
        style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",paddingTop:"10rem",paddingBottom:"7rem",position:"relative",zIndex:4}}>
        <motion.div style={{y:heroY,opacity:heroO,scale:heroScale,position:"relative",zIndex:4}} className="mx-auto max-w-5xl text-center">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,ease:E}}>
            <motion.span style={{...SF,color:ORANGE,background:ORANGE_LIGHT,border:`1px solid ${ORANGE_BORDER}`}}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8"
              whileHover={{scale:1.06}}>
              <motion.span animate={{rotate:[0,360]}} transition={{duration:8,repeat:Infinity,ease:"linear"}}>✦</motion.span>
              AI Automation for Roofing Companies
            </motion.span>
          </motion.div>

          {/* Floating house illustration */}
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.6,duration:0.8,ease:E}}
            className="absolute right-8 top-20 hidden lg:block" style={{zIndex:3}}>
            <RoofHouseIllustration size={170}/>
          </motion.div>

          <h1 style={{...IF,fontStyle:"italic",fontSize:"clamp(50px,8vw,112px)",lineHeight:1.15}} className="text-gray-900 tracking-tight mb-6">
            <motion.span style={{display:"block",paddingBottom:"0.05em"}}
              initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.55,ease:E,delay:0.05}}>
              quazieR,
            </motion.span>
            <span style={{display:"block",paddingBottom:"0.15em"}}>
              <motion.span style={{display:"inline-block",marginRight:"0.2em"}} initial={{y:28}} animate={{y:0}} transition={{duration:0.55,ease:E,delay:0.15}}>
                <span className="shimmer-text">quicker</span>
              </motion.span>
              <motion.span style={{display:"inline-block"}} initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.55,ease:E,delay:0.22}}>
                and easier
              </motion.span>
            </span>
          </h1>
          <motion.p initial={{opacity:0,y:20,filter:"blur(6px)"}} animate={{opacity:1,y:0,filter:"blur(0px)"}} transition={{duration:0.9,ease:E,delay:0.75}}
            style={{...IF,fontStyle:"italic",fontSize:"clamp(18px,2.2vw,28px)"}} className="text-gray-400 mb-4">Work smarter. Not harder.</motion.p>
          <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.8,ease:E,delay:0.88}}
            style={SF} className="text-base text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10">
            At <span style={{color:ORANGE}}>quazieR</span>, we build AI automation systems for roofing companies — answering calls, running ads, responding to messages, and following up with leads automatically so you never miss a job.
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

        {/* Stats card */}
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
              <h2 style={{...IF,fontStyle:"italic",fontSize:"clamp(36px,4.5vw,64px)"}} className="text-gray-900 leading-[0.93]">Roofing leads<br/>disappear <em style={{color:ORANGE}}>fast.</em></h2>
              <div className="mt-10 flex justify-center">
                <RoofHouseIllustration size={140}/>
              </div>
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
              <h2 style={{...IF,fontStyle:"italic",fontSize:"clamp(36px,5vw,70px)"}} className="text-gray-900 leading-[0.93]">AI that works<br/><em style={{color:ORANGE}}>while you roof.</em></h2>
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
            <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-4">Why quazieR</p>
            <h2 style={{...IF,fontStyle:"italic",fontSize:"clamp(36px,5vw,72px)"}} className="text-gray-900 leading-[0.93]">vs. doing it<br/><em style={{color:ORANGE}}>manually.</em></h2>
          </Reveal>
          <Reveal y={38}>
            <div className="overflow-hidden rounded-2xl" style={{background:"rgba(255,255,255,0.58)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.88)",boxShadow:"0 8px 40px rgba(0,0,0,0.05)"}}>
              <div className="grid grid-cols-[1.6fr_1fr_1fr]" style={{borderBottom:"1px solid rgba(0,0,0,0.07)",background:`rgba(249,115,22,0.03)`}}>
                {["Feature","quazieR AI","Without AI"].map((h,i)=>(
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
              <p style={SF} className="mb-8 text-sm leading-[1.9] text-gray-500">No pressure. No obligation. Just a clear conversation about your roofing business and whether quazieR is the right fit.<br/><br/><span className="text-gray-900">Most clients are live within 48 hours.</span> We handle everything — you keep roofing.</p>
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

  return (
    <div className="pt-32 pb-24 px-6" style={{position:"relative",zIndex:4}}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center mb-16">
          <p style={{...SF,color:ORANGE}} className="text-xs font-semibold uppercase tracking-widest mb-4">Pricing</p>
          <h1 style={{...IF,fontStyle:"italic",fontSize:"clamp(40px,6vw,80px)"}} className="text-gray-900 leading-tight mb-4">Honest pricing.<br/><em style={{color:ORANGE}}>Real results.</em></h1>
          <p style={SF} className="text-gray-500 max-w-xl mx-auto mb-8">No hidden fees. No long-term contracts. No sales games. Pick the plan that fits and be live within 48 hours.</p>

          {/* ── FIXED TOGGLE ── */}
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.3}}
            className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full"
            style={{background:"rgba(255,255,255,0.75)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.9)",boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
            <span style={{...SF,fontSize:13,fontWeight:500,color:!annual?"#111":"#9ca3af",transition:"color .2s"}}>Monthly</span>

            {/* The actual toggle button */}
            <div
              onClick={()=>setAnnual(a=>!a)}
              style={{
                position:"relative", width:46, height:26, borderRadius:13, cursor:"pointer",
                background:annual?`linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`:"rgba(0,0,0,0.12)",
                transition:"background 0.3s",flexShrink:0,
              }}>
              <motion.div
                animate={{x: annual ? 22 : 2}}
                transition={{type:"spring",stiffness:500,damping:35}}
                style={{
                  position:"absolute", top:3, width:20, height:20, borderRadius:"50%",
                  background:"white", boxShadow:"0 1px 4px rgba(0,0,0,0.2)",
                }}/>
            </div>

            <span style={{...SF,fontSize:13,fontWeight:500,color:annual?"#111":"#9ca3af",transition:"color .2s"}}>
              Annual <span style={{color:ORANGE,fontWeight:700}}>−20%</span>
            </span>
          </motion.div>
        </Reveal>

        {/* Bundle card */}
        <div className="mb-6"><BundleCard goto={goto}/></div>

        {/* Other plans grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Ads card (dark) */}
          <Reveal y={55} delay={0}>
            <AdsTogglePlan goto={goto}/>
          </Reveal>

          {/* Regular plans */}
          {PLANS.filter(p=>!p.ads&&!p.bundle&&!p.hot).map((p,i)=>{
            const mp = p.custom ? null : parseInt(p.price.replace("$","").replace(",",""));
            const dp = mp ? (annual ? `$${Math.round(mp*0.8).toLocaleString()}` : p.price) : null;
            return (
              <Reveal key={i} delay={(i+1)*0.08} y={55}>
                <GlowCard className="rounded-2xl p-7 flex flex-col relative cursor-default h-full"
                  style={{background:"rgba(255,255,255,0.68)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.9)"}}>
                  {p.custom && <span style={{...SF,background:"#f3f4f6",color:"#6b7280",position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",padding:"4px 14px",borderRadius:9999,fontSize:11,fontWeight:700}}>Bespoke</span>}
                  <p style={SF} className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">{p.n}</p>
                  <h3 style={{...IF,fontStyle:"italic"}} className="text-xl text-gray-900 mb-2">{p.title}</h3>
                  <p style={SF} className="text-sm text-gray-500 mb-5 leading-relaxed">{p.desc}</p>
                  <div className="mb-5">
                    {p.custom
                      ? <><p style={{...IF,fontStyle:"italic"}} className="text-3xl text-gray-900">Tailored</p><p style={SF} className="text-xs text-gray-400 mt-1">Quoted per scope</p></>
                      : <><p style={SF} className="text-xs text-gray-400">{p.setup} setup</p>
                          <p style={{...IF,fontStyle:"italic"}} className="text-3xl text-gray-900">{dp}<span style={SF} className="text-base font-normal text-gray-400">/mo</span></p>
                          {annual && mp && <motion.p initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} style={SF} className="text-xs font-medium mt-1 text-emerald-600">Saving ${(mp-Math.round(mp*0.8)).toLocaleString()}/mo</motion.p>}</>
                    }
                  </div>
                  <ul className="mb-6 space-y-2.5 flex-1" style={{borderTop:"1px solid rgba(0,0,0,0.06)",paddingTop:"1.25rem"}}>
                    {p.features.map(f=>(
                      <motion.li key={f} style={SF} className="flex items-start gap-2 text-sm text-gray-600" whileHover={{x:5}}>
                        <span style={{color:ORANGE}} className="mt-0.5 shrink-0">✓</span>{f}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.button onClick={()=>{ trackLead(); goto("contact"); }} whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.96}}
                    style={{...SF,background:"rgba(255,255,255,0.65)",backdropFilter:"blur(8px)",border:"1px solid rgba(0,0,0,0.09)",borderRadius:12,padding:12}}
                    className="w-full text-sm font-semibold text-gray-700">
                    {p.custom?"Request a quote":"Get started"}
                  </motion.button>
                </GlowCard>
              </Reveal>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-16">
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
          <h1 style={{...IF,fontStyle:"italic",fontSize:"clamp(44px,7vw,100px)"}} className="text-gray-900 leading-[0.88] mb-4">Systems that<br/><em style={{color:ORANGE}}>do the work.</em></h1>
          <p style={SF} className="text-gray-500 max-w-xl">Each service is purpose-built for roofing companies. We configure, deploy, and maintain everything — you get results without the overhead.</p>
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
            <p style={SF} className="text-gray-500 leading-relaxed">quazieR started with a simple observation: great roofing companies were losing customers not because of their work — but because they couldn't respond fast enough after a storm.</p>
            <p style={SF} className="text-gray-500 leading-relaxed">Michael and Badre built quazieR to close that gap permanently. Not with an app that creates more to-do items, but with systems that operate in the background.</p>
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
              &ldquo;Automation should feel human, calm, and trustworthy — not aggressive, robotic, or overwhelming.&rdquo;
            </blockquote>
            <p style={SF} className="text-sm text-white/50 mb-8 relative z-10">Michael &amp; Badre, quazieR</p>
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
              Let&apos;s talk<br/><em style={{color:ORANGE}}>about your business.</em>
            </h1>
            <p style={SF} className="text-gray-500 leading-relaxed mb-12">No pressure. No sales pitch. Just a real conversation about where you're losing time and how automation might help. Most clients are live within 48 hours.</p>
            <div className="space-y-6 mb-10">
              {[{label:"Email",value:"quazier.ai@gmail.com"},{label:"Phone / WhatsApp",value:"(518) 662-3244"},{label:"Based in",value:"Available worldwide"}].map(c=>(
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
                <p style={SF} className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">Pick a time that works. We'll talk about your roofing business and how quazieR can help. No pressure.</p>
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
export default function Home() {
  const [page,setPage] = useState<Page>("home");
  const goto = (p:Page)=>{ window.scrollTo({top:0,behavior:"smooth"}); setTimeout(()=>setPage(p),120); };
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
            initial={{opacity:0,y:18,filter:"blur(6px)"}}
            animate={{opacity:1,y:0,filter:"blur(0px)"}}
            exit={{opacity:0,y:-18,filter:"blur(6px)"}}
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