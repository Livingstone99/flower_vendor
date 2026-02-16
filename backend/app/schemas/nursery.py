"""
Pydantic schemas for nurseries and nursery inventory.
"""

from typing import Optional
from decimal import Decimal

from pydantic import BaseModel


class NurseryResponse(BaseModel):
    id: int
    internal_name: str
    city: str
    commune: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class CreateNurseryRequest(BaseModel):
    internal_name: str
    city: str
    commune: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None


class UpdateNurseryRequest(BaseModel):
    internal_name: Optional[str] = None
    city: Optional[str] = None
    commune: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None


class NurseryInventoryResponse(BaseModel):
    id: int
    nursery_id: int
    product_id: int
    quantity: int
    updated_at: str
    product_name: Optional[str] = None  # Can be populated from join

    class Config:
        from_attributes = True


class UpsertNurseryInventoryRequest(BaseModel):
    quantity: int


