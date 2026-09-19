"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Code2, Layers, ShieldCheck } from "lucide-react";

const TRUST_FEATURES = [
  {
    icon: Award,
    title: "Verified academics",
    copy: "Marksheet-derived CGPA takes priority over self-reported values.",
    detail: "Automated OCR extracts cumulative CGPA and active backlog count directly from university marksheets, rejecting manual inflation.",
  },
  {
    icon: Code2,
    title: "Coding evidence",
    copy: "GitHub and LeetCode data add practical technical context.",
    detail: "Inspects public repositories, commit patterns, and algorithmic problem solve distributions rather than taking claimed skills on faith.",
  },
  {
    icon: Layers,
    title: "Explainable matching",
    copy: "Every shortlist shows matched skills, missing skills, and eligibility evidence.",
    detail: "TPOs and recruiters get transparent reason codes for why each candidate is placed in rank order—no black-box scoring.",
  },
  {
    icon: ShieldCheck,
    title: "Private document handling",
    copy: "Student documents are stored privately with controlled access.",
    detail: "Academic records and resumes reside in private AWS S3 storage, accessible only via time-bounded HMAC signed tokens.",
  },
];

export function TrustSection() {
  return (
    <section id="trust" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono font-semibold tracking-widest uppercase text-primary">
            Verification Integrity
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Not just resume keywords.
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground pt-1 text-balance">
            VeriAI replaces speculative resume scans with multi-source proof across academic transcripts, live codebases, and deterministic criteria.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {TRUST_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="size-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-foreground tracking-tight">
                      {feat.title}
                    </h4>
                    <p className="text-sm font-medium text-foreground/90">
                      {feat.copy}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                      {feat.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
