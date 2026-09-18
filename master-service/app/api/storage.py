from __future__ import annotations

from urllib.parse import quote

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response

from app.config import get_settings
from app.services.storage_service import (
    download_resume_from_s3,
    verify_resume_access_token,
)

router = APIRouter(prefix="/storage", tags=["storage"])


@router.get("/resumes/{token}")
async def download_resume(token: str, sig: str = Query(min_length=64, max_length=64)) -> Response:
    settings = get_settings()
    try:
        object_key = verify_resume_access_token(settings=settings, token=token, signature=sig)
        content, content_type, filename = await download_resume_from_s3(
            settings=settings,
            object_key=object_key,
        )
    except ValueError as exc:
        raise HTTPException(status_code=403, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Resume storage is temporarily unavailable.") from exc
    return Response(
        content=content,
        media_type=content_type,
        headers={
            "Cache-Control": "private, max-age=300",
            "Content-Disposition": f"inline; filename*=UTF-8''{quote(filename)}",
            "X-Content-Type-Options": "nosniff",
        },
    )
