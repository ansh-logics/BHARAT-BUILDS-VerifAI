# From Fragmented Profiles to Placement Intelligence: Why We Built VeriAI

Campus placements are often treated as a sorting problem: collect resumes, filter CGPA, search a few keywords, and create a shortlist. But the harder problem is trust.

Student evidence is fragmented across resumes, marksheets, GitHub, LeetCode, spreadsheets, and TPO records. Students may not know which gaps hold them back, while TPO teams must verify eligibility and role fit under time pressure.

We built **VeriAI** to turn that scattered evidence into an explainable placement-readiness profile.

## What VeriAI does

VeriAI combines three sources of evidence:

- **Resume analysis:** skills, projects, certifications, education, and ATS-focused insights.
- **Marksheet analysis:** CGPA, semester data, and backlog-related signals.
- **Coding analysis:** normalized GitHub and LeetCode performance data.

When values conflict, verified marksheet data takes priority over a manual or resume-extracted CGPA. This gives teams a reliable academic signal and students clear improvement actions.

For a job description, VeriAI evaluates required skills, preferred skills, branch, CGPA, backlog policy, and placement status. It then returns an explainable shortlist: matched skills, missing skills, coding evidence, verified academics, and score breakdowns. The goal is not only to rank candidates, but to show why a candidate is recommended.

## Building trust into the workflow

Student documents are sensitive, so resumes and marksheets are stored in a private Amazon S3 bucket with server-side encryption. The backend runs as containerized services on Amazon EC2 behind Amazon API Gateway, while AWS IAM controls storage access.

We also made updates source-aware. Updating a resume refreshes resume-derived data without replacing coding or verified academic data. Updating a marksheet refreshes academic verification. When a resume changes, VeriAI can re-check the stored marksheet so the combined profile remains consistent.

That detail matters: a student should not lose verified academic information just because they added a new project to a resume.

## What we learned

Building VeriAI pushed us beyond extraction accuracy. We had to decide which source owns each field, how to explain recommendations, and how to protect documents without making the product difficult to use.

Our answer is a modular platform: separate analyzers for resumes, coding profiles, marksheets, and job descriptions, connected through a master service that reconciles the evidence.

VeriAI is our attempt to make placement preparation more transparent for students and more manageable for colleges.

**Live app:** https://web-six-pi-61.vercel.app/  
**Public demo:** https://web-six-pi-61.vercel.app/demo  
**AWS API:** https://upur1tv9bg.execute-api.us-east-1.amazonaws.com/health  
**Source:** https://github.com/ansh-logics/BHARAT-BUILDS-VerifAI
