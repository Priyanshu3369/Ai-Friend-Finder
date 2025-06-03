from fastapi import APIRouter, HTTPException, status, Request, Header
from pydantic import BaseModel
from app.core.auth import verify_password, create_access_token
from app.core.model import extract_personality
from jose import jwt, JWTError
from app.core.auth import SECRET_KEY, ALGORITHM

router = APIRouter()

users_db = {}

class User(BaseModel):
    username: str
    password: str

class TextSample(BaseModel):
    text: str

def get_username_from_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/register")
def register(user: User):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    users_db[user.username] = create_access_token({"sub": user.username})
    return {"msg": "User registered successfully"}

@router.post("/login")
def login(user: User):
    if user.username not in users_db:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/analyze")
def analyze(sample: TextSample, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ")[1]
    get_username_from_token(token)  # raises error if invalid
    traits = extract_personality(sample.text)
    return {"traits": traits}
