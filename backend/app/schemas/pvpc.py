from pydantic import BaseModel
from datetime import datetime

class PVPCResponse(BaseModel):
    price_eur_per_kwh: float
    timestamp: datetime
    is_cached: bool
    cache_age_hours: float

    class Config:
        json_schema_extra = {
            "example": {
                "price_eur_per_kwh": 0.142,
                "timestamp": "2025-01-15T20:05:00Z",
                "is_cached": False,
                "cache_age_hours": 0.5
            }
        }