from __future__ import annotations

from typing import Any

from app.schemas.student import PlacementReadiness, ReadinessAction


def _number(value: Any) -> float:
    try:
        return max(0.0, float(value or 0))
    except (TypeError, ValueError):
        return 0.0


def _read_activity(github_data: dict[str, Any]) -> int:
    return int(
        _number(
            github_data.get("last_30_day_commits")
            or github_data.get("commits_30d")
            or github_data.get("recent_commit_activity")
        )
    )


def build_placement_readiness(
    *,
    overall_score: float,
    coding_score: float,
    academic_score: float,
    academic_verified: bool,
    skills: list[str],
    resume_url: str | None,
    github_data: dict[str, Any],
    leetcode_data: dict[str, Any],
) -> PlacementReadiness:
    score = round(
        (max(0.0, min(overall_score, 100.0)) * 0.5)
        + (max(0.0, min(coding_score, 100.0)) * 0.3)
        + (max(0.0, min(academic_score, 100.0)) * 0.2),
        1,
    )
    if score >= 85:
        level = "Strong"
    elif score >= 70:
        level = "Ready"
    elif score >= 50:
        level = "Building"
    else:
        level = "Starting"

    actions: list[ReadinessAction] = []
    if not resume_url:
        actions.append(
            ReadinessAction(
                priority="high",
                category="Resume",
                title="Upload a verified resume",
                reason="Recruiters and the matching agent cannot inspect your project evidence yet.",
                next_step="Upload a PDF or DOCX resume and run analysis again.",
            )
        )
    elif overall_score < 70:
        actions.append(
            ReadinessAction(
                priority="high",
                category="Resume",
                title="Strengthen measurable project evidence",
                reason=f"Your current profile analysis score is {overall_score:.1f}/100.",
                next_step="Add outcomes, scale, and the exact technologies used to your strongest projects.",
            )
        )

    if not github_data:
        actions.append(
            ReadinessAction(
                priority="high",
                category="GitHub",
                title="Connect your GitHub evidence",
                reason="No repository evidence is available to validate hands-on engineering work.",
                next_step="Add your GitHub username and analyze the profile again.",
            )
        )
    elif _read_activity(github_data) < 8:
        actions.append(
            ReadinessAction(
                priority="medium",
                category="GitHub",
                title="Show recent development activity",
                reason="Your last 30-day contribution evidence is currently limited.",
                next_step="Ship one focused project improvement each week with clear commit history and documentation.",
            )
        )

    if not leetcode_data:
        actions.append(
            ReadinessAction(
                priority="medium",
                category="Problem solving",
                title="Connect a coding-practice profile",
                reason="No problem-solving evidence is available for technical shortlisting.",
                next_step="Add your LeetCode username and analyze the profile again.",
            )
        )
    elif coding_score < 60:
        actions.append(
            ReadinessAction(
                priority="medium",
                category="Problem solving",
                title="Build medium-difficulty consistency",
                reason=f"Your coding evidence score is {coding_score:.1f}/100.",
                next_step="Complete a small weekly set of medium problems and join at least one contest per month.",
            )
        )

    if not academic_verified:
        actions.append(
            ReadinessAction(
                priority="high",
                category="Academics",
                title="Verify academic eligibility",
                reason="Your CGPA is not backed by an analyzed marksheet.",
                next_step="Upload the latest marksheet so TPO eligibility filters can trust the result.",
            )
        )

    if len(skills) < 6:
        actions.append(
            ReadinessAction(
                priority="medium",
                category="Skills",
                title="Add evidence for more role-ready skills",
                reason=f"Only {len(skills)} distinct skills were captured from your profile.",
                next_step="Describe project tech stacks and responsibilities with concrete, verifiable examples.",
            )
        )

    priority_order = {"high": 0, "medium": 1, "low": 2}
    actions.sort(key=lambda action: priority_order[action.priority])
    if not actions:
        actions.append(
            ReadinessAction(
                priority="low",
                category="Profile",
                title="Keep your evidence current",
                reason="Your baseline signals are complete and currently strong.",
                next_step="Refresh your resume and coding profiles after each meaningful project or achievement.",
            )
        )

    return PlacementReadiness(score=score, level=level, actions=actions[:4])
