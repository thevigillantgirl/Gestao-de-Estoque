from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..db import get_db

router = APIRouter(prefix="/products", tags=["products"])

@router.post("/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.sku == product.sku).first()
    if db_product:
        raise HTTPException(status_code=400, detail="SKU already registered")
    
    new_product = models.Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.get("/", response_model=List[schemas.Product])
def list_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@router.get("/low-stock", response_model=List[schemas.Product])
def list_low_stock_products(db: Session = Depends(get_db)):
    return db.query(models.Product).filter(models.Product.stock <= models.Product.min_stock).all()
