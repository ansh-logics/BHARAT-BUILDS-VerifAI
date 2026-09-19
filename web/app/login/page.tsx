"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BrainCircuit, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage, login } from "@/lib/api";
import { setAuth } from "@/lib/auth-storage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PaletteSwitcher } from "@/components/theme/palette-switcher";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pre = new URLSearchParams(window.location.search).get("identifier");
    if (pre) setIdentifier(pre);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      toast.error("Enter roll number or email and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await login({
        identifier: identifier.trim(),
        password,
      });
      setAuth(data.access_token, data.student_id, data.email, data.roll_no);
      toast.success("Signed in.");
      router.push("/profile");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background p-6 text-foreground transition-colors">
      <div className="absolute left-6 top-6 flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground shadow-2xs transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="absolute right-6 top-6">
        <PaletteSwitcher />
      </div>

      <Card className="w-full max-w-md rounded-3xl border border-border/80 bg-card text-card-foreground shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs mb-2">
            <BrainCircuit className="size-5" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Student Sign In</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Sign in with your roll number or institute email to access your placement profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Roll number or email</label>
              <Input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                placeholder="e.g. AKTU001 or student@college.edu"
                className="h-11 rounded-xl border-input bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="h-11 rounded-xl border-input bg-background"
              />
            </div>
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
              <Link href="/tpo/login" className="hover:text-foreground transition-colors">
                TPO Console Sign In →
              </Link>
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Create Account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
