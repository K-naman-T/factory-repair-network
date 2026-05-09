from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class Technician(BaseModel):
    id: int
    name: str
    specialty: str
    city: str
    phone: str
    available: bool
    rating: float


class JobCreate(BaseModel):
    factory_id: int
    specialty_needed: str
    technician_id: Optional[int] = None
    status: str = "open"
    cost: float = Field(default=0.0, ge=0.0)


class Job(BaseModel):
    id: int
    factory_id: int
    technician_id: Optional[int]
    specialty_needed: str
    status: str
    created_at: datetime
    resolved_at: Optional[datetime]
    cost: float


class StatsResponse(BaseModel):
    total_factories: int
    total_technicians: int
    total_jobs: int
    open_jobs: int
    resolved_jobs: int
    jobs_by_specialty: dict[str, int]
