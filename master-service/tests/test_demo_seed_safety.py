from __future__ import annotations

import unittest
from unittest.mock import MagicMock, patch

from scripts.seed_demo_students import (
    DEMO_STUDENTS,
    _demo_roll_no,
    _resolve_seed_email,
    delete_demo_students,
)


class DemoSeedSafetyTests(unittest.TestCase):
    def test_default_email_stays_on_explicit_demo_domain(self) -> None:
        with patch.dict("os.environ", {}, clear=True):
            email = _resolve_seed_email(DEMO_STUDENTS[0], 0)

        self.assertEqual(email, DEMO_STUDENTS[0]["email"])
        self.assertTrue(email.endswith(".demo@verifai.dev"))

    def test_demo_roll_numbers_cannot_collide_with_real_roll_numbers(self) -> None:
        self.assertEqual(_demo_roll_no(DEMO_STUDENTS[0]), "DEMO-AKTU-CSE-001")

    def test_cleanup_deletes_only_selected_demo_rows(self) -> None:
        demo_student = MagicMock()
        db = MagicMock()
        db.query.return_value.filter.return_value.all.return_value = [demo_student]
        session_context = MagicMock()
        session_context.__enter__.return_value = db
        session_context.__exit__.return_value = False

        with patch("scripts.seed_demo_students.SessionLocal", return_value=session_context):
            deleted = delete_demo_students()

        self.assertEqual(deleted, 1)
        db.delete.assert_called_once_with(demo_student)
        db.commit.assert_called_once_with()
        db.execute.assert_not_called()


if __name__ == "__main__":
    unittest.main()
