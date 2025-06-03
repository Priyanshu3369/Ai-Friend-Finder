from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel
from sqlmodel import select
from app.models.user import User
from app.core.auth import hash_password, verify_password, create_access_token
from app.db.session import get_session
from app.core.model import extract_personality
from app.core.auth import SECRET_KEY, ALGORITHM
from jose import jwt, JWTError
from sqlalchemy.exc import IntegrityError
from math import sqrt
import json

router = APIRouter()

class UserIn(BaseModel):
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
def register(user: UserIn, session=Depends(get_session)):
    existing = session.exec(select(User).where(User.username == user.username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    new_user = User(username=user.username, password_hash=hash_password(user.password))
    session.add(new_user)
    session.commit()
    return {"msg": "User registered successfully"}

@router.post("/login")
def login(user: UserIn, session=Depends(get_session)):
    db_user = session.exec(select(User).where(User.username == user.username)).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/analyze")
def analyze(sample: TextSample, authorization: str = Header(None), session=Depends(get_session)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ")[1]
    username = get_username_from_token(token)

    db_user = session.exec(select(User).where(User.username == username)).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    traits = extract_personality(sample.text)
    db_user.mbti = traits["MBTI"]
    db_user.set_bigfive(traits["BigFive"])
    session.add(db_user)
    session.commit()

    return {"traits": traits}

@router.get("/match")
def match_user(authorization: str = Header(None), session=Depends(get_session)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ")[1]
    username = get_username_from_token(token)

    current_user = session.exec(select(User).where(User.username == username)).first()
    if not current_user or not current_user.bigfive_json:
        raise HTTPException(status_code=400, detail="No personality data for user")

    user_vec = current_user.get_bigfive()
    best_match = None
    best_score = -1

    def cosine_similarity(vec1, vec2):
        dot = sum(vec1[k] * vec2[k] for k in vec1)
        mag1 = sqrt(sum(vec1[k] ** 2 for k in vec1))
        mag2 = sqrt(sum(vec2[k] ** 2 for k in vec2))
        return dot / (mag1 * mag2) if mag1 and mag2 else 0

    for user in session.exec(select(User)).all():
        if user.username == username or not user.bigfive_json:
            continue
        sim = cosine_similarity(user_vec, user.get_bigfive())
        if sim > best_score:
            best_score = sim
            best_match = {
                "username": user.username,
                "mbti": user.mbti,
                "score": round(sim * 100, 2)
            }

    return best_match or {"msg": "No match found yet."}
