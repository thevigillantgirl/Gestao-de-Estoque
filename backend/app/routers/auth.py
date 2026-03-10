from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from .. import models, schemas, security
from ..security import get_db
from ..services import audit_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=schemas.Token)
async def login_for_access_token(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not user or not security.verify_password(form_data.password, user.password_hash) or not user.is_active:
        # Log failed login
        audit_service.log_event(
            db,
            event_type="LOGIN_FAILED",
            user_id=user.id if user else None,
            ip_address=request.client.host,
            user_agent=request.headers.get("user-agent"),
            path="/auth/login",
            method="POST",
            status_code=status.HTTP_401_UNAUTHORIZED,
            details=f"E-mail: {form_data.username}" + (" (Desativado)" if user and not user.is_active else "")
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas ou conta desativada",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    
    # Log success login
    audit_service.log_event(
        db,
        event_type="LOGIN_SUCCESS",
        user_id=user.id,
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent"),
        path="/auth/login",
        method="POST",
        status_code=200
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(security.get_current_user)):
    return current_user

@router.post("/logout")
async def logout(
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    audit_service.log_event(
        db,
        event_type="LOGOUT",
        user_id=current_user.id,
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent"),
        path="/auth/logout",
        method="POST",
        status_code=200
    )
    return {"message": "Sessão encerrada"}

@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
async def register(
    request: Request,
    user_in: schemas.UserRegister,
    db: Session = Depends(get_db)
):
    # Check if email already exists
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")
    
    # First user logic: if database is empty, first user is ADMIN
    user_count = db.query(models.User).count()
    role = "ADMIN" if user_count == 0 else "USER"
    
    hashed_password = security.get_password_hash(user_in.password)
    new_user = models.User(
        name=user_in.name,
        email=user_in.email,
        password_hash=hashed_password,
        role=role,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Log registration
    audit_service.log_event(
        db,
        event_type="REGISTER_SUCCESS",
        user_id=new_user.id,
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent"),
        path="/auth/register",
        method="POST",
        status_code=201,
        details=f"Novo cadastro: {new_user.email} (Role: {role})"
    )
    
    return new_user
