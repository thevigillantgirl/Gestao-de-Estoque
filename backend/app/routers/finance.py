from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from .. import db, security, models_erp, schemas_erp
from ..security import get_current_user

router = APIRouter(prefix="/finance", tags=["Finance"])

@router.get("/transactions", response_model=List[schemas_erp.Transaction])
async def list_transactions(
    db_session: Session = Depends(db.get_db),
    current_user: models_erp.models.User = Depends(get_current_user)
):
    return db_session.query(models_erp.Transaction).all()

@router.post("/transactions", response_model=schemas_erp.Transaction)
async def create_transaction(
    tx_in: schemas_erp.TransactionCreate,
    db_session: Session = Depends(db.get_db),
    current_user: models_erp.models.User = Depends(get_current_user)
):
    new_tx = models_erp.Transaction(**tx_in.model_dump())
    db_session.add(new_tx)
    db_session.commit()
    db_session.refresh(new_tx)
    return new_tx

@router.get("/stats")
async def get_finance_stats(
    db_session: Session = Depends(db.get_db),
    current_user: models_erp.models.User = Depends(get_current_user)
):
    income = db_session.query(func.sum(models_erp.Transaction.amount)).filter(models_erp.Transaction.type == "INCOME").scalar() or 0
    expense = db_session.query(func.sum(models_erp.Transaction.amount)).filter(models_erp.Transaction.type == "EXPENSE").scalar() or 0
    return {
        "balance": income - expense,
        "total_income": income,
        "total_expense": expense
    }
