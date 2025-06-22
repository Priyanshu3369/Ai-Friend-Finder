from pydantic import BaseModel

class ChatMessage(BaseModel):
    sender: str
    receiver: str
    encrypted_text: str
