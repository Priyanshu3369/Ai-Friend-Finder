from sqlmodel import SQLModel, Field
from typing import Optional, Dict
import json

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password_hash: str
    mbti: Optional[str] = None
    bigfive_json: Optional[str] = None  # stored as a JSON string

    def set_bigfive(self, bigfive_dict: Dict[str, float]):
        self.bigfive_json = json.dumps(bigfive_dict)

    def get_bigfive(self) -> Optional[Dict[str, float]]:
        return json.loads(self.bigfive_json) if self.bigfive_json else None
