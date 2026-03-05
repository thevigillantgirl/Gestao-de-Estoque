from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from .. import models, schemas, security
from ..security import get_db, check_admin

router = APIRouter(prefix="/admin", tags=["Admin Logs"])

@router.get("/logs", response_model=List[schemas.AccessLog])
async def get_access_logs(
    user_id: Optional[int] = None,
    event_type: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    admin: models.User = Depends(check_admin)
):
    query = db.query(models.AccessLog)
    
    if user_id:
        query = query.filter(models.AccessLog.user_id == user_id)
    if event_type:
        query = query.filter(models.AccessLog.event_type == event_type)
    if start_date:
        query = query.filter(models.AccessLog.timestamp >= start_date)
    if end_date:
        query = query.filter(models.AccessLog.timestamp <= end_date)
        
    return query.order_by(models.AccessLog.timestamp.desc()).limit(100).all()
