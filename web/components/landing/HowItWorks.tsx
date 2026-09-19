"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileUp, Cpu, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: FileUp,
    title: "Collect evidence",
    description:
      "Students submit resumes, marksheets, and coding-profile details.",
    highlight: "Multi-Source Submission",
  },
  {
    step: "02",
    icon: Cpu,
    title: "Verify and analyze",
    description:
      "VeriAI extracts skills, analyzes coding evidence, and uses marksheet data as the academic source of truth.",
    highlight: "Academic Truth & OCR",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Match to opportunities",
    description:
      "TPOs add a job description and receive ranked candidates with transparent match evidence.",
    highlight: "Explainable Ranking",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Guide improvement",
    description:
      "Students receive readiness signals and practical actions to improve.",
    highlight: "Actionable Feedback",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-muted/20 border-y border-border/40 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono font-semibold tracking-widest uppercase text-primary">
            Workflow Overview
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            How VeriAI Works
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground pt-1 text-balance">
            A structured four-stage pipeline from primary document submission to audit-proof candidate shortlists.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-2xl border border-border/80 bg-card p-6 shadow-xs hover:border-primary/40 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-extrabold text-muted-foreground/40 group-hover:text-primary/60 transition-colors">
                      {item.step}
                    </span>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-foreground tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    <CheckCircle2 className="size-3 text-primary" />
                    <span>{item.highlight}</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
