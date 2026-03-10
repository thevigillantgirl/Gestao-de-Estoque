from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, security
from ..security import get_db, get_current_user

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])

@router.post("/", response_model=schemas.Supplier)
def create_supplier(supplier: schemas.SupplierCreate, db: Session = Depends(get_db)):
    new_supplier = models.Supplier(**supplier.model_dump())
    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)
    return new_supplier

@router.get("/", response_model=List[schemas.Supplier])
def list_suppliers(db: Session = Depends(get_db)):
    return db.query(models.Supplier).all()
