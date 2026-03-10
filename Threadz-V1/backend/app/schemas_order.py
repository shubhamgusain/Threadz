from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class OrderItemCreate(BaseModel):
    variant_id: str
    design_id: Optional[str] = None
    quantity: int
    unit_price: int

class OrderCreate(BaseModel):
    total_amount: int
    shipping_address_id: Optional[str] = None
    items: List[OrderItemCreate]

class OrderItemResponse(OrderItemCreate):
    order_item_id: str
    order_id: str

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    order_id: str
    user_id: Optional[str] = None
    status: str
    total_amount: int
    razorpay_order_id: Optional[str] = None
    shipping_address_id: Optional[str] = None
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True
