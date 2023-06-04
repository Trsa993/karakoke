from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=True)
    profile_name = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=text("now()"))

    preferences = relationship("UserPreference", back_populates="user")


class Artist(Base):
    __tablename__ = "artists"

    id = Column(Integer, primary_key=True, nullable=False)
    artist = Column(String, nullable=False, unique=True)
    image_path = Column(String, nullable=False, unique=True)

    listeners = relationship("UserPreference", back_populates="artist")


class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, nullable=False)
    artist_id = Column(Integer, ForeignKey(
        "artists.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    vocals_path = Column(String, nullable=False, unique=True)
    accompaniments_path = Column(String, nullable=False, unique=True)
    text_path = Column(String, nullable=False, unique=True)

    artist = relationship("Artist")
    listeners = relationship("UserPreference", back_populates="song")


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    artist_id = Column(Integer, ForeignKey("artists.id", ondelete="CASCADE"))
    song_id = Column(Integer, ForeignKey("songs.id", ondelete="CASCADE"))
    listen_count = Column(Integer, nullable=False, default=0)
    listened_at = Column(TIMESTAMP(timezone=True),
                         nullable=False, server_default=text("now()"))

    user = relationship("User", back_populates="preferences")
    artist = relationship("Artist", back_populates="listeners")
    song = relationship("Song", back_populates="listeners")
