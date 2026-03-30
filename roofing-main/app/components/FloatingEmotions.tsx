"use client";

import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

const E = [0.16, 1, 0.3, 1] as const;
type Page = "home" | "pricing" | "services" | "contact" | "about" | "404";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TICKER = ["AI Voice Receptionist","Lead Automation","24/7 Availability","WhatsApp & SMS","CRM Integration","Follow-Up Sequences","No Missed Calls","Instant Response","AI-Powered Websites","n8n Workflows","Custom Automation","Real-Time Alerts"];
const STATS = [{ n: "78%", l: "of customers buy from whoever responds first." },{ n: "< 1m", l: "ideal response window for a fresh inbound lead." },{ n: "3×", l: "more revenue closed with automated follow-ups." }];
const SERVICES = [
  { glyph: "W", title: "AI Website",            desc: "High-conversion pages connected to AI — built to capture, qualify, and route leads around the clock." },
  { glyph: "V", title: "AI Voice Receptionist", desc: "Every call answered 24/7. Qualifies leads, books appointments, routes urgent calls — in your brand's voice." },
  { glyph: "C", title: "AI Chat & SMS",         desc: "Instant replies on WhatsApp, SMS, and web chat. Zero wait time. No missed messages." },
  { glyph: "F", title: "Automated Follow-Ups",  desc: "Multi-step sequences that nurture leads until they buy. Runs on autopilot." },
  { glyph: "Q", title: "Lead Qualification",    desc: "AI detects intent, asks the right questions, and sends only the best leads to your team." },
  { glyph: "I", title: "CRM Integration",       desc: "Plugs into GoHighLevel, HubSpot, Salesforce and more. Your data stays where it lives." },
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
  { n:"01", title:"Website",         desc:"High-conversion website connected to AI systems.",             setup:"$100", mo:"$200", features:["Custom AI-connected landing page","Lead capture form","Mobile-first design","Basic analytics"], hot:false, custom:false },
  { n:"02", title:"AI Voice & Chat", desc:"24/7 AI receptionist answering calls and messages.",            setup:"$100", mo:"$300", features:["AI phone receptionist (24/7)","WhatsApp & SMS automation","Lead qualification","CRM integration","Weekly report"], hot:true, custom:false },
  { n:"03", title:"Full Automation", desc:"Website + AI receptionist + automated follow-ups.",             setup:"$150", mo:"$400", features:["Everything in Website","Everything in AI Voice & Chat","Follow-up sequences","Lead tracking dashboard","Priority support"], hot:false, custom:false },
  { n:"04", title:"Custom / n8n",    desc:"Bespoke workflow automation built on n8n — engineered around your exact process.", setup:"Custom", mo:"Custom", features:["Full n8n workflow architecture","API & webhook integrations","Multi-system orchestration","Custom logic & conditional flows","Data transformation & routing","Dedicated build sprint","Ongoing maintenance option"], hot:false, custom:true },
];
const N8N_FEATURES = [
  { title:"Workflow Architecture", desc:"We design end-to-end automation graphs tailored to your exact business logic — not templates, not shortcuts." },
  { title:"API Orchestration",     desc:"Connect any tool, any API, any database. If it has a webhook or endpoint, we can wire it in." },
  { title:"Conditional Logic",     desc:"Branching flows, fallback paths, error handling, retry queues — production-grade reliability built in." },
  { title:"Data Transformation",   desc:"Parse, reshape, filter, enrich. Your data moves through pipelines the way it should." },
  { title:"Multi-System Sync",     desc:"CRM, ERP, billing, email, Slack, spreadsheets — all talking to each other automatically." },
  { title:"Monitoring & Alerting", desc:"Real-time visibility into every run. Alerts when something breaks. Logs for everything." },
];
type Msg = { role: "user" | "ai"; text: string };
const FLOW: Msg[] = [
  { role:"user", text:"Hi, I'm interested in your services." },
  { role:"ai",   text:"Hi. I'm the quazieR AI. What kind of business do you run?" },
  { role:"user", text:"I run a real estate agency." },
  { role:"ai",   text:"Got it. Are you currently missing calls or follow-ups with leads?" },
  { role:"user", text:"Yes, constantly." },
  { role:"ai",   text:"We can fix that. Our AI handles every call and follows up automatically. Want to book a free call?" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════════
const ORBS = [
  { size:700, x:"-10%", y:"-8%",  color:"rgba(109,40,217,0.28)",  blur:160, dur:26, dx:35,  dy:55  },
  { size:520, x:"65%",  y:"-3%",  color:"rgba(167,110,255,0.18)", blur:130, dur:31, dx:-45, dy:40  },
  { size:360, x:"40%",  y:"35%",  color:"rgba(88,28,220,0.22)",   blur:110, dur:21, dx:55,  dy:-35 },
  { size:580, x:"-8%",  y:"52%",  color:"rgba(124,58,237,0.14)",  blur:180, dur:36, dx:65,  dy:-25 },
  { size:240, x:"76%",  y:"60%",  color:"rgba(139,92,246,0.30)",  blur:90,  dur:18, dx:-28, dy:45  },
  { size:420, x:"28%",  y:"-12%", color:"rgba(76,29,200,0.16)",   blur:145, dur:28, dx:22,  dy:65  },
  { size:200, x:"88%",  y:"22%",  color:"rgba(196,166,255,0.20)", blur:70,  dur:15, dx:-18, dy:-38 },
  { size:300, x:"12%",  y:"75%",  color:"rgba(124,58,237,0.18)",  blur:100, dur:23, dx:40,  dy:-50 },
];
function buildPath(dx:number,dy:number,seed:number){
  const s=seed*0.37;
  return { x:[0,dx*0.4,dx*0.8,dx,dx*0.7,dx*0.2,-dx*0.3,-dx*0.6,-dx*0.4,0], y:[0,dy*0.3,dy*0.7,dy*0.5+s,-dy*0.2,-dy*0.7,-dy,-dy*0.5+s,-dy*0.1,0] };
}
function Background(){
  const reduced=useReducedMotion();
  return(
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0" style={{background:"radial-gradient(ellipse 90% 70% at 50% 10%,rgba(76,29,149,0.15) 0%,transparent 70%)"}}/>
      {ORBS.map((o,i)=>{
        const p=buildPath(o.dx,o.dy,i*13);
        return(
          <motion.div key={i} style={{position:"absolute",width:o.size,height:o.size,left:o.x,top:o.y,borderRadius:"50%",background:o.color,filter:`blur(${o.blur}px)`,willChange:"transform"}}
            animate={reduced?{}:{x:p.x,y:p.y,scale:[1,1.08,0.96,1.05,0.98,1.1,0.95,1.04,1,1],opacity:[0.7,1,0.78,0.95,0.85,1,0.8,0.92,0.75,0.7]}}
            transition={{duration:o.dur,repeat:Infinity,ease:"easeInOut",delay:i*1.4,times:[0,0.11,0.22,0.33,0.44,0.55,0.66,0.77,0.88,1]}}/>
        );
      })}
      <div className="absolute inset-0 opacity-[0.022]" style={{backgroundImage:"linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px)",backgroundSize:"90px 90px"}}/>
      <motion.div style={{position:"absolute",top:0,bottom:0,width:1,background:"linear-gradient(to bottom,transparent,rgba(139,92,246,0.15) 20%,rgba(196,166,255,0.28) 50%,rgba(139,92,246,0.15) 80%,transparent)",filter:"blur(2px)",left:"30%"}}
        animate={{left:["8%","92%","8%"],opacity:[0,0.7,0.15,0.7,0]}} transition={{duration:22,repeat:Infinity,ease:"easeInOut",delay:3}}/>
      {Array.from({length:14},(_,i)=>(
        <motion.div key={`p${i}`} style={{position:"absolute",width:1.5+(i%3)*0.8,height:1.5+(i%3)*0.8,borderRadius:"50%",background:i%3===0?"rgba(196,166,255,0.7)":i%3===1?"rgba(139,92,246,0.5)":"rgba(255,255,255,0.3)",left:`${6+i*6.8}%`,top:`${12+((i*17)%72)}%`,filter:"blur(0.4px)"}}
          animate={reduced?{}:{y:[0,-(60+i*7)*0.5,-(60+i*7),-(60+i*7)*0.7,0],x:[0,(i%2===0?1:-1)*(12+(i%5)*8)*0.6,(i%2===0?1:-1)*(12+(i%5)*8),(i%2===0?1:-1)*(12+(i%5)*8)*0.3,0],opacity:[0,0.9,0.5,0.75,0]}}
          transition={{duration:9+i*1.8,repeat:Infinity,ease:"easeInOut",delay:i*1.6}}/>
      ))}
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 60% at 50% 40%,transparent 25%,rgba(4,4,8,0.55) 70%,rgba(4,4,8,0.88) 100%)",zIndex:1}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"20%",background:"linear-gradient(to top,rgba(4,4,8,0.8),transparent)",zIndex:1}}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SVG ILLUSTRATIONS
// ═══════════════════════════════════════════════════════════════════════════════
function IllustrationOrbitNetwork(){
  return(
    <svg width="320" height="320" viewBox="0 0 320 320" fill="none" className="w-full max-w-[320px]">
      {[60,100,140].map((r,i)=>(
        <motion.circle key={r} cx="160" cy="160" r={r} stroke="rgba(139,92,246,0.15)" strokeWidth="1" strokeDasharray="4 6"
          animate={{rotate:i%2===0?360:-360}} transition={{duration:20+i*8,repeat:Infinity,ease:"linear"}} style={{transformOrigin:"160px 160px"}}/>
      ))}
      <motion.circle cx="160" cy="160" r="18" fill="rgba(109,40,217,0.3)" stroke="rgba(139,92,246,0.6)" strokeWidth="1.5"
        animate={{scale:[1,1.12,1]}} transition={{duration:3,repeat:Infinity}} style={{transformOrigin:"160px 160px"}}/>
      <motion.circle cx="160" cy="160" r="6" fill="rgba(196,166,255,0.9)"
        animate={{scale:[1,1.3,1]}} transition={{duration:2,repeat:Infinity}} style={{transformOrigin:"160px 160px"}}/>
      {[{r:60,a:0,s:6,c:"rgba(139,92,246,0.9)",d:8},{r:60,a:180,s:4,c:"rgba(196,166,255,0.6)",d:8},{r:100,a:45,s:8,c:"rgba(109,40,217,0.9)",d:13},{r:100,a:225,s:5,c:"rgba(167,110,255,0.7)",d:13},{r:100,a:135,s:4,c:"rgba(196,166,255,0.5)",d:13},{r:140,a:90,s:7,c:"rgba(139,92,246,0.8)",d:18},{r:140,a:270,s:5,c:"rgba(88,28,220,0.7)",d:18},{r:140,a:20,s:3,c:"rgba(196,166,255,0.4)",d:18}].map((d,i)=>(
        <motion.g key={i} style={{transformOrigin:"160px 160px"}} animate={{rotate:i%2===0?360:-360}} transition={{duration:d.d,repeat:Infinity,ease:"linear",delay:i*0.5}}>
          <circle cx={160+d.r*Math.cos(d.a*Math.PI/180)} cy={160+d.r*Math.sin(d.a*Math.PI/180)} r={d.s/2} fill={d.c}/>
        </motion.g>
      ))}
      {[0,72,144,216,288].map((angle,i)=>(
        <motion.line key={i} x1="160" y1="160" x2={160+140*Math.cos(angle*Math.PI/180)} y2={160+140*Math.sin(angle*Math.PI/180)} stroke="rgba(139,92,246,0.07)" strokeWidth="1"
          animate={{opacity:[0.3,0.7,0.3]}} transition={{duration:3,repeat:Infinity,delay:i*0.6}}/>
      ))}
    </svg>
  );
}

function IllustrationDataFlow(){
  const nodes=[{cx:40,label:"Lead"},{cx:140,label:"AI"},{cx:240,label:"CRM"},{cx:320,label:"Done"}];
  return(
    <svg width="360" height="130" viewBox="0 0 360 130" fill="none" className="w-full max-w-[360px]">
      {nodes.map((n,i)=>(
        <g key={i}>
          <motion.circle cx={n.cx} cy="65" r="24" fill="rgba(109,40,217,0.2)" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5"
            animate={{scale:[1,1.08,1]}} transition={{duration:2.5,repeat:Infinity,delay:i*0.5}} style={{transformOrigin:`${n.cx}px 65px`}}/>
          <text x={n.cx} y="69" textAnchor="middle" fill="rgba(196,166,255,0.8)" fontSize="9" fontFamily="monospace">{n.label}</text>
        </g>
      ))}
      {[0,1,2].map(j=>(
        <motion.circle key={j} cy="65" r="4" fill="rgba(196,166,255,0.9)"
          animate={{cx:[40,140,240,320],opacity:[0,1,1,0]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut",delay:j*1}}/>
      ))}
      {[[64,116],[164,216],[264,296]].map(([x1,x2],i)=>(
        <line key={i} x1={x1} y1="65" x2={x2} y2="65" stroke="rgba(139,92,246,0.2)" strokeWidth="1" strokeDasharray="4 4"/>
      ))}
    </svg>
  );
}

function IllustrationVoiceWave(){
  const bars=Array.from({length:32},(_,i)=>i);
  return(
    <svg width="280" height="80" viewBox="0 0 280 80" fill="none" className="w-full max-w-[280px]">
      {bars.map(i=>{
        const x=8+i*8;
        const bh=8+Math.sin(i*0.5)*12+Math.sin(i*0.3)*8;
        return(
          <motion.rect key={i} x={x} width="3" rx="1.5" fill="rgba(139,92,246,0.7)"
            animate={{height:[bh,bh*2.2,bh*0.4,bh*1.8,bh],y:[40-bh/2,40-bh*2.2/2,40-bh*0.4/2,40-bh*1.8/2,40-bh/2]}}
            transition={{duration:1.4+i*0.04,repeat:Infinity,ease:"easeInOut",delay:i*0.05}}/>
        );
      })}
    </svg>
  );
}

function IllustrationSignalRings(){
  return(
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none" className="w-full max-w-[180px]">
      {[20,38,56,74].map((r,i)=>(
        <motion.circle key={r} cx="90" cy="90" r={r} stroke="rgba(139,92,246,0.55)" strokeWidth="1"
          animate={{scale:[1,1.5+i*0.1],opacity:[0.7,0]}} transition={{duration:2.4,repeat:Infinity,ease:"easeOut",delay:i*0.5}} style={{transformOrigin:"90px 90px"}}/>
      ))}
      <circle cx="90" cy="90" r="16" fill="rgba(109,40,217,0.35)" stroke="rgba(139,92,246,0.7)" strokeWidth="1.5"/>
      <motion.circle cx="90" cy="90" r="6" fill="rgba(196,166,255,0.9)"
        animate={{scale:[1,1.2,1]}} transition={{duration:1.5,repeat:Infinity}} style={{transformOrigin:"90px 90px"}}/>
    </svg>
  );
}

function IllustrationDotGrid(){
  const dots:Array<{r:number;c:number;key:string}>=[];
  for(let r=0;r<7;r++) for(let c=0;c<10;c++) dots.push({r,c,key:`${r}-${c}`});
  return(
    <svg width="220" height="154" viewBox="0 0 220 154" fill="none" className="w-full max-w-[220px]">
      {dots.map(({r,c,key})=>(
        <motion.circle key={key} cx={11+c*22} cy={11+r*22} r="3" fill="rgba(139,92,246,0.5)"
          animate={{opacity:[0.2,1,0.2],scale:[0.7,1.3,0.7]}} transition={{duration:2.5,repeat:Infinity,delay:(r+c)*0.12}} style={{transformOrigin:`${11+c*22}px ${11+r*22}px`}}/>
      ))}
    </svg>
  );
}

function IllustrationWorkflow(){
  const nodes=[
    {x:20, y:55,  label:"Trigger"},
    {x:110,y:15,  label:"Filter"},
    {x:110,y:95,  label:"Parse"},
    {x:200,y:55,  label:"CRM"},
    {x:280,y:25,  label:"Notify"},
    {x:280,y:85,  label:"Log"},
  ];
  const edges=[[0,1],[0,2],[1,3],[2,3],[3,4],[3,5]];
  return(
    <svg width="340" height="130" viewBox="0 0 340 130" fill="none" className="w-full max-w-[340px]">
      {edges.map(([a,b],i)=>(
        <motion.line key={i} x1={nodes[a].x+28} y1={nodes[a].y+14} x2={nodes[b].x} y2={nodes[b].y+14}
          stroke="rgba(139,92,246,0.25)" strokeWidth="1.5" strokeDasharray="4 4"
          animate={{strokeDashoffset:[0,-16]}} transition={{duration:1.2,repeat:Infinity,ease:"linear"}}/>
      ))}
      {nodes.map((n,i)=>(
        <motion.g key={i} animate={{y:[0,-2,0]}} transition={{duration:2.5,repeat:Infinity,delay:i*0.3}}>
          <rect x={n.x} y={n.y} width="56" height="28" rx="6" fill="rgba(109,40,217,0.15)" stroke="rgba(139,92,246,0.5)" strokeWidth="1"/>
          <text x={n.x+28} y={n.y+17} textAnchor="middle" fill="rgba(196,166,255,0.8)" fontSize="8" fontFamily="monospace">{n.label}</text>
        </motion.g>
      ))}
      <motion.circle r="4" fill="rgba(196,166,255,0.9)"
        animate={{cx:[20,110,200,280],cy:[69,29,69,39],opacity:[0,1,1,0]}} transition={{duration:2.5,repeat:Infinity,ease:"easeInOut"}}/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED
// ═══════════════════════════════════════════════════════════════════════════════
function Tag({children}:{children:string}){
  return(
    <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-violet-400">
      <span className="inline-block h-px w-5 bg-violet-400/50"/>{children}
    </p>
  );
}
function WordReveal({text,italic,delay=0}:{text:string;italic?:string;delay?:number}){
  return(
    <span>
      {text.split(" ").map((word,i)=>(
        <motion.span key={i} className={`inline-block ${word===italic?"font-normal italic text-violet-300":""}`} style={{marginRight:"0.22em"}}
          initial={{opacity:0,y:70}} animate={{opacity:1,y:0}} transition={{duration:1.1,ease:E,delay:delay+i*0.1}}>{word}</motion.span>
      ))}
    </span>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({current,goto}:{current:Page;goto:(p:Page)=>void}){
  const [open,setOpen]=useState(false);
  const links:[string,Page][]=[["Services","services"],["Pricing","pricing"],["About","about"],["Contact","contact"]];
  return(
    <>
      <motion.header initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} transition={{duration:0.8,ease:E}} className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-max">
        <nav className="hidden md:flex items-center gap-1 px-2 py-2 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-[0_0_60px_rgba(124,58,237,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <button onClick={()=>goto("home")} className="px-4 py-1.5 font-['Instrument_Serif'] italic text-white text-base hover:text-violet-300 transition-colors">quazieR</button>
          <div className="w-px h-4 bg-white/[0.12] mx-1"/>
          {links.map(([label,page])=>(
            <button key={page} onClick={()=>goto(page)}
              className={`px-4 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.18em] transition-all ${current===page?"bg-violet-600/20 text-white border border-violet-500/30":"text-white/45 hover:text-white hover:bg-white/[0.05]"}`}>
              {label}
            </button>
          ))}
          <div className="w-px h-4 bg-white/[0.12] mx-1"/>
          <button onClick={()=>goto("contact")} className="px-4 py-1.5 rounded-full bg-violet-600 font-mono text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-violet-500 shadow-[0_0_18px_rgba(124,58,237,0.45)]">Get started</button>
        </nav>
        <nav className="flex md:hidden items-center gap-3 px-4 py-2.5 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-[0_0_40px_rgba(124,58,237,0.2)]">
          <button onClick={()=>goto("home")} className="font-['Instrument_Serif'] italic text-white text-base">quazieR</button>
          <div className="flex-1"/>
          <button onClick={()=>setOpen(!open)} className="flex flex-col gap-1 p-1">
            <motion.span animate={{rotate:open?45:0,y:open?5:0}} className="block h-px w-5 bg-white origin-center"/>
            <motion.span animate={{opacity:open?0:1}} className="block h-px w-5 bg-white"/>
            <motion.span animate={{rotate:open?-45:0,y:open?-5:0}} className="block h-px w-5 bg-white origin-center"/>
          </button>
        </nav>
      </motion.header>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0,y:-8,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-8,scale:0.97}} transition={{duration:0.25,ease:E}}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-[min(300px,88vw)] rounded-2xl border border-white/[0.09] bg-[#06060c]/95 backdrop-blur-xl p-3 shadow-[0_20px_60px_rgba(0,0,0,0.6)] md:hidden">
            <div className="flex flex-col gap-1">
              {links.map(([label,page])=>(
                <button key={page} onClick={()=>{goto(page);setOpen(false);}}
                  className={`w-full rounded-xl px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.18em] transition-colors ${current===page?"bg-violet-600/15 text-white":"text-white/45 hover:bg-white/[0.03] hover:text-white"}`}>
                  {label}
                </button>
              ))}
              <div className="my-1 h-px bg-white/[0.06]"/>
              <button onClick={()=>{goto("contact");setOpen(false);}} className="w-full rounded-xl bg-violet-600 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-white hover:bg-violet-500 transition-colors">Get started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({goto}:{goto:(p:Page)=>void}){
  return(
    <footer className="relative z-10 mt-20 border-t border-violet-500/[0.12]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3" style={{background:"linear-gradient(to right,transparent,rgba(139,92,246,0.4),transparent)"}}/>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="mb-3 font-['Instrument_Serif'] italic text-xl text-white">quazieR</p>
            <p className="mb-6 max-w-xs font-mono text-xs leading-relaxed text-white/28">AI automation systems that respond, follow up, and convert — without you lifting a finger.</p>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"/>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400"/>
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">All systems operational</span>
            </div>
          </div>
          {[{title:"Product",links:[{l:"Services",p:"services"},{l:"Pricing",p:"pricing"}]},{title:"Company",links:[{l:"About",p:"about"},{l:"Contact",p:"contact"}]},{title:"Legal",links:[{l:"Privacy",p:"home"},{l:"Terms",p:"home"}]}].map(col=>(
            <div key={col.title}>
              <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.22em] text-white/22">{col.title}</p>
              <div className="flex flex-col gap-2.5">
                {col.links.map(lnk=>(
                  <button key={lnk.l} onClick={()=>goto(lnk.p as Page)} className="w-fit font-mono text-xs text-white/38 hover:text-white transition-colors">{lnk.l}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-white/[0.05] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[10px] text-white/18">© {new Date().getFullYear()} quazieR. All rights reserved.</p>
          <p className="font-mono text-[10px] text-white/12">Built by <span className="text-white/25">Michael Brito</span> & <span className="text-white/25">Badre Elkhammal</span></p>
        </div>
      </div>
    </footer>
  );
}

// ─── CHAT DEMO ────────────────────────────────────────────────────────────────
function ChatDemo(){
  const [msgs,setMsgs]=useState<Msg[]>([FLOW[0],FLOW[1]]);
  const [step,setStep]=useState(2);
  const [typing,setTyping]=useState(false);
  const advance=()=>{
    if(step>=FLOW.length||typing) return;
    const cur=FLOW[step];
    setMsgs(m=>[...m,cur]);
    setStep(s=>s+1);
    if(cur.role==="user"&&FLOW[step+1]?.role==="ai"){
      setTyping(true);
      setTimeout(()=>{setTyping(false);setMsgs(m=>[...m,FLOW[step+1]]);setStep(s=>s+1);},1300);
    }
  };
  return(
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-violet-500/25 bg-violet-600/15 font-mono text-[9px] text-violet-400">
          AI<span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-[#06060c] bg-emerald-400"/>
        </div>
        <div>
          <p className="font-mono text-xs text-white">quazieR AI</p>
          <p className="font-mono text-[10px] text-emerald-400">Online · responds instantly</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        <AnimatePresence>
          {msgs.map((m,i)=>(
            <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.35}} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 font-mono text-xs leading-relaxed ${m.role==="user"?"rounded-br-sm bg-violet-600 text-white":"rounded-bl-sm bg-white/[0.07] text-white/80"}`}>{m.text}</div>
            </motion.div>
          ))}
          {typing&&(
            <motion.div key="typing" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white/[0.07] px-4 py-3">
                {[0,1,2].map(j=><motion.span key={j} className="h-1.5 w-1.5 rounded-full bg-white/35" animate={{y:[0,-4,0]}} transition={{duration:0.7,repeat:Infinity,delay:j*0.15}}/>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="border-t border-white/[0.07] p-4">
        {step<FLOW.length
          ?<button onClick={advance} disabled={typing} className="w-full rounded-lg bg-violet-600 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white transition hover:bg-violet-500 disabled:opacity-50">{FLOW[step]?.role==="user"?"Send message":"Continue"}</button>
          :<button className="w-full rounded-lg bg-violet-600 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white hover:bg-violet-500 transition">Book a real conversation</button>
        }
      </div>
    </div>
  );
}

function FAQItem({q,a}:{q:string;a:string}){
  const [open,setOpen]=useState(false);
  return(
    <div className="py-6">
      <button onClick={()=>setOpen(!open)} className="flex w-full items-start justify-between gap-4 text-left">
        <span className="font-['Instrument_Serif'] italic text-lg text-white/75">{q}</span>
        <motion.span animate={{rotate:open?45:0}} className="mt-1 flex-shrink-0 font-mono text-xl text-violet-400">+</motion.span>
      </button>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.35}} className="overflow-hidden">
            <p className="mt-4 font-mono text-sm leading-relaxed text-white/35">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════════════════════════════
function HomePage({goto}:{goto:(p:Page)=>void}){
  const heroRef=useRef<HTMLElement>(null);
  const {scrollYProgress}=useScroll({target:heroRef,offset:["start start","end start"]});
  const heroY=useTransform(scrollYProgress,[0,1],["0%","18%"]);
  const heroO=useTransform(scrollYProgress,[0,0.75],[1,0]);
  return(
    <>
      <section ref={heroRef} className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16 text-center">
        <motion.div style={{y:heroY,opacity:heroO}} className="relative w-full max-w-5xl">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8,ease:E,delay:0.1}}><Tag>AI Automation Studio</Tag></motion.div>
          <h1 className="mb-6 font-['Instrument_Serif'] italic leading-[0.88] tracking-tight text-white" style={{fontSize:"clamp(64px,10.5vw,145px)"}}>
            <WordReveal text="Respond without limits" italic="without" delay={0.2}/>
          </h1>
          <motion.p initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:1,ease:E,delay:0.65}} className="mb-6 font-['Instrument_Serif'] italic font-light text-white/45" style={{fontSize:"clamp(22px,3vw,36px)"}}>Work smarter. Not harder.</motion.p>
          <motion.p initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:1,ease:E,delay:0.82}} className="mx-auto mb-10 max-w-2xl font-mono text-sm leading-relaxed text-white/38 md:text-base">
            At <span className="text-violet-300">quazieR</span>, we build AI automation systems that answer calls, respond to messages, and follow up with leads automatically — so your business never misses an opportunity.
          </motion.p>
          <motion.div initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:1,ease:E,delay:1.0}} className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={()=>goto("pricing")} className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.15em] text-white shadow-[0_0_28px_rgba(124,58,237,0.5)] transition hover:bg-violet-500 hover:shadow-[0_0_44px_rgba(124,58,237,0.65)]">See pricing</button>
            <button onClick={()=>goto("contact")} className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] px-7 py-3.5 font-mono text-xs uppercase tracking-[0.15em] text-white/55 transition hover:border-violet-400/35 hover:bg-violet-500/[0.08] hover:text-white">Contact us</button>
          </motion.div>
          <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{duration:1.2,ease:E,delay:1.2}} className="mt-16 flex justify-center">
            <IllustrationOrbitNetwork/>
          </motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.5}} className="mt-8 flex flex-col items-center gap-2 opacity-20">
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-white">Scroll</span>
            <motion.div className="h-10 w-px origin-top bg-white" animate={{scaleY:[0,1,0],opacity:[0,1,0]}} transition={{duration:2,repeat:Infinity,ease:"easeInOut"}}/>
          </motion.div>
        </motion.div>
      </section>

      <div className="relative z-10 overflow-hidden border-y border-violet-500/[0.12] py-4">
        <div className="flex gap-10" style={{width:"max-content",animation:"ticker 30s linear infinite"}}>
          {[...TICKER,...TICKER].map((t,i)=>(
            <span key={i} className="flex shrink-0 items-center gap-3 font-mono text-[9px] uppercase tracking-[0.22em] text-white/22">{t}<span className="text-violet-600 text-[7px]">◆</span></span>
          ))}
        </div>
        <style>{`@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </div>

      <section className="relative z-10 border-b border-white/[0.05]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/[0.05] md:grid-cols-3 md:divide-x md:divide-y-0">
          {STATS.map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9,ease:E,delay:i*0.12}} className="flex flex-col gap-2 px-8 py-12 md:px-12">
              <span className="font-['Instrument_Serif'] italic text-violet-300 leading-none" style={{fontSize:"clamp(52px,6vw,88px)"}}>{s.n}</span>
              <p className="max-w-[210px] font-mono text-xs leading-relaxed text-white/30">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="relative z-10 py-36 px-6">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1fr_1.9fr] md:gap-28">
          <motion.div initial={{opacity:0,y:50}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1,ease:E}} className="md:sticky md:top-28 md:self-start">
            <Tag>The problem</Tag>
            <h2 className="font-['Instrument_Serif'] italic leading-[0.93] text-white" style={{fontSize:"clamp(38px,5vw,68px)"}}>Good businesses<br />lose <em className="text-violet-300">quietly.</em></h2>
            <div className="mt-10"><IllustrationDotGrid/><p className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/20">Each dot — a missed lead</p></div>
          </motion.div>
          <div className="divide-y divide-white/[0.05]">
            {[
              "Most businesses don't lose customers because they're bad at what they do.",
              <><strong className="font-semibold text-white">They lose them because responses arrive too late.</strong> Calls come in while you're busy. Messages wait while your attention is elsewhere. Leads disappear quietly — not because you don't care, but because you're human and time is limited.</>,
              "In today's market, speed matters. Consistency matters. Availability matters.",
              <>The average lead expects a reply <strong className="text-white">within 5 minutes.</strong> Most businesses respond in 5 hours — or never. That gap is where revenue quietly disappears.</>,
              <>Our AI systems close that gap permanently. <strong className="text-white">Every call answered. Every message replied to. Every lead followed up.</strong> Without you lifting a finger.</>,
            ].map((t,i)=>(
              <motion.p key={i} initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-40px"}} transition={{duration:0.85,ease:E,delay:i*0.08}} className="py-7 font-mono text-sm leading-[1.95] text-white/38">{t}</motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section className="relative z-10 py-36 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{opacity:0,y:50}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1,ease:E}} className="mb-16 text-center">
            <Tag>Live demo</Tag>
            <h2 className="font-['Instrument_Serif'] italic leading-[0.93] text-white" style={{fontSize:"clamp(40px,5.5vw,80px)"}}>Try our AI <em className="text-violet-300">systems</em></h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div initial={{opacity:0,y:50}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.95,ease:E}}
              className="overflow-hidden rounded-2xl border border-violet-500/[0.15] bg-white/[0.03] backdrop-blur-sm" style={{minHeight:500}}>
              <div className="border-b border-white/[0.07] px-6 py-5">
                <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.22em] text-violet-400">AI Chat</p>
                <h3 className="font-['Instrument_Serif'] italic text-2xl text-white">Chat with our AI</h3>
                <p className="mt-1 font-mono text-xs text-white/30">See how our AI responds instantly to leads</p>
              </div>
              <div style={{height:400}}><ChatDemo/></div>
            </motion.div>
            <motion.div initial={{opacity:0,y:50}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.95,ease:E,delay:0.12}}
              className="flex flex-col items-center justify-center rounded-2xl border border-violet-500/[0.15] bg-white/[0.03] p-12 backdrop-blur-sm text-center" style={{minHeight:500}}>
              <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-violet-400">AI Voice</p>
              <h3 className="mb-4 font-['Instrument_Serif'] italic leading-[1] text-white" style={{fontSize:"clamp(26px,3.5vw,36px)"}}>Call our AI receptionist</h3>
              <p className="mb-8 max-w-xs font-mono text-xs leading-relaxed text-white/30">Experience a real AI answering calls 24/7. Pick up the phone — it's live right now.</p>
              <div className="mb-4"><IllustrationSignalRings/></div>
              <div className="mb-6"><IllustrationVoiceWave/></div>
              <button className="mb-3 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-8 py-3.5 font-mono text-xs uppercase tracking-[0.15em] text-white shadow-[0_0_24px_rgba(124,58,237,0.45)] transition hover:bg-violet-500">Call now</button>
              <p className="font-mono text-[10px] text-white/18">Test our AI voice agent live</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="relative z-10 py-36 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1,ease:E}}>
              <Tag>What we build</Tag>
              <h2 className="font-['Instrument_Serif'] italic leading-[0.93] text-white" style={{fontSize:"clamp(40px,5.5vw,78px)"}}>AI that works<br /><em className="text-violet-300">while you don't.</em></h2>
            </motion.div>
            <button onClick={()=>goto("services")} className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 transition hover:border-violet-400/25 hover:text-white">All services</button>
          </div>
          <div className="grid gap-px border border-violet-500/[0.1]" style={{gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))"}}>
            {SERVICES.map((s,i)=>(
              <motion.div key={i} initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.85,ease:E,delay:i*0.08}}
                className="group flex flex-col gap-4 bg-[#06060c] p-8 transition-colors hover:bg-violet-950/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/[0.15] bg-violet-600/[0.08] font-mono text-[10px] uppercase tracking-[0.15em] text-violet-400/60 transition group-hover:border-violet-500/30 group-hover:bg-violet-600/15 group-hover:text-violet-300">{s.glyph}</span>
                <h3 className="font-['Instrument_Serif'] italic text-[19px] text-white">{s.title}</h3>
                <p className="font-mono text-xs leading-relaxed text-white/30">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works illustration break */}
      <section className="relative z-10 py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1,ease:E}}
            className="rounded-2xl border border-violet-500/[0.15] bg-violet-950/[0.15] p-10 md:p-16">
            <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
              <div>
                <Tag>How it works</Tag>
                <h2 className="font-['Instrument_Serif'] italic leading-[0.93] text-white" style={{fontSize:"clamp(32px,4vw,56px)"}}>Every lead.<br /><em className="text-violet-300">Handled.</em></h2>
                <p className="mt-6 font-mono text-sm leading-[1.9] text-white/35">A lead comes in. The AI picks it up instantly, qualifies it, logs it to your CRM, and follows up automatically — all without you touching a thing.</p>
              </div>
              <div className="flex flex-col items-center gap-8">
                <IllustrationDataFlow/>
                <IllustrationWorkflow/>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison */}
      <section className="relative z-10 py-36 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1,ease:E}} className="mb-14">
            <Tag>Why quazieR</Tag>
            <h2 className="font-['Instrument_Serif'] italic leading-[0.93] text-white" style={{fontSize:"clamp(40px,5.5vw,78px)"}}>vs. doing it<br /><em className="text-violet-300">manually.</em></h2>
          </motion.div>
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9,ease:E,delay:0.15}} className="overflow-hidden rounded-2xl border border-violet-500/[0.1]">
            <div className="grid grid-cols-[1.6fr_1fr_1fr] border-b border-violet-500/[0.1] bg-violet-950/[0.08]">
              {["Feature","quazieR AI","Without AI"].map((h,i)=>(
                <div key={h} className={`px-6 py-4 font-mono text-[9px] uppercase tracking-[0.22em] ${i===0?"text-white/18":i===1?"border-l border-violet-500/[0.1] text-violet-300":"border-l border-violet-500/[0.1] text-white/18"}`}>{h}</div>
              ))}
            </div>
            {COMPARE.map(([feat,ours,theirs],i)=>(
              <motion.div key={i} initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:0.05*i}}
                className="grid grid-cols-[1.6fr_1fr_1fr] border-b border-white/[0.04] transition-colors last:border-0 hover:bg-violet-950/[0.1]">
                <div className="flex items-center px-6 py-4 font-mono text-xs text-white/40">{feat}</div>
                <div className="flex items-center gap-2 border-l border-white/[0.04] px-6 py-4 font-mono text-xs font-medium text-violet-300"><span className="text-[8px] text-violet-500">◆</span>{ours}</div>
                <div className="flex items-center border-l border-white/[0.04] px-6 py-4 font-mono text-xs text-white/18">{theirs}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="relative z-10 py-36 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1,ease:E}}>
              <Tag>Pricing</Tag>
              <h2 className="font-['Instrument_Serif'] italic leading-[0.93] text-white" style={{fontSize:"clamp(40px,5.5vw,78px)"}}>Simple pricing.<br /><em className="text-violet-300">Real automation.</em></h2>
            </motion.div>
            <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:0.2}} className="max-w-[240px] font-mono text-xs text-white/25 md:text-right">No hidden fees.<br/>No long-term contracts.<br/>Cancel anytime.</motion.p>
          </div>
          <div className="grid gap-px border border-violet-500/[0.1] md:grid-cols-4">
            {PLANS.map((p,i)=>(
              <motion.div key={i} initial={{opacity:0,y:55}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9,ease:E,delay:i*0.1}}
                className={`relative flex flex-col p-8 transition-all ${p.hot?"bg-violet-950/30 hover:bg-violet-950/40":p.custom?"bg-[#08080f] hover:bg-[#0a0a15]":"bg-[#06060c] hover:bg-violet-950/15"}`}>
                {p.hot&&<span className="absolute right-5 top-5 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-violet-300">Popular</span>}
                {p.custom&&<span className="absolute right-5 top-5 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-white/25">Custom</span>}
                <span className="mb-5 font-mono text-[10px] tracking-[0.2em] text-violet-600/45">{p.n}</span>
                <h3 className="mb-2 font-['Instrument_Serif'] italic text-xl text-white">{p.title}</h3>
                <p className="mb-6 font-mono text-[11px] leading-relaxed text-white/28">{p.desc}</p>
                {p.custom
                  ?<p className="mb-6 font-['Instrument_Serif'] italic text-4xl text-white leading-none">Let's talk</p>
                  :<><p className="mb-0.5 font-mono text-[9px] uppercase tracking-widest text-white/18">{p.setup} setup —</p>
                    <p className="mb-6 font-['Instrument_Serif'] italic leading-none text-white" style={{fontSize:"clamp(2rem,3.5vw,3rem)"}}>{p.mo}<span className="font-sans text-sm text-white/22"> / mo</span></p></>
                }
                <ul className="mb-8 space-y-2 border-t border-white/[0.05] pt-5">
                  {p.features.map(f=>(
                    <li key={f} className="flex items-start gap-2 font-mono text-[11px] text-white/32"><span className="mt-[3px] shrink-0 text-[7px] text-violet-500">◆</span>{f}</li>
                  ))}
                </ul>
                <button onClick={()=>goto("contact")} className={`mt-auto block rounded-lg py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.15em] transition ${p.hot?"bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] hover:bg-violet-500":p.custom?"border border-violet-400/25 text-violet-400/70 hover:border-violet-400/45 hover:text-violet-300":"border border-white/[0.08] text-white/40 hover:border-violet-400/25 hover:text-white"}`}>
                  {p.custom?"Get a quote":"Get started"}
                </button>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:0.3}} className="mt-8 text-center">
            <button onClick={()=>goto("pricing")} className="font-mono text-xs text-white/22 underline underline-offset-4 transition hover:text-white/50">View full pricing details</button>
          </motion.div>
        </div>
      </section>

      {/* Founders */}
      <section className="relative z-10 py-36 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:gap-24">
            <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1,ease:E}} className="md:sticky md:top-28 md:self-start">
              <Tag>The founders</Tag>
              <h2 className="font-['Instrument_Serif'] italic leading-[0.93] text-white" style={{fontSize:"clamp(36px,4.5vw,62px)"}}>Built by people<br /><em className="text-violet-300">who care.</em></h2>
              <div className="mt-8 flex flex-wrap gap-2">
                {["Michael Brito","Badre Elkhammal"].map(name=>(
                  <span key={name} className="rounded-full border border-violet-500/[0.18] bg-violet-600/[0.07] px-4 py-1.5 font-mono text-xs text-white/40">{name}</span>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1,ease:E,delay:0.15}}>
              <blockquote className="mb-8 font-['Instrument_Serif'] italic text-[clamp(18px,2.2vw,26px)] font-light leading-[1.55] text-white/65">"Automation should feel human, calm, and trustworthy — not aggressive, robotic, or overwhelming."</blockquote>
              <div className="space-y-5 font-mono text-sm leading-[1.95] text-white/35">
                <p>quazieR was founded by <span className="text-white/60">Michael Brito</span> and <span className="text-white/60">Badre Elkhammal</span> — two builders who got tired of watching great businesses lose opportunities simply because nobody picked up the phone.</p>
                <p>After seeing countless teams burn out trying to manually respond to every lead, they built systems that quietly handle communication so owners can focus on real work.</p>
                <p>No hype. No shortcuts. Just well-designed systems that do exactly what they're supposed to do.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-36 pt-10">
        <div className="mx-auto max-w-6xl">
          <div aria-hidden className="mb-20 h-px w-full" style={{background:"linear-gradient(to right,transparent,rgba(139,92,246,0.5),transparent)"}}/>
          <div className="grid gap-14 md:grid-cols-2 md:gap-24">
            <motion.h2 initial={{opacity:0,y:50}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1.1,ease:E}}
              className="font-['Instrument_Serif'] italic leading-[0.88] text-white" style={{fontSize:"clamp(52px,7.5vw,110px)"}}>
              A calmer<br />way to<br /><em className="text-violet-300">grow.</em>
            </motion.h2>
            <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1,ease:E,delay:0.15}} className="flex flex-col justify-center">
              <p className="mb-8 font-mono text-sm leading-[1.9] text-white/38">No pressure. No obligation. Just a clear conversation about your business, your workflow, and whether quazieR is the right system for you.<br/><br/><span className="text-white">Most clients are live within 48 hours.</span> We handle everything — you just show up.</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={()=>goto("contact")} className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.15em] text-white shadow-[0_0_28px_rgba(124,58,237,0.4)] transition hover:bg-violet-500">Start the conversation</button>
                <button onClick={()=>goto("pricing")} className="inline-flex items-center gap-2 rounded-lg border border-white/[0.09] px-7 py-3.5 font-mono text-xs uppercase tracking-[0.15em] text-white/45 transition hover:border-violet-400/25 hover:bg-violet-500/[0.07] hover:text-white">See pricing</button>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {["No contracts","Live in 48h","Cancel anytime"].map(t=>(
                  <span key={t} className="flex items-center gap-1.5 rounded-full border border-violet-500/[0.15] px-3 py-1 font-mono text-[10px] text-white/28"><span className="h-1 w-1 rounded-full bg-violet-500"/>{t}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRICING
// ═══════════════════════════════════════════════════════════════════════════════
function PricingPage({goto}:{goto:(p:Page)=>void}){
  const [annual,setAnnual]=useState(false);
  return(
    <div className="relative z-10 px-6 pt-36 pb-24">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-violet-600/[0.08] blur-[140px]"/>
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:1,ease:E}} className="mb-20 text-center">
          <Tag>Pricing</Tag>
          <h1 className="mb-6 font-['Instrument_Serif'] italic leading-[0.88] text-white" style={{fontSize:"clamp(56px,8vw,120px)"}}>Honest pricing.<br /><em className="text-violet-300">Real results.</em></h1>
          <p className="mx-auto max-w-xl font-mono text-sm leading-relaxed text-white/35">No hidden fees. No long-term contracts. No sales games. Pick the plan that fits and be live within 48 hours.</p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`font-mono text-xs uppercase tracking-[0.15em] ${!annual?"text-white":"text-white/30"}`}>Monthly</span>
            <button onClick={()=>setAnnual(!annual)} className={`relative h-7 w-12 rounded-full border transition-colors ${annual?"border-violet-500/40 bg-violet-600/20":"border-white/[0.1] bg-white/[0.05]"}`}>
              <motion.span animate={{x:annual?20:2}} transition={{type:"spring",stiffness:400,damping:30}} className="absolute top-1 h-5 w-5 rounded-full bg-violet-500"/>
            </button>
            <span className={`font-mono text-xs uppercase tracking-[0.15em] ${annual?"text-white":"text-white/30"}`}>Annual <span className="text-violet-400">−20%</span></span>
          </div>
        </motion.div>
        <div className="grid gap-px border border-violet-500/[0.1] md:grid-cols-4">
          {PLANS.map((p,i)=>{
            const moPrice=p.custom?null:parseInt(p.mo.replace("$",""));
            const displayPrice=moPrice?(annual?`$${Math.round(moPrice*0.8)}`:p.mo):null;
            return(
              <motion.div key={i} initial={{opacity:0,y:55}} animate={{opacity:1,y:0}} transition={{duration:0.9,ease:E,delay:i*0.1}}
                className={`relative flex flex-col p-8 md:p-10 transition-all ${p.hot?"bg-violet-950/30":p.custom?"bg-[#08080f]":"bg-[#06060c]"}`}>
                {p.hot&&<span className="absolute right-5 top-5 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-violet-300">Most popular</span>}
                {p.custom&&<span className="absolute right-5 top-5 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-white/25">Bespoke</span>}
                <span className="mb-5 font-mono text-[10px] tracking-[0.22em] text-violet-600/40">{p.n}</span>
                <h3 className="mb-2 font-['Instrument_Serif'] italic text-2xl text-white">{p.title}</h3>
                <p className="mb-8 font-mono text-[11px] leading-relaxed text-white/28">{p.desc}</p>
                {p.custom
                  ?<div className="mb-8"><p className="font-['Instrument_Serif'] italic text-4xl text-white leading-none">Tailored</p><p className="mt-2 font-mono text-[10px] text-white/25">Quoted per scope</p></div>
                  :<div className="mb-8">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-white/18">{p.setup} setup —</p>
                    <p className="font-['Instrument_Serif'] italic leading-none text-white" style={{fontSize:"clamp(2.5rem,4vw,3.5rem)"}}>{displayPrice}<span className="font-sans text-base text-white/22"> / mo</span></p>
                    {annual&&<p className="mt-1 font-mono text-[10px] text-emerald-400">Saving ${moPrice!-Math.round(moPrice!*0.8)}/mo</p>}
                  </div>
                }
                <ul className="mb-10 space-y-3 border-t border-white/[0.05] pt-6">
                  {p.features.map(f=>(
                    <li key={f} className="flex items-start gap-2.5 font-mono text-[11px] text-white/35"><span className="mt-[3px] shrink-0 text-[7px] text-violet-500">◆</span>{f}</li>
                  ))}
                </ul>
                <button onClick={()=>goto("contact")} className={`mt-auto block rounded-lg py-3 text-center font-mono text-[10px] uppercase tracking-[0.15em] transition ${p.hot?"bg-violet-600 text-white shadow-[0_0_24px_rgba(124,58,237,0.35)] hover:bg-violet-500":p.custom?"border border-violet-400/25 text-violet-300/60 hover:border-violet-400/45 hover:text-violet-300":"border border-white/[0.08] text-white/38 hover:border-violet-400/25 hover:text-white"}`}>
                  {p.custom?"Request a quote":"Get started"}
                </button>
              </motion.div>
            );
          })}
        </div>
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1,ease:E,delay:0.2}}
          className="mt-6 overflow-hidden rounded-2xl border border-violet-500/[0.15] bg-violet-950/[0.18] p-10 md:p-14">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-violet-400">Custom plan</p>
              <h2 className="font-['Instrument_Serif'] italic leading-[0.93] text-white" style={{fontSize:"clamp(32px,4vw,56px)"}}>Built on<br /><em className="text-violet-300">n8n.</em></h2>
              <div className="mt-8"><IllustrationWorkflow/></div>
            </div>
            <div>
              <p className="mb-8 font-mono text-sm leading-[1.9] text-white/38">Not every business fits a template. The Custom plan is for companies with complex, multi-system workflows that need to be engineered from scratch — using n8n as the orchestration layer.</p>
              <div className="grid gap-4 md:grid-cols-2">
                {N8N_FEATURES.map((f,i)=>(
                  <div key={i} className="rounded-xl border border-violet-500/[0.1] bg-violet-950/[0.1] p-5">
                    <p className="mb-1.5 font-mono text-xs text-white">{f.title}</p>
                    <p className="font-mono text-[11px] leading-relaxed text-white/30">{f.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <button onClick={()=>goto("contact")} className="inline-flex items-center gap-2 rounded-lg border border-violet-400/25 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-violet-300 transition hover:bg-violet-500/10">Discuss your workflow</button>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1,ease:E}} className="mt-20">
          <Tag>FAQ</Tag>
          <div className="mt-8 divide-y divide-white/[0.05]">
            {[
              {q:"How fast can I go live?",               a:"Most clients are fully live within 48 hours of onboarding. The Custom plan may take longer depending on workflow complexity."},
              {q:"Is there a long-term commitment?",      a:"No. All plans are month-to-month. Cancel at any time with no penalty."},
              {q:"Can I upgrade or change plans later?",  a:"Yes. You can move between plans at any time. Changes take effect on your next billing cycle."},
              {q:"What's included in the setup fee?",     a:"The setup fee covers system configuration, AI training on your business, integration testing, and go-live support."},
              {q:"Does the AI sound like a real person?", a:"Yes. Our voice AI is trained to match your brand's tone and handles natural conversation including interruptions and follow-up questions."},
            ].map((item,i)=><FAQItem key={i} q={item.q} a={item.a}/>)}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════════════════════════
function ServicesPage({goto}:{goto:(p:Page)=>void}){
  const items=[
    {n:"01",title:"AI Website",           headline:"Your 24/7 sales machine.",      desc:"We build high-conversion websites that don't just look good — they actively capture and qualify leads around the clock.",details:["Custom design aligned to your brand","Lead capture with instant AI response","Mobile-first, performance-optimised","Connected to your CRM from day one","Built-in analytics and tracking"]},
    {n:"02",title:"AI Voice Receptionist",headline:"Never miss a call again.",       desc:"An AI receptionist that answers every call, qualifies the lead, books appointments, and routes urgent matters — sounding exactly like your brand.",details:["Natural conversation handling","Lead qualification scripting","Appointment booking integration","Urgent call escalation routing","Full call logging and summaries"]},
    {n:"03",title:"AI Chat & SMS",        headline:"Instant replies, every channel.",desc:"We deploy AI on WhatsApp, SMS, and your website chat. Every inbound message gets an immediate, intelligent response — even at 3am.",details:["WhatsApp Business API integration","SMS automation","Web chat widget","Lead capture and qualification","Handoff to human when needed"]},
    {n:"04",title:"Automated Follow-Ups", headline:"Persistence without effort.",    desc:"Multi-step follow-up sequences that run automatically after every lead interaction.",details:["Multi-channel sequences (email, SMS, WhatsApp)","Personalised message logic","Time-delay and behaviour triggers","Lead scoring integration","Full sequence analytics"]},
    {n:"05",title:"Lead Qualification",   headline:"Only talk to the right people.", desc:"AI-powered screening that identifies intent, asks qualifying questions, and scores leads before they ever reach your team.",details:["Custom qualification criteria","AI scoring and tagging","Automatic CRM enrichment","Disqualification handling","Hot lead alerts"]},
    {n:"06",title:"CRM Integration",      headline:"Your stack, connected.",         desc:"We wire your automation systems into your existing CRM so nothing falls through the cracks.",details:["GoHighLevel integration","HubSpot integration","Salesforce integration","Custom API connections","Bi-directional data sync"]},
    {n:"07",title:"Custom n8n Workflows", headline:"Automation without limits.",     desc:"For businesses with complex, multi-system needs. We architect bespoke automation workflows using n8n — connecting any tool, any API, any process.",details:["Full workflow architecture","API and webhook integration","Conditional logic and branching","Data transformation pipelines","Monitoring and alerting"]},
  ];
  return(
    <div className="relative z-10 px-6 pt-36 pb-24">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:1,ease:E}} className="mb-24">
          <Tag>Services</Tag>
          <h1 className="mb-6 font-['Instrument_Serif'] italic leading-[0.88] text-white" style={{fontSize:"clamp(56px,8vw,120px)"}}>Systems that<br /><em className="text-violet-300">do the work.</em></h1>
          <p className="max-w-xl font-mono text-sm leading-relaxed text-white/35">Each service is a purpose-built system, not a generic tool. We configure, deploy, and maintain everything — you get results without the overhead.</p>
        </motion.div>
        <div className="divide-y divide-white/[0.05]">
          {items.map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.85,ease:E,delay:0.05*i}}
              className="grid gap-8 py-16 md:grid-cols-[1fr_2fr] md:gap-20">
              <div>
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-violet-600/50">{s.n}</p>
                <h2 className="font-['Instrument_Serif'] italic text-3xl text-white">{s.title}</h2>
                <p className="mt-2 font-mono text-xs italic text-violet-300/55">{s.headline}</p>
              </div>
              <div>
                <p className="mb-8 font-mono text-sm leading-[1.9] text-white/38">{s.desc}</p>
                <ul className="space-y-2.5">
                  {s.details.map(d=>(
                    <li key={d} className="flex items-start gap-2.5 font-mono text-xs text-white/30"><span className="mt-[3px] shrink-0 text-[7px] text-violet-500">◆</span>{d}</li>
                  ))}
                </ul>
                <div className="mt-8">
                  <button onClick={()=>goto("contact")} className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/35 transition hover:border-violet-400/25 hover:text-white">Enquire about this</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABOUT
// ═══════════════════════════════════════════════════════════════════════════════
function AboutPage({goto}:{goto:(p:Page)=>void}){
  const values=[
    {title:"Calm over chaos",  desc:"We build systems that reduce noise, not add to it. Every decision is guided by what creates the most clarity."},
    {title:"Precision",         desc:"We don't ship until it works exactly as intended. We'd rather take an extra day than deliver something that's almost right."},
    {title:"No hype",           desc:"We say what we mean. No inflated promises, no manufactured urgency. If something isn't the right fit, we say so."},
    {title:"Human at the core", desc:"AI should handle the repetitive so people can focus on what only humans can do. That's the only version of automation worth building."},
  ];
  return(
    <div className="relative z-10 px-6 pt-36 pb-24">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:1,ease:E}} className="mb-32">
          <Tag>About</Tag>
          <h1 className="mb-8 font-['Instrument_Serif'] italic leading-[0.88] text-white" style={{fontSize:"clamp(56px,8vw,120px)"}}>Built with<br /><em className="text-violet-300">intention.</em></h1>
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
            <p className="font-mono text-sm leading-[1.9] text-white/38">quazieR started with a simple observation: great businesses were losing customers not because of their product or service — but because they couldn't respond fast enough.</p>
            <p className="font-mono text-sm leading-[1.9] text-white/38">Michael and Badre built quazieR to close that gap permanently. Not with an app that creates more to-do items, but with systems that operate in the background, silently handling communication.</p>
          </div>
        </motion.div>
        <motion.div initial={{opacity:0,scale:0.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:1.2,ease:E}} className="mb-32 flex justify-center">
          <IllustrationOrbitNetwork/>
        </motion.div>
        <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1,ease:E}} className="mb-32">
          <Tag>The team</Tag>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              {name:"Michael Brito",   role:"Co-founder",bio:"Systems architect with a background in automation engineering and product design. Obsessed with removing friction from complex workflows."},
              {name:"Badre Elkhammal",role:"Co-founder",bio:"Growth operator and AI integration specialist. Has built and scaled sales automation systems for dozens of service businesses."},
            ].map((f,i)=>(
              <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.85,ease:E,delay:i*0.12}}
                className="rounded-2xl border border-violet-500/[0.12] bg-violet-950/[0.1] p-8">
                <div className="mb-4 h-px w-12 bg-violet-500/40"/>
                <h3 className="mb-1 font-['Instrument_Serif'] italic text-2xl text-white">{f.name}</h3>
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-violet-400/60">{f.role}</p>
                <p className="font-mono text-xs leading-relaxed text-white/35">{f.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1,ease:E}} className="mb-32">
          <Tag>Our values</Tag>
          <div className="mt-10 grid gap-px border border-violet-500/[0.1] md:grid-cols-2">
            {values.map((v,i)=>(
              <motion.div key={i} initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:i*0.1}}
                className="bg-[#06060c] p-8 transition-colors hover:bg-violet-950/[0.15]">
                <p className="mb-3 font-['Instrument_Serif'] italic text-xl text-white">{v.title}</p>
                <p className="font-mono text-xs leading-relaxed text-white/30">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1,ease:E}} className="border-t border-white/[0.05] pt-20 text-center">
          <blockquote className="mx-auto max-w-3xl font-['Instrument_Serif'] italic font-light leading-[1.5] text-white/55" style={{fontSize:"clamp(24px,3vw,42px)"}}>
            "Automation should feel human, calm, and trustworthy — not aggressive, robotic, or overwhelming."
          </blockquote>
          <div className="mt-8 h-px w-12 mx-auto bg-violet-500/30"/>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/20">Michael & Badre, quazieR</p>
        </motion.div>
        <div className="mt-24 flex justify-center">
          <button onClick={()=>goto("contact")} className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-8 py-4 font-mono text-xs uppercase tracking-[0.15em] text-white shadow-[0_0_28px_rgba(124,58,237,0.4)] transition hover:bg-violet-500">Work with us</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════════════════════════════════════════
