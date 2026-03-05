from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from .. import models, schemas
from ..security import get_db
from ..services import email_service, audit_service

router = APIRouter(prefix="/access-requests", tags=["Access Requests"])

@router.post("/", response_model=schemas.AccessRequest)
async def create_access_request(
    request: Request,
    request_in: schemas.AccessRequestCreate,
    db: Session = Depends(get_db)
):
    new_request = models.AccessRequest(
        name=request_in.name,
        email=request_in.email,
        company=request_in.company,
        message=request_in.message
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    
    # Log event
    audit_service.log_event(
        db,
        event_type="ACCESS_REQUEST_CREATED",
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent"),
        path="/access-requests",
        method="POST",
        status_code=201,
        details=f"Request from {new_request.name} ({new_request.email})"
    )
    
    # Send email notification
    email_service.send_access_request_notification(
        name=new_request.name,
        email=new_request.email,
        company=new_request.company,
        message=new_request.message
    )
    
    return new_request
