from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import db, security, models_erp, schemas_erp
from ..security import get_current_user

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.get("/", response_model=List[schemas_erp.Client])
async def list_clients(
    db_session: Session = Depends(db.get_db),
    current_user: models_erp.models.User = Depends(get_current_user)
):
    return db_session.query(models_erp.Client).all()

@router.post("/", response_model=schemas_erp.Client)
async def create_client(
    client_in: schemas_erp.ClientCreate,
    db_session: Session = Depends(db.get_db),
    current_user: models_erp.models.User = Depends(get_current_user)
):
    new_client = models_erp.Client(**client_in.model_dump())
    db_session.add(new_client)
    db_session.commit()
    db_session.refresh(new_client)
    return new_client
