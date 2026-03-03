from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional

# Shared schemas
class ProductBase(BaseModel):
    sku: str
    name: str
    cost: float = 0.0
    price: float = 0.0
    stock: int = 0
    min_stock: int = 0
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Stock Movement
class StockMovementCreate(BaseModel):
    product_id: int
    type: str  # "IN", "OUT", "ADJUST"
    quantity: int
    reason: Optional[str] = None

class StockMovement(StockMovementCreate):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Supplier
class SupplierBase(BaseModel):
    name: str
    document: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class SupplierCreate(SupplierBase):
    pass

class Supplier(SupplierBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Purchase Order Item
class PurchaseOrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_cost: float

class PurchaseOrderItem(PurchaseOrderItemCreate):
    id: int
    purchase_order_id: int
    model_config = ConfigDict(from_attributes=True)

# Purchase Order
class PurchaseOrderCreate(BaseModel):
    supplier_id: int
    notes: Optional[str] = None
    items: List[PurchaseOrderItemCreate]

class PurchaseOrderUpdateStatus(BaseModel):
    status: str

class PurchaseOrder(BaseModel):
    id: int
    supplier_id: int
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[PurchaseOrderItem]
    model_config = ConfigDict(from_attributes=True)

# Integration
class IntegrationEndpointCreate(BaseModel):
    name: str
    event_type: str
    target_url: str
    secret: Optional[str] = None
    is_active: bool = True

class IntegrationEndpoint(IntegrationEndpointCreate):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class IntegrationEvent(BaseModel):
    id: int
    event_type: str
    payload_json: str
    status: str
    last_error: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
