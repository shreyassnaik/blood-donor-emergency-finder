from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from ..database import execute_query
from ..schemas.donor import DonorResponse, DonorUpdate, DonorCreate

router = APIRouter()

@router.get("/", response_model=List[DonorResponse])
async def get_donors(
    city: Optional[str] = None,
    blood_group: Optional[str] = None,
    available_only: bool = True
):
    query = "SELECT * FROM donors WHERE 1=1"
    params = []
    
    if city:
        query += " AND city = %s"
        params.append(city)
    
    if blood_group:
        query += " AND blood_group = %s"
        params.append(blood_group)
        
    if available_only:
        query += " AND available = TRUE"
        
    donors = execute_query(query, tuple(params), fetch=True)
    return donors

@router.get("/{user_id}", response_model=DonorResponse)
async def get_donor_by_id(user_id: int):
    query = "SELECT * FROM donors WHERE user_id = %s"
    donors = execute_query(query, (user_id,), fetch=True)
    
    if not donors:
        raise HTTPException(status_code=404, detail="Donor not found")
    
    return donors[0]

@router.post("/", response_model=DonorResponse)
async def create_donor_profile(donor: DonorCreate):
    # Check if profile already exists
    check_query = "SELECT user_id FROM donors WHERE user_id = %s"
    existing = execute_query(check_query, (donor.user_id,), fetch=True)
    if existing:
        raise HTTPException(status_code=400, detail="Donor profile already exists")
    
    insert_query = """
        INSERT INTO donors (user_id, name, blood_group, city, phone, available)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    try:
        execute_query(insert_query, (
            donor.user_id, donor.name, donor.blood_group, 
            donor.city, donor.phone, donor.available
        ), commit=True)
        
        return await get_donor_by_id(donor.user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{user_id}", response_model=DonorResponse)
async def update_donor_profile(user_id: int, donor_update: DonorUpdate):
    # Construct dynamic update query
    update_data = donor_update.dict(exclude_unset=True)
    if not update_data:
        return await get_donor_by_id(user_id)
    
    query = "UPDATE donors SET "
    params = []
    for key, value in update_data.items():
        query += f"{key} = %s, "
        params.append(value)
    
    query = query.rstrip(", ") + " WHERE user_id = %s"
    params.append(user_id)
    
    try:
        execute_query(query, tuple(params), commit=True)
        return await get_donor_by_id(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/donations")
async def get_donor_donations(user_id: int):
    query = """
        SELECT d.id, d.date, d.hospital, d.units, r.blood_group
        FROM donations d
        LEFT JOIN blood_requests r ON d.request_id = r.id
        WHERE d.donor_id = %s
        ORDER BY d.date DESC
    """
    donations = execute_query(query, (user_id,), fetch=True)
    return donations
