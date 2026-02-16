"""add_super_admin_role

Revision ID: 3fcd7ba5fb94
Revises: 24283419d93f
Create Date: 2026-02-11 16:18:42.965212

"""

from alembic import op
import sqlalchemy as sa



revision = '3fcd7ba5fb94'
down_revision = '24283419d93f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add super_admin value to userrole enum
    op.execute("ALTER TYPE userrole ADD VALUE 'super_admin'")


def downgrade() -> None:
    # Note: PostgreSQL does not support removing enum values directly
    # To downgrade, you would need to recreate the enum and update all references
    # For now, we'll leave it as-is since removing enum values is complex
    pass




