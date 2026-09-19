# When Placement Signals Disagree: How VerifAI Decides What to Trust

In my earlier post, [From Fragmented Profiles to Placement Intelligence: Why We Built VerifAI](https://builder.aws.com/content/3JXGoS0etOwCWgVI8BRsyL2KEJL/from-fragmented-profiles-to-placement-intelligence-why-we-built-veriai), I wrote about the problem of scattered student evidence.

The natural follow-up is: what happens when those sources disagree?

VerifAI does not average everything. Some fields are facts and need a strict source of truth. Others are signals and become more useful when combined.

## Facts need an authority

Academic eligibility is a clear example. A student may enter a CGPA manually or list it on a resume, but a marksheet is the strongest available source.

VerifAI uses source-of-truth rules:

- **CGPA, semester records, and backlog signals:** marksheet analysis owns these fields.
- **Projects, certifications, and experience:** resume analysis owns these fields.
- **Repositories, languages, and activity:** GitHub owns these fields.
- **Solved problems and contest information:** LeetCode owns these fields.

If a resume says `8.5` CGPA and the analyzed marksheet says `8.1`, VerifAI uses `8.1`. Job eligibility should not depend on a self-reported number.

The same principle applies to updates. A resume refreshes resume-derived skills and projects, but cannot overwrite verified academic data or coding evidence. A marksheet update owns academic fields, and a coding-profile update owns coding fields.

## Signals are stronger together

Readiness for a backend role cannot be decided by CGPA or GitHub activity alone. For role matching, VerifAI combines normalized signals:

- Resume quality, relevant projects, and technical skills
- Verified academic performance
- GitHub activity and repository evidence
- LeetCode problem-solving evidence
- Requirements from the job description

The result is a weighted readiness or match score. It is not presented as an absolute truth; it is decision support for a specific role.

## Explainability matters more than one score

A ranking without context is hard to trust. VerifAI shows matched and missing skills, academic eligibility, and coding evidence.

This gives TPO teams the reasoning behind a shortlist. It also gives students a useful answer beyond "not selected": what evidence is missing and what they can improve.

## Keeping profiles consistent

When a student replaces a resume, VerifAI can re-check the previously stored marksheet before creating the final profile. This prevents a resume refresh from creating a partial academic view.

The lesson is simple: trustworthy AI workflows must separate verified facts from weighted evidence, then make the reasoning visible.

**Read the first post:** https://builder.aws.com/content/3JXGoS0etOwCWgVI8BRsyL2KEJL/from-fragmented-profiles-to-placement-intelligence-why-we-built-veriai  
**Live app:** https://web-six-pi-61.vercel.app/  
**Public demo:** https://web-six-pi-61.vercel.app/demo
