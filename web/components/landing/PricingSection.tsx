"use client";

import React from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Campus Pilot",
    badge: "Free Trial",
    description: "Ideal for testing VerifAI with synthetic candidates and small departmental drives.",
    price: "Free",
    period: "forever",
    features: [
      "Access to full synthetic candidate pool",
      "Up to 25 natural language JD analyses",
      "Basic marksheet OCR inspection",
      "Interactive clarification capsules",
      "CSV shortlist export",
    ],
    cta: "Start Free Pilot",
    href: "/demo",
    popular: false,
  },
  {
    name: "Campus Pro",
    badge: "Most Popular",
    description: "Built for college placement cells managing batch-wide recruitment drives.",
    price: "Custom",
    period: "per academic year",
    features: [
      "Up to 2,500 student profiles",
      "Unlimited natural language JD matching",
      "Official marksheet OCR & backlog verification",
      "GitHub commit integrity & LeetCode rating audits",
      "Multi-round placement groups & cohort tracking",
      "Encrypted AWS S3 document vault access",
      "Priority TPO support & CSV exports",
    ],
    cta: "Deploy Campus Pro",
    href: "/register",
    popular: true,
  },
  {
    name: "University Enterprise",
    badge: "State & Multi-Campus",
    description: "For multi-college universities, state boards, and centralized placement directorates.",
    price: "Tailored",
    period: "custom SLA",
    features: [
      "Unlimited student batches across all campuses",
      "Dedicated private AWS S3 bucket & custom KMS keys",
      "Custom ERP / SIS database synchronization",
      "Role-based multi-department TPO permissions",
      "Dedicated onboarding engineer & 24/7 SLA",
      "Custom recruiter portal branding",
    ],
    cta: "Contact Enterprise",
    href: "/demo",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-muted/20 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-xs font-mono font-semibold tracking-widest uppercase text-primary">
            Pricing
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Transparent Plans for Every Institution
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground pt-2 text-balance">
            Deploy automated verification and explainable recruiter shortlists with predictable institutional plans.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {TIERS.map((tier, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-8 transition-all flex flex-col justify-between ${
                tier.popular
                  ? "bg-card border-2 border-primary shadow-lg lg:-translate-y-2"
                  : "bg-card/80 border border-border/80 shadow-sm hover:border-primary/40"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1 shadow-xs gap-1">
                    <Sparkles className="size-3" />
                    <span>Recommended for Colleges</span>
                  </Badge>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold text-foreground">{tier.name}</h4>
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                      {tier.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-4xl font-extrabold text-foreground">{tier.price}</span>
                  <span className="text-xs text-muted-foreground ml-2">/ {tier.period}</span>
                </div>

                <div className="pt-4 border-t border-border/60 space-y-3">
                  <div className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Included Capabilities
                  </div>
                  <ul className="space-y-2.5">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                        <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href={tier.href}
                  className={cn(
                    buttonVariants({
                      variant: tier.popular ? "default" : "secondary",
                    }),
                    "w-full rounded-full text-center font-medium",
                    tier.popular && "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                  )}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
