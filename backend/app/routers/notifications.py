from fastapi import APIRouter, HTTPException
from typing import List
from ..database import execute_query
from ..schemas.notification import NotificationResponse, NotificationCreate

router = APIRouter()

@router.get("/{user_id}", response_model=List[NotificationResponse])
async def get_user_notifications(user_id: int):
    query = "SELECT * FROM notifications WHERE user_id = %s ORDER BY created_at DESC"
    notifications = execute_query(query, (user_id,), fetch=True)
    return notifications

@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(notification_id: int):
    update_query = "UPDATE notifications SET is_read = TRUE WHERE id = %s"
    try:
        execute_query(update_query, (notification_id,), commit=True)
        fetch_query = "SELECT * FROM notifications WHERE id = %s"
        res = execute_query(fetch_query, (notification_id,), fetch=True)
        if not res:
            raise HTTPException(status_code=404, detail="Notification not found")
        return res[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=NotificationResponse)
async def create_notification(notification: NotificationCreate):
    insert_query = "INSERT INTO notifications (user_id, type, message) VALUES (%s, %s, %s)"
    try:
        notif_id = execute_query(insert_query, (
            notification.user_id, notification.type, notification.message
        ), commit=True)
        fetch_query = "SELECT * FROM notifications WHERE id = %s"
        new_notif = execute_query(fetch_query, (notif_id,), fetch=True)
        return new_notif[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
