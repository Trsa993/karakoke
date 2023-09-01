"""added artist images

Revision ID: a9102fdd839f
Revises: 123827787fde
Create Date: 2023-08-22 17:58:49.387271

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a9102fdd839f'
down_revision = '123827787fde'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('artists', sa.Column('artist_image_large_path', sa.String(), nullable=False))
    op.add_column('artists', sa.Column('artist_image_medium_path', sa.String(), nullable=True))
    op.add_column('artists', sa.Column('artist_image_small_path', sa.String(), nullable=True))
    op.drop_constraint('artists_image_path_key', 'artists', type_='unique')
    op.create_unique_constraint(None, 'artists', ['artist_image_medium_path'])
    op.create_unique_constraint(None, 'artists', ['artist_image_small_path'])
    op.create_unique_constraint(None, 'artists', ['artist_image_large_path'])
    op.drop_column('artists', 'image_path')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('artists', sa.Column('image_path', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'artists', type_='unique')
    op.drop_constraint(None, 'artists', type_='unique')
    op.drop_constraint(None, 'artists', type_='unique')
    op.create_unique_constraint('artists_image_path_key', 'artists', ['image_path'])
    op.drop_column('artists', 'artist_image_small_path')
    op.drop_column('artists', 'artist_image_medium_path')
    op.drop_column('artists', 'artist_image_large_path')
    # ### end Alembic commands ###
