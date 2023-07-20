"""added total listeners to songs

Revision ID: 123827787fde
Revises: 9c2a27833c4c
Create Date: 2023-07-20 14:05:41.394416

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '123827787fde'
down_revision = '9c2a27833c4c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('songs', sa.Column('total_listeners', sa.Integer(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('songs', 'total_listeners')
    # ### end Alembic commands ###
