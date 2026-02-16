"""
Order endpoints for customers and admins.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin_user, get_current_user
from app.db.models import (
    Address,
    FulfillmentStatus,
    Inventory,
    Nursery,
    NurseryInventory,
    Order,
    OrderFulfillment,
    OrderFulfillmentItem,
    OrderItem,
    OrderStatus,
    Product,
    User,
)
from app.db.session import get_db
from app.schemas.fulfillment import (
    AllocationSuggestionsResponse,
    CreateAllocationRequest,
    DeliveryContactRequest,
    NurseryAllocationSuggestion,
    OrderFulfillmentItemResponse,
    OrderFulfillmentResponse,
)
from app.schemas.order import CreateOrderRequest, OrderResponse, UpdateOrderStatusRequest

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    request: CreateOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new order from cart items."""
    # Calculate totals
    subtotal_cents = 0
    order_items = []

    for item in request.items:
        product_id = item.get("product_id")
        quantity = item.get("quantity", 1)

        if not product_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="product_id is required")

        product = db.query(Product).filter(Product.id == product_id, Product.active == True).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product {product_id} not found")

        item_total = product.price_cents * quantity
        subtotal_cents += item_total

        order_items.append(
            {
                "product_id": product.id,
                "quantity": quantity,
                "unit_price_cents": product.price_cents,
                "product_name": product.name,
            }
        )

    shipping_cents = 500  # Fixed shipping for now
    tax_cents = int(subtotal_cents * 0.08)  # 8% tax
    total_cents = subtotal_cents + shipping_cents + tax_cents

    # Create order
    order = Order(
        user_id=current_user.id,
        status=OrderStatus.PLACED,
        subtotal_cents=subtotal_cents,
        shipping_cents=shipping_cents,
        tax_cents=tax_cents,
        total_cents=total_cents,
    )
    db.add(order)
    db.flush()

    # Create order items
    for item_data in order_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data["product_id"],
            quantity=item_data["quantity"],
            unit_price_cents=item_data["unit_price_cents"],
            product_name=item_data["product_name"],
        )
        db.add(order_item)

    # Create shipping address
    address = Address(
        order_id=order.id,
        full_name=request.shipping_address.full_name,
        street_address=request.shipping_address.street_address,
        city=request.shipping_address.city,
        commune=getattr(request.shipping_address, 'commune', None),
        state=request.shipping_address.state,
        postal_code=request.shipping_address.postal_code,
        country=request.shipping_address.country,
        phone=request.shipping_address.phone,
    )
    db.add(address)

    db.commit()
    db.refresh(order)

    return OrderResponse.model_validate(order)


@router.get("/me", response_model=List[OrderResponse])
async def get_my_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's orders."""
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return [OrderResponse.model_validate(o) for o in orders]


