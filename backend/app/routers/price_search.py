from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import asc
from typing import List, Optional
from .. import models, schemas, security
from ..security import get_db

router = APIRouter(prefix="/price-search", tags=["Price Search"])

@router.get("/", response_model=List[schemas.ProductPrice])
async def search_prices(
    state: Optional[str] = None,
    product_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.ProductPrice)
    
    if state:
        query = query.filter(models.ProductPrice.state == state.upper())
    
    if product_id:
        query = query.filter(models.ProductPrice.product_id == product_id)
    
    # Order by price (cheapest first)
    return query.order_by(asc(models.ProductPrice.price)).all()

@router.post("/", response_model=schemas.ProductPrice)
async def create_price_record(
    price_in: schemas.ProductPriceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.check_admin)
):
    new_price = models.ProductPrice(**price_in.model_dump())
    db.add(new_price)
    db.commit()
    db.refresh(new_price)
    return new_price
