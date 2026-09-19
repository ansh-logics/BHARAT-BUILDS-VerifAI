"use client";

import React from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Is VeriAI available for any college to sign up today?",
    answer:
      "VeriAI is currently deployed as a dedicated single-college placement intelligence workspace rather than a public multi-tenant SaaS. Placement cells can explore our full capabilities immediately through the live interactive demo workspace, which uses synthetic candidate datasets.",
  },
  {
    question: "How does VeriAI verify academic records against resume claims?",
    answer:
      "VeriAI extracts cumulative CGPA and active backlog counts directly from university marksheet PDFs using OCR. The extracted marksheet data serves as the single source of academic truth, overriding any self-reported resume numbers.",
  },
  {
    question: "What coding evidence is analyzed for technical candidates?",
    answer:
      "We inspect public GitHub activity (commit recency, originality, repository structure) and LeetCode problem-solving profiles to add verifiable technical context to candidates claiming software engineering competencies.",
  },
  {
    question: "How does natural language JD matching prevent AI hallucinations?",
    answer:
      "Rather than generating speculative generative summaries, VeriAI parses job descriptions into deterministic constraints (minimum CGPA, permitted branches, required frameworks, backlog rules). Every candidate match displays clear matched skills, missing skills, and eligibility status.",
  },
  {
    question: "How are student documents protected in the cloud?",
    answer:
      "All student transcripts and resumes are stored in private AWS S3 buckets using AES-256 server-side encryption. Documents cannot be accessed publicly and are retrieved solely via time-limited, HMAC SHA-256 signed access tokens governed by AWS IAM policies.",
  },
  {
    question: "Can placement officers export candidate shortlists?",
    answer:
      "Yes. Any shortlisted candidate roster can be exported directly to a structured CSV file containing verified CGPA, match scores, skill breakdown evidence, and links to verified documents for visiting recruiting panels.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-mono font-semibold tracking-widest uppercase text-primary">
            FAQ
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Frequently Asked Questions
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground pt-2 text-balance">
            Clear answers on VeriAI&apos;s architecture, evidence verification pipeline, and institutional deployment model.
          </p>
        </div>

        {/* Accordion FAQ List */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {FAQS.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="rounded-2xl border border-border/80 bg-card px-6 shadow-2xs data-[state=open]:border-primary/40 transition-colors"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground py-5 text-base hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Support Note */}
        <div className="mt-12 text-center text-xs text-muted-foreground">
          Have more questions? Explore our{" "}
          <Link href="/demo" className="text-primary font-semibold underline underline-offset-4">
            Interactive Live Demo
          </Link>{" "}
          or access the TPO Console.
        </div>
      </div>
    </section>
  );
}
