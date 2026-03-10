import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Integer
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

# We use String(36) to store UUIDs universally to be compatible with SQLite
def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    user_id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255))
    full_name = Column(String(255), nullable=False)
    phone = Column(String(15))
    profile_picture_url = Column(Text)
    oauth_provider = Column(String(50))
    oauth_id = Column(String(255))
    email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime)

    addresses = relationship("Address", back_populates="owner", cascade="all, delete-orphan")
    designs = relationship("Design", back_populates="creator", cascade="all, delete-orphan")

class Address(Base):
    __tablename__ = "addresses"

    address_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id", ondelete="CASCADE"))
    address_type = Column(String(20)) # home, work, other
    full_name = Column(String(255), nullable=False)
    phone = Column(String(15), nullable=False)
    address_line1 = Column(String(500), nullable=False)
    address_line2 = Column(String(500))
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(10), nullable=False)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="addresses")

class Design(Base):
    __tablename__ = "designs"

    design_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id", ondelete="SET NULL"))
    design_name = Column(String(255))
    design_source = Column(String(20)) # upload, ai_generated, explore
    image_url = Column(Text, nullable=False)
    thumbnail_url = Column(Text)
    ai_prompt = Column(Text)
    ai_style = Column(String(50))
    width_px = Column(Integer)
    height_px = Column(Integer)
    dpi = Column(Integer)
    file_size_kb = Column(Integer)
    is_public = Column(Boolean, default=False, index=True)
    moderation_status = Column(String(20), default="pending") # pending, approved, rejected
    created_at = Column(DateTime, default=datetime.utcnow)
    tags = Column(String(500)) # Simple comma-separated string for local SQLite since arrays aren't natively supported 

    creator = relationship("User", back_populates="designs")

class Product(Base):
    __tablename__ = "products"

    product_id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    category = Column(String(50)) # t-shirt, hoodie, jacket
    base_price = Column(Integer, nullable=False) # In cents
    fit_type = Column(String(50)) # regular, oversized, slim
    gsm = Column(Integer)
    fabric_composition = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")

class ProductVariant(Base):
    __tablename__ = "product_variants"

    variant_id = Column(String(36), primary_key=True, default=generate_uuid)
    product_id = Column(String(36), ForeignKey("products.product_id", ondelete="CASCADE"))
    color_name = Column(String(50))
    color_hex = Column(String(7))
    size = Column(String(10)) # XS, S, M, L, XL, XXL
    stock_quantity = Column(Integer, default=0)
    price_adjustment = Column(Integer, default=0) # In cents
    sku = Column(String(100), unique=True, index=True)

    product = relationship("Product", back_populates="variants")

class Order(Base):
    __tablename__ = "orders"

    order_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id", ondelete="SET NULL"))
    status = Column(String(50), default="Pending") # Pending, Paid, Shipped, Delivered, Cancelled
    total_amount = Column(Integer, nullable=False) # In cents
    razorpay_order_id = Column(String(100), unique=True, index=True)
    shipping_address_id = Column(String(36), ForeignKey("addresses.address_id", ondelete="SET NULL"))
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    buyer = relationship("User")

class OrderItem(Base):
    __tablename__ = "order_items"

    order_item_id = Column(String(36), primary_key=True, default=generate_uuid)
    order_id = Column(String(36), ForeignKey("orders.order_id", ondelete="CASCADE"))
    variant_id = Column(String(36), ForeignKey("product_variants.variant_id", ondelete="SET NULL"))
    design_id = Column(String(36), ForeignKey("designs.design_id", ondelete="SET NULL"))
    quantity = Column(Integer, default=1)
    unit_price = Column(Integer, nullable=False) # Base price + variant adjustment

    order = relationship("Order", back_populates="items")
