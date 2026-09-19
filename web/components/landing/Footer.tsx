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
              The explainable AI placement and verification platform for Indian universities and technology recruiters. Multi-agent proof checking with zero resume fraud.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-muted-foreground">
                All Verification Engines Operational
              </span>
            </div>
          </div>

          {/* Col 1: Product */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-foreground">
              Product
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/demo" className="hover:text-foreground transition-colors">
                  Live Interactive Demo
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
                <Link href="#features" className="hover:text-foreground transition-colors">
                  Features Breakdown
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-foreground transition-colors">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Solutions */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-foreground">
              Solutions
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="#solution" className="hover:text-foreground transition-colors">
                  Marksheet OCR Verification
                </Link>
              </li>
              <li>
                <Link href="#solution" className="hover:text-foreground transition-colors">
                  GitHub Originality Audit
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  Natural Language JD Search
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  Placement Cohorts & CSV
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-foreground transition-colors">
                  AWS S3 HMAC Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Resources */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-foreground">
              Resources & Legal
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="#faq" className="hover:text-foreground transition-colors">
                  FAQ & Documentation
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
              <li>
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  Security Disclosures
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} VerifAI Inc. Built for transparent, audit-proof campus placements.
          </div>
          <div className="flex items-center gap-6">
            <span>ISO / IEC 27001 Certified Architecture</span>
            <span>AWS Cloud Native</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
