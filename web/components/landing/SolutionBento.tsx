"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  CheckCircle2,
  Database,
  Download,
  FileCheck2,
  GitBranch,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GithubIcon } from "./icons";

export function SolutionBento() {
  return (
    <section id="solution" className="py-20 md:py-28 bg-muted/20 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-xs font-mono font-semibold tracking-widest uppercase text-primary">
            The Solution
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Empower Your Placement Cell with VerifAI Workflows
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground pt-2 text-balance">
            Generic screening tools won&apos;t suffice. VerifAI provides auditable multi-source profile verification, intelligent JD parsing, and zero-fraud shortlists.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Card 1: Multi-Agent Audit (Span 2 columns on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 group relative rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BrainCircuit className="size-4" />
                </span>
                <Badge variant="outline" className="text-[10px] uppercase font-semibold text-primary">
                  Multi-Agent Core
                </Badge>
              </div>
              <h4 className="text-2xl font-bold text-foreground tracking-tight">
                Multi-Source Profile Audit & Proof Verification
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                VerifAI cross-validates student claims against three independent proofs: official university marksheet OCR for CGPA/backlogs, GitHub activity for commit consistency, and LeetCode ratings for genuine algorithmic problem solving.
              </p>
            </div>

            {/* Visual Graphic inside Card */}
            <div className="mt-8 pt-6 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <FileCheck2 className="size-3.5 text-emerald-600" />
                  <span>Marksheet</span>
                </div>
                <div className="text-[11px] text-muted-foreground">OCR verified CGPA</div>
                <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified 8.95
                </span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <GithubIcon className="size-3.5 text-primary" />
                  <span>GitHub</span>
                </div>
                <div className="text-[11px] text-muted-foreground">420+ commits audited</div>
                <span className="inline-block text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Original Code
                </span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Sparkles className="size-3.5 text-amber-600" />
                  <span>LeetCode</span>
                </div>
                <div className="text-[11px] text-muted-foreground">480 problems solved</div>
                <span className="inline-block text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Top 5% Rating
                </span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <span>Backlogs</span>
                </div>
                <div className="text-[11px] text-muted-foreground">Semester transcript</div>
                <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Zero Backlogs
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bento Card 2: Natural Language JD Matching */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                  <Search className="size-4" />
                </span>
                <Badge variant="outline" className="text-[10px] uppercase font-semibold text-indigo-600">
                  Instant Parser
                </Badge>
              </div>
              <h4 className="text-xl font-bold text-foreground tracking-tight">
                Natural Language JD Engine
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Paste any unstructured job description or upload PDF files. VerifAI extracts role requirements, required frameworks, minimum CGPA, and branch criteria deterministically.
              </p>
            </div>

            {/* Prompt Preview Pill */}
            <div className="mt-6 p-3 rounded-xl bg-muted/40 border border-border/60 text-left space-y-2">
              <div className="text-[11px] font-mono text-muted-foreground">
                &gt; &quot;Need 5 React devs, CGPA &gt;= 7.5, unplaced only&quot;
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] font-medium bg-background px-2 py-0.5 rounded-md border border-border">
                  React.js
                </span>
                <span className="text-[10px] font-medium bg-background px-2 py-0.5 rounded-md border border-border">
                  CGPA ≥ 7.5
                </span>
                <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                  Unplaced Only
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bento Card 3: Secure S3 Document Vault */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="group relative rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Lock className="size-4" />
                </span>
                <Badge variant="outline" className="text-[10px] uppercase font-semibold text-emerald-600">
                  AWS Architecture
                </Badge>
              </div>
              <h4 className="text-xl font-bold text-foreground tracking-tight">
                Encrypted S3 Document Vault
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Marksheet PDFs and resumes are securely stored in private AWS S3 buckets with AES-256 encryption. Documents can only be retrieved using HMAC SHA-256 time-limited signed tokens.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="size-4 text-emerald-600" />
                AES-256 Server-Side
              </span>
              <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-500">
                HMAC Signed
              </span>
            </div>
          </motion.div>

          {/* Bento Card 4: Placement Groups & CSV (Span 2 cols on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2 group relative rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                  <Download className="size-4" />
                </span>
                <Badge variant="outline" className="text-[10px] uppercase font-semibold text-blue-600">
                  Drive Management
                </Badge>
              </div>
              <h4 className="text-2xl font-bold text-foreground tracking-tight">
                One-Click Placement Cohorts & Instant CSV Export
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Group shortlisted candidates into structured multi-round interview pipelines with customized topic evaluation criteria. Export full audit logs and shortlisted rosters directly to CSV for recruiters in a single click.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  Multi-Round Interview Tracking
                </span>
                <span className="flex items-center gap-1">
                  <Database className="size-3.5 text-primary" />
                  PostgreSQL Persistence
                </span>
              </div>
              <div className="font-medium text-foreground bg-muted px-3 py-1.5 rounded-lg border border-border">
                Export Shortlist (CSV)
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
