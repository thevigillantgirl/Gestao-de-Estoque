from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import db, security, models_erp, schemas_erp
from ..security import get_current_user

router = APIRouter(prefix="/crm", tags=["CRM"])

@router.get("/leads", response_model=List[schemas_erp.Lead])
async def list_leads(
    db_session: Session = Depends(db.get_db),
    current_user: models_erp.models.User = Depends(get_current_user)
):
    return db_session.query(models_erp.Lead).all()

@router.post("/leads", response_model=schemas_erp.Lead)
async def create_lead(
    lead_in: schemas_erp.LeadCreate,
    db_session: Session = Depends(db.get_db),
    current_user: models_erp.models.User = Depends(get_current_user)
):
    new_lead = models_erp.Lead(**lead_in.model_dump())
    db_session.add(new_lead)
    db_session.commit()
    db_session.refresh(new_lead)
    return new_lead

@router.put("/leads/{lead_id}", response_model=schemas_erp.Lead)
async def update_lead(
    lead_id: int,
    lead_in: schemas_erp.LeadCreate,
    db_session: Session = Depends(db.get_db),
    current_user: models_erp.models.User = Depends(get_current_user)
):
    lead = db_session.query(models_erp.Lead).filter(models_erp.Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    for key, value in lead_in.model_dump().items():
        setattr(lead, key, value)
    
    db_session.commit()
    db_session.refresh(lead)
    return lead
