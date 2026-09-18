from __future__ import annotations

import asyncio
import base64
import hashlib
import hmac
import re
from pathlib import Path
from typing import Any
from uuid import uuid4

import boto3

from app.config import Settings


def _safe_filename(filename: str) -> str:
    path = Path(filename or "resume.pdf")
    stem = re.sub(r"[^a-zA-Z0-9_-]+", "-", path.stem).strip("-") or "resume"
    suffix = path.suffix.lower() if path.suffix.lower() in {".pdf", ".docx"} else ".bin"
    return f"{stem[:80]}{suffix}"


def _encode_key(key: str) -> str:
    return base64.urlsafe_b64encode(key.encode()).decode().rstrip("=")


def _decode_key(token: str) -> str:
    padding = "=" * (-len(token) % 4)
    return base64.urlsafe_b64decode(f"{token}{padding}").decode()


def _signature(settings: Settings, token: str) -> str:
    return hmac.new(
        settings.effective_storage_signing_secret.encode(),
        token.encode(),
        hashlib.sha256,
    ).hexdigest()


def build_resume_access_url(*, settings: Settings, object_key: str) -> str:
    token = _encode_key(object_key)
    signature = _signature(settings, token)
    return f"{settings.public_api_base_url.rstrip('/')}/storage/resumes/{token}?sig={signature}"


def verify_resume_access_token(*, settings: Settings, token: str, signature: str) -> str:
    if not signature or not hmac.compare_digest(_signature(settings, token), signature):
        raise ValueError("Invalid resume access signature.")
    try:
        object_key = _decode_key(token)
    except Exception as exc:
        raise ValueError("Invalid resume access token.") from exc
    expected_prefix = f"{settings.s3_resume_prefix.strip('/')}/"
    if not object_key.startswith(expected_prefix) or ".." in object_key:
        raise ValueError("Invalid resume object key.")
    return object_key


def _s3_client(settings: Settings) -> Any:
    return boto3.client("s3", region_name=settings.aws_region)


def _upload_resume_sync(
    *,
    settings: Settings,
    resume_bytes: bytes,
    filename: str,
    content_type: str | None,
) -> str:
    if not settings.s3_resume_bucket:
        raise ValueError("S3 resume storage is not configured. Set S3_RESUME_BUCKET.")
    object_key = (
        f"{settings.s3_resume_prefix.strip('/')}/{uuid4().hex}/{_safe_filename(filename)}"
    )
    _s3_client(settings).put_object(
        Bucket=settings.s3_resume_bucket,
        Key=object_key,
        Body=resume_bytes,
        ContentType=content_type or "application/octet-stream",
        ServerSideEncryption="AES256",
        Metadata={"original-filename": filename[:512]},
    )
    return build_resume_access_url(settings=settings, object_key=object_key)


async def upload_resume_to_s3(
    *,
    settings: Settings,
    resume_bytes: bytes,
    filename: str,
    content_type: str | None = None,
) -> str:
    return await asyncio.to_thread(
        _upload_resume_sync,
        settings=settings,
        resume_bytes=resume_bytes,
        filename=filename,
        content_type=content_type,
    )


async def create_presigned_resume_download_url(*, settings: Settings, object_key: str) -> str:
    if not settings.s3_resume_bucket:
        raise ValueError("S3 resume storage is not configured. Set S3_RESUME_BUCKET.")

    def _create() -> str:
        return str(
            _s3_client(settings).generate_presigned_url(
                "get_object",
                Params={"Bucket": settings.s3_resume_bucket, "Key": object_key},
                ExpiresIn=settings.s3_presigned_expiry_seconds,
            )
        )

    return await asyncio.to_thread(_create)


async def download_resume_from_s3(
    *, settings: Settings, object_key: str
) -> tuple[bytes, str, str]:
    if not settings.s3_resume_bucket:
        raise ValueError("S3 resume storage is not configured. Set S3_RESUME_BUCKET.")

    def _download() -> tuple[bytes, str, str]:
        response = _s3_client(settings).get_object(
            Bucket=settings.s3_resume_bucket,
            Key=object_key,
        )
        body = response["Body"]
        try:
            content = body.read()
        finally:
            body.close()
        content_type = str(response.get("ContentType") or "application/octet-stream")
        filename = Path(object_key).name or "resume.pdf"
        return content, content_type, filename

    return await asyncio.to_thread(_download)
