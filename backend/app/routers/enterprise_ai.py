from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import db, security, models, models_erp
from ..security import get_current_user

router = APIRouter(prefix="/enterprise-ai", tags=["Enterprise AI"])

@router.get("/insights")
async def get_ai_insights(
    db_session: Session = Depends(db.get_db),
    current_user: models.User = Depends(get_current_user)
):
    insights = []
    
    # Check for low stock
    low_stock_count = db_session.query(models.Product).filter(models.Product.stock <= models.Product.min_stock).count()
    if low_stock_count > 0:
        insights.append({
            "type": "WARNING",
            "title": "Estoque Baixo Detectado",
            "message": f"Existem {low_stock_count} produtos com nível de estoque abaixo do mínimo recomendado."
        })
        
    # Check for recent sales
    recent_sales_count = db_session.query(models_erp.Sale).count()
    if recent_sales_count == 0:
        insights.append({
            "type": "TIP",
            "title": "Alerta de Vendas",
            "message": "Nenhuma venda registrada recentemente. Considere revisar suas estratégias de CRM."
        })
        
    # Finance insight
    income = db_session.query(func.sum(models_erp.Transaction.amount)).filter(models_erp.Transaction.type == "INCOME").scalar() or 0
    expense = db_session.query(func.sum(models_erp.Transaction.amount)).filter(models_erp.Transaction.type == "EXPENSE").scalar() or 0
    if expense > income:
        insights.append({
            "type": "CRITICAL",
            "title": "Saúde Financeira",
            "message": "Suas despesas superaram as receitas no período atual."
        })
    else:
        insights.append({
            "type": "SUCCESS",
            "title": "Fluxo Positivo",
            "message": "Operação lucrativa! O saldo atual é positivo."
        })

    return {
        "summary": "Análise completa do sistema concluída.",
        "insights": insights
    }
