# Built for Placement Teams Today, Designed for Many Colleges Tomorrow

One of the most important product decisions we made while building VeriAI was to be honest about its current stage.

VeriAI is live as a secure placement workspace for one college. Students submit evidence, TPO teams review profiles and matches, and the platform creates explainable shortlists.

That does not mean every college can self-register today. Multi-college onboarding is a planned platform layer, not a feature we want to pretend already exists.

## Why start with one college?

Placement data is sensitive: documents, academic information, coding profiles, eligibility rules, and outcomes. A multi-college platform needs more than a “college signup” form.

It needs hard isolation.

College A must never see College B's students, documents, reports, or groups. Each institution also needs its own policies, TPO users, and settings.

Starting with one college workspace let us focus on the core workflow first:

- Analyze resumes, marksheets, GitHub, and LeetCode evidence.
- Make marksheet-derived CGPA the verified academic source of truth.
- Create explainable job-description matches.
- Give students readiness actions instead of only a score.
- Store documents privately with controlled access.

## What is already scalable

VeriAI is built as modular services. Resume, marksheet, coding-profile, job-description, and orchestration workflows are separate FastAPI services, so workloads can scale independently.

The backend runs in Docker containers on Amazon EC2 behind Amazon API Gateway. PostgreSQL stores structured data, private Amazon S3 holds encrypted documents, and IAM limits access.

This is a solid base for scale, but service scalability is different from tenant isolation.

## The next architecture layer

To support multiple colleges safely, the next version of VeriAI needs an explicit `college_id` across the platform:

- Every student, TPO user, job description, placement group, report, and document belongs to one college.
- Authentication tokens carry college context.
- Every query filters by that context.
- S3 storage paths are isolated by college and student.
- Student email and roll-number uniqueness become college-scoped, not global.

The structure becomes:

```text
College
  ├─ TPO users
  ├─ Students
  ├─ Job descriptions
  ├─ Placement groups and rounds
  └─ Reports and documents
```

This is more than a database migration; it is an authorization and data-boundary model.

## What we learned

The tempting path is to market a prototype as a universal SaaS platform. The better path is to show what works now, protect the data boundary, and make the next architecture step explicit.

VeriAI is built for placement teams today and designed to grow across institutions without compromising trust.

**Live app:** https://web-six-pi-61.vercel.app/  
**Public demo:** https://web-six-pi-61.vercel.app/demo  
**Source:** https://github.com/ansh-logics/BHARAT-BUILDS-VerifAI
