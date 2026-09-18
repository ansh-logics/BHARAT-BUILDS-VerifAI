from __future__ import annotations

import unittest

from app.models.response_model import JDAnalyzeResponse
from app.services.jd_analyzer_service import _apply_text_fallbacks


class JDConstraintFallbackTests(unittest.TestCase):
    def test_extracts_target_cgpa_backlog_and_placement_from_text(self) -> None:
        jd_text = "I need 5 students with no backlogs and 6 cgpa. include placed students if eligible."
        payload = JDAnalyzeResponse()

        normalized = _apply_text_fallbacks(jd_text=jd_text, payload=payload)

        self.assertEqual(normalized.target_student_count, 5)
        self.assertEqual(normalized.min_cgpa, 6.0)
        self.assertTrue(normalized.exclude_active_backlogs)
        self.assertEqual(normalized.placement_filter, "placed_or_unplaced")

    def test_unplaced_only_phrase_takes_unplaced_filter(self) -> None:
        jd_text = "Find 10 candidates, unplaced only, no active backlog, minimum 7 cgpa."
        payload = JDAnalyzeResponse()

        normalized = _apply_text_fallbacks(jd_text=jd_text, payload=payload)

        self.assertEqual(normalized.target_student_count, 10)
        self.assertEqual(normalized.min_cgpa, 7.0)
        self.assertTrue(normalized.exclude_active_backlogs)
    def test_cgpa_range_and_webdev_expansion(self) -> None:
        jd_text = "Find 5 students with 5-7 cgpa not more then or less then this also they should have the speciality in webdev"
        payload = JDAnalyzeResponse()

        normalized = _apply_text_fallbacks(jd_text=jd_text, payload=payload)

        self.assertEqual(normalized.target_student_count, 5)
        self.assertEqual(normalized.min_cgpa, 5.0)
        self.assertEqual(normalized.max_cgpa, 7.0)
        self.assertIn("html", normalized.required_skills)
        self.assertIn("react", normalized.required_skills)
        self.assertGreater(len(normalized.clarification_questions), 0)

    def test_between_cgpa_and_aiml_expansion(self) -> None:
        jd_text = "can you find 5 students between cgpa of 5 and 7 with AIML skills"
        payload = JDAnalyzeResponse()

        normalized = _apply_text_fallbacks(jd_text=jd_text, payload=payload)

        self.assertEqual(normalized.target_student_count, 5)
        self.assertEqual(normalized.min_cgpa, 5.0)
        self.assertEqual(normalized.max_cgpa, 7.0)
        self.assertIn("machine learning", normalized.required_skills)
        self.assertIn("python", normalized.required_skills)
        self.assertGreater(len(normalized.clarification_questions), 0)


if __name__ == "__main__":
    unittest.main()
