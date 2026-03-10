from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProductVariantBase(BaseModel):
    color_name: str
    color_hex: str
    size: str
    stock_quantity: int
    price_adjustment: int = 0
    sku: Optional[str] = None

class ProductVariantResponse(ProductVariantBase):
    variant_id: str
    product_id: str

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    base_price: int # In cents
    fit_type: Optional[str] = None
    gsm: Optional[int] = None
    fabric_composition: Optional[str] = None
    is_active: bool = True

class ProductResponse(ProductBase):
    product_id: str
    created_at: datetime
    variants: List[ProductVariantResponse] = []

    class Config:
        from_attributes = True
