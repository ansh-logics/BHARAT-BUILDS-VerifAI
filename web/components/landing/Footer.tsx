"use client";

import React from "react";
import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import { GithubIcon } from "./icons";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                <BrainCircuit className="size-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                Verif<span className="text-primary font-black">AI</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Placement intelligence workspace for college TPOs and career cells. Cross-verifies student evidence to create transparent, explainable placement decisions.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-muted-foreground">
                Verification Pipeline Operational
              </span>
            </div>
          </div>

          {/* Col 1: Product */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-foreground">
              Workspace
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/demo" className="hover:text-foreground transition-colors font-medium text-primary">
                  Interactive Live Demo
                </Link>
              </li>
              <li>
                <Link href="/tpo" className="hover:text-foreground transition-colors">
                  TPO Console
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-foreground transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Evidence & Security */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-foreground">
              Verification
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="#trust" className="hover:text-foreground transition-colors">
                  Marksheet OCR Truth
                </Link>
              </li>
              <li>
                <Link href="#trust" className="hover:text-foreground transition-colors">
                  GitHub & Coding Evidence
                </Link>
              </li>
              <li>
                <Link href="#trust" className="hover:text-foreground transition-colors">
                  Explainable Candidate Matching
                </Link>
              </li>
              <li>
                <Link href="#architecture" className="hover:text-foreground transition-colors">
                  Private S3 Document Storage
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Stage */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-foreground">
              Platform
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="#architecture" className="hover:text-foreground transition-colors">
                  AWS Cloud Architecture
                </Link>
              </li>
              <li>
                <Link href="#roadmap" className="hover:text-foreground transition-colors">
                  Product Stage & Scaling
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-foreground transition-colors">
                  Institutional FAQ
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ansh-logics/BHARAT-BUILDS-VerifAI"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  <GithubIcon className="size-3" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} VerifAI. Placement intelligence for college TPOs.
          </div>
          <div className="flex items-center gap-6">
            <span>Dedicated College Workspace</span>
            <span>AWS Cloud Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
