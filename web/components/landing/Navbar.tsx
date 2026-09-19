"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Menu, X } from "lucide-react";
import {
  getStoredEmail,
  getStoredRollNo,
  getStoredToken,
  getStoredTpoToken,
  getStoredTpoUsername,
} from "@/lib/auth-storage";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatUserLabel(email: string | null, rollNo: string | null): string {
  if (rollNo) return rollNo;
  if (!email) return "Student";
  const local = email.split("@")[0]?.trim();
  if (!local) return "Student";
  return local.replace(/[._-]+/g, " ");
}

export function Navbar() {
  const [studentLoggedIn, setStudentLoggedIn] = useState(false);
  const [tpoLoggedIn, setTpoLoggedIn] = useState(false);
  const [userLabel, setUserLabel] = useState("Student");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const studentToken = getStoredToken();
    const tpoToken = getStoredTpoToken();
    const email = getStoredEmail();
    const rollNo = getStoredRollNo();
    const tpoUsername = getStoredTpoUsername();

    if (tpoToken) {
      setTpoLoggedIn(true);
      setStudentLoggedIn(false);
      setUserLabel(tpoUsername || "TPO");
      return;
    }

    if (studentToken) {
      setStudentLoggedIn(true);
      setTpoLoggedIn(false);
      setUserLabel(formatUserLabel(email, rollNo));
      return;
    }

    setStudentLoggedIn(false);
    setTpoLoggedIn(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs group-hover:scale-105 transition-transform">
            <BrainCircuit className="size-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xl tracking-tight text-foreground">
              Verif<span className="text-primary font-black">AI</span>
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              2.0
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            href="#problem"
            className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
          >
            Problem
          </Link>
          <Link
            href="#solution"
            className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
          >
            Solution
          </Link>
          <Link
            href="#how-it-works"
            className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="#features"
            className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/demo"
            className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            Live Demo
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {studentLoggedIn || tpoLoggedIn ? (
            <>
              <span className="text-xs font-medium text-muted-foreground hidden md:inline-block">
                Signed in as <strong className="text-foreground">{userLabel}</strong>
              </span>
              <Link
                href={tpoLoggedIn ? "/tpo" : "/profile"}
                className={cn(buttonVariants({ size: "sm" }), "rounded-full shadow-xs px-5")}
              >
                {tpoLoggedIn ? "TPO Dashboard" : "Student Profile"}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "rounded-full text-muted-foreground hover:text-foreground"
                )}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-full px-5 shadow-xs gap-1.5 bg-primary hover:bg-primary/90"
                )}
              >
                <span>Get Started Free</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="rounded-lg"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl px-4 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-2">
            <Link
              href="#problem"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-foreground rounded-md hover:bg-muted"
            >
              Problem
            </Link>
            <Link
              href="#solution"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-foreground rounded-md hover:bg-muted"
            >
              Solution
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-foreground rounded-md hover:bg-muted"
            >
              How it Works
            </Link>
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-foreground rounded-md hover:bg-muted"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-foreground rounded-md hover:bg-muted"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-foreground rounded-md hover:bg-muted"
            >
              FAQ
            </Link>
            <Link
              href="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-primary rounded-md hover:bg-primary/10"
            >
              Live Demo
            </Link>
          </div>

          <div className="pt-4 border-t border-border/40 flex flex-col gap-2">
            {studentLoggedIn || tpoLoggedIn ? (
              <Link
                href={tpoLoggedIn ? "/tpo" : "/profile"}
                className={cn(buttonVariants(), "w-full rounded-full")}
              >
                {tpoLoggedIn ? "TPO Dashboard" : "Student Profile"}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-full")}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={cn(buttonVariants(), "w-full rounded-full")}
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
