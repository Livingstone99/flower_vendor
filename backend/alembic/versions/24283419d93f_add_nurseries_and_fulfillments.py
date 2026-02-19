"""add_nurseries_and_fulfillments

Revision ID: 24283419d93f
Revises: 001_initial
Create Date: 2026-02-09 01:10:02.249866

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql



revision = '24283419d93f'
down_revision = '001_initial'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Get the database dialect
    bind = op.get_bind()
    is_postgres = bind.dialect.name == 'postgresql'

    # Create fulfillmentstatus enum only for PostgreSQL
    if is_postgres:
        op.execute("CREATE TYPE fulfillmentstatus AS ENUM ('proposed', 'confirmed', 'cancelled')")

    # Helper function for platform-agnostic ENUM
    def get_enum_type(name, values):
        if is_postgres:
            return postgresql.ENUM(*values, name=name, create_type=False)
        else:
            return sa.Enum(*values, name=name)

    # Add commune column to addresses table
    op.add_column('addresses', sa.Column('commune', sa.String(length=100), nullable=True))

    # Create nurseries table
    op.create_table(
        'nurseries',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('internal_name', sa.String(length=255), nullable=False),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('commune', sa.String(length=100), nullable=True),
        sa.Column('latitude', sa.Numeric(precision=10, scale=8), nullable=True),
        sa.Column('longitude', sa.Numeric(precision=11, scale=8), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_nurseries_id'), 'nurseries', ['id'], unique=False)

    # Create nursery_inventory table
    op.create_table(
        'nursery_inventory',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nursery_id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['nursery_id'], ['nurseries.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('nursery_id', 'product_id', name='uq_nursery_product')
    )
    op.create_index(op.f('ix_nursery_inventory_id'), 'nursery_inventory', ['id'], unique=False)

    # Create order_fulfillments table
    op.create_table(
        'order_fulfillments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=False),
        sa.Column('nursery_id', sa.Integer(), nullable=True),
        sa.Column('status', get_enum_type('fulfillmentstatus', ('proposed', 'confirmed', 'cancelled')), nullable=False),
        sa.Column('delivery_name', sa.String(length=255), nullable=True),
        sa.Column('delivery_phone', sa.String(length=50), nullable=True),
        sa.Column('delivery_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['nursery_id'], ['nurseries.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_order_fulfillments_id'), 'order_fulfillments', ['id'], unique=False)

    # Create order_fulfillment_items table
    op.create_table(
        'order_fulfillment_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('fulfillment_id', sa.Integer(), nullable=False),
        sa.Column('order_item_id', sa.Integer(), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['fulfillment_id'], ['order_fulfillments.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['order_item_id'], ['order_items.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_order_fulfillment_items_id'), 'order_fulfillment_items', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_order_fulfillment_items_id'), table_name='order_fulfillment_items')
    op.drop_table('order_fulfillment_items')
    op.drop_index(op.f('ix_order_fulfillments_id'), table_name='order_fulfillments')
    op.drop_table('order_fulfillments')
    op.drop_index(op.f('ix_nursery_inventory_id'), table_name='nursery_inventory')
    op.drop_table('nursery_inventory')
    op.drop_index(op.f('ix_nurseries_id'), table_name='nurseries')
    op.drop_table('nurseries')
    op.drop_column('addresses', 'commune')
    bind = op.get_bind()
    if bind.dialect.name == 'postgresql':
        op.execute("DROP TYPE IF EXISTS fulfillmentstatus")



