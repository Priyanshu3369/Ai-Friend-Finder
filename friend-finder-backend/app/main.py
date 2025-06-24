from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth import routes as auth_routes
from app.routes import friend_requests, match
from app.routes.chat import chat_router

app = FastAPI()

# ✅ Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router, prefix="/api/v1", tags=["Auth"])
app.include_router(friend_requests.router, prefix="/api/v1", tags=["Friend Requests"])
app.include_router(match.router, prefix="/api/v1", tags=["Matching"])
app.include_router(chat_router)
