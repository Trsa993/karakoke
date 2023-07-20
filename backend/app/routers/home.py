from fastapi import APIRouter, Depends
from sqlalchemy import desc, func, text
from sqlalchemy.orm import Session

from .. import models, oauth2, schemas
from ..database import get_db

router = APIRouter()


@router.get("/home", response_model=schemas.HomeOut)
async def home(user_id: int = Depends(oauth2.require_user), db: Session = Depends(get_db)):
    latest_songs = (
        db.query(models.Song)
        .join(models.UserPreference, models.Song.id == models.UserPreference.song_id, isouter=True)
        .filter(models.UserPreference.user_id == user_id)
        .order_by(models.UserPreference.listened_at.desc())
        .limit(3)
        .all()
    )

    most_listened_songs = (
        db.query(models.Song)
        .join(models.UserPreference, models.Song.id == models.UserPreference.song_id, isouter=True)
        .filter(models.UserPreference.user_id == user_id)
        .filter(~models.Song.id.in_([song.id for song in latest_songs]))
        .order_by(models.UserPreference.listen_count.desc())
        .limit(3)
        .all()
    )

    home_songs = latest_songs + most_listened_songs

    num_remaining_songs = 6 - len(home_songs)
    if num_remaining_songs > 0:
        remaining_songs = (
            db.query(models.Song)
            .filter(~models.Song.id.in_([song.id for song in home_songs]))
            .order_by(func.random())
            .limit(num_remaining_songs).all())

        home_songs.extend(remaining_songs)

    latest_artists = (
        db.query(models.Artist)
        .join(models.UserPreference, models.Artist.id == models.UserPreference.artist_id)
        .filter(models.UserPreference.user_id == user_id)
        .group_by(models.Artist.id)
        .order_by(func.max(models.UserPreference.listened_at).desc())
        .limit(5)
        .with_entities(models.Artist)
        .all()
    )

    most_listened_artists = (
        db.query(models.Artist)
        .join(models.UserPreference, models.Artist.id == models.UserPreference.artist_id, isouter=True)
        .filter(models.UserPreference.user_id == user_id)
        .filter(~models.Artist.id.in_([artist.id for artist in latest_artists]))
        .group_by(models.Artist.id)
        .order_by(func.sum(models.UserPreference.song_id).desc())
        .limit(15)
        .with_entities(models.Artist)
        .all()
    )

    home_artists = latest_artists + most_listened_artists

    num_remaining_artists = 20 - len(home_artists)
    if num_remaining_artists > 0:
        remaining_artists = (
            db.query(models.Artist)
            .filter(~models.Artist.id.in_([artist.id for artist in home_artists]))
            .order_by(func.random())
            .limit(num_remaining_artists)
            .all())
        home_artists.extend(remaining_artists)

    return schemas.HomeOut(home_songs=home_songs, home_artists=home_artists)


@router.get("/home/guest", response_model=schemas.HomeOut)
async def home(db: Session = Depends(get_db)):
    home_songs = (
        db.query(models.Song)
        .order_by(func.random())
        .limit(6).all())

    home_artists = (
        db.query(models.Artist)
        .order_by(func.random())
        .limit(20)
        .all())

    return schemas.HomeOut(home_songs=home_songs, home_artists=home_artists)
