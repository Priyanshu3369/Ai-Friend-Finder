from fastapi import APIRouter, Depends, HTTPException, Header
from app.db import db
from app.models.friend_request import FriendRequestCreate
from jose import jwt
import os

router = APIRouter()
SECRET_KEY = os.getenv("SECRET_KEY")
friend_requests = db.get_collection("friend_requests")

def get_current_email(authorization: str = Header(...)) -> str:
    try:
        token = authorization.split(" ")[1]
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"]).get("sub")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/send-request")
async def send_request(data: FriendRequestCreate, sender_email: str = Depends(get_current_email)):
    if data.receiver_email == sender_email:
        raise HTTPException(status_code=400, detail="Cannot send request to yourself")
    
    existing = await friend_requests.find_one({
        "sender_email": sender_email,
        "receiver_email": data.receiver_email
    })

    if existing:
        raise HTTPException(status_code=400, detail="Friend request already sent")

    await friend_requests.insert_one({
        "sender_email": sender_email,
        "receiver_email": data.receiver_email,
        "status": "pending"
    })
    return {"message": "Friend request sent"}

@router.get("/incoming-requests")
async def get_incoming_requests(user_email: str = Depends(get_current_email)):
    requests = await friend_requests.find({"receiver_email": user_email, "status": "pending"}).to_list(length=None)
    return requests

@router.post("/accept-request")
async def accept_request(data: FriendRequestCreate, user_email: str = Depends(get_current_email)):
    updated = await friend_requests.update_one(
        {
            "receiver_email": user_email,
            "sender_email": data.receiver_email,
            "status": "pending"
        },
        {"$set": {"status": "accepted"}}
    )

    if updated.modified_count == 0:
        raise HTTPException(status_code=400, detail="Request not found or already accepted")

    return {"message": "Friend request accepted"}
