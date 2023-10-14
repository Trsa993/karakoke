from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from .. import models, oauth2, schemas
from ..database import get_db

router = APIRouter()


@router.get("/search", response_model=schemas.SearchResult)
async def search(query: str, db: Session = Depends(get_db)):
    sanitized_query = func.unaccent(f"%{query}%")
    artists = (
        db.query(models.Artist)
        .filter(func.unaccent(models.Artist.artist).ilike(sanitized_query))
        .limit(5)
        .all()
    )
    songs = (
        db.query(models.Song)
        .filter(func.unaccent(models.Song.title).ilike(sanitized_query))
        .order_by(models.Song.total_listeners.desc())
        .limit(10)
        .all()
    )

    return schemas.SearchResult(artists=artists, songs=songs)
