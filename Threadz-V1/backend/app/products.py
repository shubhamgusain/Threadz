from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from . import models, schemas_product
from .database import get_db

router = APIRouter(prefix="/api/v1/products", tags=["products"])

@router.get("/", response_model=List[schemas_product.ProductResponse])
async def get_products(db: AsyncSession = Depends(get_db)):
    query = select(models.Product).where(models.Product.is_active == True).options(selectinload(models.Product.variants))
    result = await db.execute(query)
    products = result.scalars().all()
    return products

@router.get("/{product_id}", response_model=schemas_product.ProductResponse)
async def get_product(product_id: str, db: AsyncSession = Depends(get_db)):
    query = select(models.Product).where(models.Product.product_id == product_id).options(selectinload(models.Product.variants))
    result = await db.execute(query)
    product = result.scalars().first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    return product
    
@router.post("/seed")
async def seed_products(db: AsyncSession = Depends(get_db)):
    # Check if we already have products
    result = await db.execute(select(models.Product))
    existing = result.scalars().first()
    if existing:
        return {"message": "Database already seeded"}

    # T-Shirt
    tshirt = models.Product(
        name="Premium Heavyweight T-Shirt",
        description="A stylish, boxy-fit heavyweight cotton t-shirt built for maximum durability and comfort. The perfect canvas for your custom designs.",
        category="t-shirt",
        base_price=2499,
        fit_type="oversized",
        gsm=280,
        fabric_composition="100% Organic Cotton"
    )

    tshirt.variants = [
        models.ProductVariant(color_name="Black", color_hex="#1a1a1a", size="M", stock_quantity=100, sku="TS-BLK-M"),
        models.ProductVariant(color_name="Black", color_hex="#1a1a1a", size="L", stock_quantity=100, sku="TS-BLK-L"),
        models.ProductVariant(color_name="White", color_hex="#f8f9fa", size="M", stock_quantity=100, sku="TS-WHT-M"),
        models.ProductVariant(color_name="White", color_hex="#f8f9fa", size="L", stock_quantity=100, sku="TS-WHT-L"),
        models.ProductVariant(color_name="Lavender", color_hex="#d8bfd8", size="M", stock_quantity=50, sku="TS-LAV-M"),
    ]

    # Hoodie
    hoodie = models.Product(
        name="Essential Pullover Hoodie",
        description="Cozy, warm, and highly printable. Our premium fleece hoodie features a drop-shoulder design.",
        category="hoodie",
        base_price=4500,
        fit_type="regular",
        gsm=400,
        fabric_composition="80% Cotton, 20% Polyester"
    )

    hoodie.variants = [
        models.ProductVariant(color_name="Black", color_hex="#1a1a1a", size="L", stock_quantity=50, sku="HD-BLK-L"),
        models.ProductVariant(color_name="Heather Grey", color_hex="#a9a9a9", size="L", stock_quantity=30, sku="HD-GRY-L")
    ]

    db.add(tshirt)
    db.add(hoodie)
    await db.commit()
    
    return {"message": "Successfully seeded products"}
