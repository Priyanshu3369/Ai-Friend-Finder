import bcrypt
import jwt
from datetime import datetime,timedelta
from config import Config
from models.user import find_user_by_email, create_user

def register_user(name,email,password):
    if find_user_by_email(email):
        return {"error":"User already Exists"},400
    
    hashed = bcrypt.hashpw(password.encode(),bcrypt.gensalt())
    user = {
        "name": name,
        "email": email,
        "password": hashed,
        "friends": [],
        "requests": [],
        "accepted": []
    }
    create_user(user)
    return {"message":"User registered successfully"},201

def login_user(email,password):
    user = find_user_by_email(email)
    if not user or not bcrypt.checkpw(password.encode(),user['password']):
        return {"error":"Invalid Credentials"} , 401
    token = jwt.encode({
        "id":str(user["_id"]),
        "exp":datetime.utcnow() + timedelta(days=1)
    },Config.JWT_SECRET,algorithm="HS256")

    return {
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }
    }, 200