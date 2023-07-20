from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import text

from .. import models, oauth2, schemas
from ..database import get_db

router = APIRouter()

@router.post("/songs/{song_id}/listen", response_model=schemas.SongOut)
async def listen_song(song_id: int, user_id: int = Depends(oauth2.require_user), db: Session = Depends(get_db)):
    song = (
        db.query(models.Song)
        .filter(models.Song.id == song_id)
        .first()
    )
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail="Song not found")
    
    artist_id = song.artist_id
    
    preference = (
        db.query(models.UserPreference)
        .filter(models.UserPreference.user_id == user_id, models.UserPreference.song_id == song_id)
        .first()
    )

    if preference:
        preference.listen_count += 1
        preference.listened_at = text("now()")
    else:
        song.total_listeners += 1
        preference = models.UserPreference(user_id=user_id, artist_id=artist_id, song_id=song_id, listen_count=1)
        db.add(preference)

    db.commit()

    return song