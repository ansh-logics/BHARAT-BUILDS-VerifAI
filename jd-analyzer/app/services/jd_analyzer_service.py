from __future__ import annotations

import asyncio
import json
import re
from typing import Any, cast

from groq import Groq

from app.config import Settings
from app.models.response_model import GenderFilter, JDAnalyzeResponse


SYSTEM_PROMPT = """You are a Job Description and TPO Query parser for a placement intelligence system.

Your ONLY job is to extract structured information from combined input text and return STRICT valid JSON.
The input may contain:
1) Formal job descriptions (roles, requirements, responsibilities, packages, bonds)
2) Informal TPO candidate search queries (e.g. "find 5 students with 5-7 cgpa not more then or less then this also they should have the speciality in webdev" or "can you find 5 students between cgpa of 5 and 7 with AIML skills")

RULES:
- Output ONLY a JSON object. No explanation, no markdown, no code fences, no extra text.
- If a field cannot be determined, use null for strings/numbers and [] for arrays.
- For accepts_freshers: true if 0 years experience required OR "freshers welcome" is mentioned.
- For min_experience_years: extract the MINIMUM number only (e.g. "2-5 years" → 2). If fresher/entry level, use 0.
- For required_skills: only hard requirements explicitly stated or implied by domain keywords.
- For preferred_skills: "good to have", "plus", "bonus", or "preferred" skills.
- For key_traits: soft skills and personality traits (e.g. "team player", "self-starter").
- For role_type: one of → "full_time" | "internship" | "contract" | "part_time" | "unknown"

CRITICAL — STRICT CGPA RANGE EXTRACTION:
You MUST extract BOTH min_cgpa and max_cgpa whenever a range, window, or boundary is stated.
- "5-7 cgpa", "5 to 7 cgpa", "5 - 7 cgpa" → min_cgpa: 5, max_cgpa: 7
- "between cgpa of 5 and 7", "between 5 and 7 cgpa", "cgpa between 5 and 7" → min_cgpa: 5, max_cgpa: 7
- "5-7 cgpa not more then or less then this" → min_cgpa: 5, max_cgpa: 7
- "strictly between 6 and 8" → min_cgpa: 6, max_cgpa: 8
- "above 7", "min 6.5", "at least 7 cgpa" → min_cgpa: 7, max_cgpa: null
- "below 8", "under 7.5", "not more than 7 cgpa" → min_cgpa: null, max_cgpa: 8
- "not more than or less than" a range → extract lower bound into min_cgpa and upper bound into max_cgpa.

CRITICAL — DOMAIN KEYWORD EXPANSION:
When a candidate domain or specialty is stated instead of individual tools, expand it into canonical required_skills:
- "webdev", "web development", "web dev", "web developer" → add ["html", "css", "javascript", "react"] to required_skills, domain="web development"
- "fullstack", "full stack" → add ["html", "css", "javascript", "react", "node.js"] to required_skills, domain="fullstack"
- "frontend", "front end" → add ["html", "css", "javascript", "react"] to required_skills, domain="frontend"
- "backend", "back end" → add ["node.js", "sql", "rest api"] to required_skills, domain="backend"
- "aiml", "ai ml", "ai/ml", "artificial intelligence", "machine learning", "ml" → add ["python", "machine learning", "tensorflow", "numpy"] to required_skills, domain="machine learning"
- "data science", "data analyst" → add ["python", "sql", "statistics", "pandas"] to required_skills, domain="data science"
- "android", "android developer" → add ["android", "kotlin", "java"] to required_skills, domain="android"
- "ios", "ios developer" → add ["swift", "ios"] to required_skills, domain="ios"
- "embedded", "embedded systems" → add ["c", "embedded c", "rtos", "microcontrollers"] to required_skills, domain="embedded systems"
- "cloud", "devops" → add ["aws", "docker", "kubernetes", "ci/cd"] to required_skills, domain="devops"

CRITICAL — TPO CONSTRAINTS:
- target_student_count: numeric count requested (e.g. "find 5 students", "need 10 candidates" → 5 or 10)
- exclude_active_backlogs: true for "no backlogs", "without backlog", "no active backlog"
- placement_filter: "unplaced_only" if user specifies unplaced/not placed students; else "placed_or_unplaced"
- allowed_branches: list of branches if explicitly requested (e.g. ["cse"], ["ece", "eee"])
- Branch family inference: "CSE related" → allowed_branches: ["cse", "it", "aiml", "ds"]

CRITICAL — CLARIFICATION QUESTIONS:
If the user query is brief, underspecified, or leaves key criteria unstated:
Generate 1-3 intelligent, concise clarification questions in "clarification_questions" to help narrow down the search.
Examples:
- If no branch specified: "Would you like to restrict to specific branches (e.g. CSE, IT, AIML) or include all branches?"
- If backlog policy not mentioned: "Should students with active backlogs be excluded?"
- If placement status not mentioned: "Are you looking for unplaced students only or placed as well?"
If everything is clear and comprehensive, return [].
"""

