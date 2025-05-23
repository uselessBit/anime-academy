"""add nullable

Revision ID: 4e1244b6f2a1
Revises: d49995fae930
Create Date: 2025-04-28 21:31:31.091048

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4e1244b6f2a1'
down_revision: Union[str, None] = 'd49995fae930'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('anime', 'description',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.alter_column('anime', 'release_year',
               existing_type=sa.SMALLINT(),
               nullable=True)
    op.alter_column('anime', 'image_url',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.alter_column('anime', 'rating',
               existing_type=sa.DOUBLE_PRECISION(precision=53),
               nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('anime', 'rating',
               existing_type=sa.DOUBLE_PRECISION(precision=53),
               nullable=False)
    op.alter_column('anime', 'image_url',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.alter_column('anime', 'release_year',
               existing_type=sa.SMALLINT(),
               nullable=False)
    op.alter_column('anime', 'description',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    # ### end Alembic commands ###
