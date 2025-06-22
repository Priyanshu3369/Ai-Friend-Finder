from pydantic import BaseModel, EmailStr

class FriendRequestCreate(BaseModel):
    receiver_email: EmailStr

class FriendRequestOut(BaseModel):
    sender_email: str
    receiver_email: str
    status: str