USER_PROMPT = """Parse the following combined input (Job Description + optional TPO query) and return ONLY a JSON object.

---
EXAMPLES (study these carefully before parsing):

Input: "Find 5 students with CGPA between 5 and 7 who have webdev skills"
Output: {{"target_student_count": 5, "min_cgpa": 5, "max_cgpa": 7, "required_skills": ["html", "css", "javascript", "react"], "preferred_skills": [], "tools_and_technologies": [], "responsibilities": [], "key_traits": [], "role_type": "unknown", "jd_summary": "Looking for 5 students with CGPA between 5 and 7 specializing in web development.", "company_name": null, "pay_or_stipend": null, "bond_details": null, "job_title": null, "min_experience_years": null, "accepts_freshers": true, "education_requirements": [], "location": null, "domain": "web development", "duration": null, "work_type": null, "exclude_active_backlogs": false, "placement_filter": "placed_or_unplaced", "placement_exception_roll_nos": [], "allowed_branches": [], "gender_filter": "all_genders", "gender_filter_raw": null, "branch_constraint_raw": null, "branch_inference_reason": null, "clarification_questions": ["Would you like to restrict to specific branches (e.g. CSE, IT)?", "Should students with active backlogs be excluded?"]}}

Input: "find 5 students with 5-7 cgpa not more then or less then this also they should have the speciality in webdev"
Output: {{"target_student_count": 5, "min_cgpa": 5, "max_cgpa": 7, "required_skills": ["html", "css", "javascript", "react"], "preferred_skills": [], "tools_and_technologies": [], "responsibilities": [], "key_traits": [], "role_type": "unknown", "jd_summary": "Strictly filter 5 students with CGPA in the 5-7 range with web development specialization.", "company_name": null, "pay_or_stipend": null, "bond_details": null, "job_title": null, "min_experience_years": null, "accepts_freshers": true, "education_requirements": [], "location": null, "domain": "web development", "duration": null, "work_type": null, "exclude_active_backlogs": false, "placement_filter": "placed_or_unplaced", "placement_exception_roll_nos": [], "allowed_branches": [], "gender_filter": "all_genders", "gender_filter_raw": null, "branch_constraint_raw": null, "branch_inference_reason": null, "clarification_questions": ["Would you like to restrict to specific branches (e.g. CSE, IT)?", "Should students with active backlogs be excluded?"]}}

Input: "can you find 5 students between cgpa of 5 and 7 with AIML skills"
Output: {{"target_student_count": 5, "min_cgpa": 5, "max_cgpa": 7, "required_skills": ["python", "machine learning", "tensorflow", "numpy"], "preferred_skills": [], "tools_and_technologies": [], "responsibilities": [], "key_traits": [], "role_type": "unknown", "jd_summary": "Find 5 students with CGPA between 5 and 7 specializing in AI/ML.", "company_name": null, "pay_or_stipend": null, "bond_details": null, "job_title": null, "min_experience_years": null, "accepts_freshers": true, "education_requirements": [], "location": null, "domain": "machine learning", "duration": null, "work_type": null, "exclude_active_backlogs": false, "placement_filter": "placed_or_unplaced", "placement_exception_roll_nos": [], "allowed_branches": [], "gender_filter": "all_genders", "gender_filter_raw": null, "branch_constraint_raw": null, "branch_inference_reason": null, "clarification_questions": ["Would you like to restrict to specific branches (e.g. AIML, CSE, DS)?", "Should students with active backlogs be excluded?"]}}

Input: "I need 10 unplaced CSE students with min CGPA 7.5 and no active backlogs for a React.js internship"
Output: {{"target_student_count": 10, "min_cgpa": 7.5, "max_cgpa": null, "required_skills": ["react"], "preferred_skills": [], "tools_and_technologies": ["react"], "responsibilities": [], "key_traits": [], "role_type": "internship", "jd_summary": "10 unplaced CSE students, CGPA 7.5+, no backlogs, React.js internship.", "company_name": null, "pay_or_stipend": null, "bond_details": null, "job_title": "Frontend Intern", "min_experience_years": 0, "accepts_freshers": true, "education_requirements": [], "location": null, "domain": "frontend", "duration": null, "work_type": null, "exclude_active_backlogs": true, "placement_filter": "unplaced_only", "placement_exception_roll_nos": [], "allowed_branches": ["cse"], "gender_filter": "all_genders", "gender_filter_raw": null, "branch_constraint_raw": "CSE", "branch_inference_reason": null, "clarification_questions": []}}
---

Now parse this input:

<combined_input>
{jd_text}
</combined_input>

Return exactly this schema (fill every field, never omit any key):
{{
  "company_name": "string | null",
  "pay_or_stipend": "string | null",
  "bond_details": "string | null",
  "jd_summary": "string | null",
  "job_title": "string | null",
  "role_type": "full_time | internship | contract | part_time | unknown",
  "required_skills": ["string"],
  "preferred_skills": ["string"],
  "tools_and_technologies": ["string"],
  "responsibilities": ["string"],
  "min_experience_years": "number | null",
  "accepts_freshers": "boolean",
  "key_traits": ["string"],
  "education_requirements": ["string"],
  "location": "string | null",
  "domain": "string | null",
  "duration": "string | null",
  "work_type": "string | null",
  "target_student_count": "number | null",
  "exclude_active_backlogs": "boolean",
  "placement_filter": "unplaced_only | placed_or_unplaced",
  "placement_exception_roll_nos": ["string"],
  "min_cgpa": "number | null",
  "max_cgpa": "number | null",
  "allowed_branches": ["string"],
  "gender_filter": "women_only | men_only | all_genders | custom_text",
  "gender_filter_raw": "string | null",
  "branch_constraint_raw": "string | null",
  "branch_inference_reason": "string | null",
  "clarification_questions": ["string"]
}}"""



