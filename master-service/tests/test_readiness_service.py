from __future__ import annotations

import unittest

from app.services.readiness_service import build_placement_readiness


class ReadinessServiceTests(unittest.TestCase):
    def test_incomplete_profile_returns_prioritized_actions(self) -> None:
        plan = build_placement_readiness(
            overall_score=40,
            coding_score=30,
            academic_score=70,
            academic_verified=False,
            skills=["python", "sql"],
            resume_url=None,
            github_data={},
            leetcode_data={},
        )

        self.assertEqual(plan.score, 43.0)
        self.assertEqual(plan.level, "Starting")
        self.assertEqual(len(plan.actions), 4)
        self.assertTrue(all(action.priority == "high" for action in plan.actions[:3]))
        self.assertEqual(plan.actions[0].category, "Resume")
        self.assertEqual(plan.actions[1].category, "GitHub")
        self.assertEqual(plan.actions[2].category, "Academics")

    def test_strong_complete_profile_gets_maintenance_action(self) -> None:
        plan = build_placement_readiness(
            overall_score=92,
            coding_score=88,
            academic_score=90,
            academic_verified=True,
            skills=["python", "fastapi", "postgresql", "docker", "aws", "git"],
            resume_url="https://api.example.com/resume",
            github_data={"last_30_day_commits": 18},
            leetcode_data={"total_solved": 300},
        )

        self.assertEqual(plan.score, 90.4)
        self.assertEqual(plan.level, "Strong")
        self.assertEqual(len(plan.actions), 1)
        self.assertEqual(plan.actions[0].priority, "low")


if __name__ == "__main__":
    unittest.main()
