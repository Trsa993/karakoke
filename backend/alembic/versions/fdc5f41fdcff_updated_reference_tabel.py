"""updated reference tabel

Revision ID: fdc5f41fdcff
Revises: d1adc448bc5d
Create Date: 2023-05-11 21:12:42.890021

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fdc5f41fdcff'
down_revision = 'd1adc448bc5d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user_preferences', sa.Column('listened_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user_preferences', 'listened_at')
    # ### end Alembic commands ###