class JDAnalyzerServiceError(Exception):
    """Raised when JD parsing fails."""


SKILL_SYNONYMS: dict[str, str] = {
    "ui & ux design": "ui/ux design",
    "ui and ux design": "ui/ux design",
    "ux/ui design": "ui/ux design",
    "reactjs": "react",
    "react.js": "react",
    "nodejs": "node.js",
    "node js": "node.js",
    "js": "javascript",
}

BRANCH_SYNONYMS: dict[str, str] = {
    "computer science": "cse",
    "computer science and engineering": "cse",
    "cse": "cse",
    "information technology": "it",
    "it": "it",
    "electronics and communication engineering": "ece",
    "ece": "ece",
    "electrical and electronics engineering": "eee",
    "eee": "eee",
    "mechanical engineering": "me",
    "me": "me",
    "civil engineering": "ce",
    "ce": "ce",
    "artificial intelligence and machine learning": "aiml",
    "aiml": "aiml",
    "data science": "ds",
    "ds": "ds",
}

BRANCH_FAMILY_INFERENCE: dict[str, tuple[list[str], str]] = {
    "cse related": (["cse", "it", "aiml", "ds"], "Mapped CSE-related family to core CS branches."),
    "cse-related": (["cse", "it", "aiml", "ds"], "Mapped CSE-related family to core CS branches."),
    "computer science related": (["cse", "it", "aiml", "ds"], "Mapped Computer Science related family to core CS branches."),
    "computer-science related": (["cse", "it", "aiml", "ds"], "Mapped Computer Science related family to core CS branches."),
}

