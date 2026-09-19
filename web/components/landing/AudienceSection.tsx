"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Users2, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export function AudienceSection() {
  return (
    <section id="audience" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-14 sm:mb-16">
          <h2 className="text-xs font-mono font-semibold tracking-widest uppercase text-primary">
            Designed for Campus Ecosystems
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Two perspectives. One trusted evidence pipeline.
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground pt-1 text-balance">
            VeriAI connects student readiness with placement office decision-making through transparent, auditable profiles.
          </p>
        </div>

        {/* Dual Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: For Students */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative rounded-3xl border border-border/80 bg-card p-8 sm:p-10 shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <GraduationCap className="size-6" />
                </div>
                <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                  Self-Serve Portal
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-2xl font-bold text-foreground tracking-tight">
                  For Students
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Understand your placement readiness, strengthen your evidence, and see practical next steps before the next opportunity.
                </p>
              </div>

              <ul className="space-y-3 pt-2 text-sm text-foreground/90">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>Consolidate resumes, marksheets, GitHub, and LeetCode into one auditable profile.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>Receive deterministic skill extraction and practical guidance on missing proficiencies.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>Verify academic credentials once with encrypted, private document storage.</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-8 border-t border-border/60">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                <span>View Student Workspace</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: For Placement Teams */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative rounded-3xl border border-border/80 bg-card p-8 sm:p-10 shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Users2 className="size-6" />
                </div>
                <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                  TPO Console
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-2xl font-bold text-foreground tracking-tight">
                  For Placement Teams
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Verify academic eligibility, review coding evidence, and build explainable shortlists from a job description.
                </p>
              </div>

              <ul className="space-y-3 pt-2 text-sm text-foreground/90">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>Enforce marksheet-verified CGPA and backlog rules over unverified self-claims.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>Parse job descriptions instantly and rank candidates with clear matched vs. missing criteria.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>Export audit-ready shortlists in CSV format for visiting recruiting teams.</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-8 border-t border-border/60">
              <Link
                href="/tpo"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                <span>Access TPO Console</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
