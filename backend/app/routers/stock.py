import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..db import get_db

router = APIRouter(prefix="/stock", tags=["stock"])

def create_integration_event(db: Session, event_type: str, payload: dict):
    event = models.IntegrationEvent(
        event_type=event_type,
        payload_json=json.dumps(payload)
    )
    db.add(event)
    # We don't commit here, the caller should commit

@router.post("/movements", response_model=schemas.StockMovement)
def create_movement(movement: schemas.StockMovementCreate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == movement.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    quantity_change = movement.quantity
    
    if movement.type == "IN":
        product.stock += quantity_change
    elif movement.type == "OUT":
        if product.stock < quantity_change:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        product.stock -= quantity_change
    elif movement.type == "ADJUST":
        product.stock = quantity_change
    else:
        raise HTTPException(status_code=400, detail="Invalid movement type")

    new_movement = models.StockMovement(**movement.model_dump())
    db.add(new_movement)
    
    # Generate events
    create_integration_event(db, "stock.updated", {
        "product_id": product.id,
        "sku": product.sku,
        "new_stock": product.stock
    })
    
    if product.stock <= product.min_stock:
        create_integration_event(db, "stock.low", {
            "product_id": product.id,
            "sku": product.sku,
            "stock": product.stock,
            "min_stock": product.min_stock
        })

    db.commit()
    db.refresh(new_movement)
    return new_movement
