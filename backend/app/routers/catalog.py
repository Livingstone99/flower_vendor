"""
Public catalog endpoints.
"""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.models import PlantEnvironment, Product, ProductAttributes, ProductKind
from app.db.session import get_db
from app.schemas.product import ProductListResponse, ProductResponse

router = APIRouter(prefix="/catalog", tags=["catalog"])


@router.get("/products", response_model=ProductListResponse)
async def list_products(
    kind: Optional[ProductKind] = Query(None, description="Filter by product kind"),
    plant_environment: Optional[PlantEnvironment] = Query(None, description="Filter by plant environment"),
    q: Optional[str] = Query(None, description="Search query"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List products with optional filters."""
    query = db.query(Product).filter(Product.active == True)

    if kind:
        query = query.filter(Product.kind == kind)

    if plant_environment:
        # Filter products that have the matching plant_environment attribute
        query = query.join(ProductAttributes).filter(
            or_(
                ProductAttributes.plant_environment == plant_environment,
                ProductAttributes.plant_environment == PlantEnvironment.BOTH
            )
        )

    if q:
        search_term = f"%{q}%"
        query = query.filter(
            (Product.name.ilike(search_term)) | (Product.description.ilike(search_term))
        )

    total = query.count()
    offset = (page - 1) * page_size
    products = query.offset(offset).limit(page_size).all()

    return ProductListResponse(
        items=[ProductResponse.model_validate(p) for p in products],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/products/{slug}", response_model=ProductResponse)
async def get_product(slug: str, db: Session = Depends(get_db)):
    """Get a single product by slug."""
    product = db.query(Product).filter(Product.slug == slug, Product.active == True).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return ProductResponse.model_validate(product)

