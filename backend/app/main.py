from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.services.esios_proxy import router as esios_router

app = FastAPI(title="CalcuLux API", version="1.0.0")

# CORS para frontend en desarrollo y producción
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(esios_router, prefix="/api")