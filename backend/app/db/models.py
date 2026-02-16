"""
SQLAlchemy models for the flower vendor e-commerce platform.
"""

from datetime import datetime
from enum import Enum as PyEnum
from typing import Optional

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.db.base import Base


class UserRole(str, PyEnum):
    CUSTOMER = "customer"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


class ProductKind(str, PyEnum):
    PLANT = "plant"
    BOUQUET = "bouquet"
    VASE = "vase"
    DIGITAL_SERVICE = "digital_service"


class PlantEnvironment(str, PyEnum):
    INDOOR = "indoor"
    OUTDOOR = "outdoor"
    BOTH = "both"


class OrderStatus(str, PyEnum):
    DRAFT = "draft"
    PLACED = "placed"
    PENDING_PAYMENT = "pending_payment"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"


class OAuthProvider(str, PyEnum):
    GOOGLE = "google"
    FACEBOOK = "facebook"


class FulfillmentStatus(str, PyEnum):
    PROPOSED = "proposed"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=True)
    avatar_url = Column(String(512), nullable=True)
    role = Column(Enum(UserRole, values_callable=lambda obj: [e.value for e in obj]), default=UserRole.CUSTOMER, nullable=False)
    hashed_password = Column(String(255), nullable=True)  # For admin email/password login
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    oauth_accounts = relationship("OAuthAccount", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")


class OAuthAccount(Base):
    __tablename__ = "oauth_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    provider = Column(Enum(OAuthProvider), nullable=False)
    provider_account_id = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="oauth_accounts")

    __table_args__ = (
        UniqueConstraint("provider", "provider_account_id", name="uq_provider_account"),
    )


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price_cents = Column(Integer, nullable=False)  # Price in cents
    currency = Column(String(3), default="USD", nullable=False)
    kind = Column(Enum(ProductKind), nullable=False)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    attributes = relationship("ProductAttributes", back_populates="product", uselist=False, cascade="all, delete-orphan")
    inventory = relationship("Inventory", back_populates="product", uselist=False, cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")


class ProductAttributes(Base):
    __tablename__ = "product_attributes"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), unique=True, nullable=False)
    plant_environment = Column(Enum(PlantEnvironment), nullable=True)
    size = Column(String(100), nullable=True)  # e.g., "small", "medium", "large"
    color = Column(String(100), nullable=True)
    care_instructions = Column(Text, nullable=True)

    product = relationship("Product", back_populates="attributes")


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), unique=True, nullable=False)
    quantity = Column(Integer, default=0, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    product = relationship("Product", back_populates="inventory")


class Nursery(Base):
    __tablename__ = "nurseries"

    id = Column(Integer, primary_key=True, index=True)
    internal_name = Column(String(255), nullable=False)  # Admin-only name/code
    city = Column(String(100), nullable=False)
    commune = Column(String(100), nullable=True)  # Optional commune within city
    latitude = Column(Numeric(10, 8), nullable=True)  # Optional coordinates
    longitude = Column(Numeric(11, 8), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    inventory = relationship("NurseryInventory", back_populates="nursery", cascade="all, delete-orphan")
    fulfillments = relationship("OrderFulfillment", back_populates="nursery")


class NurseryInventory(Base):
    __tablename__ = "nursery_inventory"

    id = Column(Integer, primary_key=True, index=True)
    nursery_id = Column(Integer, ForeignKey("nurseries.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, default=0, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    nursery = relationship("Nursery", back_populates="inventory")
    product = relationship("Product")

    __table_args__ = (
        UniqueConstraint("nursery_id", "product_id", name="uq_nursery_product"),
    )


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    status = Column(Enum(OrderStatus), default=OrderStatus.DRAFT, nullable=False)
    subtotal_cents = Column(Integer, nullable=False)
    shipping_cents = Column(Integer, default=0, nullable=False)
    tax_cents = Column(Integer, default=0, nullable=False)
    total_cents = Column(Integer, nullable=False)
    currency = Column(String(3), default="USD", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    shipping_address = relationship("Address", back_populates="order", uselist=False, cascade="all, delete-orphan", foreign_keys="Address.order_id")
    fulfillments = relationship("OrderFulfillment", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    quantity = Column(Integer, nullable=False)
    unit_price_cents = Column(Integer, nullable=False)  # Snapshot of price at time of order
    product_name = Column(String(255), nullable=False)  # Snapshot of name at time of order

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    street_address = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    commune = Column(String(100), nullable=True)  # Optional commune within city
    state = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=False)
    country = Column(String(100), nullable=False)
    phone = Column(String(50), nullable=True)

    order = relationship("Order", back_populates="shipping_address", foreign_keys=[order_id])


class OrderFulfillment(Base):
    __tablename__ = "order_fulfillments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    nursery_id = Column(Integer, ForeignKey("nurseries.id", ondelete="SET NULL"), nullable=True)
    status = Column(Enum(FulfillmentStatus), default=FulfillmentStatus.PROPOSED, nullable=False)
    delivery_name = Column(String(255), nullable=True)
    delivery_phone = Column(String(50), nullable=True)
    delivery_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    order = relationship("Order", back_populates="fulfillments")
    nursery = relationship("Nursery", back_populates="fulfillments")
    items = relationship("OrderFulfillmentItem", back_populates="fulfillment", cascade="all, delete-orphan")


class OrderFulfillmentItem(Base):
    __tablename__ = "order_fulfillment_items"

    id = Column(Integer, primary_key=True, index=True)
    fulfillment_id = Column(Integer, ForeignKey("order_fulfillments.id", ondelete="CASCADE"), nullable=False)
    order_item_id = Column(Integer, ForeignKey("order_items.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, nullable=False)

    fulfillment = relationship("OrderFulfillment", back_populates="items")
    order_item = relationship("OrderItem")
