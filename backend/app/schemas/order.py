"""
Pydantic schemas for orders.
"""

from typing import Optional, List

from pydantic import BaseModel

from app.db.models import OrderStatus


class AddressResponse(BaseModel):
    full_name: str
    street_address: str
    city: str
    commune: Optional[str] = None
    state: Optional[str] = None
    postal_code: str
    country: str
    phone: Optional[str] = None

    class Config:
        from_attributes = True


class OrderItemResponse(BaseModel):
    id: int
    product_id: Optional[int]
    quantity: int
    unit_price_cents: int
    product_name: str

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    user_id: Optional[int]
    status: OrderStatus
    subtotal_cents: int
    shipping_cents: int
    tax_cents: int
    total_cents: int
    currency: str
    created_at: str
    items: list[OrderItemResponse]
    shipping_address: Optional[AddressResponse] = None
    fulfillments: Optional[List[dict]] = None  # Will be populated manually with OrderFulfillmentResponse data

    class Config:
        from_attributes = True


class CreateOrderRequest(BaseModel):
    items: list[dict]  # Simplified for now: {product_id, quantity}
    shipping_address: AddressResponse


class UpdateOrderStatusRequest(BaseModel):
    status: OrderStatus


