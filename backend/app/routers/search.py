from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, oauth2, schemas
from ..database import get_db

router = APIRouter()


@router.get("/search", response_model=schemas.SearchResult)
async def search(query: str, db: Session = Depends(get_db)):
    artists = (
        db.query(models.Artist)
        .filter(models.Artist.artist.ilike(f"%{query}%"))
        .limit(10)
        .all()
    )
    songs = (
        db.query(models.Song)
        .filter(models.Song.title.ilike(f"%{query}%"))
        .limit(5)
        .all()
    )

    return schemas.SearchResult(artists=artists, songs=songs)
