"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaBanner() {
  return (
    <section className="py-20 md:py-28 bg-muted/20 border-t border-border/40 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 size-[500px] rounded-full bg-primary/15 blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="relative rounded-3xl border border-border/80 bg-gradient-to-b from-card via-card to-background p-8 sm:p-14 shadow-xl text-center space-y-6 ring-1 ring-border/50">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <BrainCircuit className="size-6" />
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground text-balance">
              Ready to modernize your campus placement drives?
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground text-balance">
              Join leading engineering colleges and recruiters running fraud-proof, explainable screening with VerifAI.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full sm:w-auto rounded-full px-8 shadow-md gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              )}
            >
              <Sparkles className="size-4" />
              <span>Get Started for Free</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/tpo"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto rounded-full px-8 border-border hover:bg-muted/60 font-medium"
              )}
            >
              <span>Access TPO Console</span>
            </Link>
          </div>

          <div className="pt-4 text-xs text-muted-foreground">
            No credit card required · Instant synthetic candidate pool · 100% auditable
          </div>
        </div>
      </div>
    </section>
  );
}
