from __future__ import annotations

from copy import deepcopy
from typing import Any


DEMO_SCENARIOS: dict[str, dict[str, Any]] = {
    "frontend": {
        "company_name": "Demo Web Labs",
        "job_title": "Frontend Engineering Intern",
        "role_type": "internship",
        "jd_summary": "Build accessible React interfaces for a fast-moving product team.",
        "required_skills": ["react", "javascript", "html", "css"],
        "preferred_skills": ["typescript", "nextjs", "git"],
        "tools_and_technologies": ["figma"],
        "responsibilities": ["Build reusable UI components", "Collaborate through code review"],
        "accepts_freshers": True,
        "min_cgpa": 7.0,
        "allowed_branches": ["CSE", "IT", "AIML", "DS"],
        "exclude_active_backlogs": True,
        "placement_filter": "unplaced_only",
        "target_student_count": 8,
    },
    "backend": {
        "company_name": "Demo Cloud Systems",
        "job_title": "Backend Engineer",
        "role_type": "full_time",
        "jd_summary": "Develop reliable APIs and data services for a cloud platform.",
        "required_skills": ["python", "fastapi", "postgresql", "rest api"],
        "preferred_skills": ["docker", "redis", "aws", "git"],
        "tools_and_technologies": ["linux"],
        "responsibilities": ["Design APIs", "Own database-backed services"],
        "accepts_freshers": True,
        "min_cgpa": 7.0,
        "allowed_branches": ["CSE", "IT", "AIML", "DS"],
        "exclude_active_backlogs": True,
        "placement_filter": "unplaced_only",
        "target_student_count": 8,
    },
    "data": {
        "company_name": "Demo Insight Analytics",
        "job_title": "Data Analyst Intern",
        "role_type": "internship",
        "jd_summary": "Turn operational datasets into clear decisions and dashboards.",
        "required_skills": ["python", "sql", "data analysis", "statistics"],
        "preferred_skills": ["pandas", "power bi", "excel", "communication"],
        "tools_and_technologies": ["git"],
        "responsibilities": ["Analyze datasets", "Present actionable findings"],
        "accepts_freshers": True,
        "min_cgpa": 7.0,
        "allowed_branches": ["CSE", "IT", "AIML", "DS"],
        "exclude_active_backlogs": True,
        "placement_filter": "unplaced_only",
        "target_student_count": 8,
    },
}


def get_demo_scenario(name: str) -> dict[str, Any]:
    scenario = DEMO_SCENARIOS.get(name.strip().lower())
    if scenario is None:
        raise KeyError(name)
    return deepcopy(scenario)


def list_demo_scenarios() -> list[dict[str, str]]:
    return [
        {
            "id": scenario_id,
            "job_title": str(payload["job_title"]),
            "summary": str(payload["jd_summary"]),
        }
        for scenario_id, payload in DEMO_SCENARIOS.items()
    ]
