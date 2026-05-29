from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from ..database import execute_query
from ..schemas.request import RequestResponse, RequestCreate, RequestUpdate

router = APIRouter()

@router.get("/", response_model=List[RequestResponse])
async def get_requests(
    city: Optional[str] = None,
    blood_group: Optional[str] = None,
    status: Optional[str] = "open",
    requester_id: Optional[int] = None
):
    query = "SELECT *, hospital as hospital_name FROM blood_requests WHERE 1=1"
    params = []
    
    if city:
        query += " AND city = %s"
        params.append(city)
    
    if blood_group:
        query += " AND blood_group = %s"
        params.append(blood_group)
        
    if status and status != "all":
        query += " AND status = %s"
        params.append(status)
    
    if requester_id:
        query += " AND requester_id = %s"
        params.append(requester_id)
        
    requests = execute_query(query, tuple(params), fetch=True)
    return requests

@router.post("/", response_model=RequestResponse)
async def create_blood_request(blood_request: RequestCreate):
    insert_query = """
        INSERT INTO blood_requests (
            requester_id, hospital_id, patient_name, blood_group, hospital, 
            city, units, urgency, contact_phone
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    try:
        request_id = execute_query(insert_query, (
            blood_request.requester_id, blood_request.hospital_id, blood_request.patient_name, 
            blood_request.blood_group, blood_request.hospital_name, 
            blood_request.city, blood_request.units, 
            blood_request.urgency, blood_request.contact_phone
        ), commit=True)
        
        # --- Smart Matching Engine ---
        # Find compatible donors in the same city who are not on cooldown
        donor_query = """
            SELECT d.user_id 
            FROM donors d
            JOIN blood_compatibility c ON d.blood_group = c.donor_group
            WHERE c.recipient_group = %s
            AND d.city = %s
            AND d.available = TRUE
            AND (d.last_donation IS NULL OR DATEDIFF(CURRENT_DATE, d.last_donation) >= 56)
            AND d.user_id != %s
        """
        compatible_donors = execute_query(donor_query, (blood_request.blood_group, blood_request.city, blood_request.requester_id), fetch=True)
        
        # Send notifications to all matched donors
        for donor in compatible_donors:
            notif_msg = (
                f"URGENT: {blood_request.blood_group} requested at {blood_request.hospital_name}. "
                f"Your blood type is a compatible match! Please respond if you can help."
            )
            execute_query(
                "INSERT INTO notifications (user_id, type, message, related_id) VALUES (%s, %s, %s, %s)",
                (donor['user_id'], "request", notif_msg, request_id),
                commit=True
            )

        # Fetch the created request to return
        fetch_query = "SELECT *, hospital as hospital_name FROM blood_requests WHERE id = %s"
        new_request = execute_query(fetch_query, (request_id,), fetch=True)
        return new_request[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{request_id}", response_model=RequestResponse)
async def update_request_status(request_id: int, request_update: RequestUpdate):
    update_data = request_update.dict(exclude_unset=True)
    if not update_data:
        fetch_query = "SELECT *, hospital as hospital_name FROM blood_requests WHERE id = %s"
        res = execute_query(fetch_query, (request_id,), fetch=True)
        return res[0]
    
    query = "UPDATE blood_requests SET "
    params = []
    for key, value in update_data.items():
        # Handle field name mapping if necessary
        query += f"{key} = %s, "
        params.append(value)
    
    query = query.rstrip(", ") + " WHERE id = %s"
    params.append(request_id)
    
    try:
        execute_query(query, tuple(params), commit=True)
        fetch_query = "SELECT *, hospital as hospital_name FROM blood_requests WHERE id = %s"
        res = execute_query(fetch_query, (request_id,), fetch=True)
        if not res:
            raise HTTPException(status_code=404, detail="Request not found")
        return res[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{request_id}/respond")
async def respond_to_request(request_id: int, donor_id: int):
    print(f"DEBUG: Donor {donor_id} responding to request {request_id}")
    # Fetch the blood request
    req = execute_query("SELECT *, hospital as hospital_name FROM blood_requests WHERE id = %s", (request_id,), fetch=True)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    req = req[0]

    # Check if donor already responded
    existing = execute_query(
        "SELECT id FROM request_responses WHERE request_id = %s AND donor_id = %s",
        (request_id, donor_id),
        fetch=True
    )
    if existing:
        print(f"DEBUG: Donor {donor_id} already responded to request {request_id}")
        raise HTTPException(status_code=400, detail="You have already responded to this request")

    # Fetch donor name
    donor = execute_query("SELECT name FROM donors WHERE user_id = %s", (donor_id,), fetch=True)
    donor_name = donor[0]["name"] if donor else "A volunteer"

    # Insert into request_responses
    try:
        execute_query(
            "INSERT INTO request_responses (request_id, donor_id) VALUES (%s, %s)",
            (request_id, donor_id),
            commit=True
        )
        print(f"DEBUG: Successfully inserted response for donor {donor_id} to request {request_id}")
    except Exception as e:
        print(f"DEBUG: Error inserting response: {e}")
        raise HTTPException(status_code=500, detail="Database error recording response")

    # Create notification for the requester
    notif_msg = (
        f"{donor_name} has responded to your {req['blood_group']} blood request "
        f"at {req['hospital_name']}. They are ready to donate."
    )
    execute_query(
        "INSERT INTO notifications (user_id, type, message, related_id) VALUES (%s, %s, %s, %s)",
        (req["requester_id"], "match", notif_msg, request_id),
        commit=True
    )

    return {
        "success": True,
        "contact_phone": req["contact_phone"],
        "patient_name": req["patient_name"],
        "hospital_name": req["hospital_name"],
        "blood_group": req["blood_group"],
    }

@router.get("/{request_id}/responses")
async def get_request_responses(request_id: int):
    print(f"DEBUG: Fetching responses for request {request_id}")
    # Use LEFT JOIN with donors and users to ensure we see the volunteer even if their profile is incomplete
    query = """
        SELECT 
            r.id, r.request_id, r.donor_id, r.status, r.created_at,
            COALESCE(d.name, u.email) as donor_name,
            COALESCE(d.blood_group, 'Unknown') as blood_group,
            COALESCE(d.phone, 'No phone') as phone,
            COALESCE(d.donation_count, 0) as donation_count
        FROM request_responses r
        JOIN users u ON r.donor_id = u.id
        LEFT JOIN donors d ON r.donor_id = d.user_id
        WHERE r.request_id = %s
    """
    responses = execute_query(query, (request_id,), fetch=True)
    print(f"DEBUG: Found {len(responses)} responses for request {request_id}")
    return responses

@router.post("/{request_id}/confirm")
async def confirm_donation(request_id: int, donor_id: int):
    # 0. Ensure donor profile exists (Integrity check for donations table)
    donor_exists = execute_query("SELECT user_id FROM donors WHERE user_id = %s", (donor_id,), fetch=True)
    if not donor_exists:
        # Fetch user email to use as name fallback
        user = execute_query("SELECT email FROM users WHERE id = %s", (donor_id,), fetch=True)
        if not user:
             raise HTTPException(status_code=404, detail="User not found")
        
        # Create minimal donor profile
        execute_query(
            "INSERT INTO donors (user_id, name, blood_group, city, phone) VALUES (%s, %s, %s, %s, %s)",
            (donor_id, user[0]['email'], 'N/A', 'Unknown', 'N/A'),
            commit=True
        )

    # 1. Update request status
    execute_query(
        "UPDATE blood_requests SET status = 'fulfilled' WHERE id = %s",
        (request_id,),
        commit=True
    )

    # 2. Update response status
    execute_query(
        "UPDATE request_responses SET status = 'confirmed' WHERE request_id = %s AND donor_id = %s",
        (request_id, donor_id),
        commit=True
    )

    # 3. Fetch request details for history
    req = execute_query("SELECT *, hospital as hospital_name FROM blood_requests WHERE id = %s", (request_id,), fetch=True)[0]

    # 4. Insert into donations history
    execute_query(
        "INSERT INTO donations (donor_id, request_id, hospital_id, hospital, units, date) VALUES (%s, %s, %s, %s, %s, %s)",
        (donor_id, request_id, req['hospital_id'], req['hospital_name'], req['units'], datetime.now().date()),
        commit=True
    )

    # 5. Update donor stats
    execute_query(
        "UPDATE donors SET donation_count = donation_count + 1, last_donation = %s WHERE user_id = %s",
        (datetime.now().date(), donor_id),
        commit=True
    )

    # 6. Notify the donor
    execute_query(
        "INSERT INTO notifications (user_id, type, message, related_id) VALUES (%s, %s, %s, %s)",
        (donor_id, "confirmed", f"Thank you! Your donation for {req['patient_name']} has been confirmed. You just saved a life!", request_id),
        commit=True
    )

    return {"success": True, "message": "Donation confirmed and recorded"}

@router.post("/{request_id}/fulfill-hospital")
async def fulfill_from_hospital_stock(request_id: int, hospital_id: int):
    # 1. Fetch request details
    req = execute_query("SELECT *, hospital as hospital_name FROM blood_requests WHERE id = %s", (request_id,), fetch=True)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    req = req[0]
    
    # 2. Check hospital inventory
    inv = execute_query(
        "SELECT id, units_available FROM inventory WHERE hospital_id = %s AND blood_group = %s",
        (hospital_id, req['blood_group']),
        fetch=True
    )
    
    if not inv or inv[0]['units_available'] < req['units']:
        raise HTTPException(status_code=400, detail="Insufficient hospital stock to fulfill this request")
    
    # 3. Decrement inventory
    execute_query(
        "UPDATE inventory SET units_available = units_available - %s WHERE id = %s",
        (req['units'], inv[0]['id']),
        commit=True
    )
    
    # 4. Update request status
    execute_query(
        "UPDATE blood_requests SET status = 'fulfilled', hospital_id = %s WHERE id = %s",
        (hospital_id, request_id),
        commit=True
    )
    
    # 5. Fetch hospital name for notification
    hosp = execute_query("SELECT name FROM hospitals WHERE id = %s", (hospital_id,), fetch=True)[0]
    
    # 6. Notify the requester
    notif_msg = f"Your request for {req['blood_group']} blood has been fulfilled by {hosp['name']} from their internal bank. Please contact them to coordinate."
    execute_query(
        "INSERT INTO notifications (user_id, type, message, related_id) VALUES (%s, %s, %s, %s)",
        (req['requester_id'], "fulfilled", notif_msg, request_id),
        commit=True
    )
    
    return {"success": True, "message": "Request fulfilled using hospital inventory"}
