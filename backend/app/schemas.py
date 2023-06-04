from datetime import datetime
from typing import List

from pydantic import BaseModel, EmailStr, constr


class UserCreate(BaseModel):
    email: EmailStr
    password: constr(min_length=5)
    passwordConfirm: str
    profile_name: constr(min_length=2)


class UserOut(BaseModel):
    id: int
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
    image_path: str

    class Config:
        orm_mode = True


class Artist(ArtistBase):
    id: int

    class Config:
        orm_mode = True


class SongBase(BaseModel):
    title: str
    artist_id: str
    vocals_path: str
    accompaniments_path: str
    text_path: str

    class Config:
        orm_mode = True


class Song(SongBase):
    id: int

    class Config:
        orm_mode = True


class ArtistOut(BaseModel):
    artist: Artist
    artist_songs: List[Song]


class SongOut(Song):
    artist: ArtistBase


class HomeOut(BaseModel):
    home_songs: List[SongOut]
    home_artists: List[Artist]


class SearchResult(BaseModel):
    artists: List[Artist]
    songs: List[SongOut]
