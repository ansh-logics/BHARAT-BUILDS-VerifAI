"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BrainCircuit, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage, tpoLogin } from "@/lib/api";
import { setTpoAuth } from "@/lib/auth-storage";
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

const DEMO_TPO_CREDENTIALS = {
  username: "tpo",
  password: "Tpo@1234",
};

export default function TpoLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const fillDemoCredentials = () => {
    setUsername(DEMO_TPO_CREDENTIALS.username);
    setPassword(DEMO_TPO_CREDENTIALS.password);
    toast.success("Demo credentials filled. Sign in to continue.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error("Enter username and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await tpoLogin({
        username: username.trim(),
        password,
      });
      setTpoAuth(data.access_token, data.username);
      toast.success("Signed in as TPO.");
      router.push("/tpo");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
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
          <CardTitle className="text-2xl font-bold tracking-tight">TPO Console Login</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Sign in with administrative credentials to access your college placement workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="e.g. tpo_admin"
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
                  Signing in...
                </>
              ) : (
                "Sign in to TPO Console"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full rounded-xl border-primary/30 text-primary hover:bg-primary/5"
              onClick={fillDemoCredentials}
              disabled={loading}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Use demo credentials
            </Button>
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              For the live VerifAI demonstration workspace.
            </p>
            <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
              <Link href="/login" className="hover:text-foreground transition-colors">
                ← Student Sign In
              </Link>
              <Link href="/demo" className="font-semibold text-primary hover:underline">
                Explore Demo
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
