"""
Admin-only endpoints for managing nurseries, inventory, and products.
"""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin_user
from app.db.models import Inventory, Nursery, NurseryInventory, Product, ProductAttributes, User
from app.db.session import get_db
from app.schemas.nursery import (
    CreateNurseryRequest,
    NurseryInventoryResponse,
    NurseryResponse,
    UpdateNurseryRequest,
    UpsertNurseryInventoryRequest,
)
from app.schemas.product import (
    CreateProductRequest,
    ProductListResponse,
    ProductResponse,
    UpdateProductRequest,
)

router = APIRouter(prefix="/admin", tags=["admin"])


def _recompute_global_inventory(db: Session, product_id: int) -> None:
    """Recompute global inventory quantity from nursery inventories."""
    total = (
        db.query(func.sum(NurseryInventory.quantity))
        .filter(NurseryInventory.product_id == product_id)
        .scalar()
        or 0
    )

    inventory = db.query(Inventory).filter(Inventory.product_id == product_id).first()
    if inventory:
        inventory.quantity = total
    else:
        inventory = Inventory(product_id=product_id, quantity=total)
        db.add(inventory)
    db.flush()


# Nursery endpoints
@router.post("/nurseries", response_model=NurseryResponse, status_code=status.HTTP_201_CREATED)
async def create_nursery(
    request: CreateNurseryRequest,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Create a new nursery (admin only)."""
    nursery = Nursery(
        internal_name=request.internal_name,
        city=request.city,
        commune=request.commune,
        latitude=request.latitude,
        longitude=request.longitude,
    )
    db.add(nursery)
    db.commit()
    db.refresh(nursery)
    return NurseryResponse.model_validate(nursery)


@router.get("/nurseries", response_model=List[NurseryResponse])
async def list_nurseries(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """List all nurseries (admin only)."""
    nurseries = db.query(Nursery).order_by(Nursery.created_at.desc()).all()
    return [NurseryResponse.model_validate(n) for n in nurseries]


@router.get("/nurseries/{nursery_id}", response_model=NurseryResponse)
async def get_nursery(
    nursery_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Get a single nursery by ID (admin only)."""
    nursery = db.query(Nursery).filter(Nursery.id == nursery_id).first()
    if not nursery:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nursery not found")
    return NurseryResponse.model_validate(nursery)


@router.patch("/nurseries/{nursery_id}", response_model=NurseryResponse)
async def update_nursery(
    nursery_id: int,
    request: UpdateNurseryRequest,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Update a nursery (admin only)."""
    nursery = db.query(Nursery).filter(Nursery.id == nursery_id).first()
    if not nursery:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nursery not found")

    if request.internal_name is not None:
        nursery.internal_name = request.internal_name
    if request.city is not None:
        nursery.city = request.city
    if request.commune is not None:
        nursery.commune = request.commune
    if request.latitude is not None:
        nursery.latitude = request.latitude
    if request.longitude is not None:
        nursery.longitude = request.longitude

    db.commit()
    db.refresh(nursery)
    return NurseryResponse.model_validate(nursery)


@router.delete("/nurseries/{nursery_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_nursery(
    nursery_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Delete a nursery (admin only)."""
    nursery = db.query(Nursery).filter(Nursery.id == nursery_id).first()
    if not nursery:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nursery not found")
    
    db.delete(nursery)
    db.commit()


# Nursery inventory endpoints
@router.put(
    "/nurseries/{nursery_id}/inventory/{product_id}",
    response_model=NurseryInventoryResponse,
)
async def upsert_nursery_inventory(
    nursery_id: int,
    product_id: int,
    request: UpsertNurseryInventoryRequest,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Create or update nursery inventory quantity (admin only). Recomputes global inventory."""
    # Verify nursery exists
    nursery = db.query(Nursery).filter(Nursery.id == nursery_id).first()
    if not nursery:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nursery not found")

    # Verify product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    # Upsert nursery inventory
    nursery_inventory = (
        db.query(NurseryInventory)
        .filter(NurseryInventory.nursery_id == nursery_id, NurseryInventory.product_id == product_id)
        .first()
    )

    if nursery_inventory:
        nursery_inventory.quantity = request.quantity
    else:
        nursery_inventory = NurseryInventory(
            nursery_id=nursery_id, product_id=product_id, quantity=request.quantity
        )
        db.add(nursery_inventory)

    db.flush()

    # Recompute global inventory
    _recompute_global_inventory(db, product_id)

    db.commit()
    db.refresh(nursery_inventory)

    # Populate product name for response
    response = NurseryInventoryResponse.model_validate(nursery_inventory)
    response.product_name = product.name
    return response


@router.get("/nurseries/{nursery_id}/inventory", response_model=List[NurseryInventoryResponse])
async def list_nursery_inventory(
    nursery_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """List all inventory for a nursery (admin only)."""
    nursery = db.query(Nursery).filter(Nursery.id == nursery_id).first()
    if not nursery:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nursery not found")

    inventory_items = (
        db.query(NurseryInventory)
        .filter(NurseryInventory.nursery_id == nursery_id)
        .order_by(NurseryInventory.updated_at.desc())
        .all()
    )

    # Populate product names
    result = []
    for item in inventory_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        response = NurseryInventoryResponse.model_validate(item)
        response.product_name = product.name if product else None
        result.append(response)

    return result


# Product admin endpoints
@router.get("/products", response_model=ProductListResponse)
async def list_products_admin(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """List all products including inactive (admin only)."""
    query = db.query(Product)

    total = query.count()
    offset = (page - 1) * page_size
    products = query.order_by(Product.created_at.desc()).offset(offset).limit(page_size).all()

    return ProductListResponse(
        items=[ProductResponse.model_validate(p) for p in products],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    request: CreateProductRequest,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Create a new product (admin only). Defaults to active=False until ready for publishing."""
    # Check if slug already exists
    existing = db.query(Product).filter(Product.slug == request.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Product with slug '{request.slug}' already exists"
        )

    product = Product(
        slug=request.slug,
        name=request.name,
        description=request.description,
        price_cents=request.price_cents,
        currency=request.currency,
        kind=request.kind,
        active=request.active,
    )
    db.add(product)
    db.flush()

    # Create product attributes if provided
    if request.attributes:
        attributes = ProductAttributes(
            product_id=product.id,
            plant_environment=request.attributes.plant_environment,
            size=request.attributes.size,
            color=request.attributes.color,
            care_instructions=request.attributes.care_instructions,
        )
        db.add(attributes)

    # Create initial inventory (0 quantity)
    inventory = Inventory(product_id=product.id, quantity=0)
    db.add(inventory)

    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(product)


@router.patch("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    request: UpdateProductRequest,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Update a product (admin only). Can activate/publish products."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    # Update product fields
    if request.slug is not None:
        # Check if slug is being changed and if new slug exists
        if request.slug != product.slug:
            existing = db.query(Product).filter(Product.slug == request.slug).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Product with slug '{request.slug}' already exists",
                )
        product.slug = request.slug
    if request.name is not None:
        product.name = request.name
    if request.description is not None:
        product.description = request.description
    if request.price_cents is not None:
        product.price_cents = request.price_cents
    if request.currency is not None:
        product.currency = request.currency
    if request.kind is not None:
        product.kind = request.kind
    if request.active is not None:
        product.active = request.active

    # Update attributes if provided
    if request.attributes is not None:
        attributes = db.query(ProductAttributes).filter(ProductAttributes.product_id == product_id).first()
        if attributes:
            if request.attributes.plant_environment is not None:
                attributes.plant_environment = request.attributes.plant_environment
            if request.attributes.size is not None:
                attributes.size = request.attributes.size
            if request.attributes.color is not None:
                attributes.color = request.attributes.color
            if request.attributes.care_instructions is not None:
                attributes.care_instructions = request.attributes.care_instructions
        else:
            # Create attributes if they don't exist
            attributes = ProductAttributes(
                product_id=product.id,
                plant_environment=request.attributes.plant_environment,
                size=request.attributes.size,
                color=request.attributes.color,
                care_instructions=request.attributes.care_instructions,
            )
            db.add(attributes)

    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(product)


