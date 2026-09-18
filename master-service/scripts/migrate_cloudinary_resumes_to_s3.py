from __future__ import annotations

import asyncio
import mimetypes
from pathlib import Path
from urllib.parse import unquote, urlparse

import httpx

from app.config import get_settings
from app.database.database import SessionLocal
from app.database.models import RawUpload
from app.services.storage_service import upload_resume_to_s3


def _filename_from_url(url: str) -> str:
    name = Path(unquote(urlparse(url).path)).name.strip() or "resume.pdf"
    if Path(name).suffix.lower() not in {".pdf", ".docx"}:
        name = f"{name}.pdf"
    return name


async def migrate() -> tuple[int, int]:
    settings = get_settings()
    db = SessionLocal()
    migrated = 0
    failed = 0
    try:
        rows = (
            db.query(RawUpload)
            .filter(RawUpload.resume_url.like("https://res.cloudinary.com/%"))
            .order_by(RawUpload.id.asc())
            .all()
        )
        async with httpx.AsyncClient(timeout=60, follow_redirects=True) as client:
            for row in rows:
                try:
                    response = await client.get(row.resume_url)
                    response.raise_for_status()
                    filename = _filename_from_url(row.resume_url)
                    content_type = response.headers.get("content-type") or mimetypes.guess_type(filename)[0]
                    row.resume_url = await upload_resume_to_s3(
                        settings=settings,
                        resume_bytes=response.content,
                        filename=filename,
                        content_type=content_type,
                    )
                    db.commit()
                    migrated += 1
                except Exception as exc:
                    db.rollback()
                    failed += 1
                    print(f"Failed raw_upload id={row.id}: {exc}")
    finally:
        db.close()
    return migrated, failed


if __name__ == "__main__":
    migrated_count, failed_count = asyncio.run(migrate())
    print(f"migrated={migrated_count} failed={failed_count}")
    raise SystemExit(1 if failed_count else 0)
