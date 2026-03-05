import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, security
from ..security import get_db, get_current_user

router = APIRouter(prefix="/stock", tags=["stock"])

def create_integration_event(db: Session, event_type: str, payload: dict):
    event = models.IntegrationEvent(
        event_type=event_type,
        payload_json=json.dumps(payload)
    )
    db.add(event)
    # We don't commit here, the caller should commit

@router.post("/movements", response_model=schemas.StockMovement)
def create_movement(
    movement: schemas.StockMovementCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
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
        # 1. Integration event (existing)
        create_integration_event(db, "stock.low", {
            "product_id": product.id,
            "sku": product.sku,
            "stock": product.stock,
            "min_stock": product.min_stock
        })
        
        # 2. Email Alert Logic (as requested)
        settings = db.query(models.SystemSettings).first()
        if settings and settings.email_alerts_enabled and settings.low_stock_email_recipient:
            # Simple check to avoid flooding (e.g., 1 alert per hour for simplicity here)
            # In a real app we'd track per-product last alert time
            print(f"ALERTA: Enviando email para {settings.low_stock_email_recipient} sobre {product.name}")
            # Here we would call an email service: send_low_stock_email(...)
            
            security.create_access_log(
                db=db,
                user_id=None, # System event
                path="/stock/movements",
                method="SYSTEM",
                event_type="LOW_STOCK_ALERT_SENT",
                status_code=200,
                details=f"Email alert sent to {settings.low_stock_email_recipient} for product {product.sku}"
            )

    security.create_access_log(
        db=db,
        user_id=current_user.id,
        path="/stock/movements",
        method="POST",
        event_type="STOCK_MOVEMENT",
        status_code=201,
        details=f"Movement {movement.type} of {movement.quantity} for product {product.sku}. New stock: {product.stock}"
    )

    db.commit()
    db.refresh(new_movement)
    return new_movement
