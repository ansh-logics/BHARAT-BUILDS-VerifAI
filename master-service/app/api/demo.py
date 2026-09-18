from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Student
from app.schemas.student import JDMatchResponse
from app.services.demo_service import get_demo_scenario, list_demo_scenarios
from app.services.matching_service import run_jd_matching

router = APIRouter(prefix="/demo", tags=["public-demo"])


@router.get("/scenarios")
def get_scenarios() -> list[dict[str, str]]:
    return list_demo_scenarios()


@router.get("/match/{scenario_id}", response_model=JDMatchResponse)
def run_demo_match(
    scenario_id: str,
    db: Session = Depends(get_db),
) -> JDMatchResponse:
    try:
        jd_data = get_demo_scenario(scenario_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Unknown demo scenario.") from None

    demo_student_ids = [
        student_id
        for (student_id,) in (
            db.query(Student.id)
            .filter(Student.roll_no.like("DEMO-%"))
            .order_by(Student.id.asc())
            .all()
        )
    ]
    if not demo_student_ids:
        raise HTTPException(status_code=503, detail="Demo cohort is not available.")

    constraints, filters, candidates = run_jd_matching(
        db=db,
        jd_data=jd_data,
        student_ids=demo_student_ids,
        top_k=8,
    )
    if any(not candidate.is_demo for candidate in candidates):
        raise HTTPException(status_code=500, detail="Demo cohort isolation failed.")
    return JDMatchResponse(jd=constraints, filters=filters, candidates=candidates)