function ContactPage(){
  const [form,setForm]=useState({name:"",email:"",business:"",message:""});
  const [sent,setSent]=useState(false);
  const handle=(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>setForm({...form,[e.target.name]:e.target.value});
  const submit=(e:React.FormEvent)=>{e.preventDefault();setSent(true);};
  return(
    <div className="relative z-10 px-6 pt-36 pb-24">
      <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[400px] bg-violet-600/[0.06] blur-[150px]"/>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-[1fr_1.4fr]">
          <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:1,ease:E}}>
            <Tag>Contact</Tag>
            <h1 className="mb-8 font-['Instrument_Serif'] italic leading-[0.88] text-white" style={{fontSize:"clamp(48px,6vw,90px)"}}>Let's talk<br /><em className="text-violet-300">about your business.</em></h1>
            <p className="mb-12 font-mono text-sm leading-[1.9] text-white/35">No pressure. No sales pitch. Just a real conversation about where you're losing time and how automation might help. Most clients are live within 48 hours.</p>
            <div className="space-y-6">
              {[{label:"Email",value:"hello@brammal.com"},{label:"WhatsApp",value:"+1 (555) 000-0000"},{label:"Based in",value:"Available worldwide"}].map(c=>(
                <div key={c.label}><p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/22">{c.label}</p><p className="mt-1 font-mono text-sm text-white/55">{c.value}</p></div>
              ))}
            </div>
            <div className="mt-10 flex justify-start"><IllustrationSignalRings/></div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["No contracts","Live in 48h","Cancel anytime"].map(t=>(
                <span key={t} className="flex items-center gap-1.5 rounded-full border border-violet-500/[0.15] px-3 py-1 font-mono text-[10px] text-white/28"><span className="h-1 w-1 rounded-full bg-violet-500"/>{t}</span>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:1,ease:E,delay:0.15}}
            className="rounded-2xl border border-violet-500/[0.12] bg-white/[0.02] p-8 md:p-10">
            {sent?(
              <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:0.5,ease:E}}>
                  <div className="mb-6 h-px w-12 mx-auto bg-violet-500/50"/>
                  <h3 className="mb-4 font-['Instrument_Serif'] italic text-3xl text-white">Message received.</h3>
                  <p className="font-mono text-sm text-white/35">We'll get back to you within 24 hours. Usually much sooner.</p>
                </motion.div>
              </div>
            ):(
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  {[{name:"name",label:"Your name",type:"text",placeholder:"Alex Johnson"},{name:"email",label:"Email address",type:"email",placeholder:"alex@company.com"}].map(f=>(
                    <div key={f.name}>
                      <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.22em] text-white/30">{f.label}</label>
                      <input type={f.type} name={f.name} value={(form as any)[f.name]} onChange={handle} placeholder={f.placeholder} required
                        className="w-full rounded-lg border border-violet-500/[0.15] bg-white/[0.03] px-4 py-3 font-mono text-sm text-white placeholder-white/18 outline-none transition focus:border-violet-500/45 focus:bg-violet-500/[0.04]"/>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.22em] text-white/30">Business type</label>
                  <select name="business" value={form.business} onChange={handle} required className="w-full rounded-lg border border-violet-500/[0.15] bg-white/[0.03] px-4 py-3 font-mono text-sm text-white/60 outline-none transition focus:border-violet-500/45 appearance-none">
                    <option value="" className="bg-[#06060c]">Select your industry</option>
                    {["Real estate","Legal","Healthcare","Finance","E-commerce","Agency","Consulting","Other"].map(o=>(
                      <option key={o} value={o} className="bg-[#06060c]">{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.22em] text-white/30">What can we help with?</label>
                  <textarea name="message" value={form.message} onChange={handle} placeholder="Tell us about your business and where you're losing time..." rows={5} required
                    className="w-full rounded-lg border border-violet-500/[0.15] bg-white/[0.03] px-4 py-3 font-mono text-sm text-white placeholder-white/18 outline-none transition focus:border-violet-500/45 resize-none"/>
                </div>
                <button type="submit" className="w-full rounded-lg bg-violet-600 py-4 font-mono text-xs uppercase tracking-[0.18em] text-white shadow-[0_0_24px_rgba(124,58,237,0.35)] transition hover:bg-violet-500">Send message</button>
                <p className="text-center font-mono text-[10px] text-white/18">We typically reply within a few hours</p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 404
// ═══════════════════════════════════════════════════════════════════════════════
function NotFoundPage({goto}:{goto:(p:Page)=>void}){
  return(
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({length:12},(_,i)=>(
          <motion.div key={i} className="absolute border border-violet-500/[0.1] rounded-full"
            style={{width:80+i*80,height:80+i*80,top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}
            animate={{scale:[1,1.02,1],opacity:[0.4,0.7,0.4]}} transition={{duration:4+i*0.4,repeat:Infinity,ease:"easeInOut",delay:i*0.2}}/>
        ))}
      </div>
      <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:1,ease:E}} className="relative">
        <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.28em] text-violet-400/60">Error 404</p>
        <h1 className="mb-6 font-['Instrument_Serif'] italic leading-[0.88] text-white" style={{fontSize:"clamp(80px,14vw,200px)"}}>Lost.</h1>
        <p className="mb-12 font-mono text-sm text-white/30">This page doesn't exist. But your leads shouldn't get this treatment — let's fix that.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button onClick={()=>goto("home")} className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.15em] text-white shadow-[0_0_24px_rgba(124,58,237,0.4)] transition hover:bg-violet-500">Back to home</button>
          <button onClick={()=>goto("contact")} className="inline-flex items-center gap-2 rounded-lg border border-white/[0.09] px-7 py-3.5 font-mono text-xs uppercase tracking-[0.15em] text-white/40 transition hover:border-violet-400/25 hover:text-white">Contact us</button>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Home(){
  const [page,setPage]=useState<Page>("home");
  const goto=(p:Page)=>{window.scrollTo({top:0,behavior:"smooth"});setTimeout(()=>setPage(p),120);};
  return(
    <div className="min-h-screen bg-[#06060c] text-white selection:bg-violet-500/30">
      <Background/>
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,backgroundRepeat:"repeat",backgroundSize:"128px 128px"}}/>
      <Nav current={page} goto={goto}/>
      <AnimatePresence mode="wait">
        <motion.main key={page} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.3}}>
          {page==="home"     &&<HomePage    goto={goto}/>}
          {page==="pricing"  &&<PricingPage goto={goto}/>}
          {page==="services" &&<ServicesPage goto={goto}/>}
          {page==="about"    &&<AboutPage   goto={goto}/>}
          {page==="contact"  &&<ContactPage/>}
          {page==="404"      &&<NotFoundPage goto={goto}/>}
        </motion.main>
      </AnimatePresence>
      <Footer goto={goto}/>
    </div>
  );
}
