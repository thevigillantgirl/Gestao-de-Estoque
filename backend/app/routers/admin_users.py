from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas, security
from ..security import get_db, check_admin
from ..services import audit_service
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["Admin Users"])

@router.get("/users", response_model=List[schemas.User])
async def list_users(
    db: Session = Depends(get_db),
    admin: models.User = Depends(check_admin)
):
    return db.query(models.User).all()

@router.post("/users", response_model=schemas.User)
async def create_user(
    request: Request,
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(check_admin)
):
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")
    
    hashed_password = security.get_password_hash(user_in.password)
    new_user = models.User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed_password,
        role=user_in.role,
        is_active=user_in.is_active
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    audit_service.log_event(
        db,
        event_type="USER_CREATED",
        user_id=admin.id,
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent"),
        path="/admin/users",
        method="POST",
        status_code=201,
        details=f"Criou usuário {new_user.email} com role {new_user.role}"
    )
    
    return new_user

@router.patch("/users/{user_id}/role", response_model=schemas.User)
async def update_user_role(
    request: Request,
    user_id: int,
    role_in: schemas.UserUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(check_admin)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    old_role = user.role
    user.role = role_in.role
    db.commit()
    db.refresh(user)
    
    audit_service.log_event(
        db,
        event_type="USER_ROLE_UPDATED",
        user_id=admin.id,
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent"),
        path=f"/admin/users/{user_id}/role",
        method="PATCH",
        status_code=200,
        details=f"Alterou role do usuário {user.email} de {old_role} para {user.role}"
    )
    
    return user

@router.patch("/users/{user_id}/status", response_model=schemas.User)
async def update_user_status(
    request: Request,
    user_id: int,
    status_in: schemas.UserUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(check_admin)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    user.is_active = status_in.is_active
    db.commit()
    db.refresh(user)
    
    event = "USER_ENABLED" if user.is_active else "USER_DISABLED"
    audit_service.log_event(
        db,
        event_type=event,
        user_id=admin.id,
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent"),
        path=f"/admin/users/{user_id}/status",
        method="PATCH",
        status_code=200,
        details=f"{'Ativou' if user.is_active else 'Desativou'} usuário {user.email}"
    )
    
    return user

@router.get("/access-requests", response_model=List[schemas.AccessRequest])
async def list_access_requests(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: models.User = Depends(check_admin)
):
    query = db.query(models.AccessRequest)
    if status:
        query = query.filter(models.AccessRequest.status == status)
    return query.order_by(models.AccessRequest.created_at.desc()).all()

@router.patch("/access-requests/{request_id}", response_model=schemas.AccessRequest)
async def review_access_request(
    request: Request,
    request_id: int,
    update_in: schemas.AccessRequestUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(check_admin)
):
    db_request = db.query(models.AccessRequest).filter(models.AccessRequest.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada")
    
    db_request.status = update_in.status
    db_request.reviewed_at = datetime.now()
    db_request.reviewed_by_user_id = admin.id
    
    db.commit()
    db.refresh(db_request)
    
    audit_service.log_event(
        db,
        event_type=f"ACCESS_REQUEST_{update_in.status}",
        user_id=admin.id,
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent"),
        path=f"/admin/access-requests/{request_id}",
        method="PATCH",
        status_code=200,
        details=f"{update_in.status} solicitação de {db_request.email}"
    )
    
    return db_request
