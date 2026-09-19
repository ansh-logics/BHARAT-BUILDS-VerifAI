"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Clock, Users } from "lucide-react";

const PROBLEMS = [
  {
    icon: AlertCircle,
    title: "Resume Inflation & Fake Claims",
    description:
      "Up to 40% of student resumes feature inflated skills, fabricated internships, or borrowed GitHub projects that lead to embarrassing technical interview dropouts.",
    stat: "40% claims unverified",
  },
  {
    icon: Clock,
    title: "Exhausting Manual Verification",
    description:
      "TPO teams lose weeks manually auditing university marksheets, converting SGPA to CGPA, and verifying backlogs across disjointed spreadsheets.",
    stat: "120+ hours wasted per drive",
  },
  {
    icon: Users,
    title: "Rigid Keyword Filtering Misses Talent",
    description:
      "Basic ATS filters reject top coders because of minor formatting discrepancies, while advancing students with buzzwords but zero practical ability.",
    stat: "65% interview failure rate",
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-xs font-mono font-semibold tracking-widest uppercase text-primary">
            The Problem
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Manual placement screening is chaotic, biased & fraud-prone.
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground pt-2 text-balance">
            Universities and recruiters struggle with fragmented candidate claims, unverified academic records, and high technical interview dropouts.
          </p>
        </div>

        {/* 3 Problem Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PROBLEMS.map((problem, idx) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group relative rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive shadow-2xs group-hover:scale-105 transition-transform">
                    <Icon className="size-6" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground tracking-tight">
                    {problem.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    {problem.stat}
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
