"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  User,
  ExternalLink,
  X,
  FileText,
  Building,
  GraduationCap,
  Award,
} from "lucide-react";

import { getApiErrorMessage, getTpoOverview, listTpoGroups } from "@/lib/api";
import { clearTpoAuth, getStoredTpoToken } from "@/lib/auth-storage";
import type { TpoGroup, TpoOverviewResponse } from "@/lib/types";

type CandidateItem = {
  id: string;
  name: string;
  initials: string;
  rollNo: string;
  gender: string;
  branch: string;
  batch: string;
  cgpa: number;
  hasBacklog: boolean;
  matchScore: number;
  matchLabel: string;
  skills: string[];
  avatarColor: string;
  avatarBg: string;
  avatarBorder: string;
  email: string;
  verified: boolean;
};

const INITIAL_CANDIDATES: CandidateItem[] = [
  {
    id: "c-1",
    name: "Aarav Mehta",
    initials: "AM",
    rollNo: "22CSE104",
    gender: "Male",
    branch: "Computer Science",
    batch: "Class of 2026",
    cgpa: 9.42,
    hasBacklog: false,
    matchScore: 96,
    matchLabel: "96% Top Fit",
    skills: ["React", "Node.js", "AWS", "TypeScript"],
    avatarColor: "text-indigo-700",
    avatarBg: "bg-indigo-50",
    avatarBorder: "border-indigo-100",
    email: "aarav.mehta@univ.edu",
    verified: true,
  },
  {
    id: "c-2",
    name: "Pooja Sharma",
    initials: "PS",
    rollNo: "22IT048",
    gender: "Female",
    branch: "Information Tech",
    batch: "Class of 2026",
    cgpa: 9.18,
    hasBacklog: false,
    matchScore: 92,
    matchLabel: "92% Fit",
    skills: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind"],
    avatarColor: "text-rose-700",
    avatarBg: "bg-rose-50",
    avatarBorder: "border-rose-100",
    email: "pooja.sharma@univ.edu",
    verified: true,
  },
  {
    id: "c-3",
    name: "Rohan Nair",
    initials: "RN",
    rollNo: "22CSE089",
    gender: "Male",
    branch: "Computer Science",
    batch: "Class of 2026",
    cgpa: 8.85,
    hasBacklog: false,
    matchScore: 89,
    matchLabel: "89% Fit",
    skills: ["Python", "FastAPI", "Docker", "PyTorch"],
    avatarColor: "text-teal-700",
    avatarBg: "bg-teal-50",
    avatarBorder: "border-teal-100",
    email: "rohan.nair@univ.edu",
    verified: true,
  },
  {
    id: "c-4",
    name: "Sanya Kapoor",
    initials: "SK",
    rollNo: "22ECE031",
    gender: "Female",
    branch: "Electronics & Comm",
    batch: "Class of 2026",
    cgpa: 8.65,
    hasBacklog: false,
    matchScore: 84,
    matchLabel: "84% Fit",
    skills: ["C++", "Rust", "RTOS", "Embedded C"],
    avatarColor: "text-amber-800",
    avatarBg: "bg-amber-50",
    avatarBorder: "border-amber-100",
    email: "sanya.kapoor@univ.edu",
    verified: true,
  },
  {
    id: "c-5",
    name: "Dhruv Verma",
    initials: "DV",
    rollNo: "22CSE112",
    gender: "Male",
    branch: "Computer Science",
    batch: "Class of 2026",
    cgpa: 8.51,
    hasBacklog: false,
    matchScore: 82,
    matchLabel: "82% Fit",
    skills: ["Go", "Kubernetes", "gRPC", "Redis"],
    avatarColor: "text-sky-800",
    avatarBg: "bg-sky-50",
    avatarBorder: "border-sky-100",
    email: "dhruv.verma@univ.edu",
    verified: true,
  },
  {
    id: "c-6",
    name: "Ananya Iyer",
    initials: "AI",
    rollNo: "22AIML014",
    gender: "Female",
    branch: "AI & Data Science",
    batch: "Class of 2026",
    cgpa: 8.95,
    hasBacklog: false,
    matchScore: 91,
    matchLabel: "91% Fit",
    skills: ["Python", "TensorFlow", "Scikit-Learn", "SQL"],
    avatarColor: "text-emerald-800",
    avatarBg: "bg-emerald-50",
    avatarBorder: "border-emerald-100",
    email: "ananya.iyer@univ.edu",
    verified: true,
  },
];

