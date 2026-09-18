from __future__ import annotations

import unittest
from types import SimpleNamespace
from unittest.mock import MagicMock

from app.schemas.student import StudentProfileCreate
from app.services.profile_service import ProfileService


class SourceScopedProfileUpdateTests(unittest.TestCase):
    def test_resume_update_preserves_verified_academics_and_coding(self) -> None:
        student = SimpleNamespace(
            id=7,
            name="Ansh Bhatt",
            email="ansh@example.com",
            password_hash="hashed",
            phone="9999999999",
            branch="CSE",
            roll_no="2302301530010",
            cgpa=8.4,
            cgpa_verified=True,
            gender="other",
        )
        profile = SimpleNamespace(
            id=11,
            github_username="trusted-gh",
            leetcode_username="trusted-lc",
            skills=["python"],
            skills_json=["python"],
            coding_persona="Strong",
            coding_score=82.0,
            academic_score=84.0,
            overall_score=80.0,
            github_data={"username": "trusted-gh", "repos": 20},
            leetcode_data={"username": "trusted-lc", "total_solved": 300},
            resume_data={"file_name": "old.pdf", "skills": ["python"]},
            academic_data={"file_name": "marksheet.pdf", "cgpa_computed": 8.4},
            last_analyzed_at=None,
        )
        payload = StudentProfileCreate.model_validate(
            {
                "student": {
                    "name": student.name,
                    "email": student.email,
                    "roll_no": student.roll_no,
                    "phone": student.phone,
                    "branch": student.branch,
                    "cgpa": 4.0,
                    "gender": "other",
                    "cgpa_verified": False,
                },
                "skills": ["python", "fastapi"],
                "coding": {
                    "persona": "tampered",
                    "score": 1,
                    "github": {"username": "tampered"},
                    "leetcode": {"username": "tampered"},
                },
                "academics": {"cgpa": 4.0, "verified": False, "score": 40},
                "overall_score": 75,
                "resume_url": "https://api.example/storage/resumes/new?sig=x",
                "resume_data": {"file_name": "new.pdf", "skills": ["python", "fastapi"]},
                "academic_data": {"file_name": "fake.pdf", "cgpa_computed": 4.0},
                "github_data": {"username": "tampered"},
                "leetcode_data": {"username": "tampered"},
                "update_sources": ["resume"],
            }
        )

        db = MagicMock()
        db.query.return_value.filter.return_value.one_or_none.side_effect = [student, profile]
        db.query.return_value.filter.return_value.order_by.return_value.first.return_value = None

        ProfileService(db).save_profile(payload, requesting_student_id=student.id)

        self.assertEqual(student.cgpa, 8.4)
        self.assertTrue(student.cgpa_verified)
        self.assertEqual(profile.academic_score, 84.0)
        self.assertEqual(profile.academic_data["cgpa_computed"], 8.4)
        self.assertEqual(profile.coding_persona, "Strong")
        self.assertEqual(profile.coding_score, 82.0)
        self.assertEqual(profile.github_data["username"], "trusted-gh")
        self.assertEqual(profile.skills_json, ["python", "fastapi"])
        self.assertEqual(profile.resume_data["file_name"], "new.pdf")

    def test_marksheet_update_updates_verified_academics_and_backlogs(self) -> None:
        student = SimpleNamespace(
            id=7,
            name="Ansh Bhatt",
            email="ansh@example.com",
            password_hash="hashed",
            phone="9999999999",
            branch="CSE",
            roll_no="2302301530010",
            cgpa=8.0,
            cgpa_verified=True,
            gender="other",
            has_active_backlog=False,
        )
        profile = SimpleNamespace(
            id=11,
            github_username="trusted-gh",
            leetcode_username="trusted-lc",
            skills=["python"],
            skills_json=["python"],
            coding_persona="Strong",
            coding_score=82.0,
            academic_score=80.0,
            overall_score=80.0,
            github_data={"username": "trusted-gh"},
            leetcode_data={"username": "trusted-lc"},
            resume_data={"file_name": "resume.pdf", "skills": ["python"]},
            academic_data={"file_name": "old_sheet.pdf", "cgpa_computed": 8.0, "active_backlogs": 0},
            last_analyzed_at=None,
        )
        payload = StudentProfileCreate.model_validate(
            {
                "student": {
                    "name": student.name,
                    "email": student.email,
                    "roll_no": student.roll_no,
                    "phone": student.phone,
                    "branch": student.branch,
                    "cgpa": 8.9,
                    "gender": "other",
                    "cgpa_verified": True,
                },
                "skills": ["tampered_skill"],
                "coding": {
                    "persona": "tampered",
                    "score": 1,
                    "github": {"username": "tampered"},
                    "leetcode": {"username": "tampered"},
                },
                "academics": {"cgpa": 8.9, "verified": True, "score": 89.0},
                "overall_score": 86.0,
                "marksheet_url": "https://api.example/storage/marksheets/token?sig=y",
                "academic_data": {"file_name": "new_sheet.pdf", "cgpa_computed": 8.9, "active_backlogs": 1},
                "github_data": {"username": "tampered"},
                "leetcode_data": {"username": "tampered"},
                "update_sources": ["marksheet"],
            }
        )

        db = MagicMock()
        db.query.return_value.filter.return_value.one_or_none.side_effect = [student, profile]
        db.query.return_value.filter.return_value.order_by.return_value.first.return_value = None

        res = ProfileService(db).save_profile(payload, requesting_student_id=student.id)

        self.assertTrue(res.success)
        self.assertEqual(student.cgpa, 8.9)
        self.assertTrue(student.cgpa_verified)
        self.assertTrue(student.has_active_backlog)
        self.assertEqual(profile.academic_score, 89.0)
        self.assertEqual(profile.academic_data["cgpa_computed"], 8.9)
        self.assertEqual(profile.academic_data["file_name"], "new_sheet.pdf")
        # Ensure resume and coding were preserved and not tampered
        self.assertEqual(profile.skills_json, ["python"])
        self.assertEqual(profile.coding_persona, "Strong")
        self.assertEqual(profile.coding_score, 82.0)

    def test_first_time_profile_creation_with_marksheet_and_backlogs(self) -> None:
        student = SimpleNamespace(
            id=7,
            name="Ansh Bhatt",
            email="ansh@example.com",
            password_hash=None,
            phone="9999999999",
            branch="CSE",
            roll_no="2302301530010",
            cgpa=None,
            cgpa_verified=False,
            gender="other",
            has_active_backlog=False,
        )
        payload = StudentProfileCreate.model_validate(
            {
                "student": {
                    "name": student.name,
                    "email": student.email,
                    "roll_no": student.roll_no,
                    "phone": student.phone,
                    "branch": student.branch,
                    "cgpa": 9.2,
                    "gender": "other",
                    "cgpa_verified": True,
                },
                "skills": ["python", "react"],
                "coding": {
                    "persona": "Expert",
                    "score": 90,
                    "github": {"username": "ansh-gh"},
                    "leetcode": {"username": "ansh-lc"},
                },
                "academics": {"cgpa": 9.2, "verified": True, "score": 92.0},
                "overall_score": 91.0,
                "resume_url": "https://api.example/storage/resumes/r?sig=1",
                "marksheet_url": "https://api.example/storage/marksheets/m?sig=2",
                "resume_data": {"file_name": "resume.pdf"},
                "academic_data": {"file_name": "marksheet.pdf", "cgpa_computed": 9.2, "active_backlogs": 0},
                "github_data": {"username": "ansh-gh"},
                "leetcode_data": {"username": "ansh-lc"},
            }
        )

        db = MagicMock()
        db.query.return_value.filter.return_value.one_or_none.side_effect = [student, None]
        db.query.return_value.filter.return_value.order_by.return_value.first.return_value = None

        def fake_flush() -> None:
            # Simulate SQLAlchemy assigning an id to the added profile
            for call in db.add.call_args_list:
                obj = call[0][0]
                if hasattr(obj, "student_id") and not getattr(obj, "id", None):
                    obj.id = 42

        db.flush.side_effect = fake_flush

        res = ProfileService(db).save_profile(payload, requesting_student_id=student.id)

        self.assertTrue(res.success)
        self.assertEqual(res.profile_id, 42)
        self.assertEqual(student.cgpa, 9.2)
        self.assertTrue(student.cgpa_verified)
        self.assertFalse(student.has_active_backlog)


if __name__ == "__main__":
    unittest.main()
