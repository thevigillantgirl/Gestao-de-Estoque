from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, security
from ..security import get_db, get_current_user

router = APIRouter(prefix="/purchase-orders", tags=["Purchase Orders"])

@router.post("/", response_model=schemas.PurchaseOrder)
def create_purchase_order(
    po: schemas.PurchaseOrderCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Verify supplier
    supplier = db.query(models.Supplier).filter(models.Supplier.id == po.supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    new_po = models.PurchaseOrder(
        supplier_id=po.supplier_id,
        notes=po.notes,
        status="DRAFT"
    )
    db.add(new_po)
    db.flush()  # To get new_po.id

    for item in po.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        po_item = models.PurchaseOrderItem(
            purchase_order_id=new_po.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_cost=item.unit_cost
        )
        db.add(po_item)

    db.commit()
    db.refresh(new_po)
    return new_po

@router.get("/", response_model=List[schemas.PurchaseOrder])
def list_purchase_orders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.PurchaseOrder).all()

@router.patch("/{po_id}/status", response_model=schemas.PurchaseOrder)
def update_purchase_order_status(
    po_id: int, 
    status_update: schemas.PurchaseOrderUpdateStatus, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    po = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.id == po_id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase Order not found")

    new_status = status_update.status.upper()
    valid_statuses = ["DRAFT", "SENT", "RECEIVED", "CANCELLED"]
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")

    if po.status == "RECEIVED" or po.status == "CANCELLED":
        raise HTTPException(status_code=400, detail="Cannot change status of a finished order")

    # Business Logic for status change
    if new_status == "SENT":
        models.create_integration_event(db, "purchase_order.sent", {"id": po.id})
    
    elif new_status == "RECEIVED":
        # Update stock for each item
        for item in po.items:
            product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
            if product:
                product.stock += item.quantity
                # Create Stock Movement record
                movement = models.StockMovement(
                    product_id=product.id,
                    type="IN",
                    quantity=item.quantity,
                    reason=f"Purchase Order #{po.id} RECEIVED"
                )
                db.add(movement)
                # Stock updated event
                models.create_integration_event(db, "stock.updated", {
                    "product_id": product.id,
                    "sku": product.sku,
                    "new_stock": product.stock
                })
        models.create_integration_event(db, "purchase_order.received", {"id": po.id})

    po.status = new_status
    db.commit()
    db.refresh(po)
    return po
