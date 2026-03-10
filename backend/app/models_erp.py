from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .db import Base
from . import models # Ensure existing tables are in registry

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    company = Column(String)
    status = Column(String, default="ACTIVE") # ACTIVE, INACTIVE
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    company = Column(String)
    source = Column(String) # Website, Referral, etc.
    status = Column(String, default="NEW") # NEW, CONTACTED, QUALIFIED, LOST, WON
    stage = Column(String, default="LEAD") # LEAD, OPPORTUNITY, NEGOTIATION, CLOSED
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    total_amount = Column(Float, default=0.0)
    status = Column(String, default="PENDING") # PENDING, PAID, CANCELLED, SHIPPED
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    client = relationship("Client")
    items = relationship("SaleItem", back_populates="sale")

class SaleItem(Base):
    __tablename__ = "sale_items"

    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    
    sale = relationship("Sale", back_populates="items")
    product = relationship("Product")

class Transaction(Base):
    __tablename__ = "finance_transactions"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False) # INCOME, EXPENSE
    category = Column(String) # Sales, Salary, Rent, etc.
    amount = Column(Float, nullable=False)
    description = Column(String)
    date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="COMPLETED") # COMPLETED, PENDING, CANCELLED
