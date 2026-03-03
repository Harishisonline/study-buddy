from pydantic import BaseModel
from typing import Optional


class SyllabusIn(BaseModel):
    content: str


class NoteIn(BaseModel):
    title: str
    content: str


class NoteOut(NoteIn):
    id: int


class SummarizeRequest(BaseModel):
    text: Optional[str] = None
    prompt: Optional[str] = None
