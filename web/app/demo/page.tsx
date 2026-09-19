"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  Loader2,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Users,
} from "lucide-react";

import { getDemoMatch, getApiErrorMessage } from "@/lib/api";
import type { JDMatchResponseBody } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { PaletteSwitcher } from "@/components/theme/palette-switcher";
import { cn } from "@/lib/utils";

type Scenario = "frontend" | "backend" | "data";

const SCENARIOS: Array<{
  id: Scenario;
  label: string;
  description: string;
  icon: typeof Code2;
}> = [
  { id: "frontend", label: "Frontend Intern", description: "React interfaces and product UI", icon: Code2 },
  { id: "backend", label: "Backend Engineer", description: "APIs, databases, and cloud systems", icon: Database },
  { id: "data", label: "Data Analyst", description: "SQL, analytics, and clear insights", icon: Sparkles },
];

function scoreTone(score: number) {
  if (score >= 70) return "text-emerald-700 bg-emerald-500/10 border-emerald-500/20";
  if (score >= 55) return "text-amber-700 bg-amber-500/10 border-amber-500/20";
  return "text-rose-700 bg-rose-500/10 border-rose-500/20";
}

export default function PublicDemoPage() {
  const [scenario, setScenario] = useState<Scenario>("frontend");
  const [data, setData] = useState<JDMatchResponseBody | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getDemoMatch(scenario)
      .then((response) => {
        if (active) setData(response);
      })
      .catch((requestError) => {
        if (active) setError(getApiErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [scenario]);

  const averageScore = useMemo(() => {
    if (!data?.candidates.length) return 0;
    return data.candidates.reduce((total, candidate) => total + candidate.score_breakdown.total, 0) / data.candidates.length;
  }, [data]);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8 space-y-8">
        {/* Navigation Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/80 px-5 py-3 shadow-2xs backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </Link>
            <div className="h-4 w-px bg-border" />
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <BrainCircuit className="size-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-foreground">
                Verif<span className="text-primary font-black">AI</span>
              </span>
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-500/20">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider">Live AWS Decision Lab</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/tpo/login"
              className={cn(
                buttonVariants({ size: "sm" }),
                "rounded-full px-4 shadow-2xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
              )}
            >
              TPO Sign In
            </Link>
            <PaletteSwitcher variant="dropdown" />
          </div>
        </header>

        {/* Hero Section */}
        <section className="grid gap-8 py-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3" />
              <span>Public Decision Lab</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05]">
              See every shortlist decision.
            </h1>
          </div>
          <div className="space-y-4 max-w-xl lg:justify-self-end">
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
              Choose a role and run VeriAI&apos;s production scoring engine against 24 clearly labeled synthetic candidates. No login, hidden prompt, or real student data.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
              <span className="rounded-full bg-muted/60 border border-border/80 px-3 py-1 text-foreground/80">Policy filters</span>
              <span className="rounded-full bg-muted/60 border border-border/80 px-3 py-1 text-foreground/80">Skill evidence</span>
              <span className="rounded-full bg-muted/60 border border-border/80 px-3 py-1 text-foreground/80">Visible gaps</span>
            </div>
          </div>
        </section>

        {/* Scenario Selector Cards */}
        <section className="grid gap-4 md:grid-cols-3">
          {SCENARIOS.map(({ id, label, description, icon: Icon }) => {
            const selected = scenario === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setScenario(id)}
                className={cn(
                  "rounded-2xl border p-5 text-left transition-all cursor-pointer relative",
                  selected
                    ? "border-primary bg-primary text-primary-foreground shadow-md ring-1 ring-primary"
                    : "border-border/80 bg-card text-card-foreground hover:border-primary/40 hover:shadow-2xs"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={cn("flex size-10 items-center justify-center rounded-xl", selected ? "bg-primary-foreground/15 text-primary-foreground" : "bg-primary/10 text-primary")}>
                    <Icon className="size-5" />
                  </div>
                  {selected && (
                    <div className="flex size-6 items-center justify-center rounded-full bg-primary-foreground text-primary shadow-xs">
                      <Check className="size-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <h2 className="mt-4 text-lg font-bold tracking-tight">{label}</h2>
                <p className={cn("mt-1 text-xs sm:text-sm leading-relaxed", selected ? "text-primary-foreground/80" : "text-muted-foreground")}>{description}</p>
              </button>
            );
          })}
        </section>

        {/* Results / Candidate Ranking Container */}
        <section className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm">
          {loading ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-muted-foreground gap-3">
              <Loader2 className="size-6 animate-spin text-primary" />
              <span className="text-sm font-medium">Running policy filters and ranking engine...</span>
            </div>
          ) : error ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
              <TriangleAlert className="size-8 text-rose-500" />
              <p className="mt-3 font-semibold text-foreground">Demo analysis is temporarily unavailable</p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              <Button className="mt-5 rounded-full" onClick={() => setScenario((current) => current === "frontend" ? "backend" : "frontend")}>
                Retry another scenario
              </Button>
            </div>
          ) : data ? (
            <>
              {/* Job Summary Banner */}
              <div className="border-b border-border/60 bg-muted/40 p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-semibold text-xs">
                        {data.jd.company_name ?? "Demo Employer"}
                      </Badge>
                      <Badge variant="outline" className="border-border/80 text-muted-foreground text-xs">
                        Synthetic Cohort Only
                      </Badge>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">{data.jd.job_title}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">{data.jd.jd_summary}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-6 text-right self-center sm:self-auto">
                    <div>
                      <p className="text-2xl font-extrabold text-foreground font-mono">{data.filters.total_considered}</p>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Scanned</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-emerald-600 font-mono">{data.filters.eligible_count}</p>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Eligible</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-primary font-mono">{averageScore.toFixed(1)}</p>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Avg Score</p>
                    </div>
                  </div>
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                  <span className="text-xs font-semibold text-muted-foreground mr-1">Required Skills:</span>
                  {data.jd.required_skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-card border border-border/80 px-2.5 py-0.5 text-xs font-mono font-medium text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Candidate Cards Grid */}
              <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-2">
                {data.candidates.map((candidate, index) => (
                  <article
                    key={candidate.student_id}
                    className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs hover:border-primary/40 transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-mono text-xs font-bold">
                          #{index + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate font-bold text-foreground text-sm sm:text-base">{candidate.name}</h3>
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground border border-border/60">
                              Demo
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground font-mono">
                            {candidate.branch} · {candidate.roll_no}
                          </p>
                        </div>
                      </div>
                      <div className={cn("rounded-full px-3 py-1 text-xs font-mono font-bold border", scoreTone(candidate.score_breakdown.total))}>
                        {candidate.score_breakdown.total.toFixed(1)}%
                      </div>
                    </div>

                    {/* Breakdown Scores */}
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {[
                        ["Resume", candidate.score_breakdown.resume, 40],
                        ["GitHub", candidate.score_breakdown.github, 20],
                        ["LeetCode", candidate.score_breakdown.leetcode, 20],
                        ["Academics", candidate.score_breakdown.academics, 20],
                      ].map(([label, score, max]) => (
                        <div key={String(label)} className="rounded-xl bg-muted/40 border border-border/60 p-2">
                          <p className="font-bold text-foreground font-mono">{Number(score).toFixed(1)}</p>
                          <p className="text-[10px] text-muted-foreground">{label}/{max}</p>
                        </div>
                      ))}
                    </div>

                    {/* Match Evidence vs Gaps */}
                    <div className="space-y-2.5 pt-1">
                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="size-3.5" />
                          <span>Matched Evidence</span>
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {candidate.matched_skills.length ? (
                            candidate.matched_skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2 py-0.5 text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">No direct skill evidence</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          <TriangleAlert className="size-3.5" />
                          <span>Missing Criteria</span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          {candidate.missing_required_skills.length
                            ? candidate.missing_required_skills.join(", ")
                            : "All required criteria met"}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <BriefcaseBusiness className="size-3.5 text-primary" />
                        <span>{candidate.coding_persona || "Candidate"}</span>
                      </span>
                      {candidate.resume_url ? (
                        <a
                          href={candidate.resume_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <span>Synthetic Resume</span>
                          <ArrowUpRight className="size-3" />
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>

              {/* Bottom Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-6 py-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  <span>Real student records are protected and excluded before public scoring.</span>
                </span>
                <span className="font-mono text-[11px]">
                  {data.filters.rejected_min_cgpa} CGPA · {data.filters.rejected_backlog} backlog · {data.filters.rejected_placement} placement exclusions
                </span>
              </div>
            </>
          ) : null}
        </section>

        {/* Demo Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-4 py-8 border-t border-border/40 text-xs text-muted-foreground">
          <p>VerifAI Public Decision Lab · Synthetic Dataset</p>
          <Link href="/" className="font-semibold text-foreground hover:text-primary transition-colors">
            Return to Product Overview
          </Link>
        </footer>
      </div>
    </main>
  );
}
