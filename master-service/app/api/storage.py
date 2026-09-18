from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse

from app.config import get_settings
from app.services.storage_service import (
    create_presigned_resume_download_url,
    verify_resume_access_token,
)

router = APIRouter(prefix="/storage", tags=["storage"])


@router.get("/resumes/{token}", response_class=RedirectResponse)
async def download_resume(token: str, sig: str = Query(min_length=64, max_length=64)) -> RedirectResponse:
    settings = get_settings()
    try:
        object_key = verify_resume_access_token(settings=settings, token=token, signature=sig)
        download_url = await create_presigned_resume_download_url(settings=settings, object_key=object_key)
    except ValueError as exc:
        raise HTTPException(status_code=403, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Resume storage is temporarily unavailable.") from exc
    return RedirectResponse(download_url, status_code=307)
