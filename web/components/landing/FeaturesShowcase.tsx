"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  CheckCircle2,
  Code2,
  FileSpreadsheet,
  FileText,
  Search,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TABS = [
  {
    id: "search",
    label: "AI Candidate Search",
    icon: Search,
    headline: "Deterministic natural language parsing with explainable scoring",
    description:
      "Recruiters specify requirements in conversational plain English. VerifAI maps them into strict and preferred filters, cross-evaluates candidate profiles, and computes verified ranking percentiles.",
  },
  {
    id: "verification",
    label: "Multi-Agent Verification",
    icon: BrainCircuit,
    headline: "Zero-fraud academic transcript OCR and code originality audit",
    description:
      "Automated agents inspect marksheet PDFs for CGPA and backlog validation, scrape public GitHub activity to check commit consistency, and evaluate LeetCode ranking data.",
  },
  {
    id: "cohorts",
    label: "Placement Groups & Export",
    icon: FileSpreadsheet,
    headline: "Structured interview rounds and instant one-click CSV export",
    description:
      "Organize student shortlists into dedicated placement cohorts with custom round criteria (Coding, Tech Interview, HR). Export complete candidate dossiers into Excel-ready CSV sheets.",
  },
];

export function FeaturesShowcase() {
  const [activeTab, setActiveTab] = useState("search");

  return (
    <section id="features" className="py-20 md:py-28 bg-muted/20 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-xs font-mono font-semibold tracking-widest uppercase text-primary">
            Features
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Interactive Capabilities Built for Campus Drives
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground pt-2 text-balance">
            Explore the core engine powering automated shortlists, fraud-proof candidate profiles, and seamless recruiter handoffs.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-background border border-border shadow-xs overflow-x-auto max-w-full">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tab Preview Display */}
        <div className="mt-10">
          <AnimatePresence mode="wait">
            {activeTab === "search" && (
              <motion.div
                key="tab-search"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-5 space-y-4">
                  <Badge variant="outline" className="text-xs font-semibold text-primary">
                    Explainable Candidate Matching
                  </Badge>
                  <h4 className="text-2xl font-bold text-foreground tracking-tight">
                    Natural Language JD Parser
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Paste raw JD text from visiting recruiters. VerifAI extracts role titles, experience bounds, CGPA limits, backlog rules, and mandatory skill stacks.
                  </p>
                  <ul className="space-y-2 pt-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      Deterministic constraint validation (no LLM hallucinations)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      Dynamic clarification questions for ambiguous criteria
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      Weighted scoring across Resume (40%), GitHub (20%), LeetCode (20%), Academics (20%)
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-7 rounded-xl border border-border/70 bg-muted/30 p-5 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                      <Search className="size-4 text-primary" />
                      <span>Live Filter Output</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      Top Ranked
                    </Badge>
                  </div>

                  <div className="p-3 rounded-lg bg-card border border-border/60 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-foreground">Aarav Sharma · 98% Match</div>
                      <div className="text-xs text-muted-foreground">CGPA: 8.95 · CSE · React, Node, TS</div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Shortlisted</Badge>
                  </div>

                  <div className="p-3 rounded-lg bg-card border border-border/60 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-foreground">Priya Patel · 94% Match</div>
                      <div className="text-xs text-muted-foreground">CGPA: 8.42 · IT · React, Next.js, Docker</div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Shortlisted</Badge>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "verification" && (
              <motion.div
                key="tab-verification"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-5 space-y-4">
                  <Badge variant="outline" className="text-xs font-semibold text-emerald-600">
                    Tamper-Proof Audit
                  </Badge>
                  <h4 className="text-2xl font-bold text-foreground tracking-tight">
                    Multi-Agent Academic & Code Scrutiny
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Stop fraudulent resumes before they damage your institution&apos;s recruiter relationships. VerifAI matches marksheet OCR with student self-reported numbers and scans repository commit logs.
                  </p>
                  <ul className="space-y-2 pt-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      Marksheet OCR catches altered grades & undisclosed backlogs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      GitHub analyzer detects fork copying vs genuine development
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      Signed S3 access ensures document confidentiality
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-7 rounded-xl border border-border/70 bg-muted/30 p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-card border border-border/60 text-left space-y-2">
                      <div className="text-xs text-muted-foreground">Academic CGPA</div>
                      <div className="text-2xl font-extrabold text-foreground">8.95</div>
                      <div className="text-[11px] text-emerald-600 font-medium">✓ Verified from Marksheet PDF</div>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border/60 text-left space-y-2">
                      <div className="text-xs text-muted-foreground">Active Backlogs</div>
                      <div className="text-2xl font-extrabold text-emerald-600">0</div>
                      <div className="text-[11px] text-emerald-600 font-medium">✓ Official Transcript Clean</div>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border/60 text-left space-y-2">
                      <div className="text-xs text-muted-foreground">GitHub Code Originality</div>
                      <div className="text-2xl font-extrabold text-primary">94%</div>
                      <div className="text-[11px] text-primary font-medium">✓ 420 genuine commits</div>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border/60 text-left space-y-2">
                      <div className="text-xs text-muted-foreground">LeetCode Percentile</div>
                      <div className="text-2xl font-extrabold text-amber-600">Top 5%</div>
                      <div className="text-[11px] text-amber-600 font-medium">✓ 480 verified solutions</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "cohorts" && (
              <motion.div
                key="tab-cohorts"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-5 space-y-4">
                  <Badge variant="outline" className="text-xs font-semibold text-blue-600">
                    Drive Orchestration
                  </Badge>
                  <h4 className="text-2xl font-bold text-foreground tracking-tight">
                    Placement Groups & CSV Delivery
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Convert AI shortlists into actionable interview cohorts. Set up interview rounds, track applicant progression, and download formatted spreadsheets for company representatives.
                  </p>
                  <ul className="space-y-2 pt-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      1-click group creation from search results
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      Instant CSV export with candidate roll numbers & contacts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      Direct placement status updates (placed vs available)
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-7 rounded-xl border border-border/70 bg-muted/30 p-5 space-y-3">
                  <div className="p-4 rounded-xl bg-card border border-border/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-foreground">Google SDE Internship 2026</div>
                      <Badge variant="outline" className="text-xs text-blue-600">3 Rounds</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      34 candidates enrolled · Topics: React, Algorithms, System Design
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                      <span className="text-muted-foreground">Status: Active Screening</span>
                      <span className="font-semibold text-primary">Download Shortlist.csv</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
