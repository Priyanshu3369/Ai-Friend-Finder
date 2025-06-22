from fastapi import FastAPI
from app.auth import routes as auth_routes
from app.routes import match
from app.routes import friend_requests

app = FastAPI()
app.include_router(auth_routes.router, prefix="/api/v1", tags=["Auth"])
app.include_router(match.router, prefix="/api/v1", tags=["Match"])
app.include_router(friend_requests.router, prefix="/api/v1", tags=["Friend Requests"])