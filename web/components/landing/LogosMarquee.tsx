"use client";

import React from "react";

const COMPANIES = [
  { name: "Google", domain: "Tech Recruiter" },
  { name: "Microsoft", domain: "Tech Recruiter" },
  { name: "Amazon", domain: "E-Commerce & Cloud" },
  { name: "Atlassian", domain: "Developer Tools" },
  { name: "Flipkart", domain: "E-Commerce" },
  { name: "Uber", domain: "Mobility & Tech" },
  { name: "Cisco", domain: "Networking & Security" },
  { name: "Goldman Sachs", domain: "FinTech" },
  { name: "IIT Bombay", domain: "Premier Institute" },
  { name: "BITS Pilani", domain: "Top Engineering" },
  { name: "NIT Trichy", domain: "National Institute" },
  { name: "IIIT Hyderabad", domain: "Research Institute" },
];

export function LogosMarquee() {
  return (
    <section id="logos" className="border-y border-border/40 bg-muted/20 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
          Trusted by Top Recruiters & Premier Universities
        </h3>

        <div className="relative overflow-hidden">
          {/* Marquee Container */}
          <div className="animate-marquee flex items-center gap-10 sm:gap-14 select-none">
            {COMPANIES.concat(COMPANIES).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-background/60 border border-border/60 shadow-2xs hover:border-primary/40 transition-colors shrink-0"
              >
                <div className="size-2 rounded-full bg-primary/40" />
                <span className="text-sm font-semibold text-foreground tracking-tight">
                  {item.name}
                </span>
                <span className="text-[10px] uppercase font-medium text-muted-foreground/70 hidden sm:inline">
                  {item.domain}
                </span>
              </div>
            ))}
          </div>

          {/* Left & Right Gradient Masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  );
}
