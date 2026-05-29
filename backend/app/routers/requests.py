from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..database import execute_query
from ..schemas.request import RequestResponse, RequestCreate, RequestUpdate

router = APIRouter()

@router.get("/", response_model=List[RequestResponse])
async def get_requests(
    city: Optional[str] = None,
    blood_group: Optional[str] = None,
    status: Optional[str] = "open"
):
    query = "SELECT * FROM blood_requests WHERE 1=1"
    params = []
    
    if city:
        query += " AND city = %s"
        params.append(city)
    
    if blood_group:
        query += " AND blood_group = %s"
        params.append(blood_group)
        
    if status:
        query += " AND status = %s"
        params.append(status)
        
    requests = execute_query(query, tuple(params), fetch=True)
    return requests

@router.post("/", response_model=RequestResponse)
async def create_blood_request(blood_request: RequestCreate):
    insert_query = """
        INSERT INTO blood_requests (
            requester_id, patient_name, blood_group, hospital, 
            city, units, urgency, contact_phone
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    try:
        request_id = execute_query(insert_query, (
            blood_request.requester_id, blood_request.patient_name, 
            blood_request.blood_group, blood_request.hospital, 
            blood_request.city, blood_request.units, 
            blood_request.urgency, blood_request.contact_phone
        ), commit=True)
        
        # Fetch the created request
        fetch_query = "SELECT * FROM blood_requests WHERE id = %s"
        new_request = execute_query(fetch_query, (request_id,), fetch=True)
        return new_request[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{request_id}", response_model=RequestResponse)
async def update_request_status(request_id: int, request_update: RequestUpdate):
    update_data = request_update.dict(exclude_unset=True)
    if not update_data:
        fetch_query = "SELECT * FROM blood_requests WHERE id = %s"
        res = execute_query(fetch_query, (request_id,), fetch=True)
        return res[0]
    
    query = "UPDATE blood_requests SET "
    params = []
    for key, value in update_data.items():
        query += f"{key} = %s, "
        params.append(value)
    
    query = query.rstrip(", ") + " WHERE id = %s"
    params.append(request_id)
    
    try:
        execute_query(query, tuple(params), commit=True)
        fetch_query = "SELECT * FROM blood_requests WHERE id = %s"
        res = execute_query(fetch_query, (request_id,), fetch=True)
        if not res:
            raise HTTPException(status_code=404, detail="Request not found")
        return res[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{request_id}/respond")
async def respond_to_request(request_id: int, donor_id: int):
    # Fetch the blood request
    req = execute_query("SELECT * FROM blood_requests WHERE id = %s", (request_id,), fetch=True)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    req = req[0]

    # Fetch donor name
    donor = execute_query("SELECT name FROM donors WHERE user_id = %s", (donor_id,), fetch=True)
    donor_name = donor[0]["name"] if donor else "A donor"

    # Create notification for the requester
    notif_msg = (
        f"{donor_name} has responded to your {req['blood_group']} blood request "
        f"at {req['hospital']}. They are ready to donate."
    )
    execute_query(
        "INSERT INTO notifications (user_id, type, message) VALUES (%s, %s, %s)",
        (req["requester_id"], "match", notif_msg),
        commit=True
    )

    return {
        "success": True,
        "contact_phone": req["contact_phone"],
        "patient_name": req["patient_name"],
        "hospital": req["hospital"],
        "blood_group": req["blood_group"],
    }
