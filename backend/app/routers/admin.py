from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from .. import models, schemas, security
from ..security import get_db, check_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

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

@router.get("/users", response_model=List[schemas.User])
async def list_users(
    db: Session = Depends(get_db),
    admin: models.User = Depends(check_admin)
):
    return db.query(models.User).all()

@router.post("/users", response_model=schemas.User)
async def create_user(
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(check_admin)
):
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_password = security.get_password_hash(user_in.password)
    new_user = models.User(
        email=user_in.email,
        hashed_password=hashed_password,
        role=user_in.role,
        is_active=user_in.is_active
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
