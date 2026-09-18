from __future__ import annotations

import unittest
from unittest.mock import AsyncMock, patch

from app.services.master_service import analyze_student_profile_incremental


class IncrementalAnalysisTests(unittest.IsolatedAsyncioTestCase):
    async def test_resume_only_change_reuses_existing_coding_and_marksheet(self) -> None:
        with (
            patch("app.services.master_service.call_resume_analyzer", new=AsyncMock(return_value=({"name": "New", "branch": "CSE"}, None))),
            patch(
                "app.services.master_service.call_marksheet_analyzer",
                new=AsyncMock(return_value=({"candidate": {"name": "Old Candidate", "class_name": "CSE", "roll_no": "R1"}}, None)),
            ) as marksheet_mock,
            patch("app.services.master_service.call_coding_analyzer", new=AsyncMock()) as coding_mock,
            patch("app.services.master_service.upload_resume_to_s3", new=AsyncMock(return_value="https://cdn/new.pdf")),
            patch("app.services.master_service.verify_resume_access_token", return_value="marksheets/id/sheet.pdf"),
            patch(
                "app.services.master_service.download_resume_from_s3",
                new=AsyncMock(return_value=(b"sheet", "application/pdf", "sheet.pdf")),
            ),
            patch(
                "app.services.master_service.normalize_master_output",
                side_effect=lambda **kwargs: kwargs,
            ),
        ):
            out = await analyze_student_profile_incremental(
                existing_resume_data={"name": "Old", "branch": "ECE"},
                existing_marksheet_data={"candidate": {"name": "Old Candidate"}},
                existing_coding_data={"github": {"repos": 10}, "leetcode": {"total_solved": 300}, "coding_persona": "advanced"},
                resume_file=b"resume",
                resume_filename="resume.pdf",
                resume_content_type="application/pdf",
                marksheet_file=None,
                marksheet_filename=None,
                marksheet_content_type=None,
                resume_changed=True,
                marksheet_changed=False,
                coding_changed=False,
                branch="AIML",
                github="gh",
                leetcode="lc",
                existing_resume_url="https://cdn/old.pdf",
                existing_marksheet_url="https://api/storage/resumes/token?sig=" + ("a" * 64),
            )

        self.assertEqual(out["resume"]["name"], "New")
        self.assertEqual(out["marksheet"]["candidate"]["name"], "Old Candidate")
        self.assertEqual(out["coding"]["github"]["repos"], 10)
        self.assertEqual(out["coding"]["leetcode"]["total_solved"], 300)
        self.assertEqual(out["coding"]["coding_persona"], "advanced")
        self.assertEqual(out["resume_url"], "https://cdn/new.pdf")
        marksheet_mock.assert_awaited_once()
        coding_mock.assert_not_awaited()

    async def test_coding_only_change_reuses_existing_resume_and_marksheet(self) -> None:
        with (
            patch("app.services.master_service.call_resume_analyzer", new=AsyncMock()) as resume_mock,
            patch("app.services.master_service.call_marksheet_analyzer", new=AsyncMock()) as marksheet_mock,
            patch(
                "app.services.master_service.call_coding_analyzer",
                new=AsyncMock(return_value=({"github": {"repos": 99}, "leetcode": {"total_solved": 500}, "coding_persona": "expert"}, None)),
            ),
            patch(
                "app.services.master_service.normalize_master_output",
                side_effect=lambda **kwargs: kwargs,
            ),
        ):
            out = await analyze_student_profile_incremental(
                existing_resume_data={"name": "Old Resume", "branch": "CSE"},
                existing_marksheet_data={"candidate": {"name": "Old Candidate"}},
                existing_coding_data={"github": {"repos": 10}, "leetcode": {"total_solved": 300}, "coding_persona": "advanced"},
                resume_file=None,
                resume_filename=None,
                resume_content_type=None,
                marksheet_file=None,
                marksheet_filename=None,
                marksheet_content_type=None,
                resume_changed=False,
                marksheet_changed=False,
                coding_changed=True,
                branch="CSE",
                github="gh",
                leetcode="lc",
                existing_resume_url="https://cdn/old.pdf",
            )

        self.assertEqual(out["resume"]["name"], "Old Resume")
        self.assertEqual(out["marksheet"]["candidate"]["name"], "Old Candidate")
        self.assertEqual(out["coding"]["github"]["repos"], 99)
        self.assertEqual(out["coding"]["leetcode"]["total_solved"], 500)
        self.assertEqual(out["resume_url"], "https://cdn/old.pdf")
        resume_mock.assert_not_awaited()
        marksheet_mock.assert_not_awaited()

    async def test_two_source_change_merges_new_and_old_payloads(self) -> None:
        with (
            patch("app.services.master_service.call_resume_analyzer", new=AsyncMock(return_value=({"name": "New Resume"}, None))),
            patch("app.services.master_service.call_marksheet_analyzer", new=AsyncMock(return_value=({"candidate": {"name": "New Candidate", "class_name": "X", "roll_no": "R1"}}, None))),
            patch("app.services.master_service.call_coding_analyzer", new=AsyncMock()) as coding_mock,
            patch("app.services.master_service.upload_resume_to_s3", new=AsyncMock(return_value="https://cdn/new.pdf")),
            patch("app.services.master_service.upload_marksheet_to_s3", new=AsyncMock(return_value="https://cdn/new-sheet.pdf")),
            patch(
                "app.services.master_service.normalize_master_output",
                side_effect=lambda **kwargs: kwargs,
            ),
        ):
            out = await analyze_student_profile_incremental(
                existing_resume_data={"name": "Old Resume", "branch": "CSE"},
                existing_marksheet_data={"candidate": {"name": "Old Candidate", "class_name": "X", "roll_no": "R0"}},
                existing_coding_data={"github": {"repos": 10}, "leetcode": {"total_solved": 300}, "coding_persona": "advanced"},
                resume_file=b"resume",
                resume_filename="resume.pdf",
                resume_content_type="application/pdf",
                marksheet_file=b"marksheet",
                marksheet_filename="marksheet.pdf",
                marksheet_content_type="application/pdf",
                resume_changed=True,
                marksheet_changed=True,
                coding_changed=False,
                branch="IT",
                github="gh",
                leetcode="lc",
                existing_resume_url="https://cdn/old.pdf",
            )

        self.assertEqual(out["resume"]["name"], "New Resume")
        self.assertEqual(out["marksheet"]["candidate"]["name"], "New Candidate")
        self.assertEqual(out["coding"]["github"]["repos"], 10)
        self.assertEqual(out["coding"]["coding_persona"], "advanced")
        self.assertEqual(out["resume_url"], "https://cdn/new.pdf")
        coding_mock.assert_not_awaited()

    async def test_resume_only_change_refreshes_academic_data_in_merged_profile(self) -> None:
        marksheet_payload = {
            "candidate": {"name": "Old Candidate", "class_name": "CSE", "roll_no": "R1"},
            "cgpa_computed": 8.75,
            "active_backlogs": 0,
            "semesters": [{"sem": 1, "sgpa": 8.5}],
        }
        with (
            patch("app.services.master_service.call_resume_analyzer", new=AsyncMock(return_value=({"name": "New Name", "branch": "CSE", "cgpa": 7.0}, None))),
            patch("app.services.master_service.call_marksheet_analyzer", new=AsyncMock(return_value=(marksheet_payload, None))),
            patch("app.services.master_service.upload_resume_to_s3", new=AsyncMock(return_value="https://cdn/new-resume.pdf")),
            patch("app.services.master_service.verify_resume_access_token", return_value="marksheets/abc/sheet.pdf"),
            patch(
                "app.services.master_service.download_resume_from_s3",
                new=AsyncMock(return_value=(b"sheet", "application/pdf", "sheet.pdf")),
            ),
        ):
            out = await analyze_student_profile_incremental(
                existing_resume_data={"name": "Old Name", "branch": "CSE", "cgpa": 6.5},
                existing_marksheet_data={"candidate": {"name": "Old Candidate", "class_name": "CSE", "roll_no": "R1"}, "cgpa_computed": 7.5},
                existing_coding_data={"github": {"repos": 5}, "leetcode": {"total_solved": 150}, "coding_persona": "intermediate"},
                resume_file=b"resume-bytes",
                resume_filename="resume.pdf",
                resume_content_type="application/pdf",
                marksheet_file=None,
                marksheet_filename=None,
                marksheet_content_type=None,
                resume_changed=True,
                marksheet_changed=False,
                coding_changed=False,
                branch="CSE",
                github="ghuser",
                leetcode="lcuser",
                existing_resume_url="https://cdn/old-resume.pdf",
                existing_marksheet_url="https://api/storage/resumes/token?sig=" + ("b" * 64),
            )

        self.assertEqual(out["student"]["cgpa"], 8.75)
        self.assertTrue(out["student"]["cgpa_verified"])
        self.assertEqual(out["academics"]["cgpa"], 8.75)
        self.assertTrue(out["academics"]["verified"])
        self.assertEqual(out["academic_data"]["cgpa_computed"], 8.75)
        self.assertEqual(out["academic_data"]["active_backlogs"], 0)
        self.assertEqual(out["resume_url"], "https://cdn/new-resume.pdf")
        self.assertEqual(out["marksheet_url"], "https://api/storage/resumes/token?sig=" + ("b" * 64))

    async def test_stored_marksheet_analyzer_failure_raises_error(self) -> None:
        with (
            patch("app.services.master_service.call_resume_analyzer", new=AsyncMock(return_value=({"name": "New Name", "branch": "CSE"}, None))),
            patch("app.services.master_service.call_marksheet_analyzer", new=AsyncMock(return_value=(None, "upstream timeout"))),
            patch("app.services.master_service.upload_resume_to_s3", new=AsyncMock(return_value="https://cdn/new.pdf")),
            patch("app.services.master_service.verify_resume_access_token", return_value="marksheets/abc/sheet.pdf"),
            patch("app.services.master_service.download_resume_from_s3", new=AsyncMock(return_value=(b"sheet", "application/pdf", "sheet.pdf"))),
        ):
            with self.assertRaisesRegex(ValueError, "Stored marksheet analyzer failed"):
                await analyze_student_profile_incremental(
                    existing_resume_data={"name": "Old Name", "branch": "CSE"},
                    existing_marksheet_data={"candidate": {"name": "Old Candidate"}},
                    existing_coding_data={},
                    resume_file=b"resume",
                    resume_filename="resume.pdf",
                    resume_content_type="application/pdf",
                    marksheet_file=None,
                    marksheet_filename=None,
                    marksheet_content_type=None,
                    resume_changed=True,
                    marksheet_changed=False,
                    coding_changed=False,
                    branch="CSE",
                    github="gh",
                    leetcode="lc",
                    existing_resume_url="https://cdn/old.pdf",
                    existing_marksheet_url="https://api/storage/resumes/token?sig=" + ("c" * 64),
                )

    async def test_stored_marksheet_missing_candidate_identity_raises_error(self) -> None:
        with (
            patch("app.services.master_service.call_resume_analyzer", new=AsyncMock(return_value=({"name": "New Name", "branch": "CSE"}, None))),
            patch("app.services.master_service.call_marksheet_analyzer", new=AsyncMock(return_value=({"candidate": {"name": "Missing Roll and Class"}}, None))),
            patch("app.services.master_service.upload_resume_to_s3", new=AsyncMock(return_value="https://cdn/new.pdf")),
            patch("app.services.master_service.verify_resume_access_token", return_value="marksheets/abc/sheet.pdf"),
            patch("app.services.master_service.download_resume_from_s3", new=AsyncMock(return_value=(b"sheet", "application/pdf", "sheet.pdf"))),
        ):
            with self.assertRaisesRegex(ValueError, "Stored marksheet no longer passes identity validation"):
                await analyze_student_profile_incremental(
                    existing_resume_data={"name": "Old Name", "branch": "CSE"},
                    existing_marksheet_data={"candidate": {"name": "Old Candidate"}},
                    existing_coding_data={},
                    resume_file=b"resume",
                    resume_filename="resume.pdf",
                    resume_content_type="application/pdf",
                    marksheet_file=None,
                    marksheet_filename=None,
                    marksheet_content_type=None,
                    resume_changed=True,
                    marksheet_changed=False,
                    coding_changed=False,
                    branch="CSE",
                    github="gh",
                    leetcode="lc",
                    existing_resume_url="https://cdn/old.pdf",
                    existing_marksheet_url="https://api/storage/resumes/token?sig=" + ("d" * 64),
                )

    async def test_stored_marksheet_s3_download_failure_raises_error(self) -> None:
        with (
            patch("app.services.master_service.call_resume_analyzer", new=AsyncMock(return_value=({"name": "New Name", "branch": "CSE"}, None))),
            patch("app.services.master_service.upload_resume_to_s3", new=AsyncMock(return_value="https://cdn/new.pdf")),
            patch("app.services.master_service.verify_resume_access_token", return_value="marksheets/abc/sheet.pdf"),
            patch(
                "app.services.master_service.download_resume_from_s3",
                side_effect=RuntimeError("S3 connection reset mid-transfer"),
            ),
        ):
            with self.assertRaisesRegex(ValueError, "Failed to download stored marksheet from S3"):
                await analyze_student_profile_incremental(
                    existing_resume_data={"name": "Old Name", "branch": "CSE"},
                    existing_marksheet_data={"candidate": {"name": "Old Candidate"}},
                    existing_coding_data={},
                    resume_file=b"resume",
                    resume_filename="resume.pdf",
                    resume_content_type="application/pdf",
                    marksheet_file=None,
                    marksheet_filename=None,
                    marksheet_content_type=None,
                    resume_changed=True,
                    marksheet_changed=False,
                    coding_changed=False,
                    branch="CSE",
                    github="gh",
                    leetcode="lc",
                    existing_resume_url="https://cdn/old.pdf",
                    existing_marksheet_url="https://api/storage/marksheets/token?sig=" + ("e" * 64),
                )

    async def test_stored_marksheet_with_marksheets_url_scheme_succeeds(self) -> None:
        marksheet_payload = {
            "candidate": {"name": "Old Candidate", "class_name": "CSE", "roll_no": "R1"},
            "cgpa_computed": 9.1,
            "active_backlogs": 0,
            "semesters": [{"sem": 1, "sgpa": 9.1}],
        }
        with (
            patch("app.services.master_service.call_resume_analyzer", new=AsyncMock(return_value=({"name": "New Name", "branch": "CSE", "cgpa": 7.5}, None))),
            patch("app.services.master_service.call_marksheet_analyzer", new=AsyncMock(return_value=(marksheet_payload, None))),
            patch("app.services.master_service.upload_resume_to_s3", new=AsyncMock(return_value="https://cdn/new-resume.pdf")),
            patch("app.services.master_service.verify_resume_access_token", return_value="marksheets/xyz/sheet.pdf"),
            patch(
                "app.services.master_service.download_resume_from_s3",
                new=AsyncMock(return_value=(b"%PDF-sheet", "application/pdf", "sheet.pdf")),
            ),
        ):
            out = await analyze_student_profile_incremental(
                existing_resume_data={"name": "Old Name", "branch": "CSE", "cgpa": 6.5},
                existing_marksheet_data={"candidate": {"name": "Old Candidate", "class_name": "CSE", "roll_no": "R1"}, "cgpa_computed": 7.5},
                existing_coding_data={"github": {"repos": 5}, "leetcode": {"total_solved": 150}, "coding_persona": "intermediate"},
                resume_file=b"resume-bytes",
                resume_filename="resume.pdf",
                resume_content_type="application/pdf",
                marksheet_file=None,
                marksheet_filename=None,
                marksheet_content_type=None,
                resume_changed=True,
                marksheet_changed=False,
                coding_changed=False,
                branch="CSE",
                github="ghuser",
                leetcode="lcuser",
                existing_resume_url="https://cdn/old-resume.pdf",
                existing_marksheet_url="https://api.example.com/storage/marksheets/xyz123token?sig=" + ("f" * 64),
            )

        self.assertEqual(out["student"]["cgpa"], 9.1)
        self.assertTrue(out["student"]["cgpa_verified"])
        self.assertEqual(out["marksheet_url"], "https://api.example.com/storage/marksheets/xyz123token?sig=" + ("f" * 64))

    async def test_stored_marksheet_invalid_signature_raises_error(self) -> None:
        with (
            patch("app.services.master_service.call_resume_analyzer", new=AsyncMock(return_value=({"name": "New Name", "branch": "CSE"}, None))),
            patch("app.services.master_service.upload_resume_to_s3", new=AsyncMock(return_value="https://cdn/new.pdf")),
            patch("app.services.master_service.verify_resume_access_token", side_effect=ValueError("Invalid resume access signature.")),
        ):
            with self.assertRaisesRegex(ValueError, "Invalid resume access signature"):
                await analyze_student_profile_incremental(
                    existing_resume_data={"name": "Old Name", "branch": "CSE"},
                    existing_marksheet_data={"candidate": {"name": "Old Candidate"}},
                    existing_coding_data={},
                    resume_file=b"resume",
                    resume_filename="resume.pdf",
                    resume_content_type="application/pdf",
                    marksheet_file=None,
                    marksheet_filename=None,
                    marksheet_content_type=None,
                    resume_changed=True,
                    marksheet_changed=False,
                    coding_changed=False,
                    branch="CSE",
                    github="gh",
                    leetcode="lc",
                    existing_resume_url="https://cdn/old.pdf",
                    existing_marksheet_url="https://api/storage/marksheets/badtoken?sig=invalidsig",
                )

    async def test_stored_marksheet_with_trailing_slash_url_succeeds(self) -> None:
        marksheet_payload = {
            "candidate": {"name": "Old Candidate", "class_name": "CSE", "roll_no": "R1"},
            "cgpa_computed": 8.9,
            "active_backlogs": 0,
        }
        with (
            patch("app.services.master_service.call_resume_analyzer", new=AsyncMock(return_value=({"name": "New Name", "branch": "CSE"}, None))),
            patch("app.services.master_service.call_marksheet_analyzer", new=AsyncMock(return_value=(marksheet_payload, None))),
            patch("app.services.master_service.upload_resume_to_s3", new=AsyncMock(return_value="https://cdn/new-resume.pdf")),
            patch("app.services.master_service.verify_resume_access_token", return_value="marksheets/xyz/sheet.pdf"),
            patch(
                "app.services.master_service.download_resume_from_s3",
                new=AsyncMock(return_value=(b"%PDF-sheet", "application/pdf", "sheet.pdf")),
            ),
        ):
            out = await analyze_student_profile_incremental(
                existing_resume_data={"name": "Old Name", "branch": "CSE"},
                existing_marksheet_data={"candidate": {"name": "Old Candidate", "class_name": "CSE", "roll_no": "R1"}, "file_name": "sem4.pdf"},
                existing_coding_data={},
                resume_file=b"resume",
                resume_filename="resume.pdf",
                resume_content_type="application/pdf",
                marksheet_file=None,
                marksheet_filename=None,
                marksheet_content_type=None,
                resume_changed=True,
                marksheet_changed=False,
                coding_changed=False,
                branch="CSE",
                github="gh",
                leetcode="lc",
                existing_resume_url="https://cdn/old.pdf",
                existing_marksheet_url="https://api.example.com/storage/marksheets/xyz123token/?sig=" + ("f" * 64),
            )

        self.assertEqual(out["student"]["cgpa"], 8.9)
        self.assertEqual(out["academic_data"]["file_name"], "sem4.pdf")

    async def test_stored_marksheet_url_fallback_from_academic_data(self) -> None:
        marksheet_payload = {
            "candidate": {"name": "Old Candidate", "class_name": "CSE", "roll_no": "R1"},
            "cgpa_computed": 9.4,
            "active_backlogs": 0,
        }
        with (
            patch("app.services.master_service.call_resume_analyzer", new=AsyncMock(return_value=({"name": "New Name", "branch": "CSE"}, None))),
            patch("app.services.master_service.call_marksheet_analyzer", new=AsyncMock(return_value=(marksheet_payload, None))),
            patch("app.services.master_service.upload_resume_to_s3", new=AsyncMock(return_value="https://cdn/new-resume.pdf")),
            patch("app.services.master_service.verify_resume_access_token", return_value="marksheets/abc/sheet.pdf"),
            patch(
                "app.services.master_service.download_resume_from_s3",
                new=AsyncMock(return_value=(b"%PDF-sheet", "application/pdf", "sheet.pdf")),
            ),
        ):
            out = await analyze_student_profile_incremental(
                existing_resume_data={"name": "Old Name", "branch": "CSE"},
                existing_marksheet_data={
                    "candidate": {"name": "Old Candidate", "class_name": "CSE", "roll_no": "R1"},
                    "url": "https://api.example.com/storage/marksheets/fallbacktok?sig=" + ("a" * 64),
                },
                existing_coding_data={},
                resume_file=b"resume",
                resume_filename="resume.pdf",
                resume_content_type="application/pdf",
                marksheet_file=None,
                marksheet_filename=None,
                marksheet_content_type=None,
                resume_changed=True,
                marksheet_changed=False,
                coding_changed=False,
                branch="CSE",
                github="gh",
                leetcode="lc",
                existing_resume_url="https://cdn/old.pdf",
                existing_marksheet_url=None,
            )

        self.assertEqual(out["student"]["cgpa"], 9.4)
        self.assertEqual(out["marksheet_url"], "https://api.example.com/storage/marksheets/fallbacktok?sig=" + ("a" * 64))


if __name__ == "__main__":
    unittest.main()
