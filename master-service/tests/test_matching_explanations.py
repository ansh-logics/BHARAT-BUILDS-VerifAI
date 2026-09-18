from __future__ import annotations

import unittest

from app.schemas.student import JDParsedConstraints
from app.services.matching_service import build_skill_explanation


class MatchingExplanationTests(unittest.TestCase):
    def test_aliases_and_skill_families_produce_consistent_evidence(self) -> None:
        constraints = JDParsedConstraints(
            required_skills=["Node.js", "web development", "PostgreSQL"],
            preferred_skills=["Docker", "AWS"],
            tools_and_technologies=["Git"],
        )

        matched, missing_required, missing_preferred = build_skill_explanation(
            ["nodejs", "React", "Postgres", "Docker"],
            constraints,
        )

        self.assertEqual(matched, ["nodejs", "web development", "postgresql", "docker"])
        self.assertEqual(missing_required, [])
        self.assertEqual(missing_preferred, ["aws", "git"])

    def test_missing_required_skills_remain_visible(self) -> None:
        constraints = JDParsedConstraints(
            required_skills=["Python", "FastAPI", "Redis"],
            preferred_skills=[],
            tools_and_technologies=[],
        )

        matched, missing_required, missing_preferred = build_skill_explanation(
            ["Python"],
            constraints,
        )

        self.assertEqual(matched, ["python"])
        self.assertEqual(missing_required, ["fastapi", "redis"])
        self.assertEqual(missing_preferred, [])


if __name__ == "__main__":
    unittest.main()
