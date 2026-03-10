from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional

# Client
class ClientBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    status: str = "ACTIVE"

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Lead
class LeadBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    source: Optional[str] = None
    status: str = "NEW"
    stage: str = "LEAD"
    notes: Optional[str] = None

class LeadCreate(LeadBase):
    pass

class Lead(LeadBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

# Sale
class SaleItemBase(BaseModel):
    product_id: int
    quantity: int
    unit_price: float

class SaleItemCreate(SaleItemBase):
    pass

class SaleItem(SaleItemBase):
    id: int
    sale_id: int
    model_config = ConfigDict(from_attributes=True)

class SaleCreate(BaseModel):
    client_id: int
    items: List[SaleItemCreate]

class Sale(BaseModel):
    id: int
    client_id: int
    total_amount: float
    status: str
    created_at: datetime
    items: List[SaleItem]
    model_config = ConfigDict(from_attributes=True)

# Finance
class TransactionBase(BaseModel):
    type: str
    category: Optional[str] = None
    amount: float
    description: Optional[str] = None
    status: str = "COMPLETED"

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    date: datetime
    model_config = ConfigDict(from_attributes=True)
