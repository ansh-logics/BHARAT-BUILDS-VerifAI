"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "How does VerifAI prevent fake resume claims and inflated skills?",
    answer:
      "VerifAI uses multi-agent verification to cross-examine claims across three independent sources. We inspect marksheet PDFs with OCR to confirm true CGPA and active backlogs, examine public GitHub repositories to measure genuine commit volume and commit recency, and verify LeetCode problem-solving ratings.",
  },
  {
    question: "Can VerifAI process Indian university marksheets and grade scales?",
    answer:
      "Yes. The OCR engine is trained on diverse university marksheet layouts. It accurately calculates cumulative CGPA from semester SGPA breakdowns, isolates active vs cleared backlogs, and handles autonomous university grading rubrics without manual intervention.",
  },
  {
    question: "How does natural language JD matching prevent AI hallucinations?",
    answer:
      "VerifAI enforces a deterministic structured schema for JD parsing. Rather than generating speculative answers, our analyzer maps job descriptions into strict criteria (minimum CGPA, allowed branches, required frameworks, backlog rules) and mathematically calculates weighted candidate match scores.",
  },
  {
    question: "Is student academic data private and securely stored?",
    answer:
      "Yes. Student marksheets and verified resumes are stored in private AWS S3 buckets using AES-256 server-side encryption. Documents cannot be accessed publicly and are only accessible through secure, time-limited HMAC SHA-256 signed access tokens.",
  },
  {
    question: "Can placement officers export candidate shortlists directly to CSV?",
    answer:
      "Yes. Any shortlisted candidate pool can be exported in one click to a clean, formatted CSV sheet containing candidate names, verified CGPAs, match percentages, skill breakdown scores, and direct links to verified resumes.",
  },
  {
    question: "What are interactive AI Clarifications in the search composer?",
    answer:
      "When a recruiter's job description leaves key constraints ambiguous (such as whether already-placed students should be excluded or if active backlogs are permissible), VerifAI dynamically displays floating clarification capsules above the composer with one-click resolution chips.",
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
            Everything you need to know about VerifAI&apos;s multi-agent evaluation, data security, and recruiter workflows.
          </p>
        </div>

        {/* Accordion Component */}
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="rounded-2xl border border-border/80 bg-card px-2 transition-all hover:border-primary/40"
            >
              <AccordionTrigger className="text-left font-semibold text-base py-4 px-4 hover:no-underline text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed px-4 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Support Note */}
        <div className="mt-12 text-center text-xs text-muted-foreground">
          Have more questions? Check out our{" "}
          <a href="/demo" className="text-primary font-semibold underline underline-offset-4">
            Interactive Live Demo
          </a>{" "}
          or explore the TPO portal.
        </div>
      </div>
    </section>
  );
}
