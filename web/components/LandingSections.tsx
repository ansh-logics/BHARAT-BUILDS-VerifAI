"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, CheckCircle2, Cloud, Database, HardDrive, LayoutDashboard, BrainCircuit, FileText, Server, ShieldCheck } from "lucide-react";
import {
  getStoredEmail,
  getStoredRollNo,
  getStoredToken,
  getStoredTpoToken,
  getStoredTpoUsername,
} from "@/lib/auth-storage";

function formatUserLabel(email: string | null, rollNo: string | null): string {
  if (rollNo) return rollNo;
  if (!email) return "Student";
  const local = email.split("@")[0]?.trim();
  if (!local) return "Student";
  return local.replace(/[._-]+/g, " ");
}

export function Navbar() {
  const [studentLoggedIn, setStudentLoggedIn] = useState(false);
  const [tpoLoggedIn, setTpoLoggedIn] = useState(false);
  const [userLabel, setUserLabel] = useState("Student");

  useEffect(() => {
    const studentToken = getStoredToken();
    const tpoToken = getStoredTpoToken();
    const email = getStoredEmail();
    const rollNo = getStoredRollNo();
    const tpoUsername = getStoredTpoUsername();

    if (tpoToken) {
      setTpoLoggedIn(true);
      setStudentLoggedIn(false);
      setUserLabel(tpoUsername || "TPO");
      return;
    }

    if (studentToken) {
      setStudentLoggedIn(true);
      setTpoLoggedIn(false);
      setUserLabel(formatUserLabel(email, rollNo));
      return;
    }

    setStudentLoggedIn(false);
    setTpoLoggedIn(false);
  }, []);

  return (
    <header className="fixed top-2 left-0 right-0 z-50 flex justify-between items-center px-8 h-16 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl rounded-full mt-4 mx-auto w-[92%] max-w-7xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] ring-1 ring-black/[0.04]">
      <div className="flex items-center gap-2">
        <BrainCircuit className="text-purple-600 w-6 h-6" />
        <span className="text-xl font-bold tracking-tighter text-[#1d1d1f] dark:text-zinc-50 font-sans">VerifAI</span>
      </div>
      <nav className="hidden md:flex items-center gap-8">
        <Link className="font-sans tracking-tight text-sm font-semibold text-[#1d1d1f] dark:text-purple-400" href="/#home">Home</Link>
        <Link className="font-sans tracking-tight text-sm font-semibold text-[#86868b] dark:text-zinc-400 hover:text-[#1d1d1f] transition-colors duration-300" href="/demo">Live Demo</Link>
        <Link className="font-sans tracking-tight text-sm font-semibold text-[#86868b] dark:text-zinc-400 hover:text-[#1d1d1f] transition-colors duration-300" href="/#live-demo">Case Studies</Link>
        <Link className="font-sans tracking-tight text-sm font-semibold text-[#86868b] dark:text-zinc-400 hover:text-[#1d1d1f] transition-colors duration-300" href="/#architecture">AWS Architecture</Link>
      </nav>
      <div className="flex items-center gap-4">
        {studentLoggedIn || tpoLoggedIn ? (
          <>
            <span className="hidden sm:block font-sans tracking-tight text-sm font-semibold text-[#86868b]">
              {userLabel}
            </span>
            <Link
              className="bg-[#1d1d1f] text-white font-sans tracking-tight text-sm font-semibold px-6 py-2 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-md"
              href={tpoLoggedIn ? "/tpo" : "/profile"}
            >
              {tpoLoggedIn ? "Open TPO" : "Open Profile"}
            </Link>
          </>
        ) : (
          <>
            <Link className="font-sans tracking-tight text-sm font-semibold text-[#86868b] hover:text-[#1d1d1f] transition-colors duration-300 hidden sm:block" href="/login">Login</Link>
            <Link className="bg-[#1d1d1f] text-white font-sans tracking-tight text-sm font-semibold px-6 py-2 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-md" href="/register">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}

export function Features() {
  return (
    <section id="features" className="scroll-mt-28 space-y-16 py-24 px-6 sm:px-12 max-w-7xl mx-auto w-full bg-[#f5f5f7]">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-[#1d1d1f]">Intelligence at every step.</h2>
        <p className="text-[#86868b] font-medium text-xl tracking-tight">Designed to bring clarity and precision to the complex placement process.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Feature 1 */}
        <div className="md:col-span-8 bg-white rounded-[2.5rem] p-12 flex flex-col md:flex-row gap-10 items-center ring-1 ring-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform duration-500">
          <div className="flex-1 space-y-4 relative z-10">
            <div className="bg-zinc-50/80 w-12 h-12 rounded-full flex items-center justify-center ring-1 ring-black/5 mb-8">
              <CheckCircle2 className="text-purple-600 w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">Verified Profiles</h3>
            <p className="text-[#86868b] text-base leading-relaxed font-medium">We cross-check submitted marksheets, resume evidence, GitHub activity, and coding profiles to give placement teams an auditable view of each candidate.</p>
          </div>
          <div className="flex-1 w-full bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/[0.04] relative z-10 hover:scale-[1.02] transition-transform duration-500">
            <div className="space-y-4">
              {/* Profile Card Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-50/50 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg ring-1 ring-indigo-100">AB</div>
                   <div>
                     <div className="font-bold tracking-tight text-[#1d1d1f] text-sm">Aarav Sharma</div>
                     <div className="text-xs text-[#86868b] font-medium mt-0.5">Synthetic demo candidate</div>
                   </div>
                 </div>
                 <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 px-3 py-1.5 rounded-full ring-1 ring-green-100"><CheckCircle2 className="w-3 h-3"/> Verified</span>
              </div>
              {/* Profile Stats */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                 <div className="bg-zinc-50/50 rounded-2xl p-4 ring-1 ring-black/[0.03]">
                    <div className="text-xs text-[#86868b] font-semibold mb-1">Academic CGPA</div>
                    <div className="text-xl font-bold tracking-tight text-[#1d1d1f]">8.60</div>
                 </div>
                 <div className="bg-zinc-50/50 rounded-2xl p-4 ring-1 ring-black/[0.03]">
                    <div className="text-xs text-[#86868b] font-semibold mb-1">Evidence Sources</div>
                    <div className="text-xl font-bold tracking-tight text-[#1d1d1f]">4 connected</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature 2 */}
        <div className="md:col-span-4 bg-[#1d1d1f] rounded-[2.5rem] p-12 text-white flex flex-col justify-between relative overflow-hidden ring-1 ring-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-transform duration-500">
          <div className="relative z-10 space-y-4 mb-16">
            <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md mb-8 ring-1 ring-white/10">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">AI Matching</h3>
            <p className="text-[#86868b] text-base leading-relaxed font-medium">Structured JD parsing and a deterministic skill ontology produce explainable matches and visible gaps.</p>
          </div>
          <div className="relative z-10 bg-white/5 backdrop-blur-3xl rounded-3xl p-6 ring-1 ring-white/10 flex justify-between items-end hover:scale-[1.02] transition-transform duration-500">
             <div>
               <div className="text-[11px] text-white/50 uppercase tracking-widest mb-1.5 font-bold">Decision support</div>
               <div className="text-3xl font-bold tracking-tighter">Evidence shown</div>
             </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="md:col-span-12 bg-white rounded-[2.5rem] p-12 ring-1 ring-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform duration-500">
           <div className="flex flex-col md:flex-row gap-16 items-center">
             <div className="flex-1 space-y-4">
               <div className="bg-zinc-50 w-12 h-12 rounded-full flex items-center justify-center ring-1 ring-black/5 mb-8">
                 <LayoutDashboard className="text-purple-600 w-6 h-6" />
               </div>
               <h3 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">TPO Dashboard</h3>
               <p className="text-[#86868b] text-base leading-relaxed font-medium max-w-lg">A centralized command center for Training and Placement Officers. Track overall campus performance, upcoming drives, and student readiness metrics at a glance.</p>
              <Link href="/tpo" className="inline-block mt-6 bg-white text-[#1d1d1f] px-8 py-3 rounded-full font-semibold ring-1 ring-black/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:bg-zinc-50 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300">
                 View Dashboard
               </Link>
             </div>
             <div className="flex-[1.5] w-full bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/[0.04] overflow-hidden relative hover:scale-[1.02] transition-transform duration-500">
               <div className="flex justify-between items-center mb-6">
                 <h4 className="font-bold tracking-tight text-[#1d1d1f] text-base">Active Campus Drives</h4>
                 <div className="text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-md">LABELED DEMO COHORT</div>
               </div>
               
               <div className="flex gap-4 mb-6">
                 {/* Stat 1 */}
                 <div className="flex-1 bg-purple-50/30 rounded-2xl p-4 ring-1 ring-purple-100">
                    <div className="text-[11px] text-purple-600 font-bold mb-1 uppercase tracking-widest">Profiles</div>
                    <div className="text-3xl font-bold tracking-tighter text-purple-900">26</div>
                 </div>
                 {/* Stat 2 */}
                 <div className="flex-1 bg-zinc-50/50 rounded-2xl p-4 ring-1 ring-black/[0.03]">
                    <div className="text-[11px] text-[#86868b] font-bold mb-1 uppercase tracking-widest">Eligible</div>
                    <div className="text-3xl font-bold tracking-tighter text-[#1d1d1f]">16</div>
                 </div>
                 {/* Stat 3 */}
                 <div className="flex-1 bg-zinc-50/50 rounded-2xl p-4 ring-1 ring-black/[0.03]">
                    <div className="text-[11px] text-[#86868b] font-bold mb-1 uppercase tracking-widest">Placed</div>
                    <div className="text-3xl font-bold tracking-tighter text-[#1d1d1f]">4</div>
                 </div>
               </div>
               
               {/* Trend Chart Mock */}
               <div className="w-full h-[80px] bg-zinc-50/50 rounded-2xl ring-1 ring-black/[0.03] flex items-end px-4 py-3 gap-2 opacity-90">
                  <div className="w-full bg-indigo-100 rounded-t border-t border-indigo-200" style={{height: "40%"}}></div>
                  <div className="w-full bg-indigo-200 rounded-t border-t border-indigo-300" style={{height: "60%"}}></div>
                  <div className="w-full bg-indigo-300 rounded-t border-t border-indigo-400" style={{height: "30%"}}></div>
                  <div className="w-full bg-purple-500 rounded-t-lg relative shadow-[0_4px_20px_rgba(139,92,246,0.25)] shadow-purple-500" style={{height: "80%"}}>
                     <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wide text-purple-600 bg-white ring-1 ring-purple-100 px-2 py-1 rounded-md shadow-sm">Peak</div>
                  </div>
                  <div className="w-full bg-indigo-200 rounded-t border-t border-indigo-300" style={{height: "50%"}}></div>
                  <div className="w-full bg-indigo-300 rounded-t border-t border-indigo-400" style={{height: "90%"}}></div>
                  <div className="w-full bg-indigo-400 rounded-t border-t border-indigo-500" style={{height: "100%"}}></div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}

export function LiveUseCase() {
  return (
    <section id="live-demo" className="scroll-mt-28 max-w-6xl mx-auto w-full my-12 bg-white rounded-[3rem] p-16 ring-1 ring-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
      <div className="text-center mb-16 relative z-10">
        <span className="text-[#86868b] font-bold tracking-widest uppercase text-xs mb-3 block">Live Demo</span>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-[#1d1d1f]">See it in action.</h2>
      </div>
      
      <div className="flex flex-col gap-6 max-w-4xl mx-auto relative z-10">
        <div className="bg-zinc-50/50 rounded-3xl p-8 flex items-start gap-6 ring-1 ring-black/[0.03]">
           <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 ring-1 ring-black/5 shadow-sm">
             <FileText className="text-zinc-500 w-5 h-5" />
           </div>
           <div className="space-y-3 w-full mt-1">
             <div className="text-sm font-bold tracking-tight text-[#1d1d1f]">Recruiter Prompt</div>
             <div className="bg-white rounded-2xl p-5 text-[#86868b] font-mono text-[13px] leading-relaxed ring-1 ring-black/[0.04] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
               &quot;Find top 5 students for a React Frontend Intern role. Must have &gt;8 CGPA, completed at least one full-stack project, and have an active GitHub. Rank by technical assessment score.&quot;
             </div>
           </div>
        </div>

        <div className="bg-white rounded-3xl p-8 flex items-start gap-6 ring-1 ring-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-transform duration-500">
           <div className="bg-gradient-to-r from-purple-600 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
             <BrainCircuit className="text-white w-6 h-6" />
           </div>
           <div className="space-y-4 w-full mt-1">
             <div className="text-sm font-bold tracking-tight text-[#1d1d1f]">VerifAI Engine Output</div>
             <p className="text-sm text-[#86868b] font-medium">Parsed the JD, applied academic and backlog policies, then ranked a labeled synthetic cohort with visible evidence and skill gaps.</p>
             
             <div className="space-y-3 pt-2">
               <div className="bg-zinc-50/80 rounded-2xl p-4 flex justify-between items-center ring-1 ring-black/[0.03] hover:scale-[1.01] transition-transform">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xs font-bold text-[#1d1d1f] ring-1 ring-black/5 shadow-sm">1</div>
                   <div>
                     <div className="font-bold tracking-tight text-[#1d1d1f] text-sm">Rohan Gupta <span className="ml-1 text-[9px] uppercase tracking-wider text-sky-700">Demo</span></div>
                     <div className="text-xs text-[#86868b] font-medium mt-0.5">Matched React + Node.js &bull; TypeScript gap visible</div>
                   </div>
                 </div>
                 <div className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full font-bold tracking-tight ring-1 ring-green-100">68.0% Match</div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}

export function AWSArchitecture() {
  const [serviceState, setServiceState] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:18082";
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 6000);
    fetch(`${apiBase.replace(/\/$/, "")}/health`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        setServiceState(response.ok ? "online" : "offline");
      })
      .catch(() => setServiceState("offline"))
      .finally(() => window.clearTimeout(timeout));
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const layers = [
    { icon: Cloud, label: "Amazon API Gateway", detail: "Public HTTPS ingress and routing" },
    { icon: Server, label: "Amazon EC2", detail: "Containerized FastAPI agent services" },
    { icon: HardDrive, label: "Amazon S3", detail: "Private encrypted resume objects" },
    { icon: Database, label: "PostgreSQL", detail: "Candidate and placement intelligence" },
  ];

  return (
    <section id="architecture" className="scroll-mt-28 mx-auto my-24 w-full max-w-7xl px-6 sm:px-12">
      <div className="overflow-hidden rounded-[3rem] bg-[#101820] text-white shadow-[0_28px_80px_rgba(15,23,42,0.2)] ring-1 ring-white/10">
        <div className="grid gap-12 p-10 sm:p-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col justify-between gap-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300 ring-1 ring-emerald-300/20">
                <Activity className="size-3.5" />
                {serviceState === "online" ? "Live on AWS" : serviceState === "offline" ? "Health check unavailable" : "Checking AWS deployment"}
              </div>
              <h2 className="mt-7 text-4xl font-bold tracking-tighter sm:text-5xl">Built to ship, not just demo.</h2>
              <p className="mt-5 max-w-xl text-base font-medium leading-7 text-slate-300">
                VeriAI runs independent analysis agents behind one orchestrator, so colleges can scale resume, coding, marksheet, and JD intelligence without coupling every workflow together.
              </p>
            </div>
            <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-300" />
                <div>
                  <p className="font-semibold">Private by default</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">S3 public access is blocked, objects are AES-256 encrypted, and EC2 uses an IAM role instead of stored AWS access keys.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {layers.map(({ icon: Icon, label, detail }, index) => (
              <div key={label} className="group rounded-3xl bg-white/[0.07] p-6 ring-1 ring-white/10 transition-transform duration-300 hover:-translate-y-1 hover:bg-white/[0.1]">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-sky-300">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-xs font-semibold tabular-nums text-slate-500">0{index + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold">{label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="footer" className="w-full py-20 px-12 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto bg-[#f5f5f7] text-purple-600 font-sans text-xs uppercase tracking-widest rounded-t-[3rem] opacity-90 hover:opacity-100 border-t border-zinc-200">
      <div className="flex items-center gap-2 mb-8 md:flex-row md:mb-0">
        <BrainCircuit className="text-purple-600 w-6 h-6" />
        <span className="text-lg font-bold text-zinc-900 tracking-normal normal-case">VerifAI</span>
      </div>
      <div className="flex flex-wrap justify-center gap-8 mb-8 md:mb-0 font-semibold">
        <Link className="text-zinc-500 hover:text-purple-600 transition-colors" href="/#features">Product</Link>
        <Link className="text-zinc-500 hover:text-purple-600 transition-colors" href="/#live-demo">Intelligence</Link>
        <Link className="text-zinc-500 hover:text-purple-600 transition-colors" href="/register">Privacy</Link>
        <Link className="text-zinc-500 hover:text-purple-600 transition-colors" href="/login">Terms</Link>
      </div>
      <div className="text-zinc-400 normal-case tracking-normal text-sm font-medium">
         © 2026 VerifAI Intelligence. Built for explainable campus placements.
      </div>
    </footer>
  );
}
