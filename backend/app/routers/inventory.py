from fastapi import APIRouter, HTTPException
from typing import List, Optional
from ..database import execute_query
from ..schemas.inventory import InventoryResponse, InventoryUpdate

router = APIRouter()

@router.get("/{hospital_id}", response_model=List[InventoryResponse])
async def get_hospital_inventory(hospital_id: int):
    return execute_query("SELECT * FROM inventory WHERE hospital_id = %s", (hospital_id,), fetch=True)

@router.get("/availability/search/")
async def search_hospital_inventory(blood_group: str, city: Optional[str] = None):
    query = """
        SELECT h.id as hospital_id, h.name as hospital_name, h.city, h.phone, h.address, i.units_available, h.is_verified
        FROM inventory i
        JOIN hospitals h ON i.hospital_id = h.id
        WHERE i.blood_group = %s AND i.units_available > 0
    """
    params = [blood_group]
    if city:
        query += " AND h.city = %s"
        params.append(city)
        
    return execute_query(query, tuple(params), fetch=True)

@router.put("/{hospital_id}/{blood_group}", response_model=InventoryResponse)
async def update_inventory(hospital_id: int, blood_group: str, update: InventoryUpdate):
    # Check if exists
    existing = execute_query(
        "SELECT id FROM inventory WHERE hospital_id = %s AND blood_group = %s",
        (hospital_id, blood_group),
        fetch=True
    )
    
    if existing:
        execute_query(
            "UPDATE inventory SET units_available = %s WHERE id = %s",
            (update.units_available, existing[0]['id']),
            commit=True
        )
        inv_id = existing[0]['id']
    else:
        inv_id = execute_query(
            "INSERT INTO inventory (hospital_id, blood_group, units_available) VALUES (%s, %s, %s)",
            (hospital_id, blood_group, update.units_available),
            commit=True
        )
    
    res = execute_query("SELECT * FROM inventory WHERE id = %s", (inv_id,), fetch=True)
    return res[0]
