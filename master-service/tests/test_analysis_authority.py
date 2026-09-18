from __future__ import annotations

import unittest

from app.schemas.student import StudentProfileCreate


def _payload(*, entered_cgpa: float | None, analyzed_cgpa: float | None) -> dict:
    return {
        "student": {
            "name": "Candidate",
            "email": "candidate@example.com",
            "roll_no": "2302301530010",
            "phone": "9999999999",
            "branch": "CSE",
            "cgpa": entered_cgpa,
            "gender": "other",
            "cgpa_verified": False,
        },
        "academics": {
            "cgpa": analyzed_cgpa,
            "verified": analyzed_cgpa is not None,
            "score": 70,
        },
    }


class AnalysisAuthorityTests(unittest.TestCase):
    def test_analyzed_cgpa_replaces_entered_cgpa(self) -> None:
        profile = StudentProfileCreate.model_validate(
            _payload(entered_cgpa=8.9, analyzed_cgpa=6.1)
        )

        self.assertEqual(profile.student.cgpa, 6.1)
        self.assertTrue(profile.student.cgpa_verified)

    def test_entered_cgpa_is_retained_when_analysis_has_no_cgpa(self) -> None:
        profile = StudentProfileCreate.model_validate(
            _payload(entered_cgpa=8.9, analyzed_cgpa=None)
        )

        self.assertEqual(profile.student.cgpa, 8.9)
        self.assertFalse(profile.student.cgpa_verified)


if __name__ == "__main__":
    unittest.main()
