"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, FileUp, Sparkles } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: FileUp,
    title: "Upload Records & Handles",
    description:
      "Students upload their academic marksheets and resume PDFs, and connect their public GitHub and LeetCode usernames through a self-serve portal.",
    highlight: "Encrypted S3 Document Storage",
  },
  {
    step: "02",
    icon: Cpu,
    title: "AI Multi-Agent Audit",
    description:
      "VerifAI extracts CGPA & active backlogs via OCR, inspects GitHub repositories for genuine code originality, and compiles a fraud-proof candidate profile.",
    highlight: "Zero Hallucination Scrutiny",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Match JDs & Export Roster",
    description:
      "TPOs paste job descriptions or upload recruiter specs. VerifAI parses criteria deterministically and generates an explainable shortlist ready for CSV export.",
    highlight: "Instant Verified Shortlists",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-xs font-mono font-semibold tracking-widest uppercase text-primary">
            How It Works
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Just 3 steps to audit-proof placements
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground pt-2 text-balance">
            Replace manual spreadsheets and speculative keyword scans with automated verification and explainable recruiter rankings.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group relative rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-extrabold text-muted-foreground/40 group-hover:text-primary/60 transition-colors">
                      {item.step}
                    </span>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-foreground tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>{item.highlight}</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