export default function TpoDashboardRootPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<TpoOverviewResponse | null>(null);
  const [groups, setGroups] = useState<TpoGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and selection states
  const [selectedFilter, setSelectedFilter] = useState<"all" | "cgpa8" | "zeroBacklogs">("all");
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(
    new Set(["c-1", "c-2", "c-3"])
  );
  const [selectedCohort, setSelectedCohort] = useState("Class of 2026");
  const [searchQuery, setSearchQuery] = useState("");
  const [jdPrompt, setJdPrompt] = useState(
    "Target: SDE-1 • Min CGPA 8.0 • Skills: React, Node, AWS • Backlogs: 0"
  );
  const [activeProfileModal, setActiveProfileModal] = useState<CandidateItem | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([getTpoOverview(), listTpoGroups()])
      .then(([overviewData, groupsData]) => {
        if (!mounted) return;
        setOverview(overviewData);
        setGroups(groupsData);
      })
      .catch((err) => {
        if (!mounted) return;
        if (axios.isAxiosError(err) && [401, 403].includes(err.response?.status ?? 0)) {
          clearTpoAuth();
          router.replace("/tpo/login");
          return;
        }
        setError(getApiErrorMessage(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  // Filtered candidate list based on active pill
  const filteredCandidates = useMemo(() => {
    return INITIAL_CANDIDATES.filter((c) => {
      if (selectedFilter === "cgpa8") return c.cgpa >= 8.8;
      if (selectedFilter === "zeroBacklogs") return !c.hasBacklog;
      return true;
    });
  }, [selectedFilter]);

  function toggleCandidate(id: string) {
    setSelectedCandidates((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllCandidates() {
    if (selectedCandidates.size === filteredCandidates.length) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(filteredCandidates.map((c) => c.id)));
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full h-full pb-16 space-y-6 bg-[#F4F5F7] text-[#11142D]">
      {/* Top Navigation Header (Matching Stitch Insp) */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Page Title */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1A1D1F] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="size-5 text-blue-400" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#11142D]">VerifAI</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  TPO AI
                </span>
              </div>
            </div>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-[#11142D] tracking-tight">
            AI Screening &amp; Match
          </h1>
        </div>

        {/* Search, Action Buttons & User Profile (Stitch Pill Treatment) */}
        <div className="flex items-center gap-2.5 flex-1 justify-end w-full md:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  router.push(`/tpo/ai-search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              placeholder="Search candidates, skills, cohorts..."
              className="w-full bg-white text-xs lg:text-sm text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2 rounded-full border border-slate-200/80 shadow-xs focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
            />
          </div>

          <button
            onClick={() => router.push("/tpo/ai-search")}
            className="bg-[#1A1D1F] hover:bg-black text-white text-xs lg:text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] shrink-0 cursor-pointer"
          >
            <Zap className="size-3.5 text-amber-400" />
            <span>Screen JD</span>
          </button>

          <div
            title="Placement Cycle Active"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-emerald-700 text-xs font-semibold shadow-xs"
          >
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active</span>
          </div>

          <div className="size-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border-2 border-white shadow-xs flex items-center justify-center font-bold text-white text-xs shrink-0">
            TP
          </div>
        </div>
      </header>

      {/* Main Bento Workspace */}
      <div className="space-y-6">
        {/* Top Bento Row: Overview (7 Cols) + Top Matched Profiles (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Bento Card 1: Overview & Verified Numbers */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-7 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.04)] border border-white flex flex-col justify-between gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#11142D] tracking-tight">Overview</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Fall 2025–26 Placement Screening Cycle
                </p>
              </div>
              <select
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                aria-label="Filter by placement cohort"
                className="text-xs font-semibold text-slate-700 bg-[#F8F9FA] hover:bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 transition-colors cursor-pointer"
              >
                <option value="Class of 2026">Class of 2026</option>
                <option value="Class of 2025">Class of 2025</option>
                <option value="All Batches">All Batches</option>
              </select>
            </div>

            {/* Sub-Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tile 1: Registered Students */}
              <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-3">
                  <div className="flex items-center gap-1.5">
                    <User className="size-4 text-slate-400" />
                    <span>Registered Students</span>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold text-[11px]">
                    <span>↑ 12.4%</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold tracking-tight text-[#11142D]">
                    {overview?.total_students ?? 1420}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">verified profiles</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <ShieldCheck className="size-3 text-emerald-600" />
                  <span>100% authenticated by university registrar</span>
                </p>
              </div>

              {/* Tile 2: Eligible Active Pool */}
              <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-3">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span>Eligible Active Pool</span>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold text-[11px]">
                    <span>↑ 36.8%</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold tracking-tight text-[#11142D]">
                    {overview?.unplaced_eligible_students ?? 845}
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    0 Backlogs
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="size-3 text-blue-600" />
                  <span>59.5% ready for immediate recruiter dispatch</span>
                </p>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Top Matched Profiles */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.04)] border border-white flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#11142D] tracking-tight">
                Top Matched Profiles
              </h3>
              <span className="text-xs text-slate-400 font-medium">Ranked</span>
            </div>

            <div className="space-y-3.5">
              {INITIAL_CANDIDATES.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveProfileModal(c)}
                  className="flex items-center justify-between gap-3 group cursor-pointer p-1.5 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl ${c.avatarBg} ${c.avatarColor} border ${c.avatarBorder} flex items-center justify-center font-extrabold text-xs shrink-0`}
                    >
                      {c.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#11142D] group-hover:text-blue-600 transition-colors">
                        {c.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">{c.branch}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-[#11142D]">{c.matchScore}% Match</p>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/tpo/ai-search")}
              className="w-full py-2.5 rounded-full bg-[#F8F9FA] hover:bg-slate-100 text-[#11142D] font-bold text-xs transition-colors text-center border border-slate-200/80 cursor-pointer"
            >
              View All 64 Matched Profiles
            </button>
          </div>
        </div>

        {/* Bento Card 3: AI Job Description Analyzer (Interactive Search Bar) */}
        <div className="w-full bg-white rounded-3xl p-6 md:p-7 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.04)] border border-white flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center text-sm font-bold shadow-xs">
                ✦
              </span>
              <div>
                <h3 className="text-base font-bold text-[#11142D] tracking-tight">
                  AI Job Description Analyzer
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Parse employer criteria, auto-match qualifying cohorts &amp; filter zero-backlog candidates
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                Live Parser v2.4
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <div className="relative flex-1 w-full">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
              <input
                type="text"
                value={jdPrompt}
                onChange={(e) => setJdPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    router.push(`/tpo/ai-search?q=${encodeURIComponent(jdPrompt)}`);
                  }
                }}
                className="w-full bg-[#F8F9FA] rounded-2xl border border-slate-200 text-xs sm:text-sm pl-11 pr-4 py-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all font-medium"
              />
            </div>
            <button
              onClick={() => router.push(`/tpo/ai-search?q=${encodeURIComponent(jdPrompt)}`)}
              className="w-full sm:w-auto bg-[#1A1D1F] hover:bg-black text-white text-xs sm:text-sm font-semibold px-8 py-3.5 rounded-2xl shrink-0 flex items-center justify-center gap-2.5 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Zap className="size-4 text-emerald-400" />
              <span>Match &amp; Rank</span>
            </button>
          </div>
        </div>

        {/* Bento Card 4: Shortlisted Match Results Table (Centerpiece) */}
        <div className="w-full bg-white rounded-3xl p-6 md:p-7 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.04)] border border-white flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-[#11142D] tracking-tight">
                Shortlisted Match Results
              </h2>
              <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-full border border-emerald-100">
                {filteredCandidates.length} Qualified
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all cursor-pointer ${
                  selectedFilter === "all"
                    ? "bg-black text-white shadow-xs"
                    : "bg-[#F8F9FA] hover:bg-slate-100 text-slate-700"
                }`}
              >
                SDE Tier-1
              </button>
              <button
                onClick={() => setSelectedFilter("cgpa8")}
                className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all cursor-pointer ${
                  selectedFilter === "cgpa8"
                    ? "bg-black text-white shadow-xs"
                    : "bg-[#F8F9FA] hover:bg-slate-100 text-slate-700"
                }`}
              >
                Min CGPA 8.8+
              </button>
              <button
                onClick={() => setSelectedFilter("zeroBacklogs")}
                className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all cursor-pointer ${
                  selectedFilter === "zeroBacklogs"
                    ? "bg-black text-white shadow-xs"
                    : "bg-[#F8F9FA] hover:bg-slate-100 text-slate-700"
                }`}
              >
                0 Backlogs
              </button>
            </div>
          </div>

          {/* Interactive Candidate Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3 pl-2 pr-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.size === filteredCandidates.length && filteredCandidates.length > 0}
                      onChange={toggleAllCandidates}
                      aria-label="Select all candidates"
                      className="rounded border-slate-300 text-black focus:ring-black/20 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3">Candidate</th>
                  <th className="py-3 px-3">Branch &amp; Batch</th>
                  <th className="py-3 px-3">CGPA</th>
                  <th className="py-3 px-3">AI Match Score</th>
                  <th className="py-3 px-3">Top Skills</th>
                  <th className="py-3 pr-2 pl-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3.5 pl-2 pr-3">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.has(c.id)}
                        onChange={() => toggleCandidate(c.id)}
                        aria-label={`Select candidate ${c.name}`}
                        className="rounded border-slate-300 text-black focus:ring-black/20 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl ${c.avatarBg} ${c.avatarColor} border ${c.avatarBorder} font-bold flex items-center justify-center text-xs shrink-0`}
                        >
                          {c.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#11142D] group-hover:text-blue-600 transition-colors">
                              {c.name}
                            </span>
                            <span title="Registrar Verified">
                              <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400">
                            Roll: {c.rollNo} • {c.gender}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-medium text-slate-800 text-xs">{c.branch}</span>
                      <p className="text-[11px] text-slate-400">{c.batch}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-[#11142D]">{c.cgpa}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                          0 Backlog
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E8F8F0] text-[#18A058] font-bold text-xs">
                        <span>{c.matchLabel}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {c.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-[10px] font-semibold bg-[#F8F9FA] text-slate-700 rounded-md border border-slate-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 pr-2 pl-3 text-right">
                      <button
                        onClick={() => setActiveProfileModal(c)}
                        className="bg-[#F8F9FA] hover:bg-black hover:text-white text-slate-700 font-semibold text-xs px-3.5 py-1.5 rounded-full transition-all border border-slate-200/80 cursor-pointer"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500">
            <p>
              Showing <strong className="text-black font-semibold">1 – {filteredCandidates.length}</strong> of{" "}
              <strong className="text-black font-semibold">64</strong> candidates
            </p>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1 rounded-full bg-black text-white font-bold cursor-pointer">
                1
              </button>
              <button className="px-3 py-1 rounded-full bg-[#F8F9FA] hover:bg-slate-200 text-slate-700 font-medium cursor-pointer">
                2
              </button>
              <button className="px-3 py-1 rounded-full bg-[#F8F9FA] hover:bg-slate-200 text-slate-700 font-medium cursor-pointer">
                3
              </button>
              <button
                onClick={() => router.push("/tpo/ai-search")}
                className="px-3 py-1 rounded-full bg-[#F8F9FA] hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Bento Card 5: Placement Screening Velocity Chart */}
        <div className="w-full bg-white rounded-3xl p-6 md:p-7 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.04)] border border-white flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-[#11142D] tracking-tight">
                Placement Screening Velocity
              </h3>
              <p className="text-xs text-slate-400">Total matched student volume evaluated over past 7 days</p>
            </div>
            <button className="flex items-center gap-1.5 bg-[#F8F9FA] hover:bg-slate-100 text-xs font-semibold text-slate-700 px-3.5 py-1.5 rounded-full border border-slate-200 transition-colors cursor-pointer">
              <span>Last 7 days</span>
              <ChevronRight className="size-3.5 text-slate-400 rotate-90" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-6">
            <div className="mb-2">
              <span className="text-3xl md:text-5xl font-extrabold text-slate-300 tracking-tight">
                {overview?.total_students ?? 1420}
                <span className="text-sm md:text-base font-semibold text-slate-400 ml-1">profiles</span>
              </span>
              <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Peak shortlisting speed: 280 profiles/hour</span>
              </p>
            </div>

            {/* Stylized Weekly Velocity Bars */}
            <div className="flex items-end gap-3 sm:gap-4 h-36 sm:h-44 pb-1 self-center sm:self-auto">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-6 sm:w-10 bg-slate-200/70 rounded-full h-16" />
                <span className="text-[10px] text-slate-400 font-semibold">Mon</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-6 sm:w-10 bg-slate-200/70 rounded-full h-24" />
                <span className="text-[10px] text-slate-400 font-semibold">Tue</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-6 sm:w-10 bg-slate-200/70 rounded-full h-20" />
                <span className="text-[10px] text-slate-400 font-semibold">Wed</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 relative">
                <div className="absolute -top-7 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  <span>648</span>
                </div>
                <div className="w-6 sm:w-10 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-full h-36 shadow-xs" />
                <span className="text-[10px] text-black font-bold">Thu</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-6 sm:w-10 bg-slate-200/70 rounded-full h-28" />
                <span className="text-[10px] text-slate-400 font-semibold">Fri</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-6 sm:w-10 bg-slate-200/70 rounded-full h-16" />
                <span className="text-[10px] text-slate-400 font-semibold">Sat</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-6 sm:w-10 bg-slate-200/70 rounded-full h-32" />
                <span className="text-[10px] text-slate-400 font-semibold">Sun</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Profile Quick View Modal */}
      {activeProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`size-12 rounded-2xl ${activeProfileModal.avatarBg} ${activeProfileModal.avatarColor} border ${activeProfileModal.avatarBorder} font-bold text-sm flex items-center justify-center`}
                >
                  {activeProfileModal.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base text-[#11142D]">
                      {activeProfileModal.name}
                    </h3>
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  </div>
                  <p className="text-xs text-slate-400">
                    Roll: {activeProfileModal.rollNo} • {activeProfileModal.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveProfileModal(null)}
                className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#F8F9FA] rounded-2xl p-3 border border-slate-100">
                <p className="text-slate-400 font-medium">Branch &amp; Batch</p>
                <p className="font-bold text-slate-900 mt-0.5">{activeProfileModal.branch}</p>
                <p className="text-slate-500 text-[11px]">{activeProfileModal.batch}</p>
              </div>
              <div className="bg-[#F8F9FA] rounded-2xl p-3 border border-slate-100">
                <p className="text-slate-400 font-medium">Verified CGPA</p>
                <p className="font-bold text-slate-900 mt-0.5">{activeProfileModal.cgpa}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 mt-1 inline-block">
                  0 Backlogs
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Verified Technical Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {activeProfileModal.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-800 rounded-lg border border-slate-200/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setActiveProfileModal(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => router.push(`/tpo/ai-search?q=${encodeURIComponent(activeProfileModal.name)}`)}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-black text-white hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Full Profile</span>
                <ExternalLink className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
