from __future__ import annotations

import asyncio
from io import BytesIO
import unittest
from unittest.mock import patch

from app.config import Settings
from app.services.storage_service import (
    build_resume_access_url,
    download_resume_from_s3,
    verify_resume_access_token,
)


class StorageServiceTests(unittest.TestCase):
    def setUp(self) -> None:
        self.settings = Settings(
            storage_signing_secret="test-secret",
            s3_resume_bucket="private-resumes",
            s3_resume_prefix="resumes",
            public_api_base_url="https://api.example.com",
        )

    def test_signed_resume_url_round_trip(self) -> None:
        key = "resumes/abc123/candidate.pdf"
        url = build_resume_access_url(settings=self.settings, object_key=key)
        token_and_query = url.split("/storage/resumes/", 1)[1]
        token, signature = token_and_query.split("?sig=", 1)

        self.assertEqual(
            verify_resume_access_token(settings=self.settings, token=token, signature=signature),
            key,
        )

    def test_modified_signature_is_rejected(self) -> None:
        url = build_resume_access_url(settings=self.settings, object_key="resumes/abc/cv.pdf")
        token = url.split("/storage/resumes/", 1)[1].split("?", 1)[0]

        with self.assertRaisesRegex(ValueError, "Invalid resume access signature"):
            verify_resume_access_token(settings=self.settings, token=token, signature="0" * 64)

    def test_download_returns_private_object_content_and_metadata(self) -> None:
        body = BytesIO(b"%PDF-1.5 test")
        with patch("app.services.storage_service._s3_client") as client_factory:
            client_factory.return_value.get_object.return_value = {
                "Body": body,
                "ContentType": "application/pdf",
            }

            content, content_type, filename = asyncio.run(
                download_resume_from_s3(
                    settings=self.settings,
                    object_key="resumes/abc123/Candidate-Resume.pdf",
                )
            )

        self.assertEqual(content, b"%PDF-1.5 test")
        self.assertEqual(content_type, "application/pdf")
        self.assertEqual(filename, "Candidate-Resume.pdf")
        client_factory.return_value.get_object.assert_called_once_with(
            Bucket="private-resumes",
            Key="resumes/abc123/Candidate-Resume.pdf",
        )
        self.assertTrue(body.closed)


if __name__ == "__main__":
    unittest.main()
