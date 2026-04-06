"""initial migration - create distressed_leads table

Revision ID: 001_initial
Revises:
Create Date: 2024-01-01

"""

from alembic import op
import sqlalchemy as sa


revision = "001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "distressed_leads",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("address", sa.String(), nullable=False, index=True),
        sa.Column("city", sa.String(), nullable=True),
        sa.Column("image_url", sa.String(), nullable=True),
        sa.Column("indicators", sa.String(), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=False),
        sa.Column("zestimate", sa.Float(), nullable=True),
        sa.Column("year_built", sa.Integer(), nullable=True),
        sa.Column("distressed", sa.Boolean(), default=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
    )


def downgrade() -> None:
    op.drop_table("distressed_leads")
