from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from .. import models, schemas, security
from ..security import get_db

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("/", response_model=List[dict])
async def global_search(
    q: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    results = []
    
    # Search Products
    products = db.query(models.Product).filter(
        or_(
            models.Product.name.ilike(f"%{q}%"),
            models.Product.sku.ilike(f"%{q}%"),
            models.Product.category.ilike(f"%{q}%")
        )
    ).limit(5).all()
    
    for p in products:
        results.append({
            "type": "product",
            "id": p.id,
            "title": p.name,
            "subtitle": f"SKU: {p.sku} | Estoque: {p.stock}",
            "path": "/products"
        })
        
    # Search Suppliers
    suppliers = db.query(models.Supplier).filter(
        or_(
            models.Supplier.name.ilike(f"%{q}%"),
            models.Supplier.document.ilike(f"%{q}%")
        )
    ).limit(5).all()
    
    for s in suppliers:
        results.append({
            "type": "supplier",
            "id": s.id,
            "title": s.name,
            "subtitle": f"Doc: {s.document}",
            "path": "/suppliers"
        })
        
    return results
