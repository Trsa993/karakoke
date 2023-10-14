from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, constr


class UserCreate(BaseModel):
    email: EmailStr
    password: constr(min_length=5)
    confirm_password: str
    profile_name: constr(min_length=3)


class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    profile_name: str
    created_at: datetime

    class Config:
        orm_mode = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ArtistBase(BaseModel):
    artist: str
    artist_image_large_path: str
    artist_image_medium_path: Optional[str] = None
    artist_image_small_path: Optional[str] = None

    class Config:
        orm_mode = True


class Artist(ArtistBase):
    id: UUID

    class Config:
        orm_mode = True


class SongBase(BaseModel):
    title: str
    artist_id: UUID
    vocals_path: str
    accompaniments_path: str
    text_path: str
    total_listeners: int
    length: str

    class Config:
        orm_mode = True


class Song(SongBase):
    id: UUID

    class Config:
        orm_mode = True


class ArtistOut(BaseModel):
    artist: Artist
    artist_songs: List[Song]
    artist_summary: Optional[str] = None
    dominant_color: str


class SongOut(Song):
    artist: ArtistBase


class HomeOut(BaseModel):
    home_songs: List[SongOut]
    home_artists: List[Artist]


class SearchResult(BaseModel):
    artists: List[Artist]
    songs: List[SongOut]


class UpdateDB(BaseModel):
    password: str
