"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BrainCircuit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import { getApiErrorMessage, login, registerAccount } from "@/lib/api";
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

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !phone.trim()) {
      toast.error("All fields are required.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await registerAccount({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
      });
      const auth = await login({
        identifier: email.trim().toLowerCase(),
        password,
      });
      setAuth(auth.access_token, auth.student_id, auth.email, auth.roll_no);
      toast.success("Account created. Continue to profile setup.");
      router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast.info("Account already exists. Please sign in.");
        router.push(`/login?identifier=${encodeURIComponent(email.trim())}`);
        return;
      }
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

      <Card className="w-full max-w-lg rounded-3xl border border-border/80 bg-card text-card-foreground shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs mb-2">
            <BrainCircuit className="size-5" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create Student Profile</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Register with basic details to begin evidence verification and placement readiness scoring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Aarav Sharma"
                className="h-11 rounded-xl border-input bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Institute Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="student@college.edu"
                className="h-11 rounded-xl border-input bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Password (min 8 characters)</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="h-11 rounded-xl border-input bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Phone Number</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                minLength={7}
                placeholder="+91 98765 43210"
                className="h-11 rounded-xl border-input bg-background"
              />
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  "Register and continue"
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Already registered?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
