# Verification Is the Feature: How VerifAI Builds Trust Into Placement Data

A resume can say almost anything.

That is not a criticism of students. A resume is a self-reported snapshot that is difficult to validate at scale.

For a Training and Placement Officer, the question is not only, "Who knows Python?" It is also:

- Is the CGPA eligible for this opportunity?
- Is the academic value verified?
- Is there coding evidence behind the listed skills?
- Why was one student shortlisted over another?

That is why **VerifAI** treats verification as a core product feature.

## Three sources, one placement profile

VerifAI combines evidence from three independent sources.

**Resume analysis** extracts skills, projects, education, certifications, and experience from PDF and DOCX files.

**Marksheet analysis** extracts academic information such as CGPA, semester-level data, and backlog-related signals. If a marksheet CGPA conflicts with a manual or resume value, the marksheet becomes the source of truth.

**Coding-profile analysis** evaluates public GitHub and LeetCode evidence: repositories, languages, activity, solved problems, and coding strength.

The result is a reconciled profile for placement readiness and job-description matching.

## The rule that made the product stronger

We had to answer an important question: what happens when a student updates only one source?

If a student uploads a new resume, their projects and resume-derived skills should refresh. But that update must not overwrite verified academic or coding data.

So VerifAI uses source-aware updates:

- Resume updates own resume-derived fields.
- Marksheet updates own verified academic fields.
- Coding updates own GitHub and LeetCode fields.

When a resume changes, VerifAI can retrieve and re-analyze the previously stored marksheet before creating the final combined profile. This keeps the profile consistent and protects verified information.

## Explainability for TPOs and students

When a TPO adds a job description, VerifAI shows matched skills, missing required skills, academic eligibility, coding evidence, and ranking context.

Students get practical readiness actions, while TPO teams get evidence behind every recommendation.

## The stack behind the workflow

VerifAI uses Next.js, FastAPI microservices, and PostgreSQL.

The backend runs in Docker containers on Amazon EC2 behind Amazon API Gateway. Resumes and marksheets are stored privately in Amazon S3 with server-side encryption, while AWS IAM limits service access to those documents.

The goal is straightforward: help colleges move from unverified profile claims to transparent, evidence-based placement decisions.

**Live app:** https://web-six-pi-61.vercel.app/  
**Public demo:** https://web-six-pi-61.vercel.app/demo  
**Source:** https://github.com/ansh-logics/BHARAT-BUILDS-VerifAI
