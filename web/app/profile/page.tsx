"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, CheckCircle2, Loader2, Route } from "lucide-react";
import { toast } from "sonner";

import axios from "axios";

import { getMyProfile, getApiErrorMessage } from "@/lib/api";
import { clearAuth, getStoredToken } from "@/lib/auth-storage";
import type { StudentProfileDetail } from "@/lib/types";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ResumePdfViewer from "@/components/resume-pdf-viewer";
import { Skeleton } from "@/components/ui/skeleton";
import { PaletteSwitcher } from "@/components/theme/palette-switcher";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "resume">("overview");

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    (async () => {
      try {
        const data = await getMyProfile(token);
        setProfile(data);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 404) {
          setProfile(null);
        } else {
          toast.error(getApiErrorMessage(e));
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const signOut = () => {
    clearAuth();
    router.replace("/login");
  };
  const surfaceCardClass = "rounded-3xl border border-border/80 bg-card text-card-foreground shadow-sm";

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground transition-colors px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-3">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </header>

          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className={surfaceCardClass}>
              <CardHeader>
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>

            <Card className={surfaceCardClass}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>

            <Card className={`md:col-span-2 ${surfaceCardClass}`}>
              <CardHeader>
                <Skeleton className="h-5 w-16" />
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-background text-foreground transition-colors px-4 py-8">
        <div className="mx-auto max-w-lg space-y-3">
          <Card className={surfaceCardClass}>
            <CardHeader>
              <CardTitle>No saved profile yet</CardTitle>
              <CardDescription>
                Run analysis and save your profile from the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Link href="/dashboard" className={cn(buttonVariants())}>
                Go to dashboard
              </Link>
              <Button variant="outline" onClick={signOut}>
                Sign out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const { student } = profile;
  const resumeUrl =
    profile.resume_url ||
    (typeof profile.resume_data?.url === "string" ? profile.resume_data.url : null);
  const marksheetUrl =
    profile.marksheet_url ||
    (typeof profile.academic_data?.url === "string" ? profile.academic_data.url : null);
  const resumePreviewUrl = resumeUrl
    ? `/api/resume-preview?url=${encodeURIComponent(resumeUrl)}`
    : null;
  const lastAnalyzedLabel = new Date(profile.last_analyzed_at).toLocaleString();
  const topSkills = profile.skills.slice(0, 8);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Your Student Profile</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {student.name} · {student.email}
            {student.roll_no ? ` · ${student.roll_no}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <PaletteSwitcher />
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full border-border/80 bg-card hover:bg-muted font-medium text-xs sm:text-sm",
            )}
          >
            Update Analysis
          </Link>
          <Button variant="ghost" size="sm" className="rounded-full text-xs sm:text-sm" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </header>

      <div className="flex gap-2">
        <Button
          variant={activeTab === "overview" ? "default" : "outline"}
          className={cn(
            "rounded-full font-medium text-xs sm:text-sm",
            activeTab === "overview"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "border-border/80 bg-card text-foreground hover:bg-muted",
          )}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === "resume" ? "default" : "outline"}
          className={cn(
            "rounded-full font-medium text-xs sm:text-sm",
            activeTab === "resume"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "border-border/80 bg-card text-foreground hover:bg-muted",
          )}
          onClick={() => setActiveTab("resume")}
        >
          Resume
        </Button>
      </div>

      {activeTab === "overview" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Card className={surfaceCardClass}>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base text-card-foreground">Academics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm pt-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Branch</span>
                <span className="font-medium text-card-foreground">{student.branch}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium text-card-foreground">{student.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">CGPA</span>
                <span className="font-medium text-card-foreground">{student.cgpa ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Marks</span>
                {student.cgpa_verified ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/20">Verified</span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-1 rounded-md border border-border">Unverified</span>
                )}
              </div>
              {marksheetUrl ? (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Marksheet</span>
                  <a
                    href={marksheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View document
                  </a>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className={surfaceCardClass}>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base text-card-foreground">Overall score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="text-4xl font-semibold tracking-tight text-card-foreground">
                {profile.overall_score.toFixed(1)} <span className="text-xl text-muted-foreground font-medium">/ 100</span>
              </div>
              <Progress value={profile.overall_score} className="h-2" />
            </CardContent>
          </Card>

          <Card className={`md:col-span-2 overflow-hidden ${surfaceCardClass}`}>
            <CardHeader className="border-b border-border/60 bg-muted/20 pb-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base text-card-foreground">
                    <Route className="size-4 text-primary" />
                    Placement readiness plan
                  </CardTitle>
                  <CardDescription className="mt-1 text-muted-foreground">
                    Prioritized from your verified resume, coding, and academic evidence.
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-semibold tracking-tight text-card-foreground">
                    {profile.readiness.score.toFixed(1)}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-primary border border-border">
                    <CheckCircle2 className="size-3.5" />
                    {profile.readiness.level}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 pt-4 md:grid-cols-2">
              {profile.readiness.actions.map((action, index) => (
                <div key={`${action.category}-${action.title}`} className="rounded-2xl border border-border/80 bg-muted/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {index + 1}. {action.category}
                      </p>
                      <h3 className="mt-1 font-semibold text-card-foreground">{action.title}</h3>
                    </div>
                    <span className={cn(
                      "rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                      action.priority === "high"
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        : action.priority === "medium"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                    )}>
                      {action.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-muted-foreground">{action.reason}</p>
                  <div className="mt-3 flex items-start gap-2 text-sm font-medium leading-5 text-card-foreground">
                    <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-primary" />
                    {action.next_step}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className={surfaceCardClass}>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base text-card-foreground">Placement status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm pt-4">
              {profile.placement?.is_active ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Company</span>
                    <span className="font-medium text-card-foreground">{profile.placement.company_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium text-card-foreground">{profile.placement.offer_type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pay/Stipend</span>
                    <span className="font-medium text-card-foreground">{profile.placement.pay_amount ?? "—"}</span>
                  </div>
                  {profile.placement.notes && (
                    <div className="pt-2 border-t border-border/60 text-muted-foreground mt-2">
                      {profile.placement.notes}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground">Not placed yet.</div>
              )}
            </CardContent>
          </Card>

          <Card className={`md:col-span-2 ${surfaceCardClass}`}>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base text-card-foreground">Skills</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pt-4">
              {profile.skills.length ? (
                profile.skills.map((s) => (
                  <span key={s} className="bg-muted text-foreground text-xs px-3 py-1.5 rounded-md font-medium border border-border/60">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No skills stored.</span>
              )}
            </CardContent>
          </Card>

          <Card className={`md:col-span-2 ${surfaceCardClass}`}>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base text-card-foreground">Coding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm pt-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Persona</span>
                <span className="font-medium text-card-foreground">{profile.coding.persona || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Score</span>
                <span className="font-medium text-card-foreground">{profile.coding.score.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-[minmax(320px,420px)_1fr] lg:h-[calc(100vh-10.5rem)]">
          <Card className={`flex h-full flex-col overflow-auto ${surfaceCardClass}`}>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base text-card-foreground">Resume analysis</CardTitle>
              <CardDescription className="text-muted-foreground">
                ATS-focused highlights from your latest submitted resume.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ATS score</span>
                  <span className="font-semibold text-card-foreground">{profile.overall_score.toFixed(1)} <span className="text-muted-foreground font-normal">/ 100</span></span>
                </div>
                <Progress value={profile.overall_score} className="h-2" />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Coding score</span>
                  <span className="font-medium text-card-foreground">{profile.coding.score.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Persona</span>
                  <span className="font-medium text-card-foreground">{profile.coding.persona || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Skills captured</span>
                  <span className="font-medium text-card-foreground">{profile.skills.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last analyzed</span>
                  <span className="font-medium text-card-foreground">{lastAnalyzedLabel}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Top extracted skills</p>
                <div className="flex flex-wrap gap-2">
                  {topSkills.length ? (
                    topSkills.map((skill) => (
                      <span key={skill} className="bg-muted text-foreground text-xs px-2.5 py-1 rounded-md font-medium border border-border/60">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No skills extracted yet.</span>
                  )}
                </div>
              </div>

              <Link href="/dashboard" className={cn(buttonVariants(), "w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium")}>
                Update Resume
              </Link>
            </CardContent>
          </Card>

          <Card className={`flex h-full flex-col overflow-hidden ${surfaceCardClass}`}>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base text-card-foreground">Resume preview</CardTitle>
              <CardDescription className="text-muted-foreground">
                Preview your saved resume. If the preview is unavailable, open it in a new tab.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col space-y-4 overflow-hidden pt-4">
              {resumeUrl && resumePreviewUrl ? (
                <>
                  <ResumePdfViewer
                    url={resumePreviewUrl}
                    className="flex-1 min-h-0 rounded-xl border border-border/80 overflow-hidden"
                  />
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline" }), "shrink-0 rounded-full border-border/80 bg-card text-card-foreground hover:bg-muted font-medium")}
                  >
                    Open in new tab
                  </a>
                </>
              ) : (
                <div className="rounded-xl border border-border/80 bg-muted/40 p-4 text-sm text-muted-foreground">
                  No resume URL found for this profile yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </main>
  );
}
