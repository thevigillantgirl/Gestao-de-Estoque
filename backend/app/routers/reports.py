from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from .. import models, schemas, security
from ..security import get_db

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/dashboard/stats", response_model=schemas.DashboardStats)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    total_inventory_value = db.query(func.sum(models.Product.stock * models.Product.cost)).scalar() or 0.0
    total_products = db.query(models.Product).count()
    low_stock_count = db.query(models.Product).filter(models.Product.stock <= models.Product.min_stock).count()
    
    # Today's date (simplified)
    today = func.date(func.now())
    today_movements = db.query(models.StockMovement).filter(func.date(models.StockMovement.created_at) == today).count()
    
    open_purchase_orders = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.status.in_(["DRAFT", "SENT"])).count()
    
    return {
        "total_inventory_value": total_inventory_value,
        "total_products": total_products,
        "low_stock_count": low_stock_count,
        "today_movements": today_movements,
        "open_purchase_orders": open_purchase_orders
    }

@router.get("/dashboard/charts", response_model=schemas.DashboardCharts)
async def get_dashboard_charts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    # 1. Stock movements evolution (last 7 days)
    # This is a simplified mockup of the logic
    import datetime
    today = datetime.date.today()
    movements = []
    for i in range(6, -1, -1):
        day = today - datetime.timedelta(days=i)
        day_str = day.strftime("%d/%m")
        entradas = db.query(func.sum(models.StockMovement.quantity)).filter(
            func.date(models.StockMovement.created_at) == day,
            models.StockMovement.type == "IN"
        ).scalar() or 0
        saidas = db.query(func.sum(models.StockMovement.quantity)).filter(
            func.date(models.StockMovement.created_at) == day,
            models.StockMovement.type == "OUT"
        ).scalar() or 0
        movements.append({"date": day_str, "entradas": entradas, "saidas": saidas})
    
    # 2. Top products by stock level
    top_products_db = db.query(models.Product).order_by(models.Product.stock.desc()).limit(5).all()
    top_products = [{"name": p.name, "stock": p.stock} for p in top_products_db]
    
    # 3. Category distribution
    categories_db = db.query(
        models.Product.category,
        func.sum(models.Product.stock * models.Product.cost).label("value")
    ).group_by(models.Product.category).all()
    
    category_distribution = [
        {"name": c.category or "Sem Categoria", "value": float(c.value or 0)} 
        for c in categories_db
    ]
    
    return {
        "stock_movements": movements,
        "top_products": top_products,
        "category_distribution": category_distribution
    }
