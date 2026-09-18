"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
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
import { Progress } from "@/components/ui/progress";
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
  if (score >= 70) return "text-emerald-700 bg-emerald-50 ring-emerald-200";
  if (score >= 55) return "text-amber-700 bg-amber-50 ring-amber-200";
  return "text-rose-700 bg-rose-50 ring-rose-200";
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
    <main className="min-h-screen bg-[#f4f1ea] text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-slate-900/10 bg-white/80 px-5 py-3 shadow-sm backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <ArrowLeft className="size-4" />
            VeriAI
          </Link>
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
            <Cloud className="size-3.5" />
            Live AWS demo
          </div>
          <Link href="/tpo/login" className={cn(buttonVariants({ size: "sm" }), "rounded-full bg-slate-950 px-5 text-white")}>
            TPO sign in
          </Link>
        </header>

        <section className="grid gap-8 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700">Public decision lab</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl">
              See every shortlist decision.
            </h1>
          </div>
          <div className="max-w-xl lg:justify-self-end">
            <p className="text-lg leading-8 text-slate-600">
              Choose a role and run VeriAI&apos;s production scoring engine against 24 clearly labeled synthetic candidates. No login, hidden prompt, or real student data.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
              <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200">Policy filters</span>
              <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200">Skill evidence</span>
              <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200">Visible gaps</span>
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          {SCENARIOS.map(({ id, label, description, icon: Icon }) => {
            const selected = scenario === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setScenario(id)}
                className={cn(
                  "rounded-3xl border p-5 text-left transition-all",
                  selected
                    ? "border-blue-600 bg-blue-600 text-white shadow-[0_18px_45px_rgba(37,99,235,0.22)]"
                    : "border-slate-900/10 bg-white hover:-translate-y-1 hover:border-slate-300",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={cn("flex size-11 items-center justify-center rounded-2xl", selected ? "bg-white/15" : "bg-slate-100")}>
                    <Icon className="size-5" />
                  </div>
                  {selected ? <CheckCircle2 className="size-5" /> : null}
                </div>
                <h2 className="mt-5 text-lg font-semibold">{label}</h2>
                <p className={cn("mt-1 text-sm", selected ? "text-blue-100" : "text-slate-500")}>{description}</p>
              </button>
            );
          })}
        </section>

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-900/10 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          {loading ? (
            <div className="flex min-h-[420px] items-center justify-center text-slate-500">
              <Loader2 className="mr-2 size-5 animate-spin" />
              Running policy filters and ranking engine...
            </div>
          ) : error ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
              <TriangleAlert className="size-8 text-rose-500" />
              <p className="mt-3 font-semibold text-slate-900">Demo analysis is temporarily unavailable</p>
              <p className="mt-1 text-sm text-slate-500">{error}</p>
              <Button className="mt-5 rounded-full" onClick={() => setScenario((current) => current === "frontend" ? "backend" : "frontend")}>
                Retry another scenario
              </Button>
            </div>
          ) : data ? (
            <>
              <div className="border-b border-slate-100 bg-slate-950 p-6 text-white sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-blue-500 text-white hover:bg-blue-500">{data.jd.company_name ?? "Demo employer"}</Badge>
                      <Badge variant="outline" className="border-white/20 text-slate-200">Synthetic cohort only</Badge>
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold tracking-tight">{data.jd.job_title}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{data.jd.jd_summary}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-5 text-right">
                    <div><p className="text-2xl font-semibold">{data.filters.total_considered}</p><p className="text-xs text-slate-400">Scanned</p></div>
                    <div><p className="text-2xl font-semibold">{data.filters.eligible_count}</p><p className="text-xs text-slate-400">Eligible</p></div>
                    <div><p className="text-2xl font-semibold">{averageScore.toFixed(1)}</p><p className="text-xs text-slate-400">Avg score</p></div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {data.jd.required_skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 ring-1 ring-white/10">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-2">
                {data.candidates.map((candidate, index) => (
                  <article key={candidate.student_id} className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">{index + 1}</div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate font-semibold text-slate-900">{candidate.name}</h3>
                            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-700">Demo</span>
                          </div>
                          <p className="mt-0.5 text-xs text-slate-500">{candidate.branch} · {candidate.roll_no}</p>
                        </div>
                      </div>
                      <div className={cn("rounded-full px-3 py-1.5 text-sm font-bold ring-1", scoreTone(candidate.score_breakdown.total))}>
                        {candidate.score_breakdown.total.toFixed(1)}
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-4 gap-2 text-center text-xs">
                      {[
                        ["Resume", candidate.score_breakdown.resume, 40],
                        ["GitHub", candidate.score_breakdown.github, 20],
                        ["LeetCode", candidate.score_breakdown.leetcode, 20],
                        ["Academic", candidate.score_breakdown.academics, 20],
                      ].map(([label, score, max]) => (
                        <div key={String(label)} className="rounded-xl bg-white p-2 ring-1 ring-slate-200">
                          <p className="font-semibold text-slate-900">{Number(score).toFixed(1)}</p>
                          <p className="mt-0.5 text-[10px] text-slate-500">{label}/{max}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 space-y-3">
                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700"><ShieldCheck className="size-3.5" />Match evidence</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {candidate.matched_skills.length ? candidate.matched_skills.map((skill) => (
                            <span key={skill} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">{skill}</span>
                          )) : <span className="text-xs text-slate-500">No direct skill evidence</span>}
                        </div>
                      </div>
                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700"><TriangleAlert className="size-3.5" />Required gaps</p>
                        <p className="mt-1.5 text-xs leading-5 text-slate-600">{candidate.missing_required_skills.length ? candidate.missing_required_skills.join(", ") : "All required skills covered"}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><BriefcaseBusiness className="size-3.5" />{candidate.coding_persona || "Candidate"}</span>
                      {candidate.resume_url ? (
                        <a href={candidate.resume_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-semibold text-blue-700">Synthetic resume <ArrowUpRight className="size-3.5" /></a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 text-xs text-slate-500">
                <span className="flex items-center gap-2"><Users className="size-4" />Real profiles are excluded by the backend before scoring.</span>
                <span>{data.filters.rejected_min_cgpa} CGPA · {data.filters.rejected_backlog} backlog · {data.filters.rejected_placement} placement exclusions</span>
              </div>
            </>
          ) : null}
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 py-10 text-sm text-slate-500">
          <p>VeriAI public demo · Synthetic data only</p>
          <Link href="/" className="font-semibold text-slate-900">Return to product overview</Link>
        </footer>
      </div>
    </main>
  );
}
