from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import db, security, models, models_erp, schemas_erp
from ..security import get_current_user

router = APIRouter(prefix="/sales", tags=["Sales"])

@router.get("/", response_model=List[schemas_erp.Sale])
async def list_sales(
    db_session: Session = Depends(db.get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db_session.query(models_erp.Sale).all()

@router.post("/", response_model=schemas_erp.Sale)
async def create_sale(
    sale_in: schemas_erp.SaleCreate,
    db_session: Session = Depends(db.get_db),
    current_user: models.User = Depends(get_current_user)
):
    # 1. Verify stock for all items
    items_to_create = []
    total_amount = 0
    
    for item in sale_in.items:
        product = db_session.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
        
        # Deduct stock
        product.stock -= item.quantity
        total_amount += item.quantity * item.unit_price
        
        items_to_create.append(models_erp.SaleItem(
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price
        ))
        
        # Log stock movement
        movement = models.StockMovement(
            product_id=product.id,
            type="OUT",
            quantity=item.quantity,
            reason=f"Sale #{total_amount}" # Placeholder
        )
        db_session.add(movement)

    # 2. Create Sale
    new_sale = models_erp.Sale(
        client_id=sale_in.client_id,
        total_amount=total_amount,
        status="PAID"
    )
    db_session.add(new_sale)
    db_session.commit()
    db_session.refresh(new_sale)
    
    # Associate items
    for item in items_to_create:
        item.sale_id = new_sale.id
        db_session.add(item)
    
    # Create Finance Transaction automatically
    transaction = models_erp.Transaction(
        type="INCOME",
        category="Vendas",
        amount=total_amount,
        description=f"Venda registrada #{new_sale.id}"
    )
    db_session.add(transaction)
    
    db_session.commit()
    db_session.refresh(new_sale)
    return new_sale