@router.get("/admin", response_model=List[OrderResponse])
async def list_all_orders(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """List all orders (admin only)."""
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return [OrderResponse.model_validate(o) for o in orders]


@router.get("/admin/{order_id}", response_model=OrderResponse)
async def get_order_admin(
    order_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Get a single order with fulfillments (admin only)."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    # Load fulfillments for the response
    from app.schemas.fulfillment import OrderFulfillmentResponse
    fulfillments = db.query(OrderFulfillment).filter(OrderFulfillment.order_id == order_id).all()
    
    # Build response with fulfillments
    order_dict = {
        "id": order.id,
        "user_id": order.user_id,
        "status": order.status,
        "subtotal_cents": order.subtotal_cents,
        "shipping_cents": order.shipping_cents,
        "tax_cents": order.tax_cents,
        "total_cents": order.total_cents,
        "currency": order.currency,
        "created_at": order.created_at.isoformat(),
        "items": [{"id": item.id, "product_id": item.product_id, "quantity": item.quantity, "unit_price_cents": item.unit_price_cents, "product_name": item.product_name} for item in order.items],
        "shipping_address": {
            "full_name": order.shipping_address.full_name,
            "street_address": order.shipping_address.street_address,
            "city": order.shipping_address.city,
            "commune": order.shipping_address.commune,
            "state": order.shipping_address.state,
            "postal_code": order.shipping_address.postal_code,
            "country": order.shipping_address.country,
            "phone": order.shipping_address.phone,
        } if order.shipping_address else None,
        "fulfillments": [
            {
                "id": f.id,
                "order_id": f.order_id,
                "nursery_id": f.nursery_id,
                "nursery_name": f.nursery.internal_name if f.nursery else None,
                "status": f.status,
                "delivery_name": f.delivery_name,
                "delivery_phone": f.delivery_phone,
                "delivery_notes": f.delivery_notes,
                "created_at": f.created_at.isoformat(),
                "updated_at": f.updated_at.isoformat(),
                "items": [
                    {
                        "id": item.id,
                        "fulfillment_id": item.fulfillment_id,
                        "order_item_id": item.order_item_id,
                        "quantity": item.quantity,
                        "order_item_product_name": db.query(OrderItem).filter(OrderItem.id == item.order_item_id).first().product_name if db.query(OrderItem).filter(OrderItem.id == item.order_item_id).first() else None,
                    }
                    for item in f.items
                ],
            }
            for f in fulfillments
        ],
    }
    return OrderResponse(**order_dict)


@router.patch("/admin/{order_id}", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    request: UpdateOrderStatusRequest,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Update order status (admin only)."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    order.status = request.status
    db.commit()
    db.refresh(order)

    return OrderResponse.model_validate(order)


# Fulfillment endpoints
@router.get("/admin/{order_id}/allocation-suggestions", response_model=AllocationSuggestionsResponse)
async def get_allocation_suggestions(
    order_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Get allocation suggestions for an order based on commune/city matching (admin only)."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if not order.shipping_address:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Order has no shipping address"
        )

    address = order.shipping_address
    order_items = order.items

    # Get all nurseries with inventory for products in this order
    product_ids = [item.product_id for item in order_items if item.product_id]
    if not product_ids:
        return AllocationSuggestionsResponse(order_id=order_id, suggestions=[])

    # Get nurseries with available inventory for these products
    nurseries_with_inventory = (
        db.query(Nursery)
        .join(NurseryInventory)
        .filter(
            NurseryInventory.product_id.in_(product_ids),
            NurseryInventory.quantity > 0,
        )
        .distinct()
        .all()
    )

    suggestions = []
    for nursery in nurseries_with_inventory:
        # Determine match tier: 1=same commune, 2=same city, 3=other
        match_tier = 3
        if address.commune and nursery.commune and address.commune.lower() == nursery.commune.lower():
            match_tier = 1
        elif address.city.lower() == nursery.city.lower():
            match_tier = 2

        # Calculate available items for this nursery
        available_items = []
        for order_item in order_items:
            if not order_item.product_id:
                continue

            nursery_inv = (
                db.query(NurseryInventory)
                .filter(
                    NurseryInventory.nursery_id == nursery.id,
                    NurseryInventory.product_id == order_item.product_id,
                )
                .first()
            )

            if nursery_inv and nursery_inv.quantity > 0:
                available_qty = min(nursery_inv.quantity, order_item.quantity)
                available_items.append(
                    {
                        "order_item_id": order_item.id,
                        "product_name": order_item.product_name,
                        "requested_qty": order_item.quantity,
                        "available_qty": available_qty,
                    }
                )

        if available_items:
            suggestions.append(
                NurseryAllocationSuggestion(
                    nursery_id=nursery.id,
                    nursery_name=nursery.internal_name,
                    city=nursery.city,
                    commune=nursery.commune,
                    match_tier=match_tier,
                    available_items=available_items,
                )
            )

    # Sort by match tier (1 first), then by number of available items
    suggestions.sort(key=lambda s: (s.match_tier, -len(s.available_items)))

    return AllocationSuggestionsResponse(order_id=order_id, suggestions=suggestions)


@router.post("/admin/{order_id}/allocate", response_model=List[OrderFulfillmentResponse])
async def create_allocation(
    order_id: int,
    request: CreateAllocationRequest,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Create or update order fulfillments based on admin allocation (admin only)."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    # Validate all allocations
    order_item_ids = {item.id for item in order.items}
    for allocation in request.allocations:
        # Verify nursery exists
        nursery = db.query(Nursery).filter(Nursery.id == allocation.nursery_id).first()
        if not nursery:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Nursery {allocation.nursery_id} not found",
            )

        # Verify order items belong to this order and validate quantities
        for item in allocation.items:
            if item.order_item_id not in order_item_ids:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Order item {item.order_item_id} does not belong to order {order_id}",
                )

            order_item = db.query(OrderItem).filter(OrderItem.id == item.order_item_id).first()
            if item.quantity > order_item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Allocated quantity {item.quantity} exceeds order quantity {order_item.quantity} for item {item.order_item_id}",
                )

    # Delete existing proposed fulfillments for this order
    existing_fulfillments = (
        db.query(OrderFulfillment)
        .filter(
            OrderFulfillment.order_id == order_id,
            OrderFulfillment.status == FulfillmentStatus.PROPOSED,
        )
        .all()
    )
    for fulfillment in existing_fulfillments:
        db.delete(fulfillment)

    db.flush()

    # Create new fulfillments
    created_fulfillments = []
    for allocation in request.allocations:
        fulfillment = OrderFulfillment(
            order_id=order_id,
            nursery_id=allocation.nursery_id,
            status=FulfillmentStatus.PROPOSED,
        )
        db.add(fulfillment)
        db.flush()

        # Create fulfillment items
        for item in allocation.items:
            fulfillment_item = OrderFulfillmentItem(
                fulfillment_id=fulfillment.id,
                order_item_id=item.order_item_id,
                quantity=item.quantity,
            )
            db.add(fulfillment_item)

        created_fulfillments.append(fulfillment)

    db.commit()

    # Refresh and return
    result = []
    for fulfillment in created_fulfillments:
        db.refresh(fulfillment)
        # Load relationships
        fulfillment_items = (
            db.query(OrderFulfillmentItem)
            .filter(OrderFulfillmentItem.fulfillment_id == fulfillment.id)
            .all()
        )
        
        # Build response with populated data
        items_data = []
        for item in fulfillment_items:
            order_item = db.query(OrderItem).filter(OrderItem.id == item.order_item_id).first()
            items_data.append(
                OrderFulfillmentItemResponse(
                    id=item.id,
                    fulfillment_id=item.fulfillment_id,
                    order_item_id=item.order_item_id,
                    quantity=item.quantity,
                    order_item_product_name=order_item.product_name if order_item else None,
                )
            )

        fulfillment_dict = {
            "id": fulfillment.id,
            "order_id": fulfillment.order_id,
            "nursery_id": fulfillment.nursery_id,
            "nursery_name": fulfillment.nursery.internal_name if fulfillment.nursery else None,
            "status": fulfillment.status,
            "delivery_name": fulfillment.delivery_name,
            "delivery_phone": fulfillment.delivery_phone,
            "delivery_notes": fulfillment.delivery_notes,
            "created_at": fulfillment.created_at.isoformat(),
            "updated_at": fulfillment.updated_at.isoformat(),
            "items": items_data,
        }
        result.append(OrderFulfillmentResponse(**fulfillment_dict))

    return result


@router.post("/admin/{order_id}/confirm", response_model=OrderResponse)
async def confirm_order_allocation(
    order_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Confirm order allocation: validate inventory, decrement stock, mark fulfillments confirmed (admin only)."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    # Get all proposed fulfillments for this order
    fulfillments = (
        db.query(OrderFulfillment)
        .filter(
            OrderFulfillment.order_id == order_id,
            OrderFulfillment.status == FulfillmentStatus.PROPOSED,
        )
        .all()
    )

    if not fulfillments:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No proposed fulfillments found for this order",
        )

    # Validate inventory availability
    for fulfillment in fulfillments:
        fulfillment_items = (
            db.query(OrderFulfillmentItem)
            .filter(OrderFulfillmentItem.fulfillment_id == fulfillment.id)
            .all()
        )

        for fulfillment_item in fulfillment_items:
            order_item = db.query(OrderItem).filter(OrderItem.id == fulfillment_item.order_item_id).first()
            if not order_item or not order_item.product_id:
                continue

            nursery_inv = (
                db.query(NurseryInventory)
                .filter(
                    NurseryInventory.nursery_id == fulfillment.nursery_id,
                    NurseryInventory.product_id == order_item.product_id,
                )
                .first()
            )

            if not nursery_inv or nursery_inv.quantity < fulfillment_item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient inventory for product {order_item.product_id} in nursery {fulfillment.nursery_id}",
                )

    # Decrement inventory and mark fulfillments as confirmed
    product_ids_to_recompute = set()
    for fulfillment in fulfillments:
        fulfillment_items = (
            db.query(OrderFulfillmentItem)
            .filter(OrderFulfillmentItem.fulfillment_id == fulfillment.id)
            .all()
        )

        for fulfillment_item in fulfillment_items:
            order_item = db.query(OrderItem).filter(OrderItem.id == fulfillment_item.order_item_id).first()
            if not order_item or not order_item.product_id:
                continue

            nursery_inv = (
                db.query(NurseryInventory)
                .filter(
                    NurseryInventory.nursery_id == fulfillment.nursery_id,
                    NurseryInventory.product_id == order_item.product_id,
                )
                .first()
            )

            nursery_inv.quantity -= fulfillment_item.quantity
            product_ids_to_recompute.add(order_item.product_id)

        fulfillment.status = FulfillmentStatus.CONFIRMED

    # Recompute global inventory for affected products
    for product_id in product_ids_to_recompute:
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

    # Update order status to confirmed
    order.status = OrderStatus.CONFIRMED

    db.commit()
    db.refresh(order)

    return OrderResponse.model_validate(order)


