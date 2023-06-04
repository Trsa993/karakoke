from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, oauth2, schemas
from ..database import get_db

router = APIRouter()

@router.get("/artist/{artist_id}/songs", response_model=schemas.ArtistOut)
async def get_songs_by_artist(artist_id: int, offset: int = 0, limit: int = 50, user_id: int = Depends(oauth2.require_user), db: Session = Depends(get_db)):
    artist = db.query(models.Artist).filter(models.Artist.id == artist_id).first()

    if not artist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail="Artist not found")
    
    songs = db.query(models.Song).filter(models.Song.artist_id == artist_id).offset(offset).limit(limit).all()

    return schemas.ArtistOut(artist=artist, artist_songs=songs)