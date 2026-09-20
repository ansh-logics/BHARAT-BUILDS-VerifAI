"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { AlertTriangle, Check, CheckCircle2, ChevronDown, FileText, Loader2, Search, Sparkles, Target, Trophy, UploadCloud, Users, X, Download, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  createTpoGroup,
  getApiErrorMessage,
  getSearchCandidateDetails,
  listTpoGroups,
  markStudentPlacement,
  matchCandidatesWithJd,
  matchCandidatesWithJdMultipart,
  searchCandidates,
} from "@/lib/api";
import { clearTpoAuth } from "@/lib/auth-storage";
import type {
  JDMatchCandidate,
  JDMatchFilters,
  JDParsedConstraints,
  SearchResponse,
  SearchResultCandidate,
  TpoGroup,
} from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const BRANCHES = ["CSE", "IT", "ECE", "EEE", "ME", "CE", "AIML", "DS", "Other"] as const;
type BranchFilter = string;
type GenderFilter = "women" | "men" | "other" | "All";

type UICandidate = {
  key: string;
  id: number;
  name: string;
  email: string;
  rollNo: string;
  branch: string;
  gender: "women" | "men" | "other";
  cgpa: number;
  matchScore: number;
  skills: string[];
  codingPersona: string;
  resumeUrl: string | null;
  isPlaced: boolean;
  hasBacklog: boolean;
  isDemo: boolean;
  matchedSkills: string[];
  missingRequiredSkills: string[];
  missingPreferredSkills: string[];
  score: {
    resume: number;
    github: number;
    leetcode: number;
    academics: number;
    total: number;
  };
};

