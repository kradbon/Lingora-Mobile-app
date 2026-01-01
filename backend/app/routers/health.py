from fastapi import APIRouter

from .. import schemas

router = APIRouter(tags=["health"])


@router.get("/ping", response_model=schemas.PingResponse)
def ping():
    return schemas.PingResponse()
