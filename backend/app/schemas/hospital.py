from pydantic import BaseModel
from typing import Optional

class HospitalBase(BaseModel):
    name: str
    city: str
    address: Optional[str] = None
    phone: str

class HospitalCreate(HospitalBase):
    user_id: int

class HospitalResponse(HospitalBase):
    id: int
    user_id: Optional[int]
    is_verified: bool

    class Config:
        from_attributes = True