function scoreTone(score: number) {
  if (score >= 80) return { pill: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700", dot: "bg-emerald-500" };
  if (score >= 60) return { pill: "border-amber-500/30 bg-amber-500/10 text-amber-700", dot: "bg-amber-500" };
  return { pill: "border-rose-500/30 bg-rose-500/10 text-rose-700", dot: "bg-rose-500" };
}

function clamp01(v: number) {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeBranch(value: string | null | undefined): string {
  const normalized = normalizeText(value);
  if (!normalized) return normalized;
  const compact = normalized.replace(/[^a-z0-9]/g, "");
  if (compact === "computerscienceengineering" || compact === "cse") return "cse";
  if (compact === "informationtechnology" || compact === "it") return "it";
  if (compact === "electronicscommunicationengineering" || compact === "ece") return "ece";
  if (compact === "electricalelectronicsengineering" || compact === "eee") return "eee";
  if (compact === "mechanicalengineering" || compact === "me") return "me";
  if (compact === "civilengineering" || compact === "ce") return "ce";
  if (compact === "aiml" || compact === "artificialintelligencemachinelearning") return "aiml";
  if (compact === "datascience" || compact === "ds") return "ds";
  return compact;
}

function getClarificationChips(question: string): { label: string; text: string }[] {
  const q = question.toLowerCase();
  if (q.includes("unplaced") || q.includes("placed")) {
    return [
      { label: "Unplaced only", text: "Filter only unplaced students" },
      { label: "Placed as well", text: "Consider both placed and unplaced students" },
    ];
  }
  if (q.includes("backlog")) {
    return [
      { label: "Exclude backlogs", text: "Strictly exclude candidates with active backlogs" },
      { label: "Allow backlogs", text: "Allow candidates with active backlogs" },
    ];
  }
  if (q.includes("branch") || q.includes("branches")) {
    return [
      { label: "CSE / IT only", text: "Restrict candidates to CSE and IT branches" },
      { label: "All branches", text: "Open to candidates from all branches" },
    ];
  }
  if (q.includes("cgpa")) {
    return [
      { label: "Strict CGPA", text: "Strictly enforce the specified CGPA criteria" },
      { label: "Flexible CGPA", text: "Allow flexible CGPA for high-scoring skill matches" },
    ];
  }
  return [
    { label: "Yes, apply", text: `Yes, ${question.replace(/\?$/, "")}` },
    { label: "Dismiss", text: "" },
  ];
}

function toCandidate(raw: JDMatchCandidate): UICandidate {
  return {
    key: String(raw.student_id),
    id: raw.student_id,
    name: raw.name,
    email: raw.email,
    rollNo: raw.roll_no ?? "-",
    branch: raw.branch,
    gender: raw.gender,
    cgpa: raw.cgpa ?? 0,
    matchScore: raw.score_breakdown.total,
    skills: raw.skills ?? [],
    codingPersona: raw.coding_persona ?? "-",
    resumeUrl: raw.resume_url,
    isPlaced: raw.is_placed,
    hasBacklog: raw.has_active_backlog,
    isDemo: raw.is_demo ?? false,
    matchedSkills: raw.matched_skills ?? [],
    missingRequiredSkills: raw.missing_required_skills ?? [],
    missingPreferredSkills: raw.missing_preferred_skills ?? [],
    score: {
      resume: raw.score_breakdown.resume,
      github: raw.score_breakdown.github,
      leetcode: raw.score_breakdown.leetcode,
      academics: raw.score_breakdown.academics,
      total: raw.score_breakdown.total,
    },
  };
}

function CandidateFullDetails({ candidateId }: { candidateId: number }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    getSearchCandidateDetails(candidateId)
      .then((res) => {
        if (mounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (axios.isAxiosError(err) && [401, 403].includes(err.response?.status ?? 0)) {
          clearTpoAuth();
          router.replace("/tpo/login");
        }
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [candidateId, router]);

  if (loading) return <div className="text-sm text-muted-foreground animate-pulse">Loading detailed profile...</div>;
  if (!data) return <div className="text-sm text-muted-foreground">Failed to load detailed profile.</div>;

  const hasGithub = data.github_data && Object.keys(data.github_data).length > 0;
  const hasLeetcode = data.leetcode_data && Object.keys(data.leetcode_data).length > 0;

  return (
    <div className="col-span-3 pt-4 mt-4 border-t border-border/60 grid grid-cols-2 gap-8">
      {hasGithub && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-card-foreground">GitHub Stats</h4>
          <div className="text-sm text-muted-foreground">Followers: <span className="text-foreground font-medium">{data.github_data.followers || 0}</span></div>
          <div className="text-sm text-muted-foreground">Public Repos: <span className="text-foreground font-medium">{data.github_data.repos || 0}</span></div>
          {data.github_data.languages?.length > 0 && (
            <div className="text-sm text-muted-foreground">Top Languages: <span className="text-foreground font-medium">{data.github_data.languages.slice(0, 3).join(", ")}</span></div>
          )}
        </div>
      )}
      {hasLeetcode && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-card-foreground">LeetCode Stats</h4>
          <div className="text-sm text-muted-foreground">Solved: <span className="text-foreground font-medium">{data.leetcode_data.total_solved || 0}</span></div>
          <div className="text-sm text-muted-foreground">Easy: {data.leetcode_data.easy || 0}, Medium: {data.leetcode_data.medium || 0}, Hard: {data.leetcode_data.hard || 0}</div>
          <div className="text-sm text-muted-foreground">Rating: <span className="text-foreground font-medium">{Math.round(data.leetcode_data.contest_rating || data.leetcode_data.ranking || 0)}</span></div>
        </div>
      )}
      {!hasGithub && !hasLeetcode && (
        <div className="text-sm text-muted-foreground col-span-2">No connected platforms (GitHub/LeetCode) found for this candidate.</div>
      )}
    </div>
  );
}

export default function TpoDashboardPage() {
  const router = useRouter();
  const composerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const jdTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [jdInput, setJdInput] = useState("");
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<UICandidate[]>([]);
  const [parsedJD, setParsedJD] = useState<JDParsedConstraints | null>(null);
  const [filters, setFilters] = useState<JDMatchFilters | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [minCgpa, setMinCgpa] = useState("");
  const [branch, setBranch] = useState<BranchFilter>("All");
  const [gender, setGender] = useState<GenderFilter>("All");
  const [skills, setSkills] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<"matchScore" | "cgpa" | "name" | "branch" | "gender">("matchScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [composerInputHeight, setComposerInputHeight] = useState(48);
  const [groups, setGroups] = useState<TpoGroup[]>([]);
  const [groupTitle, setGroupTitle] = useState("");
  const [groupRounds, setGroupRounds] = useState("3");
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [placingStudentId, setPlacingStudentId] = useState<number | null>(null);
  const [lastCreatedGroupId, setLastCreatedGroupId] = useState<number | null>(null);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [manualSelected, setManualSelected] = useState<Record<number, SearchResultCandidate>>({});
  const [query, setQuery] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPromptMinimized, setIsPromptMinimized] = useState(false);
  const [dismissedClarifications, setDismissedClarifications] = useState<Record<number, boolean>>({});

  const activeClarifications = useMemo(() => {
    if (!parsedJD?.clarification_questions?.length) return [];
    return parsedJD.clarification_questions
      .map((q, idx) => ({ question: q, idx }))
      .filter(({ idx }) => !dismissedClarifications[idx]);
  }, [parsedJD, dismissedClarifications]);

  const handleSelectClarificationAnswer = (idx: number, answerText: string, answerLabel: string) => {
    setDismissedClarifications((prev) => ({ ...prev, [idx]: true }));
    setJdInput((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed}\n• ${answerText}` : answerText;
    });
    setIsInputExpanded(true);
    toast.success(`Added clarification: "${answerLabel}"`, {
      description: "Click Analyze to apply constraint and re-rank candidates.",
    });
  };

  const handleClickQuestion = (idx: number, question: string) => {
    setJdInput((prev) => {
      const trimmed = prev.trim();
      const promptAddition = `\nClarification requirement: [${question}] `;
      return trimmed ? `${trimmed}${promptAddition}` : promptAddition.trim();
    });
    setIsInputExpanded(true);
    setTimeout(() => {
      jdTextareaRef.current?.focus();
    }, 100);
    toast.info("Prompt updated with clarification. Type your answer and click Analyze.");
  };

  const handleDismissClarification = (idx: number) => {
    setDismissedClarifications((prev) => ({ ...prev, [idx]: true }));
  };

  const COMPACT_HEIGHT = 48;
  const EXPANDED_MIN_HEIGHT = 200;
  const EXPANDED_MAX_HEIGHT = 360;

  function resizeTextarea(expanded: boolean) {
    const textarea = jdTextareaRef.current;
    if (!expanded) {
      setComposerInputHeight(COMPACT_HEIGHT);
      if (textarea) {
        textarea.style.height = `${COMPACT_HEIGHT}px`;
        textarea.style.overflowY = "hidden";
      }
      return;
    }
    if (!textarea) {
      setComposerInputHeight(EXPANDED_MIN_HEIGHT);
      return;
    }
    textarea.style.height = "auto";
    const minHeight = EXPANDED_MIN_HEIGHT;
    const maxHeight = EXPANDED_MAX_HEIGHT;
    const nextHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight));
    setComposerInputHeight(nextHeight);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }

  function handleExpandInput() {
    setIsInputExpanded(true);
  }

  function resetFiltersAndSort() {
    setSkills([]);
    setBranch("All");
    setGender("All");
    setMinCgpa("");
    setExpandedKey(null);
    setSortKey("matchScore");
    setSortDir("desc");
  }

  function exportToCsv() {
    if (filtered.length === 0) {
      toast.error("No candidates to export");
      return;
    }
    
    const headers = ["Name", "Email", "Roll No", "Branch", "Gender", "CGPA", "Match Score", "Skills", "Placed", "Backlog", "Resume URL"];
    const rows = filtered.map(c => [
      c.name,
      c.email,
      c.rollNo,
      c.branch,
      c.gender,
      c.cgpa.toFixed(2),
      c.matchScore.toFixed(2) + "%",
      c.skills.join("; "),
      c.isPlaced ? "Yes" : "No",
      c.hasBacklog ? "Yes" : "No",
      c.resumeUrl || "N/A"
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `shortlist_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported CSV successfully");
  }

  async function runMatch() {
    const typedJd = jdInput.trim();
    const hasJdFile = Boolean(fileUpload);
    const hasValidText = typedJd.length >= 20;

    if (!hasJdFile && !hasValidText) {
      toast.error("Provide JD text (min 20 chars) or upload a JD PDF/DOCX file.");
      return;
    }
    setIsInputExpanded(false);
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = hasJdFile
        ? await (async () => {
            const formData = new FormData();
            formData.append("jd_file", fileUpload as File);
            if (typedJd) {
              formData.append("jd_text", typedJd);
            }
            return matchCandidatesWithJdMultipart(formData);
          })()
        : await matchCandidatesWithJd({ jd_text: typedJd });
      setCandidates(response.candidates.map(toCandidate));
      setParsedJD(response.jd);
      setFilters(response.filters);
      setSkills([]);
      setExpandedKey(null);
      setDismissedClarifications({});
    } catch (error) {
      if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) {
        clearTpoAuth();
        router.replace("/tpo/login");
        return;
      }
      const message = error instanceof Error ? error.message : "Failed to fetch candidates.";
      setErrorMessage(message);
      setCandidates([]);
      setFilters(null);
      setParsedJD(null);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const min = minCgpa.trim() ? Number(minCgpa.trim()) : NaN;
    const targetBranch = normalizeBranch(branch === "All" ? "" : branch);
    const targetGender = normalizeText(gender === "All" ? "" : gender);
    const out = candidates.filter((c) => {
      if (!Number.isNaN(min) && Number(c.cgpa) < min) return false;
      if (targetBranch && normalizeBranch(c.branch) !== targetBranch) return false;
      if (targetGender && normalizeText(c.gender) !== targetGender) return false;
      if (skills.length > 0) {
        const lower = c.skills.map((s) => normalizeText(s));
        if (!skills.every((s) => lower.includes(normalizeText(s)))) return false;
      }
      return true;
    });
    const dir = sortDir === "asc" ? 1 : -1;
    out.sort((a, b) => {
      if (sortKey === "matchScore") return (a.matchScore - b.matchScore) * dir;
      if (sortKey === "cgpa") return (a.cgpa - b.cgpa) * dir;
      if (sortKey === "branch") return a.branch.localeCompare(b.branch) * dir;
      if (sortKey === "gender") return a.gender.localeCompare(b.gender) * dir;
      return a.name.localeCompare(b.name) * dir;
    });
    return out;
  }, [candidates, minCgpa, branch, gender, skills, sortKey, sortDir]);

  const summary = useMemo(() => {
    const total = filtered.length;
    const qualified = filtered.filter((c) => !c.isPlaced && !c.hasBacklog).length;
    const avg = total ? filtered.reduce((acc, c) => acc + c.matchScore, 0) / total : 0;
    return { total, qualified, avg };
  }, [filtered]);

  const topKeys = useMemo(() => new Set([...filtered].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3).map((c) => c.key)), [filtered]);
  const collapsedPreview = useMemo(() => jdInput.split(/\r?\n/)[0] ?? "", [jdInput]);
  const branchOptions = useMemo(() => {
    const fromCandidates = Array.from(new Set(candidates.map((c) => c.branch).filter(Boolean)));
    const merged = Array.from(new Set([...BRANCHES, ...fromCandidates]));
    return merged.sort((a, b) => a.localeCompare(b));
  }, [candidates]);

  useEffect(() => {
    void listTpoGroups()
      .then(setGroups)
      .catch(() => {
        // keep existing page usable if group APIs are unavailable
      });
  }, []);

  useEffect(() => {
    resizeTextarea(isInputExpanded);
  }, [isInputExpanded, jdInput, loading]);

  async function handleCreateGroup(): Promise<boolean> {
    const title = groupTitle.trim() || `Analysis group ${new Date().toLocaleDateString()}`;
    const parsedRounds = Number.parseInt(groupRounds.trim(), 10);
    const totalRounds = Number.isFinite(parsedRounds) && parsedRounds > 0 ? Math.min(parsedRounds, 10) : 1;
    const studentIds = Array.from(new Set([...filtered.map((c) => c.id), ...Object.keys(manualSelected).map(Number)]));
    if (studentIds.length === 0) {
      toast.error("No shortlisted candidates to create group.");
      return false;
    }
    setCreatingGroup(true);
    try {
      const created = await createTpoGroup({
        title,
        jd_summary: parsedJD?.jd_summary ?? (jdInput.trim() || null),
        student_ids: studentIds,
        company_name: parsedJD?.company_name ?? null,
        role_type:
          parsedJD?.role_type && ["internship", "job"].includes(parsedJD.role_type)
            ? (parsedJD.role_type as "internship" | "job")
            : null,
        pay_or_stipend: parsedJD?.pay_or_stipend ?? null,
        duration: parsedJD?.duration ?? null,
        bond_details: parsedJD?.bond_details ?? null,
        jd_topics: [
          ...(parsedJD?.required_skills ?? []),
          ...(parsedJD?.preferred_skills ?? []),
          ...(parsedJD?.tools_and_technologies ?? []),
        ],
        jd_key_points: parsedJD?.responsibilities ?? [],
        interview_timezone: "Asia/Kolkata",
        total_rounds: totalRounds,
      });
      setGroups((prev) => [created, ...prev]);
      setLastCreatedGroupId(created.id);
      setGroupTitle("");
      setGroupRounds("3");
      setManualSelected({});
      setQuery("");
      setSearchResults(null);
      setHasSearched(false);
      toast.success("Analysis group created.");
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create group.";
      toast.error(message);
      return false;
    } finally {
      setCreatingGroup(false);
    }
  }

  function openCreateGroupModal() {
    setIsCreateGroupOpen(true);
  }

  function closeCreateGroupModal() {
    if (creatingGroup) return;
    setIsCreateGroupOpen(false);
  }

  async function handleMarkPlaced(studentId: number) {
    setPlacingStudentId(studentId);
    try {
      await markStudentPlacement({
        student_id: studentId,
        company_name: "TBD Company",
        offer_type: "job",
        pay_amount: null,
        notes: "Marked from TPO operate panel.",
      });
      setCandidates((prev) =>
        prev.map((item) => (item.id === studentId ? { ...item, isPlaced: true } : item)),
      );
      toast.success("Student marked as placed.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to mark placement.";
      toast.error(message);
    } finally {
      setPlacingStudentId(null);
    }
  }

  function addManualCandidate(candidate: SearchResultCandidate) {
    setManualSelected((prev) => ({ ...prev, [candidate.candidate_id]: candidate }));
  }

  function removeManualCandidate(candidateId: number) {
    setManualSelected((prev) => {
      const next = { ...prev };
      delete next[candidateId];
      return next;
    });
  }

  const handleSearch = React.useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSearchResults(null);
        setSearchError(null);
        setHasSearched(false);
        return;
      }
      setIsSearchLoading(true);
      setSearchError(null);
      try {
        const minCgpaFilter = minCgpa.trim() ? Number(minCgpa.trim()) : null;
        const branchFilter = branch !== "All" ? branch : null;
        const response = await searchCandidates(
          searchQuery.trim(),
          0,
          Number.isFinite(minCgpaFilter as number) ? minCgpaFilter : null,
          branchFilter,
          50,
        );
        setSearchResults(response);
        setHasSearched(true);
      } catch (err) {
        if (axios.isAxiosError(err) && [401, 403].includes(err.response?.status ?? 0)) {
          clearTpoAuth();
          router.replace("/tpo/login");
          return;
        }
        setSearchError(getApiErrorMessage(err));
      } finally {
        setIsSearchLoading(false);
      }
    },
    [router, minCgpa, branch],
  );

  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (searchQuery: string) => {
      clearTimeout(timeoutId);
      if (!searchQuery.trim()) {
        setSearchResults(null);
        setHasSearched(false);
        return;
      }
      timeoutId = setTimeout(() => {
        void handleSearch(searchQuery);
      }, 500);
    };
  }, [handleSearch]);

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  }

  function clearQuery() {
    setQuery("");
    setSearchResults(null);
    setSearchError(null);
    setHasSearched(false);
  }

  const showSearchDropdown = query.trim().length > 0 && (isSearchLoading || hasSearched || Boolean(searchError));

  useEffect(() => {
    if (isInputExpanded) jdTextareaRef.current?.focus();
  }, [isInputExpanded]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!isInputExpanded) return;
      const target = event.target as Node | null;
      if (!target) return;
      if (composerRef.current?.contains(target)) return;
      setIsInputExpanded(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isInputExpanded]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full h-full pb-32">
      <div className="mx-auto w-full max-w-7xl space-y-8">
            <section className="grid gap-4 md:grid-cols-4">
              <Card className="bg-card text-card-foreground rounded-3xl border border-border/80 shadow-xs"><CardHeader className="pb-2 pt-5 px-5 flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle><Users className="size-4 text-muted-foreground" /></CardHeader><CardContent className="px-5 pb-5"><div className="text-4xl font-semibold tracking-tight text-card-foreground">{summary.total}</div></CardContent></Card>
              <Card className="bg-card text-card-foreground rounded-3xl border border-border/80 shadow-xs"><CardHeader className="pb-2 pt-5 px-5 flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium text-muted-foreground">Eligible (unplaced + no backlog)</CardTitle><CheckCircle2 className="size-4 text-muted-foreground" /></CardHeader><CardContent className="px-5 pb-5"><div className="text-4xl font-semibold tracking-tight text-card-foreground">{summary.qualified}</div></CardContent></Card>
              <Card className="bg-card text-card-foreground rounded-3xl border border-border/80 shadow-xs"><CardHeader className="pb-2 pt-5 px-5 flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium text-muted-foreground">Avg Match Score</CardTitle><Target className="size-4 text-muted-foreground" /></CardHeader><CardContent className="px-5 pb-5"><div className="text-4xl font-semibold tracking-tight text-card-foreground">{summary.avg.toFixed(1)}</div></CardContent></Card>
              <Card className="bg-card text-card-foreground rounded-3xl border border-border/80 shadow-xs"><CardHeader className="pb-2 pt-5 px-5 flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium text-muted-foreground">Top Candidates</CardTitle><Trophy className="size-4 text-muted-foreground" /></CardHeader><CardContent className="px-5 pb-5"><div className="text-4xl font-semibold tracking-tight text-card-foreground">{topKeys.size}</div></CardContent></Card>
            </section>

            <section className="bg-card text-card-foreground rounded-[2rem] border border-border/80 shadow-xs overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-border/60 bg-muted/40">
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => router.push("/tpo/placement-groups")} className="rounded-full border-border/80 bg-card font-medium">
                    Open Placement Groups
                  </Button>
                </div>
                <div className="mt-3 rounded-2xl border border-border bg-card p-3 relative z-10">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search candidates by skill/name/tech..."
                        value={query}
                        onChange={handleQueryChange}
                        className="pl-9 h-9 rounded-full text-sm bg-background border-input hover:bg-muted/40 focus:bg-background"
                      />
                      {query ? (
                        <button onClick={clearQuery} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          <X className="w-4 h-4" />
                        </button>
                      ) : null}
                    </div>
                    <Button
                      onClick={() => void handleSearch(query)}
                      disabled={isSearchLoading || !query.trim()}
                      size="sm"
                      className="h-9 rounded-full px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-2"
                    >
                      {isSearchLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Searching...</> : <><Zap className="w-4 h-4" />Search</>}
                    </Button>
                  </div>
                  {showSearchDropdown ? (
                    <div className="absolute left-3 right-3 top-[calc(100%+8px)] z-20 rounded-xl border border-border bg-card text-card-foreground shadow-md max-h-72 overflow-y-auto">
                      {isSearchLoading ? (
                        <div className="px-3 py-3 text-sm text-muted-foreground">Searching candidates...</div>
                      ) : searchError ? (
                        <div className="px-3 py-3 text-sm text-destructive">{searchError}</div>
                      ) : (searchResults?.results?.length ?? 0) === 0 ? (
                        <div className="px-3 py-3 text-sm text-muted-foreground">No candidates found.</div>
                      ) : (
                        searchResults!.results.slice(0, 12).map((candidate) => (
                          <div key={candidate.candidate_id} className="flex items-center justify-between gap-3 px-3 py-2 border-b border-border/60 last:border-b-0">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-card-foreground truncate">{candidate.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{candidate.email} · {candidate.branch} · {candidate.match_quality}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                addManualCandidate({
                                  candidate_id: candidate.candidate_id,
                                  name: candidate.name,
                                  email: candidate.email,
                                  branch: candidate.branch,
                                  match_score: candidate.match_score,
                                  overall_score: candidate.overall_score,
                                  match_quality: candidate.match_quality,
                                  matched_terms: candidate.matched_terms,
                                } as SearchResultCandidate)
                              }
                              disabled={Boolean(manualSelected[candidate.candidate_id])}
                              className="h-8 rounded-full px-3 border-border/80 font-medium"
                            >
                              {manualSelected[candidate.candidate_id] ? "Added" : "Add"}
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  ) : null}
                  {Object.keys(manualSelected).length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.values(manualSelected).map((candidate) => (
                        <Badge key={candidate.candidate_id} variant="secondary" className="gap-2 border-border/80">
                          {candidate.name}
                          <button onClick={() => removeManualCandidate(candidate.candidate_id)}>
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
                {lastCreatedGroupId ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Latest group created:{" "}
                    <button
                      className="underline font-medium text-foreground"
                      onClick={() => router.push(`/tpo/placement-groups/${lastCreatedGroupId}`)}
                    >
                      View group #{lastCreatedGroupId}
                    </button>
                    .
                  </p>
                ) : null}
              </div>
              <div className="p-6 border-b border-border/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-card-foreground mr-1">Live JD shortlist</h2>
                  <div className="relative inline-flex items-center">
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value as BranchFilter)}
                      aria-label="Filter by branch"
                      className="h-9 rounded-full bg-muted/50 border border-input hover:bg-muted pl-4 pr-9 text-sm font-medium text-foreground transition-colors cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="All">All Branches</option>
                      {branchOptions.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  </div>
                  <div className="relative inline-flex items-center">
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as GenderFilter)}
                      aria-label="Filter by gender"
                      className="h-9 rounded-full bg-muted/50 border border-input hover:bg-muted pl-4 pr-9 text-sm font-medium text-foreground transition-colors cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="All">All Genders</option>
                      <option value="women">Women</option>
                      <option value="men">Men</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  </div>
                  <Input
                    value={minCgpa}
                    onChange={(e) => setMinCgpa(e.target.value)}
                    placeholder="Min CGPA"
                    className="h-9 rounded-full bg-muted/50 border-input hover:bg-muted focus:bg-background px-4 text-sm font-medium text-foreground w-28 placeholder:text-muted-foreground transition-colors"
                  />
                  {skills.length > 0 && (
                    <div className="flex items-center gap-1.5 pl-2 border-l border-border/80">
                      {skills.map((s) => (
                        <Badge key={s} variant="secondary" className="h-7 rounded-full px-3 text-xs bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                          {s}
                          <button onClick={() => setSkills((prev) => prev.filter((v) => v !== s))} className="ml-1.5 hover:opacity-80"><X className="size-3" /></button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    onClick={openCreateGroupModal}
                    disabled={creatingGroup || (filtered.length === 0 && Object.keys(manualSelected).length === 0)}
                    className="h-9 rounded-full px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium cursor-pointer"
                  >
                    Create Group
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportToCsv} className="h-9 rounded-full px-4 border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted font-medium gap-2 cursor-pointer">
                    <Download className="size-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetFiltersAndSort} className="h-9 rounded-full px-4 border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted font-medium cursor-pointer">Reset Filters</Button>
                </div>
              </div>

              <div className="px-6 py-4 border-b border-border/60 bg-muted/20 text-xs text-muted-foreground">
                {filters ? (
                  <div className="flex flex-wrap items-center gap-4">
                    <span>Requested: <strong>{filters.requested_target_count ?? "—"}</strong></span>
                    <span>Total: <strong>{filters.total_considered}</strong></span>
                    <span>Eligible: <strong>{filters.eligible_count || filters.passed_filters}</strong></span>
                    <span>Returned: <strong>{filters.returned_count}</strong></span>
                    {filters.rejected_min_cgpa > 0 && <span className="text-rose-500">↓CGPA: <strong>{filters.rejected_min_cgpa}</strong></span>}
                    {(filters.rejected_max_cgpa ?? 0) > 0 && <span className="text-rose-500">↑CGPA: <strong>{filters.rejected_max_cgpa}</strong></span>}
                    {(filters.rejected_no_skill_match ?? 0) > 0 && <span className="text-amber-500">No skill match: <strong>{filters.rejected_no_skill_match}</strong></span>}
                    {filters.rejected_branch > 0 && <span>Branch: <strong>{filters.rejected_branch}</strong></span>}
                    {filters.rejected_gender > 0 && <span>Gender: <strong>{filters.rejected_gender}</strong></span>}
                    {filters.rejected_backlog > 0 && <span>Backlog: <strong>{filters.rejected_backlog}</strong></span>}
                    {filters.rejected_placement > 0 && <span>Placement: <strong>{filters.rejected_placement}</strong></span>}
                  </div>
                ) : (
                  <span>Run JD analyze to see filter summary.</span>
                )}
              </div>
              {parsedJD && (
                <div className="px-6 py-3 border-b border-border/60 text-xs text-muted-foreground bg-card">
                  <span className="font-medium text-foreground">JD:</span>{" "}
                  {[
                    parsedJD.target_student_count ? `Target ${parsedJD.target_student_count}` : null,
                    parsedJD.job_title ? `Role ${parsedJD.job_title}` : null,
                    typeof parsedJD.min_cgpa === "number" && typeof parsedJD.max_cgpa === "number"
                      ? `CGPA ${parsedJD.min_cgpa}–${parsedJD.max_cgpa}`
                      : typeof parsedJD.min_cgpa === "number"
                        ? `Min CGPA ${parsedJD.min_cgpa}`
                        : typeof parsedJD.max_cgpa === "number"
                          ? `Max CGPA ${parsedJD.max_cgpa}`
                          : null,
                    parsedJD.required_skills?.length ? `Skills: ${parsedJD.required_skills.slice(0, 5).join(", ")}${parsedJD.required_skills.length > 5 ? "…" : ""}` : null,
                    parsedJD.exclude_active_backlogs ? "No active backlogs" : "Backlog: allowed",
                    parsedJD.placement_filter === "unplaced_only" ? "Placement: unplaced only" : "Placement: placed + unplaced",
                    parsedJD.allowed_branches?.length ? `Branches ${parsedJD.allowed_branches.join(", ")}` : null,
                    parsedJD.gender_filter !== "all_genders" ? `Gender ${parsedJD.gender_filter}` : null,
                  ]
                    .filter(Boolean)
                    .join(" | ") || "Parsed successfully"}
                </div>
              )}

              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-border/60 hover:bg-transparent">
                      <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Candidate</TableHead>
                      <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Branch</TableHead>
                      <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">CGPA</TableHead>
                      <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Match</TableHead>
                      <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gender</TableHead>
                      <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skills</TableHead>
                      <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-24">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!filtered.length ? (
                      <TableRow><TableCell colSpan={7} className="h-64 text-center text-muted-foreground">{errorMessage ?? "No candidates found matching the criteria."}</TableCell></TableRow>
                    ) : (
                      filtered.map((c) => {
                        const isTop = topKeys.has(c.key);
                        const tone = scoreTone(c.matchScore);
                        return (
                          <React.Fragment key={c.key}>
                            <TableRow className="border-border/60 hover:bg-muted/30 transition-colors group cursor-pointer" onClick={() => setExpandedKey(expandedKey === c.key ? null : c.key)}>
                              <TableCell className="px-6 py-4"><div className="flex items-center gap-3">{isTop ? <div className={cn("size-2 rounded-full", tone.dot)} /> : <div className="size-2" />}<span className="font-medium text-card-foreground">{c.name}</span>{c.isDemo ? <Badge variant="outline" className="border-sky-500/20 bg-sky-500/10 text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Demo</Badge> : null}</div></TableCell>
                              <TableCell className="px-6 py-4 text-muted-foreground">{c.branch}</TableCell>
                              <TableCell className="px-6 py-4 text-right tabular-nums text-muted-foreground">{c.cgpa.toFixed(2)}</TableCell>
                              <TableCell className="px-6 py-4 text-right"><Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 font-medium border-transparent", tone.pill)}>{c.matchScore.toFixed(1)}%</Badge></TableCell>
                              <TableCell className="px-6 py-4 text-muted-foreground capitalize">{c.gender}</TableCell>
                              <TableCell className="px-6 py-4"><div className="flex flex-wrap gap-1.5">{c.skills.slice(0, 3).map((s) => <span key={s} className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">{s}</span>)}{c.skills.length > 3 && <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">+{c.skills.length - 3}</span>}</div></TableCell>
                              <TableCell className="px-6 py-4">{!c.hasBacklog && !c.isPlaced ? <CheckCircle2 className="size-5 text-emerald-500" /> : <span className="text-muted-foreground/40">—</span>}</TableCell>
                            </TableRow>
                            {expandedKey === c.key && (
                              <TableRow className="bg-muted/20 hover:bg-muted/20">
                                <TableCell colSpan={7} className="p-0 border-b-0">
                                  <div className="px-6 md:px-10 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                                    <div className="space-y-4">
                                      <h4 className="text-sm font-semibold text-card-foreground">Score Breakdown</h4>
                                      {([
                                        ["Resume vs JD", c.score.resume, 40],
                                        ["GitHub", c.score.github, 20],
                                        ["LeetCode", c.score.leetcode, 20],
                                        ["Academics", c.score.academics, 20],
                                        ["Total", c.score.total, 100],
                                      ] as const).map(([label, value, maxValue]) => (
                                        <div key={label} className="space-y-1.5">
                                          <div className="flex items-center justify-between gap-3 text-xs"><span className="text-muted-foreground">{label}</span><span className="font-medium tabular-nums text-foreground">{value.toFixed(1)}</span></div>
                                          <Progress value={clamp01(value / maxValue) * 100} className="h-1.5 bg-muted" />
                                        </div>
                                      ))}
                                    </div>
                                    <div className="space-y-3">
                                      <h4 className="text-sm font-semibold text-card-foreground">Candidate Details</h4>
                                      <div className="text-sm text-muted-foreground">Email: {c.email}</div>
                                      <div className="text-sm text-muted-foreground">Roll: {c.rollNo}</div>
                                      <div className="text-sm text-muted-foreground">Placed: {String(c.isPlaced)}</div>
                                      <div className="text-sm text-muted-foreground">Backlog: {String(c.hasBacklog)}</div>
                                      <div className="text-sm text-muted-foreground">Persona: {c.codingPersona}</div>
                                      {!c.isPlaced ? (
                                        <Button
                                          size="sm"
                                          className="mt-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                                          disabled={placingStudentId === c.id}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            void handleMarkPlaced(c.id);
                                          }}
                                        >
                                          Mark placed
                                        </Button>
                                      ) : null}
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                          Match evidence
                                        </h4>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                          {c.matchedSkills.length ? c.matchedSkills.map((skill) => (
                                            <Badge key={skill} className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10">
                                              {skill}
                                            </Badge>
                                          )) : <span className="text-xs text-muted-foreground">No direct JD skill evidence found.</span>}
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                                          <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                                          Required skill gaps
                                        </h4>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                          {c.missingRequiredSkills.length ? c.missingRequiredSkills.map((skill) => (
                                            <Badge key={skill} className="border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10">
                                              {skill}
                                            </Badge>
                                          )) : <span className="text-xs font-medium text-emerald-700">All required skills covered</span>}
                                        </div>
                                      </div>
                                      {c.missingPreferredSkills.length ? (
                                        <p className="text-xs leading-5 text-slate-500">
                                          Preferred gaps: {c.missingPreferredSkills.join(", ")}
                                        </p>
                                      ) : null}
                                      {c.resumeUrl ? (
                                        <a href={c.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex text-sm font-medium text-blue-600 underline underline-offset-4">Open verified resume</a>
                                      ) : null}
                                    </div>
                                    <CandidateFullDetails candidateId={c.id} />
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </section>

            <AnimatePresence mode="wait">
              {!isPromptMinimized ? (
                <motion.div
                  key="composer-panel"
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.2,
                    x: 340,
                    y: 40,
                    transition: { duration: 0.32, ease: [0.36, 0.66, 0.04, 1] },
                  }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl z-50 px-4 pointer-events-none"
                >
                  <div className="pointer-events-auto flex flex-col items-center w-full">
                    {/* Floating Clickable Clarification Capsule */}
                    <AnimatePresence>
                      {activeClarifications.length > 0 && (
                        <motion.div
                          key="clarification-capsule"
                          initial={{ opacity: 0, y: 16, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 12, scale: 0.96 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="w-full mb-3 rounded-2xl bg-card/95 backdrop-blur-md border border-border/80 shadow-md p-3 flex flex-col gap-2 text-card-foreground"
                        >
                          <div className="flex items-center justify-between gap-2 px-1">
                            <div className="flex items-center gap-2">
                              <span className="flex size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                                <Sparkles className="size-3.5" />
                              </span>
                              <span className="text-xs font-semibold text-card-foreground tracking-tight">
                                AI Assistant Clarifications
                              </span>
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] px-2 py-0">
                                Click to answer
                              </Badge>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const allDismissed: Record<number, boolean> = {};
                                activeClarifications.forEach((c) => {
                                  allDismissed[c.idx] = true;
                                });
                                setDismissedClarifications((prev) => ({ ...prev, ...allDismissed }));
                              }}
                              className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors"
                              title="Dismiss all"
                              aria-label="Dismiss all clarifications"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>

                          <div className="space-y-2 pt-0.5">
                            {activeClarifications.map(({ question, idx }) => {
                              const chips = getClarificationChips(question);
                              return (
                                <motion.div
                                  key={idx}
                                  layout
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/60 hover:border-border transition-colors"
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleClickQuestion(idx, question)}
                                    className="text-left text-xs font-medium text-foreground hover:text-primary transition-colors flex items-start sm:items-center gap-1.5 min-w-0 group"
                                    title="Click to answer in prompt editor"
                                  >
                                    <span className="text-primary font-semibold shrink-0">Q:</span>
                                    <span className="group-hover:underline underline-offset-2">{question}</span>
                                  </button>
                                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                                    {chips.map((chip, chipIdx) => (
                                      <button
                                        key={chipIdx}
                                        type="button"
                                        onClick={() => handleSelectClarificationAnswer(idx, chip.text, chip.label)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-card text-foreground hover:bg-primary hover:text-primary-foreground border border-border/80 shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                                      >
                                        <Check className="size-3" />
                                        <span>{chip.label}</span>
                                      </button>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() => handleDismissClarification(idx)}
                                      className="size-6 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors shrink-0 ml-0.5"
                                      title="Dismiss question"
                                      aria-label="Dismiss question"
                                    >
                                      <X className="size-3" />
                                    </button>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Composer Card */}
                    {(() => {
                      const fileExt = fileUpload ? (fileUpload.name.match(/\.([^.]+)$/)?.[1] || "FILE").toUpperCase() : "";
                      const fileBase = fileUpload ? fileUpload.name.replace(/\.[^.]+$/, "") : "";
                      return (
                        <motion.div
                          ref={composerRef}
                          layout
                          transition={{ layout: { type: "spring", stiffness: 320, damping: 36, mass: 0.85 } }}
                          className="w-full relative bg-card text-card-foreground shadow-lg border border-border/80 rounded-[28px] p-3 flex flex-col"
                        >
                          <AnimatePresence initial={false}>
                            {fileUpload && (
                              <motion.div
                                key="file-chip"
                                layout
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 34, mass: 0.9 }}
                                className="flex flex-wrap gap-2 px-1 overflow-hidden"
                              >
                                <div className="flex items-center gap-2.5 bg-muted/40 border border-border/80 rounded-2xl pl-2 pr-2 py-2 max-w-[260px]">
                                  <div className="size-9 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
                                    <FileText className="size-4" />
                                  </div>
                                  <div className="min-w-0 pr-1">
                                    <div className="text-sm font-medium text-card-foreground truncate leading-tight" title={fileUpload.name}>
                                      {fileBase}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground uppercase leading-tight tracking-wide">
                                      {fileExt}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setFileUpload(null)}
                                    className="ml-1 size-5 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center shrink-0 text-muted-foreground hover:text-foreground"
                                    aria-label="Remove JD file"
                                  >
                                    <X className="size-3" />
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <motion.div
                            layout
                            className="min-w-0 relative overflow-hidden w-full px-1"
                            animate={{ height: isInputExpanded ? composerInputHeight : COMPACT_HEIGHT }}
                            transition={{ type: "spring", stiffness: 280, damping: 34, mass: 0.9 }}
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              {!isInputExpanded ? (
                                <motion.button
                                  key="collapsed-preview"
                                  type="button"
                                  onClick={handleExpandInput}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.18, ease: "easeInOut" }}
                                  className="h-full w-full text-left text-base leading-6 text-foreground placeholder:text-muted-foreground truncate overflow-hidden pr-10 inline-flex items-center [mask-image:linear-gradient(to_right,black_85%,transparent)]"
                                >
                                  {collapsedPreview || "Describe JD and constraints or upload JD file..."}
                                </motion.button>
                              ) : (
                                <motion.textarea
                                  key="expanded-textarea"
                                  ref={jdTextareaRef}
                                  value={jdInput}
                                  onChange={(e) => setJdInput(e.target.value)}
                                  onFocus={handleExpandInput}
                                  onClick={handleExpandInput}
                                  placeholder="Describe JD and constraints or upload JD file..."
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.18, ease: "easeInOut" }}
                                  className="h-full w-full resize-none bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground text-base leading-6 py-1 whitespace-pre-wrap overflow-y-auto pr-10"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      if (!loading) void runMatch();
                                    }
                                  }}
                                />
                              )}
                            </AnimatePresence>
                          </motion.div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1.5">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                                className="shrink-0 rounded-full size-10 text-muted-foreground hover:text-foreground hover:bg-muted"
                                title="Upload JD file"
                              >
                                <UploadCloud className="size-5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsPromptMinimized(true)}
                                className="rounded-full h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted gap-1.5"
                                title="Hide search prompt to bottom-right circle"
                              >
                                <ChevronDown className="size-3.5" />
                                <span>Hide</span>
                              </Button>
                            </div>
                            <Button
                              onClick={() => void runMatch()}
                              disabled={loading || (!fileUpload && jdInput.trim().length < 20)}
                              className="rounded-full h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs"
                            >
                              {loading ? <Loader2 className="size-5 animate-spin" /> : "Analyze"}
                            </Button>
                          </div>

                          {/* Quick minimize icon button in top-right */}
                          <button
                            type="button"
                            onClick={() => setIsPromptMinimized(true)}
                            className="absolute top-3.5 right-3.5 size-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors"
                            title="Hide search prompt"
                            aria-label="Hide search prompt"
                          >
                            <ChevronDown className="size-4" />
                          </button>

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            className="hidden"
                            onChange={(e) => setFileUpload(e.target.files?.[0] ?? null)}
                          />
                        </motion.div>
                      );
                    })()}
                  </div>
                </motion.div>
              ) : (
                /* Floating Circle in Bottom-Right Corner */
                <motion.div
                  key="minimized-fab"
                  initial={{ opacity: 0, scale: 0.2, rotate: -25, x: -60, y: 20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, x: 0, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.2,
                    rotate: 25,
                    x: -60,
                    y: 20,
                    transition: { duration: 0.24, ease: "easeInOut" },
                  }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                  className="absolute bottom-8 right-8 z-50 pointer-events-auto"
                >
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setIsPromptMinimized(false)}
                    className="relative group size-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl border-2 border-border flex items-center justify-center transition-shadow cursor-pointer"
                    aria-label="Expand AI search prompt"
                    title="Open AI Candidate Search"
                  >
                    <Sparkles className="size-6 text-primary-foreground group-hover:rotate-12 transition-transform duration-300" />

                    {activeClarifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 size-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse border border-card">
                        {activeClarifications.length}
                      </span>
                    )}

                    {/* Tooltip on hover */}
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-popover text-popover-foreground border border-border text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg backdrop-blur-xs">
                      Open AI Search {activeClarifications.length > 0 ? `(${activeClarifications.length} clarifications)` : ""}
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            {isCreateGroupOpen ? (
              <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
                <div className="w-full max-w-xl rounded-3xl border border-border bg-card text-card-foreground p-6 shadow-xl">
                  <h3 className="text-lg font-semibold text-card-foreground">Create Placement Group</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Confirm group details before creating.
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-card-foreground">Group title</label>
                      <Input
                        value={groupTitle}
                        onChange={(e) => setGroupTitle(e.target.value)}
                        placeholder="Group title (optional)"
                        className="rounded-xl border-input bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-card-foreground">Total rounds</label>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={groupRounds}
                        onChange={(e) => setGroupRounds(e.target.value)}
                        placeholder="Number of interview rounds"
                        className="rounded-xl border-input bg-background"
                      />
                    </div>
                    <div className="rounded-2xl border border-border/80 bg-muted/40 px-4 py-3 text-sm text-muted-foreground space-y-1">
                      <div>
                        Shortlist students: <span className="font-semibold text-foreground">{filtered.length}</span>
                      </div>
                      <div>
                        Manually added: <span className="font-semibold text-foreground">{Object.keys(manualSelected).length}</span>
                      </div>
                      <div>
                        Total to add:{" "}
                        <span className="font-semibold text-foreground">
                          {new Set([...filtered.map((c) => c.id), ...Object.keys(manualSelected).map(Number)]).size}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" onClick={closeCreateGroupModal} disabled={creatingGroup} className="rounded-full border-border font-medium">
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        const success = await handleCreateGroup();
                        if (success) {
                          setIsCreateGroupOpen(false);
                        }
                      }}
                      disabled={creatingGroup || (filtered.length === 0 && Object.keys(manualSelected).length === 0)}
                      className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-5"
                    >
                      {creatingGroup ? "Creating..." : "Create Group"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
            </div>
          </div>
  );
}
