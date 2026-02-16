"""
Pydantic schemas for products.
"""

from typing import Optional

from pydantic import BaseModel

from app.db.models import PlantEnvironment, ProductKind


class ProductAttributesResponse(BaseModel):
    plant_environment: Optional[PlantEnvironment] = None
    size: Optional[str] = None
    color: Optional[str] = None
    care_instructions: Optional[str] = None

    class Config:
        from_attributes = True


class InventoryResponse(BaseModel):
    quantity: int

    class Config:
        from_attributes = True


class ProductResponse(BaseModel):
    id: int
    slug: str
    name: str
    description: Optional[str]
    price_cents: int
    currency: str
    kind: ProductKind
    active: bool
    attributes: Optional[ProductAttributesResponse] = None
    inventory: Optional[InventoryResponse] = None

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    page_size: int


class ProductAttributesRequest(BaseModel):
    plant_environment: Optional[PlantEnvironment] = None
    size: Optional[str] = None
    color: Optional[str] = None
    care_instructions: Optional[str] = None


class CreateProductRequest(BaseModel):
    slug: str
    name: str
    description: Optional[str] = None
    price_cents: int
    currency: str = "USD"
    kind: ProductKind
    active: bool = False  # Default to inactive until ready
    attributes: Optional[ProductAttributesRequest] = None


class UpdateProductRequest(BaseModel):
    slug: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    price_cents: Optional[int] = None
    currency: Optional[str] = None
    kind: Optional[ProductKind] = None
    active: Optional[bool] = None
    attributes: Optional[ProductAttributesRequest] = None



