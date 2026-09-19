"use client";

import React from "react";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Dr. Rajesh K. Sharma",
    role: "Head of Placements, Premier Tech Institute",
    content:
      "VerifAI completely eliminated our marksheet verification backlog. We processed 1,200 student applications in under 2 hours, and recruiters praised the zero-discrepancy interview rounds.",
    rating: 5,
  },
  {
    name: "Meera Subramanian",
    role: "Senior Campus Recruiter, Enterprise Cloud",
    content:
      "The GitHub and LeetCode originality checks are a game-changer. Candidates recommended by VerifAI had an 80% pass rate in our technical bar raiser interviews.",
    rating: 5,
  },
  {
    name: "Ananya Deshmukh",
    role: "Computer Science Graduate (Placed at Tier-1 Tech)",
    content:
      "Having my verified marksheet and genuine GitHub project contributions highlighted gave me a huge edge over peers who just stuffed keywords into their resumes.",
    rating: 5,
  },
  {
    name: "Prof. Arvind Narayanan",
    role: "Dean of Student Affairs",
    content:
      "The S3 HMAC encryption and strict auditable logs gave our institutional compliance committee total peace of mind regarding student data privacy.",
    rating: 5,
  },
];

export function TestimonialsMarquee() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-xs font-mono font-semibold tracking-widest uppercase text-primary">
            Testimonials
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Trusted by Placement Officers & Students
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground pt-2 text-balance">
            See how engineering colleges and top tech recruiters run faster, high-integrity placement drives with VerifAI.
          </p>
        </div>

        {/* Marquee Section */}
        <div className="mt-16 relative overflow-hidden">
          <div className="animate-marquee flex items-stretch gap-6 select-none">
            {TESTIMONIALS.concat(TESTIMONIALS).map((item, idx) => (
              <div
                key={idx}
                className="w-[320px] sm:w-[380px] p-6 rounded-2xl border border-border/80 bg-card shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between shrink-0"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    &ldquo;{item.content}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <div className="font-bold text-sm text-foreground">{item.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.role}</div>
                </div>
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
