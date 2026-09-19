# First Commit Submission: VeriAI

## Submission setup

| Form field | Value |
| --- | --- |
| Project title | `VeriAI: Verified Placement Intelligence` |
| Track | `Ship It` |
| GitHub project link | `https://github.com/ansh-logics/BHARAT-BUILDS-VerifAI` |
| Deployed project link | `https://web-six-pi-61.vercel.app/` |
| Live demo link | `https://web-six-pi-61.vercel.app/demo` |
| Team format | `Solo` unless team members are added |
| Team leader WeMakeDevs username | `[ADD YOUR WEMAKEDEVS USERNAME]` |
| Team leader GitHub | `https://github.com/ansh-logics` |
| Team leader LinkedIn | `[ADD YOUR LINKEDIN URL]` |
| Team leader public resume | `[ADD PUBLIC GOOGLE DRIVE OR PORTFOLIO RESUME URL]` |
| YouTube demo | `[ADD UNLISTED OR PUBLIC VIDEO URL]` |

## What does your project do?

VeriAI is a placement-intelligence platform for college Training and Placement Offices. It turns resumes, official marksheets, GitHub profiles, LeetCode profiles, and job descriptions into structured, explainable candidate intelligence.

Students receive a profile with extracted skills, coding evidence, verified academic signals, and placement-readiness actions. TPO teams can add a job description and receive an explainable shortlist that shows candidate ranking, matched skills, missing required skills, preferred-skill gaps, academic eligibility, and coding evidence.

The project solves the problem of fragmented and difficult-to-verify placement data. Instead of relying only on self-reported resumes and spreadsheets, VeriAI reconciles evidence from multiple sources. When a marksheet-derived CGPA conflicts with a manually entered or resume-extracted value, the verified marksheet value takes priority.

VeriAI is currently demonstrated as a secure single-college placement workspace. It is built for students and TPO teams who need a clearer, more transparent way to prepare for and manage placement opportunities.

## How did you use AWS in your project?

We are submitting VeriAI in the **Ship It** track.

The application backend is deployed on **Amazon EC2** as Dockerized FastAPI microservices. The services handle resume analysis, marksheet analysis, coding-profile analysis, job-description matching, and orchestration.

**Amazon API Gateway** is the public API entry point and routes requests to the backend services running on EC2.

Student resumes and marksheets are stored in a private **Amazon S3** bucket with AES-256 server-side encryption. Files are not public; the application uses validated, signed access URLs for controlled document access and preview.

**AWS IAM** limits the EC2 application's access to the private document bucket. This was important because resumes and academic records are sensitive student data.

The live AWS API health endpoint is:
`https://upur1tv9bg.execute-api.us-east-1.amazonaws.com/health`

## Team leader's contributions

As the solo builder, I designed and implemented the VeriAI product end to end.

- Built the FastAPI microservice architecture for resume, marksheet, coding-profile, job-description, and master orchestration workflows.
- Built the Next.js student and TPO interfaces, including student profiles, placement-readiness actions, job-description matching, and a public isolated demo.
- Implemented resume and marksheet parsing, skill extraction, coding-profile normalization, candidate ranking, and explainable match evidence.
- Added marksheet-authoritative CGPA reconciliation and source-aware updates so a resume update cannot overwrite verified academic or coding data.
- Deployed backend services on AWS EC2 behind API Gateway and configured private encrypted S3 document storage with IAM access controls.
- Created synthetic demo candidates to demonstrate the product without exposing real student data.

## Feedback on AWS services: what could be better

**Amazon EC2:** EC2 gave us direct control over Dockerized services, but the initial deployment path required several manual steps: instance setup, security-group configuration, SSH key management, Docker installation, and deployment troubleshooting. A more guided path from a containerized local project to a secure EC2 deployment would reduce setup time for student builders.

**Amazon API Gateway:** API Gateway was useful for exposing the backend through one public endpoint, but debugging route integration and identifying whether an error came from the gateway, EC2 service, or security group required jumping between several consoles and logs. A simpler integrated request-tracing view for beginner builders would help.

**Amazon S3 and IAM:** Private document storage is powerful, but correct access design requires understanding bucket policies, IAM roles, encryption, CORS, and signed URLs at the same time. Better opinionated templates for "private student document uploads with application-only access" would make secure defaults easier to adopt.

## What did you like about AWS services?

**Amazon EC2:** EC2 made it possible to run our complete Docker-based FastAPI architecture without rewriting the services for a platform-specific runtime. This let us deploy the same microservice boundaries we used locally and keep control over networking and container configuration.

**Amazon API Gateway:** API Gateway gave VeriAI a clean public API layer in front of the EC2 deployment. It separated the browser-facing API endpoint from the internal service runtime and made the live backend easy to test through a stable health endpoint.

**Amazon S3:** S3 was a good fit for resumes and marksheets because it separates sensitive document storage from the application server. We used private storage and server-side encryption, then served controlled document access through the backend rather than exposing uploaded files publicly.

**AWS IAM:** IAM enabled the principle of least privilege for document storage. The application can access the bucket through its EC2 role instead of embedding long-lived AWS credentials in the source code.

## Blog links

Publish these on AWS Builder Center, then paste the published URLs into the form:

1. `[ADD BLOG URL]` - From Fragmented Profiles to Placement Intelligence: Why We Built VeriAI
2. `[ADD BLOG URL]` - Two Days of Building VeriAI: From Placement Problem to Live System
3. `[ADD BLOG URL]` - Verification Is the Feature: How VeriAI Builds Trust Into Placement Data
4. `[ADD BLOG URL]` - Built for Placement Teams Today, Designed for Many Colleges Tomorrow

## Three-minute video structure

**0:00-0:25 - Problem**

Show a student facing scattered resumes, marksheets, GitHub, and coding-platform profiles. Explain the verification and shortlisting burden on TPO teams.

**0:25-1:15 - Product walkthrough**

Show resume and marksheet upload, coding-profile connection, the student readiness profile, then the TPO JD matching workflow. Focus on matched skills, missing skills, verified CGPA, and explainable ranking.

**1:15-1:55 - AWS architecture**

Show the architecture: frontend, Amazon API Gateway, Amazon EC2 services, PostgreSQL, private Amazon S3 storage, and AWS IAM. Explain why private storage and verified marksheet data matter.

**1:55-2:25 - Live demo**

Open `/demo`, choose a role scenario, and show the synthetic candidate shortlist. State that the demo isolates synthetic data from real profiles.

**2:25-3:00 - Learning and close**

Mention the main lessons: source ownership, secure document handling, explainable AI recommendations, and building a live AWS-backed system. End on the VeriAI title and live URL.

## Before submitting

- Confirm the GitHub repository is public.
- Confirm the deployed app and `/demo` work in an incognito browser.
- Upload the YouTube video as Public or Unlisted and keep it below three minutes.
- Add the published Builder Center blog URLs.
- Add only real team-member details and contributions.
- Use the two tags required by the event: the selected track and any required project category tags.
