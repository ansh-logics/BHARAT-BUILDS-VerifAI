"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, Milestone, Shield, Layers } from "lucide-react";

export function ProductStageSection() {
  return (
    <section id="roadmap" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="relative rounded-3xl border border-border/80 bg-card p-8 sm:p-12 md:p-14 shadow-xs text-center space-y-8">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Building2 className="size-6" />
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xs font-mono font-semibold tracking-widest uppercase text-primary">
              Product Stage & Vision
            </h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
              Built for placement teams. Designed to scale across institutions.
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed pt-2 text-balance">
              VeriAI is currently demonstrated as a secure college placement workspace. Multi-college onboarding and tenant isolation are planned as the next platform layer.
            </p>
          </div>

          {/* Current vs Next Layer Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left pt-4">
            <div className="p-6 rounded-2xl bg-muted/40 border border-border/60 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold uppercase">
                <Shield className="size-4" />
                <span>Current Deployment</span>
              </div>
              <h4 className="text-base font-bold text-foreground">Dedicated College Instance</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Operates as an isolated institutional workspace with dedicated database storage, campus-specific criteria rules, and separate student/TPO roles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-muted/40 border border-border/60 space-y-3">
              <div className="flex items-center gap-2 text-primary font-mono text-xs font-semibold uppercase">
                <Milestone className="size-4" />
                <span>Next Architecture Layer</span>
              </div>
              <h4 className="text-base font-bold text-foreground">Multi-Tenant Institutional Scaling</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Extending the core verification pipeline with tenant-isolated subdomains, institutional policy configs, and consortium-level recruiting portals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
