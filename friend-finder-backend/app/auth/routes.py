from fastapi import APIRouter, HTTPException
from app.db import users_collection
from app.models.user import UserCreate, UserLogin, UserOut
from app.auth.auth_utils import hash_password, verify_password
from app.auth.jwt_handler import create_access_token
from bson import ObjectId
from fastapi import Depends, Query
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/register")
async def register(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    user_data = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hash_password(user.password),
        "interests": user.interests,
    }

    result = await users_collection.insert_one(user_data)
    return {"message": "User registered", "user_id": str(result.inserted_id)}

@router.post("/login")
async def login(user: UserLogin):
    user_data = await users_collection.find_one({"email": user.email})
    if not user_data or not verify_password(user.password, user_data["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user_data["email"]})
    return {
        "access_token": token,
        "user": {
            "id": str(user_data["_id"]),
            "username": user_data["username"],
            "email": user_data["email"],
            "interests": user_data["interests"],
        }
    }