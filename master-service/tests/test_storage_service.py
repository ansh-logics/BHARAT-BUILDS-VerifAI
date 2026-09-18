from __future__ import annotations

import asyncio
from io import BytesIO
import unittest
from unittest.mock import patch

from app.config import Settings
from app.services.storage_service import (
    build_marksheet_access_url,
    build_resume_access_url,
    download_resume_from_s3,
    upload_marksheet_to_s3,
    verify_marksheet_access_token,
    verify_resume_access_token,
)


class StorageServiceTests(unittest.TestCase):
    def setUp(self) -> None:
        self.settings = Settings(
            storage_signing_secret="test-secret",
            s3_resume_bucket="private-resumes",
            s3_resume_prefix="resumes",
            s3_marksheet_prefix="marksheets",
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

    def test_signed_marksheet_url_round_trip(self) -> None:
        key = "marksheets/xyz789/marksheet.pdf"
        url = build_marksheet_access_url(settings=self.settings, object_key=key)
        self.assertTrue(url.startswith("https://api.example.com/storage/marksheets/"))
        token_and_query = url.split("/storage/marksheets/", 1)[1]
        token, signature = token_and_query.split("?sig=", 1)

        self.assertEqual(
            verify_resume_access_token(settings=self.settings, token=token, signature=signature),
            key,
        )
        self.assertEqual(
            verify_marksheet_access_token(settings=self.settings, token=token, signature=signature),
            key,
        )

    def test_marksheet_upload_uses_s3_aes256_encryption_under_configured_prefix(self) -> None:
        with patch("app.services.storage_service._s3_client") as client_factory:
            url = asyncio.run(
                upload_marksheet_to_s3(
                    settings=self.settings,
                    marksheet_bytes=b"%PDF-marksheet",
                    filename="grade_card.pdf",
                    content_type="application/pdf",
                )
            )

        put_call = client_factory.return_value.put_object.call_args
        self.assertIsNotNone(put_call)
        kwargs = put_call.kwargs
        self.assertEqual(kwargs["Bucket"], "private-resumes")
        self.assertTrue(kwargs["Key"].startswith("marksheets/"))
        self.assertTrue(kwargs["Key"].endswith("/grade_card.pdf"))
        self.assertEqual(kwargs["Body"], b"%PDF-marksheet")
        self.assertEqual(kwargs["ContentType"], "application/pdf")
        self.assertEqual(kwargs["ServerSideEncryption"], "AES256")
        self.assertTrue(url.startswith("https://api.example.com/storage/marksheets/"))

    def test_modified_signature_is_rejected(self) -> None:
        url = build_resume_access_url(settings=self.settings, object_key="resumes/abc/cv.pdf")
        token = url.split("/storage/resumes/", 1)[1].split("?", 1)[0]

        with self.assertRaisesRegex(ValueError, "Invalid resume access signature"):
            verify_resume_access_token(settings=self.settings, token=token, signature="0" * 64)

    def test_verify_resume_access_token_rejects_path_traversal(self) -> None:
        traversal_keys = [
            "marksheets/../secrets.txt",
            "resumes/../../etc/passwd",
            "marksheets/subdir/../../escape.pdf",
        ]
        for key in traversal_keys:
            url = build_resume_access_url(settings=self.settings, object_key=key)
            token_and_query = url.split("/storage/resumes/", 1)[1]
            token, signature = token_and_query.split("?sig=", 1)
            with self.assertRaisesRegex(ValueError, "Invalid resume object key"):
                verify_resume_access_token(settings=self.settings, token=token, signature=signature)

    def test_verify_resume_access_token_rejects_unauthorized_prefix(self) -> None:
        url = build_resume_access_url(settings=self.settings, object_key="other_bucket/file.pdf")
        token_and_query = url.split("/storage/resumes/", 1)[1]
        token, signature = token_and_query.split("?sig=", 1)
        with self.assertRaisesRegex(ValueError, "Invalid resume object key"):
            verify_resume_access_token(settings=self.settings, token=token, signature=signature)

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

    def test_storage_api_endpoint_serves_marksheet_and_resume(self) -> None:
        from fastapi import FastAPI
        from fastapi.testclient import TestClient
        from app.api.storage import router as storage_router

        app = FastAPI()
        app.include_router(storage_router)
        client = TestClient(app)

        marksheet_key = "marksheets/stu456/grade_card.pdf"
        url = build_marksheet_access_url(settings=self.settings, object_key=marksheet_key)
        path = url.split("https://api.example.com")[1]

        with (
            patch("app.api.storage.get_settings", return_value=self.settings),
            patch(
                "app.api.storage.download_resume_from_s3",
                return_value=(b"%PDF-1.5 marksheet", "application/pdf", "grade_card.pdf"),
            ),
        ):
            resp = client.get(path)
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.content, b"%PDF-1.5 marksheet")
            self.assertIn("application/pdf", resp.headers["content-type"])
            self.assertIn("grade_card.pdf", resp.headers["content-disposition"])

    def test_storage_api_endpoint_rejects_invalid_sig_and_traversal(self) -> None:
        from fastapi import FastAPI
        from fastapi.testclient import TestClient
        from app.api.storage import router as storage_router

        app = FastAPI()
        app.include_router(storage_router)
        client = TestClient(app)

        with patch("app.api.storage.get_settings", return_value=self.settings):
            # Invalid signature returns 403
            marksheet_key = "marksheets/stu456/grade_card.pdf"
            url = build_marksheet_access_url(settings=self.settings, object_key=marksheet_key)
            token = url.split("/storage/marksheets/", 1)[1].split("?", 1)[0]
            resp = client.get(f"/storage/marksheets/{token}?sig={'f' * 64}")
            self.assertEqual(resp.status_code, 403)

            # Path traversal returns 403
            traversal_url = build_marksheet_access_url(settings=self.settings, object_key="marksheets/../secret.pdf")
            traversal_path = traversal_url.split("https://api.example.com")[1]
            resp = client.get(traversal_path)
            self.assertEqual(resp.status_code, 403)

    def test_storage_api_endpoint_handles_s3_error_with_502(self) -> None:
        from fastapi import FastAPI
        from fastapi.testclient import TestClient
        from app.api.storage import router as storage_router

        app = FastAPI()
        app.include_router(storage_router)
        client = TestClient(app)

        marksheet_key = "marksheets/stu456/grade_card.pdf"
        url = build_marksheet_access_url(settings=self.settings, object_key=marksheet_key)
        path = url.split("https://api.example.com")[1]

        with (
            patch("app.api.storage.get_settings", return_value=self.settings),
            patch(
                "app.api.storage.download_resume_from_s3",
                side_effect=RuntimeError("S3 connection timeout"),
            ),
        ):
            resp = client.get(path)
            self.assertEqual(resp.status_code, 502)
            self.assertEqual(resp.json()["detail"], "Document storage is temporarily unavailable.")

    def test_verify_resume_access_token_rejects_backslash_injection(self) -> None:
        url = build_marksheet_access_url(settings=self.settings, object_key="marksheets\\sub\\file.pdf")
        token_and_query = url.split("/storage/marksheets/", 1)[1]
        token, signature = token_and_query.split("?sig=", 1)
        with self.assertRaisesRegex(ValueError, "Invalid resume object key"):
            verify_resume_access_token(settings=self.settings, token=token, signature=signature)

    def test_marksheet_upload_with_empty_filename_defaults_to_marksheet_stem(self) -> None:
        with patch("app.services.storage_service._s3_client") as client_factory:
            url = asyncio.run(
                upload_marksheet_to_s3(
                    settings=self.settings,
                    marksheet_bytes=b"%PDF-empty-name",
                    filename="",
                )
            )
        put_call = client_factory.return_value.put_object.call_args
        self.assertIsNotNone(put_call)
        self.assertTrue(put_call.kwargs["Key"].endswith("/marksheet.pdf"))
        self.assertTrue(url.startswith("https://api.example.com/storage/marksheets/"))

    def test_download_marksheet_fallback_filename(self) -> None:
        body = BytesIO(b"%PDF-1.5 marksheet")
        with patch("app.services.storage_service._s3_client") as client_factory:
            client_factory.return_value.get_object.return_value = {
                "Body": body,
                "ContentType": "application/pdf",
            }
            content, content_type, filename = asyncio.run(
                download_resume_from_s3(
                    settings=self.settings,
                    object_key="marksheets/abc123/grade_card.pdf",
                )
            )
        self.assertEqual(filename, "grade_card.pdf")


if __name__ == "__main__":
    unittest.main()
