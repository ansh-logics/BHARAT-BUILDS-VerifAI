# Verification Is the Feature: How VeriAI Builds Trust Into Placement Data

A resume can say almost anything.

That is not a criticism of students. A resume is a self-reported snapshot that is difficult for a placement team to validate at scale.

For a TPO, the question is not only, "Who has Python?" It is also:

- Is the CGPA eligible for this role?
- Is that academic value verified?
- Is there coding evidence behind the listed skills?
- Why was one student shortlisted over another?

That is why, while building VeriAI, we treated verification as a core product feature rather than an afterthought.

## Three sources, one placement profile

VeriAI combines evidence from three independent sources:

**Resume analysis** extracts skills, projects, education, certifications, and experience from PDF and DOCX files.

**Marksheet analysis** extracts academic information such as CGPA, semester-level data, and backlog-related signals. If a marksheet CGPA conflicts with a manual or resume value, the marksheet becomes the source of truth.

**Coding-profile analysis** evaluates public GitHub and LeetCode evidence, including repositories, languages, activity, solved problems, and coding strength.

The result is a reconciled candidate profile for placement readiness and job-description matching.

## The rule that made the product stronger

We had to answer a simple but important question: what happens when a student updates only one source?

If a student uploads a new resume, their resume-derived skills and projects should refresh. But that update must not accidentally overwrite verified academics or coding data.

So we made updates source-aware:

- Resume updates own resume-derived fields.
- Marksheet updates own verified academic fields.
- Coding updates own GitHub and LeetCode fields.

When a resume changes, VeriAI can re-analyze the previously stored marksheet before creating the final combined profile. This prevents partial, inconsistent updates and protects verified information.

## Explainability for TPOs and students

When a TPO adds a job description, VeriAI shows matched skills, missing required skills, academic eligibility, coding evidence, and ranking context.

Students get practical next steps; TPOs get evidence behind each recommendation.

## The stack behind the workflow

VeriAI uses a Next.js frontend and FastAPI microservices for resume, marksheet, coding-profile, job-description, and orchestration workflows. PostgreSQL stores structured profiles.

The backend runs in Docker containers on Amazon EC2 behind Amazon API Gateway. Resumes and marksheets are stored privately in Amazon S3 with server-side encryption, and AWS IAM limits service access to those documents.

The goal: move from unverified claims to evidence-based placement decisions.

**Live app:** https://web-six-pi-61.vercel.app/  
**Public demo:** https://web-six-pi-61.vercel.app/demo  
**Source:** https://github.com/ansh-logics/BHARAT-BUILDS-VerifAI