GENDER_MAP: dict[str, str] = {
    "only girls": "women_only",
    "girls only": "women_only",
    "female only": "women_only",
    "women only": "women_only",
    "for women": "women_only",
    "only boys": "men_only",
    "boys only": "men_only",
    "male only": "men_only",
    "men only": "men_only",
    "for men": "men_only",
    "any gender": "all_genders",
    "mixed gender": "all_genders",
    "all genders": "all_genders",
}

TARGET_COUNT_PATTERNS = (
    re.compile(r"\b(?:need|find|give|require|looking\s*for)\s+(\d{1,4})\s+(?:students?|candidates?)\b", re.IGNORECASE),
    re.compile(r"\b(\d{1,4})\s+(?:students?|candidates?)\s+(?:needed|required)\b", re.IGNORECASE),
)

# Patterns for CGPA ranges: "5-7 cgpa", "5 to 7 cgpa", "between cgpa of 5 and 7", "between 5 and 7 cgpa", "cgpa between 5 and 7", "cgpa of 5 to 7"
CGPA_RANGE_PATTERNS = (
    # "5-7 cgpa", "5 to 7 cgpa", "5 - 7 cgpa"
    re.compile(r"\b(\d(?:\.\d+)?)\s*(?:[-–]|to)\s*(\d(?:\.\d+)?)\s*cgpa\b", re.IGNORECASE),
    # "between cgpa of 5 and 7", "between cgpa 5 and 7", "between 5 and 7 cgpa", "between 5 to 7 cgpa"
    re.compile(r"\bbetween\s+(?:cgpa\s+(?:of\s+)?)?(\d(?:\.\d+)?)\s+(?:and|to|-)\s+(\d(?:\.\d+)?)(?:\s*cgpa)?\b", re.IGNORECASE),
    # "cgpa between 5 and 7", "cgpa of 5 to 7", "cgpa from 5 to 7", "cgpa in 5-7"
    re.compile(r"\bcgpa\s+(?:between|from|in|of)\s+(\d(?:\.\d+)?)\s+(?:and|to|-)\s+(\d(?:\.\d+)?)\b", re.IGNORECASE),
    # "from 5 to 7 cgpa"
    re.compile(r"\bfrom\s+(\d(?:\.\d+)?)\s+(?:to|-)\s+(\d(?:\.\d+)?)\s*cgpa\b", re.IGNORECASE),
)
# Pattern: "min cgpa 6", "cgpa >= 7", "cgpa above 5"
CGPA_MIN_PATTERNS = (
    re.compile(r"\bcgpa\s*(?:>=|>|at\s*least|min(?:imum)?\s*)[\s:]*(\d(?:\.\d+)?)\b", re.IGNORECASE),
    re.compile(r"\b(?:min(?:imum)?\s*)?(\d(?:\.\d+)?)\s*cgpa\b", re.IGNORECASE),
    re.compile(r"\bcgpa\s+(?:of\s+)?(?:at\s+least|minimum|min)\s+(\d(?:\.\d+)?)\b", re.IGNORECASE),
    re.compile(r"\bnot\s+less\s+than\s+(\d(?:\.\d+)?)\s*cgpa\b", re.IGNORECASE),
)
# Pattern: "max cgpa 7", "cgpa <= 7", "cgpa below 7", "not more than 7 cgpa"
CGPA_MAX_PATTERNS = (
    re.compile(r"\bcgpa\s*(?:<=|<|at\s*most|max(?:imum)?\s*)[\s:]*(\d(?:\.\d+)?)\b", re.IGNORECASE),
    re.compile(r"\bnot\s+more\s+than\s+(\d(?:\.\d+)?)\s*cgpa\b", re.IGNORECASE),
    re.compile(r"\bcgpa\s+(?:below|under|at\s+most|max(?:imum)?)\s+(\d(?:\.\d+)?)\b", re.IGNORECASE),
    re.compile(r"\bmax(?:imum)?\s*cgpa\s+(?:of\s+)?(\d(?:\.\d+)?)\b", re.IGNORECASE),
)

