from __future__ import annotations

import unittest

from core_engine.scoring import score_resume_jd_match


class ResumeJDScoringTests(unittest.TestCase):
    def test_web_capability_matches_concrete_web_stack(self) -> None:
        score, breakdown = score_resume_jd_match(
            {"skills": ["React", "Next.js", "Node.js", "TypeScript"]},
            {"required_skills": ["web development"]},
        )

        self.assertEqual(score, 40)
        self.assertEqual(breakdown["matched_skills"], ["web development"])
        self.assertEqual(
            breakdown["match_evidence"]["web development"],
            ["nextjs", "nodejs", "react", "typescript"],
        )

    def test_specific_framework_does_not_match_unrelated_framework(self) -> None:
        score, breakdown = score_resume_jd_match(
            {"skills": ["Angular", "Java"]},
            {"required_skills": ["React"]},
        )

        self.assertEqual(score, 0)
        self.assertEqual(breakdown["matched_skills"], [])

    def test_aliases_are_canonicalized_before_exact_matching(self) -> None:
        score, breakdown = score_resume_jd_match(
            {"skills": ["Node.js", "Postgres"]},
            {"required_skills": ["nodejs", "PostgreSQL"]},
        )

        self.assertEqual(score, 40)
        self.assertEqual(breakdown["matched_skills"], ["nodejs", "postgresql"])


if __name__ == "__main__":
    unittest.main()
