# Built for Placement Teams Today, Designed for Many Colleges Tomorrow

While building VerifAI, we made one product decision early: be honest about what is live and what comes next.

VerifAI is a secure placement workspace for one college. Students submit evidence, TPO teams review matches, and the platform creates explainable shortlists.

It is not yet a self-serve platform where any college can create an account and onboard students independently. Multi-college onboarding is the next platform layer, not a feature we want to claim before it exists.

## Why start with one college?

Placement data is sensitive: documents, academics, coding profiles, eligibility rules, and outcomes. A multi-college platform needs more than a signup form.

It needs strong isolation.

College A must never see College B's students, documents, reports, groups, or job descriptions. Each institution needs its own users and policies.

Starting with one college workspace let us focus on the core placement workflow first:

- Analyze resumes, marksheets, GitHub, and LeetCode evidence.
- Make marksheet-derived CGPA the academic source of truth.
- Create explainable job-description matches.
- Give students readiness actions instead of only a score.
- Store documents privately with controlled access.

## What is already designed to scale

VerifAI uses modular FastAPI services for resume, marksheet, coding-profile, job-description, and orchestration workflows. Individual workloads can scale as usage grows.

The backend runs in Docker containers on Amazon EC2 behind Amazon API Gateway. PostgreSQL stores candidate data; private Amazon S3 stores encrypted documents; IAM limits access.

This supports service scalability, but it is different from tenant isolation.

## The next architecture layer

To support multiple colleges safely, the next VerifAI version needs a `college_id` across the product:

- Every student, TPO user, job description, group, report, and document belongs to one college.
- Authentication tokens carry college context.
- Every database query filters by that context.
- S3 document paths are isolated by college and student.
- Student email and roll-number uniqueness become college-scoped rather than global.

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

## What I learned

I learned that it is tempting to market a prototype as a universal SaaS platform. The better path is to show what works now, protect the data boundary, and make the next architecture step clear.

VerifAI is built for placement teams today and designed to grow across institutions without compromising trust.

**Live app:** https://web-six-pi-61.vercel.app/  
**Public demo:** https://web-six-pi-61.vercel.app/demo  
**Source:** https://github.com/ansh-logics/BHARAT-BUILDS-VerifAI
