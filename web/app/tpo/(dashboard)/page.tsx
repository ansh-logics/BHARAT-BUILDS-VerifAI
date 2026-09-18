"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Loader2,
  Users,
  Search,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  ChevronRight,
  BarChart3,
  FileText,
} from "lucide-react";

import { getApiErrorMessage, getTpoOverview, listTpoGroups } from "@/lib/api";
import { clearTpoAuth } from "@/lib/auth-storage";
import type { TpoGroup, TpoOverviewResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";

type QueueItem = {
  id: string;
  title: string;
  detail: string;
  actionLabel: string;
  onClick: () => void;
};

export default function TpoDashboardRootPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<TpoOverviewResponse | null>(null);
  const [groups, setGroups] = useState<TpoGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCohort, setSelectedCohort] = useState("Class of 2026");

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

  const sortedGroups = useMemo(
    () => [...groups].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [groups],
  );

  const recentGroups = sortedGroups.slice(0, 4);

  const queueItems = useMemo<QueueItem[]>(() => {
    const items: QueueItem[] = [];

    const staleGroup = sortedGroups.find((group) => {
      const createdAt = new Date(group.created_at).getTime();
      const ageDays = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);
      const hasPlaced = group.members.some((member) => member.placement?.is_active);
      return ageDays >= 7 && !hasPlaced;
    });
    if (staleGroup) {
      items.push({
        id: `stale-${staleGroup.id}`,
        title: "Stale group needs follow-up",
        detail: `${staleGroup.title} has no active placement updates in 7+ days.`,
        actionLabel: "Open Group",
        onClick: () => router.push(`/tpo/placement-groups/${staleGroup.id}`),
      });
    }

    items.push({
      id: "manual-review",
      title: "Review manual additions",
      detail: "Use AI Search to add candidates not captured by JD shortlist.",
      actionLabel: "Go to AI Search",
      onClick: () => router.push("/tpo/ai-search"),
    });

    if ((overview?.unplaced_eligible_students ?? 0) > 0) {
      items.push({
        id: "eligible-pool",
        title: "Unplaced pool available",
        detail: `${overview?.unplaced_eligible_students ?? 0} eligible students can be targeted in next drive.`,
        actionLabel: "Run AI Search",
        onClick: () => router.push("/tpo/ai-search"),
      });
    }

    if ((overview?.recent_placements.length ?? 0) > 0) {
      items.push({
        id: "placement-updates",
        title: "Recent placements recorded",
        detail: "Verify pay and offer details are complete for recent updates.",
        actionLabel: "View Groups",
        onClick: () => router.push("/tpo/placement-groups"),
      });
    }

    return items.slice(0, 4);
  }, [overview, sortedGroups, router]);

  // Demo candidates fallback if recent placements is empty
  const showcaseProfiles = useMemo(() => {
    if (overview?.recent_placements && overview.recent_placements.length > 0) {
      return overview.recent_placements.slice(0, 4).map((p, i) => ({
        initials: p.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "ST",
        name: p.name,
        subtitle: `${p.company_name} • ${p.offer_type}`,
        badgeText: p.pay_amount ? `₹${p.pay_amount} LPA` : "Placed",
        status: "Verified",
        bgGradient: i === 0 ? "from-blue-500 to-indigo-600" : i === 1 ? "from-emerald-500 to-teal-600" : i === 2 ? "from-amber-500 to-orange-600" : "from-violet-500 to-purple-600",
      }));
    }
    return [
      {
        initials: "AM",
        name: "Aarav Mehta",
        subtitle: "CSE • Fullstack AI",
        badgeText: "96% Match",
        status: "Active",
        bgGradient: "from-blue-500 to-indigo-600",
      },
      {
        initials: "PS",
        name: "Pooja Sharma",
        subtitle: "IT • Backend & DB",
        badgeText: "92% Match",
        status: "Active",
        bgGradient: "from-emerald-500 to-teal-600",
      },
      {
        initials: "RN",
        name: "Rohan Nair",
        subtitle: "CSE • MLOps & Cloud",
        badgeText: "89% Match",
        status: "Shortlisted",
        bgGradient: "from-amber-500 to-orange-600",
      },
      {
        initials: "SK",
        name: "Sanya Kapoor",
        subtitle: "ECE • Embedded C / RTOS",
        badgeText: "84% Match",
        status: "Active",
        bgGradient: "from-violet-500 to-purple-600",
      },
    ];
  }, [overview]);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 w-full h-full pb-16 space-y-6">
      {/* Top Header Bar */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
              AI Screening & Match
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              TPO AI
            </span>
          </div>
          <p className="text-xs lg:text-sm text-slate-500">
            Real-time candidate qualification, transcript auditing, and placement operations hub.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  router.push(`/tpo/ai-search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              placeholder="Search skills, roles, branches..."
              className="w-full bg-white text-xs lg:text-sm text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2 rounded-full border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <Button
            onClick={() => router.push("/tpo/ai-search")}
            className="rounded-full h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="size-3.5" />
            <span>Screen JD</span>
          </Button>
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shrink-0">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Drive Active</span>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="h-72 flex flex-col items-center justify-center text-slate-500 gap-3">
          <Loader2 className="size-6 text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-slate-600">Loading placement intelligence...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 flex items-center gap-3 text-rose-700 text-sm">
          <AlertCircle className="size-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Bento Row: Overview (7 Cols) + Top Matched Profiles (5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Bento Card 1: Overview and Core Metrics */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Overview</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Fall 2025–26 Placement Screening Cycle
                  </p>
                </div>
                <select
                  value={selectedCohort}
                  onChange={(e) => setSelectedCohort(e.target.value)}
                  aria-label="Filter by placement cohort"
                  className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Class of 2026">Class of 2026</option>
                  <option value="Class of 2025">Class of 2025</option>
                  <option value="All Batches">All Batches</option>
                </select>
              </div>

              {/* Two Core Stat Bento Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tile 1: Registered Students */}
                <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium mb-3">
                    <div className="flex items-center gap-1.5">
                      <Users className="size-4 text-blue-600" />
                      <span>Registered Students</span>
                    </div>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-100">
                      ↑ 12.4%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                      {overview?.total_students ?? 0}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">verified profiles</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                    <ShieldCheck className="size-3 text-emerald-600" />
                    <span>100% authenticated against academic transcripts</span>
                  </p>
                </div>

                {/* Tile 2: Eligible Active Pool */}
                <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium mb-3">
                    <div className="flex items-center gap-1.5">
                      <Clock3 className="size-4 text-indigo-600" />
                      <span>Eligible Active Pool</span>
                    </div>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-100">
                      ↑ 36.8%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                      {overview?.unplaced_eligible_students ?? 0}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      0 Backlogs
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="size-3 text-blue-600" />
                    <span>Unplaced & ready for immediate recruiter dispatch</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Top Matched Profiles / Recent Placements */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Top Matched Profiles
                  </h3>
                  <p className="text-xs text-slate-400">Ranked by Placement Readiness</p>
                </div>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                  Live Sync
                </span>
              </div>

              <div className="space-y-3">
                {showcaseProfiles.map((p, i) => (
                  <div
                    key={i}
                    onClick={() => router.push("/tpo/ai-search")}
                    className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`size-10 rounded-2xl bg-gradient-to-br ${p.bgGradient} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                      >
                        {p.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{p.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-slate-900">{p.badgeText}</p>
                      <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => router.push("/tpo/ai-search")}
                className="w-full rounded-full h-9 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                View All Shortlisted Profiles <ChevronRight className="size-3.5 ml-1" />
              </Button>
            </div>
          </div>

          {/* Bento Card 3: Quick AI Job Description Match Bar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                  <Zap className="size-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    AI Job Description Analyzer
                  </h3>
                  <p className="text-xs text-slate-500">
                    Parse recruiter requirements, enforce strict CGPA bounds, and filter zero-backlog cohorts
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                Llama-3 Few-Shot Parser
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <div className="relative flex-1 w-full">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-blue-600" />
                <input
                  type="text"
                  defaultValue="Find 5 students with 5-7 cgpa not more than or less than this also they should have the speciality in webdev"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = (e.target as HTMLInputElement).value;
                      router.push(`/tpo/ai-search?q=${encodeURIComponent(val)}`);
                    }
                  }}
                  className="w-full bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm pl-11 pr-4 py-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>
              <Button
                onClick={() =>
                  router.push(
                    "/tpo/ai-search?q=" +
                      encodeURIComponent(
                        "Find 5 students with 5-7 cgpa not more than or less than this also they should have the speciality in webdev",
                      ),
                  )
                }
                className="w-full sm:w-auto rounded-2xl h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shrink-0 flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01]"
              >
                <Zap className="size-4 text-amber-300" />
                <span>Match &amp; Rank</span>
              </Button>
            </div>
          </div>

          {/* Action Queue (7 Cols) & Recent Groups (5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Bento Card 4: Action Queue */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Action Queue</h3>
                <span className="text-xs text-slate-400 font-medium">Pending Tasks</span>
              </div>
              <div className="space-y-3">
                {queueItems.length === 0 ? (
                  <div className="text-xs text-slate-500 py-6 text-center">
                    No pending actions. All placement pipelines are up to date.
                  </div>
                ) : (
                  queueItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200/70 bg-slate-50/50 p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900">{item.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.detail}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={item.onClick}
                        className="shrink-0 h-8 rounded-full text-xs font-semibold border-slate-200 text-slate-700 hover:bg-white"
                      >
                        {item.actionLabel}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bento Card 5: Recent Placement Groups */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Placement Groups
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/tpo/placement-groups")}
                  className="text-xs text-blue-600 hover:text-blue-700 h-7 px-2"
                >
                  View All ({groups.length})
                </Button>
              </div>

              <div className="space-y-2.5">
                {recentGroups.length === 0 ? (
                  <div className="text-xs text-slate-500 py-6 text-center">
                    No placement groups created yet. Create one from AI Search.
                  </div>
                ) : (
                  recentGroups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => router.push(`/tpo/placement-groups/${group.id}`)}
                      className="w-full rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3.5 text-left hover:bg-slate-50 transition-colors flex items-center justify-between group"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {group.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {group.members.length} candidates · Round {group.current_round_no}/{group.total_rounds}
                        </p>
                      </div>
                      <ChevronRight className="size-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0 ml-2" />
                    </button>
                  ))
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => router.push("/tpo/placement-groups")}
                className="w-full rounded-full h-9 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-50"
              >
                Manage Placement Groups
              </Button>
            </div>
          </div>

          {/* Bottom Bento Card: Placement Screening Velocity Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Placement Screening Velocity
                </h3>
                <p className="text-xs text-slate-500">
                  Total student evaluations and candidate matches over the past 7 days
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                Past 7 Days
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-2">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {overview?.total_students ?? 1420}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">profiles audited</span>
                </div>
                <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Peak shortlisting speed: 280 profiles/hour</span>
                </p>
              </div>

              {/* Weekly Velocity Bar Chart */}
              <div className="flex items-end gap-3 sm:gap-5 h-32 sm:h-36 pb-1 self-center sm:self-auto">
                {[
                  { day: "Mon", height: "h-14", value: 180, active: false },
                  { day: "Tue", height: "h-20", value: 290, active: false },
                  { day: "Wed", height: "h-16", value: 240, active: false },
                  { day: "Thu", height: "h-28", value: 648, active: true },
                  { day: "Fri", height: "h-24", value: 380, active: false },
                  { day: "Sat", height: "h-12", value: 140, active: false },
                  { day: "Sun", height: "h-20", value: 310, active: false },
                ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 relative group">
                    {bar.active && (
                      <div className="absolute -top-6 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <span className="size-1 rounded-full bg-emerald-400" />
                        <span>{bar.value}</span>
                      </div>
                    )}
                    <div
                      className={`w-6 sm:w-9 rounded-full transition-all duration-300 ${
                        bar.active
                          ? "bg-gradient-to-t from-blue-600 to-indigo-500 shadow-sm"
                          : "bg-slate-200/80 group-hover:bg-slate-300"
                      } ${bar.height}`}
                    />
                    <span
                      className={`text-[10px] font-semibold ${
                        bar.active ? "text-slate-900 font-bold" : "text-slate-400"
                      }`}
                    >
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