# Domain keyword → canonical skill expansion (applied post-LLM as a safety net)
DOMAIN_SKILL_EXPANSION: dict[str, list[str]] = {
    "webdev": ["html", "css", "javascript", "react"],
    "web development": ["html", "css", "javascript", "react"],
    "web developer": ["html", "css", "javascript", "react"],
    "web dev": ["html", "css", "javascript", "react"],
    "fullstack": ["html", "css", "javascript", "react", "node.js"],
    "full stack": ["html", "css", "javascript", "react", "node.js"],
    "full-stack": ["html", "css", "javascript", "react", "node.js"],
    "full stack developer": ["html", "css", "javascript", "react", "node.js"],
    "frontend": ["html", "css", "javascript", "react"],
    "front end": ["html", "css", "javascript", "react"],
    "front-end": ["html", "css", "javascript", "react"],
    "backend": ["node.js", "sql", "rest api"],
    "back end": ["node.js", "sql", "rest api"],
    "back-end": ["node.js", "sql", "rest api"],
    "machine learning": ["python", "machine learning", "tensorflow", "numpy"],
    "ml": ["python", "machine learning", "tensorflow", "numpy"],
    "aiml": ["python", "machine learning", "tensorflow", "numpy"],
    "ai ml": ["python", "machine learning", "tensorflow", "numpy"],
    "ai/ml": ["python", "machine learning", "tensorflow", "numpy"],
    "ai-ml": ["python", "machine learning", "tensorflow", "numpy"],
    "artificial intelligence": ["python", "machine learning", "tensorflow", "numpy"],
    "data science": ["python", "sql", "statistics", "pandas"],
    "data analyst": ["python", "sql", "statistics", "pandas"],

    "android": ["android", "kotlin", "java"],
    "android developer": ["android", "kotlin", "java"],
    "ios": ["swift", "ios"],
    "ios developer": ["swift", "ios"],
    "embedded": ["c", "embedded c", "rtos", "microcontrollers"],
    "embedded systems": ["c", "embedded c", "rtos", "microcontrollers"],
    "devops": ["docker", "kubernetes", "aws", "ci/cd"],
    "cloud": ["aws", "docker", "kubernetes"],
}


def _normalize_token(value: str) -> str:
    normalized = " ".join(value.strip().lower().split())
    return SKILL_SYNONYMS.get(normalized, normalized)


def _to_string_list(value: Any, *, canonical: bool = False) -> list[str]:
    if not isinstance(value, list):
        return []
    out: list[str] = []
    seen: set[str] = set()
    for item in value:
        if not isinstance(item, str):
            continue
        cleaned = item.strip()
        normalized = _normalize_token(cleaned) if canonical else cleaned
        dedupe_key = normalized.lower()
        if not normalized or dedupe_key in seen:
            continue
        seen.add(dedupe_key)
        out.append(normalized)
    return out