@router.post("/admin/fulfillments/{fulfillment_id}/delivery-contact", response_model=OrderFulfillmentResponse)
async def set_delivery_contact(
    fulfillment_id: int,
    request: DeliveryContactRequest,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Attach delivery contact details to a fulfillment (admin only)."""
    fulfillment = db.query(OrderFulfillment).filter(OrderFulfillment.id == fulfillment_id).first()
    if not fulfillment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fulfillment not found")

    fulfillment.delivery_name = request.delivery_name
    fulfillment.delivery_phone = request.delivery_phone
    fulfillment.delivery_notes = request.delivery_notes

    db.commit()
    db.refresh(fulfillment)

    # Load relationships
    fulfillment_items = (
        db.query(OrderFulfillmentItem)
        .filter(OrderFulfillmentItem.fulfillment_id == fulfillment.id)
        .all()
    )

    # Build response with populated data
    items_data = []
    for item in fulfillment_items:
        order_item = db.query(OrderItem).filter(OrderItem.id == item.order_item_id).first()
        items_data.append(
            OrderFulfillmentItemResponse(
                id=item.id,
                fulfillment_id=item.fulfillment_id,
                order_item_id=item.order_item_id,
                quantity=item.quantity,
                order_item_product_name=order_item.product_name if order_item else None,
            )
        )

    fulfillment_dict = {
        "id": fulfillment.id,
        "order_id": fulfillment.order_id,
        "nursery_id": fulfillment.nursery_id,
        "nursery_name": fulfillment.nursery.internal_name if fulfillment.nursery else None,
        "status": fulfillment.status,
        "delivery_name": fulfillment.delivery_name,
        "delivery_phone": fulfillment.delivery_phone,
        "delivery_notes": fulfillment.delivery_notes,
        "created_at": fulfillment.created_at.isoformat(),
        "updated_at": fulfillment.updated_at.isoformat(),
        "items": items_data,
    }
    return OrderFulfillmentResponse(**fulfillment_dict)


