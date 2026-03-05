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
    category: Optional[str] = None
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

# User
class UserBase(BaseModel):
    email: str
    name: Optional[str] = None
    role: str = "USER"
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None

class User(UserBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Auth
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# Access Log
class AccessLogBase(BaseModel):
    user_id: Optional[int] = None
    timestamp: Optional[datetime] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    path: str
    method: str
    event_type: str
    status_code: Optional[int] = None
    details: Optional[str] = None

class AccessLog(AccessLogBase):
    id: int
    user: Optional[User] = None
    model_config = ConfigDict(from_attributes=True)

# Access Request
class AccessRequestBase(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    message: Optional[str] = None

class AccessRequestCreate(AccessRequestBase):
    pass

class AccessRequestUpdate(BaseModel):
    status: str # "APPROVED", "REJECTED"

class AccessRequest(AccessRequestBase):
    id: int
    status: str
    created_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewed_by_user_id: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)

# Dashboard & Reports
class DashboardStats(BaseModel):
    total_inventory_value: float
    total_products: int
    low_stock_count: int
    today_movements: int
    open_purchase_orders: int

class StockMovementPoint(BaseModel):
    date: str
    entradas: int
    saidas: int

class ProductStockPoint(BaseModel):
    name: str
    stock: int

class CategoryPoint(BaseModel):
    name: str
    value: float

class DashboardCharts(BaseModel):
    stock_movements: List[StockMovementPoint]
    top_products: List[ProductStockPoint]
    category_distribution: List[CategoryPoint]

# Settings
class SystemSettings(BaseModel):
    low_stock_email_recipient: Optional[str] = None
    email_alerts_enabled: bool
    model_config = ConfigDict(from_attributes=True)
