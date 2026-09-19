# VerifAI: Three-Minute Demo Video Script

**Target length:** 2 minutes 40 seconds to 2 minutes 55 seconds  
**Format:** Screen recording with short voiceover, plus optional opening/closing visual  
**Rule:** Show the real product for most of the video. Do not use fake metrics or claim multi-college onboarding is live.

## 0:00-0:15 — The problem

**Show:** Landing page hero, then a quick visual of resumes, marksheets, GitHub, and LeetCode tabs.

**Say:**

> College placement teams have to make high-impact decisions from scattered evidence: resumes, marksheets, coding profiles, and spreadsheets. Students do not always know what is holding them back, while TPOs have limited time to verify eligibility and shortlist candidates fairly. We built VerifAI to turn this evidence into clear, explainable placement intelligence.

## 0:15-0:40 — What VerifAI does

**Show:** Student dashboard. Scroll through resume and marksheet upload areas, then the GitHub and LeetCode inputs. If available, show the profile page with skills, ATS score, coding score, and readiness actions.

**Say:**

> VerifAI combines three sources: resume analysis for skills and projects, marksheet analysis for verified academics, and GitHub plus LeetCode for coding evidence. The key rule is that marksheet-derived CGPA takes priority over self-reported values, so eligibility is based on verified data rather than only a resume claim.

## 0:40-1:05 — Data integrity and student readiness

**Show:** Profile page. Highlight skills, CGPA/academic status, coding score, and readiness recommendations. Show the resume preview if it loads quickly.

**Say:**

> The student receives one structured profile instead of disconnected results. VerifAI shows extracted skills, academic evidence, coding strength, and practical readiness actions. We also made updates source-aware: changing a resume cannot overwrite verified marksheet data or coding evidence. When needed, the system re-checks the stored marksheet before producing the final combined profile.

## 1:05-1:45 — TPO JD matching demo

**Show:** Open the TPO dashboard while already signed in. Go to the JD matching screen, use the prepared Backend Developer Intern JD, run the analysis, then point to a candidate's evidence and gaps.

**Say:**

> This is the VerifAI TPO workspace. A placement team adds a job description, and VerifAI applies policy filters while evaluating skills, academic eligibility, and coding evidence.

> Instead of returning only a score, it explains the result. We can see matched skills, missing required skills, preferred-skill gaps, and the score breakdown behind each recommendation. This makes the shortlist useful for TPO teams and actionable for students.

## 1:45-2:10 — Placement workflow

**Show:** From the analyzed candidate list, open placement groups or the round-tracking view. Show how shortlisted candidates move into an organized placement workflow.

**Say:**

> The placement team can evaluate candidates against Python, FastAPI, PostgreSQL, CGPA, branch, and placement status. After reviewing the evidence, they can organize shortlisted candidates into placement groups and track their progress through rounds.

## 2:10-2:35 — AWS architecture

**Show:** Landing-page Cloud Architecture section or a clean architecture slide. Include AWS Console briefly if it is already open: EC2 instance, S3 bucket name hidden if necessary, and API Gateway.

**Say:**

> VerifAI uses a Next.js frontend and FastAPI microservices for resume, marksheet, coding-profile, job-description, and orchestration workflows. The backend runs in Docker containers on Amazon EC2 behind Amazon API Gateway. Resumes and marksheets are stored privately in Amazon S3 with server-side encryption, while AWS IAM limits application access to those documents.

## 2:35-2:55 — Learning and close

**Show:** Return to the landing page, then the TPO sign-in or product overview CTA. End on the VerifAI logo or title.

**Say:**

> The biggest lesson from building VerifAI was that an AI score is not enough. We need to separate verified facts from weighted evidence, protect student data, and make every recommendation explainable. VerifAI is currently a secure single-college placement workspace, designed to scale into a multi-college platform with tenant isolation as the next layer.

> VerifAI: placement intelligence built for students and college placement teams.

## Recording checklist

- Use the live TPO dashboard, not localhost. Sign in before recording so credentials never appear in the video.
- Keep browser zoom around 90% so key panels fit on screen.
- Use synthetic candidates for public footage whenever possible. If the TPO dashboard contains real candidates, blur names, emails, phone numbers, roll numbers, and documents before publishing.
- Do not reveal passwords, JWT tokens, AWS account IDs, private S3 object keys, email addresses, or real student documents.
- Keep transitions short; the JD-matching screen should get the most time.
- Record voiceover separately if possible, then place it over clean screen captures.
