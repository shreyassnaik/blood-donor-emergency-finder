from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..database import execute_query
from ..schemas.hospital import HospitalResponse, HospitalCreate

router = APIRouter()

@router.get("/", response_model=List[HospitalResponse])
async def get_hospitals(city: str = None):
    query = "SELECT * FROM hospitals"
    params = []
    if city:
        query += " WHERE city = %s"
        params.append(city)
    return execute_query(query, tuple(params), fetch=True)

@router.get("/{hospital_id}", response_model=HospitalResponse)
async def get_hospital(hospital_id: int):
    res = execute_query("SELECT * FROM hospitals WHERE id = %s", (hospital_id,), fetch=True)
    if not res:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return res[0]

@router.post("/", response_model=HospitalResponse)
async def create_hospital(hospital: HospitalCreate):
    query = """
        INSERT INTO hospitals (user_id, name, city, address, phone)
        VALUES (%s, %s, %s, %s, %s)
    """
    try:
        hospital_id = execute_query(query, (
            hospital.user_id, hospital.name, hospital.city, 
            hospital.address, hospital.phone
        ), commit=True)
        return await get_hospital(hospital_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
