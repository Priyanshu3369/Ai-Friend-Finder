from fastapi import APIRouter, Depends, Header, HTTPException
from app.services.match_service import get_interest_matches
from jose import jwt
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")

def get_current_user_email(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/suggestions")
async def suggest_friends(user_email: str = Depends(get_current_user_email)):
    return await get_interest_matches(user_email)