def _normalize_nullable_string(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    cleaned = value.strip()
    return cleaned if cleaned else None


def _normalize_roll_numbers(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    out: list[str] = []
    seen: set[str] = set()
    for item in value:
        if not isinstance(item, str):
            continue
        normalized = "".join(item.strip().upper().split())
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        out.append(normalized)
    return out


def _normalize_branches(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    out: list[str] = []
    seen: set[str] = set()
    for item in value:
        if not isinstance(item, str):
            continue
        raw = " ".join(item.strip().lower().split())
        normalized = BRANCH_SYNONYMS.get(raw, raw)
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        out.append(normalized)
    return out


def _normalize_branch_phrase(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    cleaned = " ".join(value.strip().lower().split())
    return cleaned if cleaned else None


def _apply_branch_inference(
    allowed_branches: list[str],
    branch_constraint_raw: str | None,
) -> tuple[list[str], str | None]:
    if not branch_constraint_raw:
        return allowed_branches, None
    inferred = BRANCH_FAMILY_INFERENCE.get(branch_constraint_raw)
    if not inferred:
        return allowed_branches, None
    inferred_branches, reason = inferred
    merged: list[str] = []
    seen: set[str] = set()
    for branch in [*allowed_branches, *inferred_branches]:
        if branch in seen:
            continue
        seen.add(branch)
        merged.append(branch)
    return merged, reason


def _normalize_gender_filter(value: Any, raw_phrase: Any) -> tuple[str, str | None]:
    filter_value = value if isinstance(value, str) else ""
    filter_clean = " ".join(filter_value.strip().lower().split())
    raw_clean = _normalize_nullable_string(raw_phrase)
    if filter_clean in {"women_only", "men_only", "all_genders", "custom_text"}:
        if filter_clean == "custom_text":
            return "custom_text", raw_clean
        return filter_clean, raw_clean if raw_clean else None

    if raw_clean:
        raw_lower = " ".join(raw_clean.lower().split())
        mapped = GENDER_MAP.get(raw_lower)
        if mapped:
            return mapped, raw_clean
        return "custom_text", raw_clean

    return "all_genders", None


def _extract_target_student_count_from_text(jd_text: str) -> int | None:
    for pattern in TARGET_COUNT_PATTERNS:
        match = pattern.search(jd_text)
        if match:
            try:
                value = int(match.group(1))
            except ValueError:
                continue
            if value > 0:
                return value
    return None


def _extract_cgpa_range_from_text(jd_text: str) -> tuple[float | None, float | None]:
    """Extract (min_cgpa, max_cgpa) from range expressions like '5-7 cgpa', 'between cgpa of 5 and 7'."""
    for pattern in CGPA_RANGE_PATTERNS:
        match = pattern.search(jd_text)
        if match:
            groups = [g for g in match.groups() if g is not None]
            if len(groups) >= 2:
                try:
                    lo, hi = float(groups[0]), float(groups[1])
                    if 0 <= lo <= 10 and 0 <= hi <= 10:
                        return (min(lo, hi), max(lo, hi))
                except ValueError:
                    continue
    return None, None


def _extract_min_cgpa_from_text(jd_text: str) -> float | None:
    for pattern in CGPA_MIN_PATTERNS:
        match = pattern.search(jd_text)
        if match:
            try:
                value = float(match.group(1))
            except ValueError:
                continue
            if 0 <= value <= 10:
                return value
    return None


def _extract_max_cgpa_from_text(jd_text: str) -> float | None:
    for pattern in CGPA_MAX_PATTERNS:
        match = pattern.search(jd_text)
        if match:
            try:
                value = float(match.group(1))
            except ValueError:
                continue
            if 0 <= value <= 10:
                return value
    return None


def _expand_domain_skills(required_skills: list[str], jd_text: str) -> list[str]:
    """If a domain keyword appears in the text or existing skills, expand it into canonical skills."""
    seen = {s.lower() for s in required_skills}
    expanded = list(required_skills)
    text_lower = jd_text.lower()
    for domain_kw, skill_list in DOMAIN_SKILL_EXPANSION.items():
        if domain_kw in text_lower or domain_kw in seen:
            for skill in skill_list:
                if skill not in seen:
                    seen.add(skill)
                    expanded.append(skill)
    return expanded


def _extract_backlog_policy_from_text(jd_text: str) -> bool | None:
    lowered = jd_text.lower()
    deny_terms = (
        "no backlog",
        "no backlogs",
        "without backlog",
        "without backlogs",
        "no active backlog",
        "exclude backlog",
        "exclude backlogs",
    )
    if any(term in lowered for term in deny_terms):
        return True
    allow_terms = ("backlog allowed", "backlogs allowed")
    if any(term in lowered for term in allow_terms):
        return False
    return None


def _extract_placement_filter_from_text(jd_text: str) -> str | None:
    lowered = jd_text.lower()
    unplaced_terms = ("unplaced only", "not placed only", "only unplaced")
    if any(term in lowered for term in unplaced_terms):
        return "unplaced_only"
    include_placed_terms = (
        "include placed",
        "placed students allowed",
        "include placed students",
        "placed if eligible",
    )
    if any(term in lowered for term in include_placed_terms):
        return "placed_or_unplaced"
    return None


def _generate_fallback_clarifications(payload: JDAnalyzeResponse, jd_text: str) -> list[str]:
    questions: list[str] = []
    lowered = jd_text.lower()
    if not payload.allowed_branches and not any(b in lowered for b in ("all branch", "any branch", "every branch", "all branches")):
        questions.append("Would you like to restrict candidates to specific branches (e.g. CSE, IT, AIML)?")
    if not payload.exclude_active_backlogs and not any(b in lowered for b in ("backlog", "backlogs", "kt", "kts", "arrear")):
        questions.append("Should students with active backlogs be excluded from results?")
    if payload.placement_filter == "placed_or_unplaced" and not any(p in lowered for p in ("placed", "unplaced")):
        questions.append("Are you looking for unplaced students only or placed as well?")
    seen = set()
    deduped = []
    for q in questions:
        if q not in seen:
            seen.add(q)
            deduped.append(q)
    return deduped[:3]


def _apply_text_fallbacks(*, jd_text: str, payload: JDAnalyzeResponse) -> JDAnalyzeResponse:
    updates: dict[str, Any] = {}
    if payload.target_student_count is None:
        inferred_count = _extract_target_student_count_from_text(jd_text)
        if inferred_count is not None:
            updates["target_student_count"] = inferred_count

    # CGPA: try range extraction first, then individual min/max
    range_min, range_max = _extract_cgpa_range_from_text(jd_text)
    if range_min is not None and payload.min_cgpa is None:
        updates["min_cgpa"] = range_min
    if range_max is not None and payload.max_cgpa is None:
        updates["max_cgpa"] = range_max

    # Fallback: individual min/max if range didn't fire
    if range_min is None and payload.min_cgpa is None:
        inferred_min = _extract_min_cgpa_from_text(jd_text)
        if inferred_min is not None:
            updates["min_cgpa"] = inferred_min
    if range_max is None and payload.max_cgpa is None:
        inferred_max = _extract_max_cgpa_from_text(jd_text)
        if inferred_max is not None:
            updates["max_cgpa"] = inferred_max

    backlog_policy = _extract_backlog_policy_from_text(jd_text)
    if backlog_policy is not None:
        updates["exclude_active_backlogs"] = backlog_policy

    placement_filter = _extract_placement_filter_from_text(jd_text)
    if placement_filter is not None:
        updates["placement_filter"] = placement_filter

    # Domain skill expansion: apply after LLM as a deterministic safety net
    current_skills = list(updates.get("required_skills", payload.required_skills))
    expanded = _expand_domain_skills(current_skills, jd_text)
    if expanded != current_skills:
        updates["required_skills"] = expanded

    # Clarification questions fallback
    clarifications = list(payload.clarification_questions)
    if not clarifications:
        clarifications = _generate_fallback_clarifications(payload, jd_text)
    if clarifications != payload.clarification_questions:
        updates["clarification_questions"] = clarifications

    if not updates:
        return payload
    return payload.model_copy(update=updates)



def _to_number(value: Any) -> float | None:
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        try:
            return float(value.strip())
        except ValueError:
            return None
    return None


def _normalize_output(raw: dict[str, Any]) -> JDAnalyzeResponse:
    role_type = raw.get("role_type")
    if role_type not in {"full_time", "internship", "contract", "part_time", "unknown"}:
        role_type = "unknown"

    min_exp = _to_number(raw.get("min_experience_years"))

    accepts_freshers = bool(raw.get("accepts_freshers", False))
    if isinstance(min_exp, (int, float)) and float(min_exp) <= 0:
        accepts_freshers = True

    placement_filter = raw.get("placement_filter")
    if placement_filter not in {"unplaced_only", "placed_or_unplaced"}:
        placement_filter = "placed_or_unplaced"

    target_student_count = _to_number(raw.get("target_student_count"))
    if target_student_count is not None and target_student_count <= 0:
        target_student_count = None

    min_cgpa = _to_number(raw.get("min_cgpa"))
    if min_cgpa is not None and (min_cgpa < 0 or min_cgpa > 10):
        min_cgpa = None

    max_cgpa = _to_number(raw.get("max_cgpa"))
    if max_cgpa is not None and (max_cgpa < 0 or max_cgpa > 10):
        max_cgpa = None

    branch_constraint_raw = _normalize_branch_phrase(raw.get("branch_constraint_raw"))
    allowed_branches = _normalize_branches(raw.get("allowed_branches"))
    allowed_branches, branch_inference_reason = _apply_branch_inference(
        allowed_branches=allowed_branches,
        branch_constraint_raw=branch_constraint_raw,
    )

    gender_filter, gender_filter_raw = _normalize_gender_filter(
        raw.get("gender_filter"),
        raw.get("gender_filter_raw"),
    )

    return JDAnalyzeResponse(
        company_name=_normalize_nullable_string(raw.get("company_name")),
        pay_or_stipend=_normalize_nullable_string(raw.get("pay_or_stipend") or raw.get("stipend") or raw.get("salary") or raw.get("ctc")),
        bond_details=_normalize_nullable_string(raw.get("bond_details") or raw.get("bond") or raw.get("service_agreement")),
        jd_summary=_normalize_nullable_string(raw.get("jd_summary") or raw.get("summary")),
        job_title=_normalize_nullable_string(raw.get("job_title")),
        role_type=role_type,
        required_skills=_to_string_list(raw.get("required_skills"), canonical=True),
        preferred_skills=_to_string_list(raw.get("preferred_skills"), canonical=True),
        tools_and_technologies=_to_string_list(raw.get("tools_and_technologies"), canonical=True),
        responsibilities=_to_string_list(raw.get("responsibilities")),
        min_experience_years=min_exp,
        accepts_freshers=accepts_freshers,
        key_traits=_to_string_list(raw.get("key_traits"), canonical=True),
        education_requirements=_to_string_list(raw.get("education_requirements")),
        location=_normalize_nullable_string(raw.get("location")),
        domain=_normalize_nullable_string(raw.get("domain")),
        duration=_normalize_nullable_string(raw.get("duration")),
        work_type=_normalize_nullable_string(raw.get("work_type")),
        target_student_count=int(target_student_count) if target_student_count is not None else None,
        exclude_active_backlogs=bool(raw.get("exclude_active_backlogs", False)),
        placement_filter=placement_filter,
        placement_exception_roll_nos=_normalize_roll_numbers(raw.get("placement_exception_roll_nos")),
        min_cgpa=min_cgpa,
        max_cgpa=max_cgpa,
        allowed_branches=allowed_branches,
        gender_filter=cast(GenderFilter, gender_filter),
        gender_filter_raw=gender_filter_raw,
        branch_constraint_raw=branch_constraint_raw,
        branch_inference_reason=branch_inference_reason,
        clarification_questions=_to_string_list(raw.get("clarification_questions")),
    )


class JDAnalyzerService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._client = Groq(api_key=settings.groq_api_key)

    async def parse_jd(self, jd_text: str) -> JDAnalyzeResponse:
        content = USER_PROMPT.format(jd_text=jd_text.strip())

        def _request() -> str:
            response = self._client.chat.completions.create(
                model=self._settings.groq_model,
                temperature=0,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": content},
                ],
            )
            raw_content = response.choices[0].message.content
            if not raw_content or not raw_content.strip():
                raise JDAnalyzerServiceError("Groq returned empty content.")
            return raw_content

        try:
            raw = await asyncio.wait_for(
                asyncio.to_thread(_request),
                timeout=self._settings.request_timeout_seconds,
            )
        except TimeoutError as exc:
            raise JDAnalyzerServiceError("JD parsing request timed out.") from exc
        except JDAnalyzerServiceError:
            raise
        except Exception as exc:
            raise JDAnalyzerServiceError(f"Groq request failed: {exc}") from exc

        clean = raw.strip().removeprefix("```json").removesuffix("```").strip()
        try:
            payload = json.loads(clean)
        except json.JSONDecodeError as exc:
            raise JDAnalyzerServiceError("Model returned non-JSON output.") from exc

        if not isinstance(payload, dict):
            raise JDAnalyzerServiceError("Model output is not a JSON object.")

        normalized = _normalize_output(payload)
        return _apply_text_fallbacks(jd_text=jd_text, payload=normalized)
