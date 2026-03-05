from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, security
from ..security import get_db

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("/", response_model=schemas.SystemSettings)
async def get_settings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.check_admin)
):
    settings = db.query(models.SystemSettings).first()
    if not settings:
        # Create default
        settings = models.SystemSettings(
            low_stock_email_recipient="",
            email_alerts_enabled=True
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/", response_model=schemas.SystemSettings)
async def update_settings(
    settings_data: schemas.SystemSettings,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.check_admin)
):
    settings = db.query(models.SystemSettings).first()
    if not settings:
        settings = models.SystemSettings()
        db.add(settings)
    
    settings.low_stock_email_recipient = settings_data.low_stock_email_recipient
    settings.email_alerts_enabled = settings_data.email_alerts_enabled
    
    db.commit()
    db.refresh(settings)
    return settings
