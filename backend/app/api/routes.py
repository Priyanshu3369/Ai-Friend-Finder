from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_root():
    return {"message":"AI friend finder backend is running"}