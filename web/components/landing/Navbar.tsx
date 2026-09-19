"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BrainCircuit, Menu, Sparkles, X } from "lucide-react";
import {
  getStoredEmail,
  getStoredRollNo,
  getStoredToken,
  getStoredTpoToken,
  getStoredTpoUsername,
} from "@/lib/auth-storage";
import { Button, buttonVariants } from "@/components/ui/button";
import { PaletteSwitcher } from "@/components/theme/palette-switcher";
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
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#trust"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Verification
          </Link>
          <Link
            href="#architecture"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Architecture
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {studentLoggedIn || tpoLoggedIn ? (
            <Link
              href={tpoLoggedIn ? "/tpo" : "/profile"}
              className={cn(
                buttonVariants({ size: "sm" }),
                "rounded-full px-5 h-9 shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-all"
              )}
            >
              {tpoLoggedIn ? "TPO Dashboard" : "Student Profile"}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "rounded-full text-xs font-medium text-muted-foreground hover:text-foreground px-3"
                )}
              >
                Sign In
              </Link>
              <Link
                href="/demo"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-full px-4 h-9 shadow-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-all"
                )}
              >
                <Sparkles className="size-3.5" />
                <span>Live Demo</span>
              </Link>
            </>
          )}

          <div className="h-4 w-px bg-border/80" />

          {/* Compact Icon Theme Dropdown */}
          <PaletteSwitcher variant="dropdown" compact />
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <PaletteSwitcher variant="dropdown" compact />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="rounded-full size-9"
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
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-foreground rounded-md hover:bg-muted"
            >
              How It Works
            </Link>
            <Link
              href="#trust"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-foreground rounded-md hover:bg-muted"
            >
              Verification
            </Link>
            <Link
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-foreground rounded-md hover:bg-muted"
            >
              Architecture
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-foreground rounded-md hover:bg-muted"
            >
              FAQ
            </Link>
          </div>

          <div className="pt-4 border-t border-border/40 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Theme</span>
              <PaletteSwitcher variant="dropdown" />
            </div>
            {studentLoggedIn || tpoLoggedIn ? (
              <Link
                href={tpoLoggedIn ? "/tpo" : "/profile"}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(buttonVariants(), "w-full rounded-full")}
              >
                {tpoLoggedIn ? "TPO Dashboard" : "Student Profile"}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-full")}
                >
                  Sign In
                </Link>
                <Link
                  href="/demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(buttonVariants(), "w-full rounded-full gap-2")}
                >
                  <Sparkles className="size-4" />
                  <span>Live Demo</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
