import json
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user

router = APIRouter(prefix="/api", tags=["study"])

units_path = Path(__file__).resolve().parent.parent / "data" / "units.json"
units_data: list[dict] = json.loads(units_path.read_text(encoding="utf-8"))
units_by_id: dict[str, dict] = {u["id"]: u for u in units_data}

details_path = Path(__file__).resolve().parent.parent / "data" / "unit_details.json"
details_by_id: dict[str, dict] = json.loads(details_path.read_text(encoding="utf-8"))

details_extra_path = Path(__file__).resolve().parent.parent / "data" / "unit_details_extra.json"
details_extra_by_id: dict[str, dict] = (
    json.loads(details_extra_path.read_text(encoding="utf-8")) if details_extra_path.exists() else {}
)

details_new_path = Path(__file__).resolve().parent.parent / "data" / "unit_details_new.json"
details_new_by_id: dict[str, dict] = (
    json.loads(details_new_path.read_text(encoding="utf-8")) if details_new_path.exists() else {}
)

curriculum_path = Path(__file__).resolve().parent.parent / "data" / "curriculum.json"
curriculum_raw: dict = (
    json.loads(curriculum_path.read_text(encoding="utf-8")) if curriculum_path.exists() else {"units": []}
)


@router.get("/units", response_model=list[schemas.UnitSummary])
def list_units(current_user: models.User = Depends(get_current_user)):
    if curriculum_raw.get("units"):
        lesson_ids: list[str] = []
        seen: set[str] = set()
        for raw_unit in list(curriculum_raw.get("units") or []):
            for lesson_id in list(raw_unit.get("lessons") or []):
                lesson_key = str(lesson_id)
                if lesson_key in units_by_id and lesson_key not in seen:
                    lesson_ids.append(lesson_key)
                    seen.add(lesson_key)
        return [{"id": units_by_id[i]["id"], "title": units_by_id[i]["title"]} for i in lesson_ids]

    return [{"id": u["id"], "title": u["title"]} for u in units_data]


@router.get("/curriculum", response_model=schemas.Curriculum)
def get_curriculum(current_user: models.User = Depends(get_current_user)):
    _ = current_user
    out_units: list[dict] = []
    for raw_unit in list(curriculum_raw.get("units") or []):
        unit_id = raw_unit.get("id")
        title = raw_unit.get("title")
        if not isinstance(unit_id, str) or not unit_id:
            continue
        if not isinstance(title, str) or not title:
            continue

        lessons: list[dict] = []
        for lesson_id in list(raw_unit.get("lessons") or []):
            lesson = units_by_id.get(str(lesson_id))
            if not lesson:
                continue
            lessons.append({"id": lesson["id"], "title": lesson["title"]})

        out_units.append(
            {
                "id": unit_id,
                "title": title,
                "description": raw_unit.get("description"),
                "lessons": lessons,
            }
        )

    return {"units": out_units}


@router.get("/units/{unit_id}", response_model=schemas.UnitDetail)
def get_unit(unit_id: str, current_user: models.User = Depends(get_current_user)):
    unit = units_by_id.get(unit_id)
    if not unit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unit not found")

    learn = dict(unit.get("learn") or {})
    base = details_by_id.get(unit_id) or {}
    extra = details_extra_by_id.get(unit_id) or {}
    new = details_new_by_id.get(unit_id) or {}

    learn["details"] = [
        *list(base.get("details") or []),
        *list(extra.get("details") or []),
        *list(new.get("details") or []),
    ]
    learn["summary"] = [
        *list(base.get("summary") or []),
        *list(extra.get("summary") or []),
        *list(new.get("summary") or []),
    ]

    return {
        "id": unit["id"],
        "title": unit["title"],
        "learn": learn,
        "quiz": {"question": unit["quiz"]["question"], "choices": unit["quiz"]["choices"]},
    }


@router.post("/units/{unit_id}/answer", response_model=schemas.UnitAnswerResponse)
def submit_answer(
    unit_id: str,
    payload: schemas.UnitAnswerRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    unit = units_by_id.get(unit_id)
    if not unit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unit not found")

    correct_answer = int(unit["quiz"]["answer"])
    correct = payload.answer == correct_answer

    progress = (
        db.query(models.UnitProgress)
        .filter(models.UnitProgress.user_id == current_user.id, models.UnitProgress.unit_id == unit_id)
        .first()
    )
    if progress is None:
        progress = models.UnitProgress(user_id=current_user.id, unit_id=unit_id)
        db.add(progress)

    progress.attempts = int(progress.attempts or 0) + 1
    if correct:
        progress.correct_answers = int(progress.correct_answers or 0) + 1
        progress.completed = True

    db.commit()
    db.refresh(progress)

    return schemas.UnitAnswerResponse(correct=correct, progress=schemas.UnitProgressOut.model_validate(progress))


@router.get("/progress", response_model=list[schemas.UnitProgressOut])
def get_progress(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = db.query(models.UnitProgress).filter(models.UnitProgress.user_id == current_user.id).all()
    return [schemas.UnitProgressOut.model_validate(p) for p in items]
