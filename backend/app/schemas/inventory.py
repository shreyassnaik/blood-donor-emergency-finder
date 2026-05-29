from pydantic import BaseModel
from datetime import datetime

class InventoryBase(BaseModel):
    blood_group: str
    units_available: int = 0

class InventoryUpdate(BaseModel):
    units_available: int

class InventoryResponse(InventoryBase):
    id: int
    hospital_id: int
    last_updated: datetime

    class Config:
        from_attributes = True
