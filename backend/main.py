from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.routes import router
from app.db.session import create_db_and_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code before app startup
    create_db_and_tables()
    yield
    # Code after app shutdown (optional)

app = FastAPI(lifespan=lifespan)

app.include_router(router)
