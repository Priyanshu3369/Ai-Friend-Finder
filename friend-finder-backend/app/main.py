from fastapi import FastAPI
from app.auth import routes as auth_routes
from app.routes import match

app = FastAPI()
app.include_router(auth_routes.router, prefix="/api/v1", tags=["Auth"])
app.include_router(match.router, prefix="/api/v1", tags=["Match"])