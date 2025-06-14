from sqlmodel import SQLModel, Field
from typing import Optional

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    password: str

    # 👇 Add these new fields for NLP results
    mbti_summary: Optional[str] = None
    emotion_label: Optional[str] = None
