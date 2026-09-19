"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileCheck,
  Lock,
  RotateCw,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GithubIcon } from "./icons";

export function Hero() {
  const [selectedClarification, setSelectedClarification] = useState<string | null>("unplaced");

  return (
    <section id="hero" className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[600px] w-full max-w-7xl">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 size-[300px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Announcement Chip */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <Link
            href="/demo"
            className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md shadow-2xs hover:border-primary/40 hover:text-foreground transition-all"
          >
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              <Sparkles className="size-3" />
              <span>VerifAI 2.0</span>
            </span>
            <span>Multi-Agent Placement Screening & Verification</span>
            <ChevronRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance"
        >
          Automate campus placements with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-blue-500">
            explainable AI
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed text-balance"
        >
          Cross-verify student resumes, GitHub commits, LeetCode handles, and official marksheets.
          Extract strict JD constraints and generate audit-ready candidate shortlists in seconds.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
        >
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full sm:w-auto rounded-full px-8 shadow-md gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            )}
          >
            <Zap className="size-4" />
            <span>Get Started Free</span>
            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="/tpo"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full sm:w-auto rounded-full px-8 border-border hover:bg-muted/60 font-medium"
            )}
          >
            <span>TPO Console</span>
            <ExternalLink className="size-4 ml-1.5 opacity-60" />
          </Link>

          <Link
            href="/demo"
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "w-full sm:w-auto rounded-full px-6 text-muted-foreground hover:text-foreground font-medium"
            )}
          >
            <span>Try Live Demo</span>
          </Link>
        </motion.div>

        {/* Trust Badges Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 text-xs text-muted-foreground"
        >
          100% automated & auditable verification. Zero credit card required.
        </motion.p>

        {/* High-Fidelity Simulated Browser Window Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-14 w-full max-w-5xl"
        >
          <div className="relative rounded-2xl border border-border/80 bg-card shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden ring-1 ring-border/50 text-left">
            {/* Browser Header Bar */}
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-rose-500/80" />
                <div className="size-3 rounded-full bg-amber-500/80" />
                <div className="size-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-background/80 border border-border/60 px-4 py-1 text-xs text-muted-foreground shadow-2xs">
                <Lock className="size-3 text-emerald-600" />
                <span className="font-mono">https://verifai.app/tpo/candidates</span>
              </div>
              <div className="text-muted-foreground opacity-60 hover:opacity-100 transition-opacity">
                <RotateCw className="size-3.5" />
              </div>
            </div>

            {/* Inner Dashboard Preview */}
            <div className="p-5 sm:p-7 space-y-6 bg-gradient-to-b from-background to-muted/20">
              {/* Filter / Prompt Summary Strip */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Search className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">
                      JD: &quot;Full Stack Engineer — React, Node.js, TypeScript, Min 7.5 CGPA, No Backlogs&quot;
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Parsed 128 Candidates · 34 Eligible · Target 5 Shortlisted
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    <Check className="size-3 mr-1" />
                    Verified Profiles
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                    <BrainCircuit className="size-3 mr-1" />
                    AI Scored
                  </Badge>
                </div>
              </div>

              {/* Floating Clarification Capsule Interactive Pill */}
              <div className="rounded-xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/80 via-sky-50/40 to-background p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="size-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-indigo-950">AI Clarification: </span>
                    <span className="text-xs text-indigo-900">Are you looking for unplaced students only or placed as well?</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedClarification("unplaced")}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedClarification === "unplaced"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50"
                    }`}
                  >
                    <Check className="size-3" />
                    <span>Unplaced Only</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedClarification("all")}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedClarification === "all"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50"
                    }`}
                  >
                    <span>Placed as Well</span>
                  </button>
                </div>
              </div>

              {/* Candidate Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Candidate 1 */}
                <div className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-sm transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                        AS
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">Aarav Sharma</div>
                        <div className="text-[11px] text-muted-foreground">CSE · CGPA 8.95</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-extrabold text-emerald-600">98%</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-medium">Match</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-foreground">React</span>
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-foreground">Node.js</span>
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-foreground">TypeScript</span>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="size-3 text-emerald-600" />
                      Marksheet OCR
                    </span>
                    <span className="flex items-center gap-1">
                      <GithubIcon className="size-3" />
                      420 commits
                    </span>
                  </div>
                </div>

                {/* Candidate 2 */}
                <div className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-sm transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs">
                        PP
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">Priya Patel</div>
                        <div className="text-[11px] text-muted-foreground">IT · CGPA 8.42</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-extrabold text-emerald-600">94%</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-medium">Match</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-foreground">React</span>
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-foreground">TypeScript</span>
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-foreground">Next.js</span>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="size-3 text-emerald-600" />
                      Zero Backlogs
                    </span>
                    <span className="flex items-center gap-1">
                      <FileCheck className="size-3" />
                      Top 8% Rating
                    </span>
                  </div>
                </div>

                {/* Candidate 3 */}
                <div className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-sm transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-full bg-sky-50 text-sky-700 font-bold flex items-center justify-center text-xs">
                        RV
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">Rohan Verma</div>
                        <div className="text-[11px] text-muted-foreground">AIML · CGPA 8.15</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-extrabold text-indigo-600">89%</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-medium">Match</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-foreground">Node.js</span>
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-foreground">Python</span>
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-foreground">React</span>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="size-3 text-emerald-600" />
                      Verified Resume
                    </span>
                    <span className="flex items-center gap-1">
                      <GithubIcon className="size-3" />
                      310 commits
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Gradient Fade */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-8 h-24 bg-gradient-to-t from-background to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
