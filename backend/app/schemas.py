from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserPublic(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    token: str
    user: UserPublic


class PingResponse(BaseModel):
    ok: bool = True
    service: str = "lingora-api"


class UnitSummary(BaseModel):
    id: str
    title: str


class UnitLearn(BaseModel):
    text: str
    code: str | None = None
    details: list[str] = Field(default_factory=list)
    summary: list[str] = Field(default_factory=list)


class UnitQuizPublic(BaseModel):
    question: str
    choices: list[str]


class UnitDetail(UnitSummary):
    learn: UnitLearn
    quiz: UnitQuizPublic


class UnitProgressOut(BaseModel):
    unit_id: str
    attempts: int
    correct_answers: int
    completed: bool

    model_config = ConfigDict(from_attributes=True)


class UnitAnswerRequest(BaseModel):
    answer: int


class UnitAnswerResponse(BaseModel):
    correct: bool
    progress: UnitProgressOut


class CurriculumUnit(BaseModel):
    id: str
    title: str
    description: str | None = None
    lessons: list[UnitSummary] = Field(default_factory=list)


class Curriculum(BaseModel):
    units: list[CurriculumUnit] = Field(default_factory=list)
