"""
Pydantic schemas for order fulfillments and allocation.
"""

from typing import List, Optional

from pydantic import BaseModel

from app.db.models import FulfillmentStatus


class OrderFulfillmentItemResponse(BaseModel):
    id: int
    fulfillment_id: int
    order_item_id: int
    quantity: int
    order_item_product_name: Optional[str] = None  # Can be populated from join

    class Config:
        from_attributes = True


class OrderFulfillmentResponse(BaseModel):
    id: int
    order_id: int
    nursery_id: Optional[int] = None
    nursery_name: Optional[str] = None  # Can be populated from join
    status: FulfillmentStatus
    delivery_name: Optional[str] = None
    delivery_phone: Optional[str] = None
    delivery_notes: Optional[str] = None
    created_at: str
    updated_at: str
    items: List[OrderFulfillmentItemResponse] = []

    class Config:
        from_attributes = True


class AllocationItemRequest(BaseModel):
    order_item_id: int
    quantity: int


class AllocationRequest(BaseModel):
    nursery_id: int
    items: List[AllocationItemRequest]


class CreateAllocationRequest(BaseModel):
    allocations: List[AllocationRequest]


class DeliveryContactRequest(BaseModel):
    delivery_name: str
    delivery_phone: str
    delivery_notes: Optional[str] = None


class NurseryAllocationSuggestion(BaseModel):
    nursery_id: int
    nursery_name: str
    city: str
    commune: Optional[str] = None
    match_tier: int  # 1=same commune, 2=same city, 3=other
    available_items: List[dict]  # {order_item_id, product_name, requested_qty, available_qty}


class AllocationSuggestionsResponse(BaseModel):
    order_id: int
    suggestions: List[NurseryAllocationSuggestion]


