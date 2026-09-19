"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Server, Database, Cloud, KeyRound, HardDrive, ShieldCheck } from "lucide-react";

export function AwsArchitectureSection() {
  return (
    <section id="architecture" className="py-20 md:py-28 bg-muted/20 border-y border-border/40 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono font-semibold tracking-widest uppercase text-primary">
            Infrastructure & Security
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Built with a practical, secure cloud foundation.
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground pt-1 text-balance">
            Engineered with dedicated cloud primitives on Amazon Web Services to guarantee private document storage, isolation, and reliable placement execution.
          </p>
        </div>

        {/* Cloud Architecture Flow Diagram */}
        <div className="relative rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border/60">
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">
                Production Cloud Topology
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span>AWS ap-south-1</span>
              <span>·</span>
              <span>Controlled IAM Scopes</span>
            </div>
          </div>

          {/* Flow Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 relative">
            {/* Node 1: Next.js Web Frontend */}
            <div className="rounded-2xl border border-border/80 bg-muted/40 p-5 space-y-3 relative group hover:border-primary/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">01 Client</span>
                <Server className="size-4 text-muted-foreground" />
              </div>
              <h4 className="font-bold text-foreground text-base">Next.js Frontend</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                App Router client serving student portals, TPO console, and real-time candidate search views with client-side token management.
              </p>
              <div className="pt-2">
                <span className="inline-block px-2 py-0.5 rounded-md bg-background text-[11px] font-mono text-muted-foreground border border-border/60">
                  HTTPS / TLS 1.3
                </span>
              </div>
            </div>

            {/* Node 2: Amazon API Gateway */}
            <div className="rounded-2xl border border-border/80 bg-muted/40 p-5 space-y-3 relative group hover:border-primary/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">02 Gateway</span>
                <Cloud className="size-4 text-muted-foreground" />
              </div>
              <h4 className="font-bold text-foreground text-base">Amazon API Gateway</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Single secure ingress point managing request routing, authentication header verification, and rate limiting.
              </p>
              <div className="pt-2">
                <span className="inline-block px-2 py-0.5 rounded-md bg-background text-[11px] font-mono text-muted-foreground border border-border/60">
                  Managed API Routing
                </span>
              </div>
            </div>

            {/* Node 3: FastAPI on Amazon EC2 */}
            <div className="rounded-2xl border border-border/80 bg-muted/40 p-5 space-y-3 relative group hover:border-primary/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">03 Services</span>
                <HardDrive className="size-4 text-muted-foreground" />
              </div>
              <h4 className="font-bold text-foreground text-base">FastAPI on Amazon EC2</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dedicated microservices handling PDF OCR parsing, GitHub evidence analysis, and deterministic candidate ranking.
              </p>
              <div className="pt-2">
                <span className="inline-block px-2 py-0.5 rounded-md bg-background text-[11px] font-mono text-muted-foreground border border-border/60">
                  Python 3.12 / Asynchronous
                </span>
              </div>
            </div>

            {/* Node 4: PostgreSQL */}
            <div className="rounded-2xl border border-border/80 bg-muted/40 p-5 space-y-3 relative group hover:border-primary/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">04 Database</span>
                <Database className="size-4 text-muted-foreground" />
              </div>
              <h4 className="font-bold text-foreground text-base">PostgreSQL Database</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Relational schema storing structured candidate records, placement drives, historical batch results, and audit trails.
              </p>
              <div className="pt-2">
                <span className="inline-block px-2 py-0.5 rounded-md bg-background text-[11px] font-mono text-muted-foreground border border-border/60">
                  Encrypted at Rest
                </span>
              </div>
            </div>
          </div>

          {/* Supporting Cloud Storage & IAM Highlights */}
          <div className="mt-8 pt-8 border-t border-border/60 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/60">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="size-5" />
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-foreground">Private Amazon S3 Storage</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Academic marksheets and student resumes reside in a strictly private AWS S3 bucket. Access is granted only via server-signed, time-bounded tokens with zero public bucket endpoints.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/60">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <KeyRound className="size-5" />
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-foreground">AWS IAM Controlled Access</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Application roles follow the principle of least privilege. Backend execution nodes have restricted, role-bound permissions to read and write document prefixes with no shared root credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
