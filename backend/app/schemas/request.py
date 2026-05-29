from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RequestBase(BaseModel):
    patient_name: str
    blood_group: str
    hospital_name: str
    hospital_id: Optional[int] = None
    city: str
    units: int
    urgency: str
    contact_phone: str

class RequestCreate(RequestBase):
    requester_id: int

class RequestUpdate(BaseModel):
    status: Optional[str] = None
    units: Optional[int] = None

class RequestResponse(RequestBase):
    id: int
    requester_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
