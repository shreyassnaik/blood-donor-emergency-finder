from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..database import execute_query
from ..schemas.user import UserResponse

router = APIRouter()

@router.post("/hospitals/{hospital_id}/verify")
async def verify_hospital(hospital_id: int):
    # Verify the hospital
    try:
        execute_query("UPDATE hospitals SET is_verified = TRUE WHERE id = %s", (hospital_id,), commit=True)
        
        # Also update the user's role to 'hospital' just in case or keep as is
        # Find user_id
        res = execute_query("SELECT user_id FROM hospitals WHERE id = %s", (hospital_id,), fetch=True)
        if res:
            execute_query("UPDATE users SET role = 'hospital' WHERE id = %s", (res[0]['user_id'],), commit=True)
            
        return {"success": True, "message": "Hospital verified and role updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/users", response_model=List[UserResponse])
async def get_all_users():
    # Admin utility to see all users
    return execute_query("SELECT id, email, role, created_at FROM users", fetch=True)
