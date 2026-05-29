from pydantic import BaseModel
from typing import Optional
from datetime import date

class DonorBase(BaseModel):
    name: str
    blood_group: str
    city: str
    phone: str
    available: Optional[bool] = True

class DonorCreate(DonorBase):
    user_id: int

class DonorUpdate(BaseModel):
    name: Optional[str] = None
    blood_group: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    available: Optional[bool] = None

class DonorResponse(DonorBase):
    user_id: int
    donation_count: int
    last_donation: Optional[date] = None
    verified: bool

    class Config:
        from_attributes = True
