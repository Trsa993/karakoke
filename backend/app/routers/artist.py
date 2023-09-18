from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import redis.asyncio as redis
import httpx

from .. import models, schemas, utils
from ..database import get_db
from ..redis import get_redis

from ..config import settings

router = APIRouter()


@router.get("/artists/{artist_id}/songs", response_model=schemas.ArtistOut)
async def get_songs_by_artist(artist_id: int, offset: int = 0, limit: int = 50, db: Session = Depends(get_db), cache: redis.Redis = Depends(get_redis)):
    artist = (
        db.query(models.Artist)
        .filter(models.Artist.id == artist_id)
        .first())

    if not artist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Artist not found")

    songs = (
        db.query(models.Song)
        .filter(models.Song.artist_id == artist_id)
        .order_by(models.Song.total_listeners.desc())
        .offset(offset)
        .limit(limit)
        .all())

    summary_key = f"artist:{artist_id}:summary"
    summary = await cache.get(summary_key)
    print(summary)

    if not summary:
        async with httpx.AsyncClient() as client:
            response = await client.get("http://ws.audioscrobbler.com/2.0/", params={
                "method": "artist.getinfo",
                "artist": artist.artist,
                "api_key": settings.last_fm_api_key,
                "format": "json"
            }, timeout=10.0)
            data = response.json()

        summary = data.get("artist", {}).get("bio", {}).get("summary", {})

        await cache.set(name=summary_key, value=summary, ex=15552000)

    dominant_color_key = f"artist:{artist_id}:dominant_color"
    dominant_color = await cache.get(dominant_color_key)

    if not dominant_color:
        dominant_color = utils.get_dominant_color(
            f"{settings.base_data_path}/{artist.artist_image_small_path}"
        )
        await cache.set(name=dominant_color_key, value=dominant_color, ex=15552000)

    return schemas.ArtistOut(artist=artist, artist_songs=songs, artist_summary=summary, dominant_color=dominant_color)
