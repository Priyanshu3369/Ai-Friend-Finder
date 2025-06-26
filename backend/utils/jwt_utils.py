import jwt
from config import Config

def decode_jwt(token):
    return jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])