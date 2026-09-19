# Two Days of Building VeriAI: From Placement Problem to Live System

We started VeriAI with one question: how can a college identify the right students for the right opportunity without relying on scattered resumes and spreadsheets?

In two days, it became a live placement-intelligence prototype with document analysis, explainable matching, and AWS-backed storage.

It was not about building everything perfectly. It was about finding what could not be trusted yet and fixing it before calling the product ready.

## Day 1: Build one profile from scattered evidence

Our first task was to combine resume, marksheet, and coding-profile analysis. Resumes provide skills and projects; marksheets provide academic evidence; GitHub and LeetCode add coding signals.

We made one rule non-negotiable: if a marksheet CGPA conflicts with a manual or resume-extracted CGPA, the verified marksheet value wins. That rule turned a profile form into a verification workflow.

## Day 2: Make matching explainable and updates safe

For TPOs, a job description should not produce a mysterious score. VeriAI shows matched skills, missing required and preferred skills, eligibility, coding evidence, and a ranked candidate list.

For students, the product creates practical readiness actions: strengthen projects, improve coding evidence, or update the resume.

The hard part was protecting source ownership. Replacing a resume must not overwrite verified academic or coding data. We changed the pipeline so each source owns its fields:

- Resume updates refresh resume-derived data.
- Marksheet updates refresh verified academic data.
- Coding-profile updates refresh coding data.

When a resume changes, VeriAI re-analyzes the stored marksheet before producing the combined profile.

## What fought back

The system became stronger because of the failures we found:

- PDF previews failed when the browser loaded a protected document across origins. We added a same-origin preview proxy.
- Storing a document link was not enough; we needed private encrypted storage and validated access.
- Ranking was not enough; TPOs need the evidence behind each recommendation.
- A public demo could not expose real student data, so we created an isolated synthetic candidate cohort.

## What shipped

The frontend uses Next.js. FastAPI microservices handle resumes, marksheets, coding profiles, job descriptions, and orchestration. PostgreSQL stores candidate data.

On AWS, Dockerized services run on Amazon EC2 behind Amazon API Gateway. Private Amazon S3 holds encrypted documents, and IAM limits access.

VeriAI is not trying to replace placement teams. It is trying to give students clearer direction and colleges better evidence for decisions that matter.

**Live app:** https://web-six-pi-61.vercel.app/  
**Public demo:** https://web-six-pi-61.vercel.app/demo  
**AWS API:** https://upur1tv9bg.execute-api.us-east-1.amazonaws.com/health  
**Source:** https://github.com/ansh-logics/BHARAT-BUILDS-VerifAI
