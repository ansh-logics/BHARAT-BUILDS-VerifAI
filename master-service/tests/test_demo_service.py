from __future__ import annotations

import unittest

from app.services.demo_service import get_demo_scenario, list_demo_scenarios


class DemoServiceTests(unittest.TestCase):
    def test_only_allowlisted_scenarios_are_available(self) -> None:
        scenarios = list_demo_scenarios()

        self.assertEqual([item["id"] for item in scenarios], ["frontend", "backend", "data"])
        with self.assertRaises(KeyError):
            get_demo_scenario("arbitrary-user-prompt")

    def test_scenario_copy_cannot_mutate_allowlist(self) -> None:
        first = get_demo_scenario("backend")
        first["required_skills"].append("invented")

        second = get_demo_scenario("backend")
        self.assertNotIn("invented", second["required_skills"])
        self.assertTrue(second["exclude_active_backlogs"])
        self.assertEqual(second["placement_filter"], "unplaced_only")


if __name__ == "__main__":
    unittest.main()
