from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP

import uuid

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4, unique=True, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=True)
    profile_name = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=text("now()"))

    preferences = relationship("UserPreference", back_populates="user")


class Artist(Base):
    __tablename__ = "artists"

    id = Column(UUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4, unique=True, nullable=False)
    artist = Column(String, nullable=False, unique=True)
    artist_image_large_path = Column(String, nullable=False, unique=True)
    artist_image_medium_path = Column(String, nullable=True, unique=True)
    artist_image_small_path = Column(String, nullable=True, unique=True)

    listeners = relationship("UserPreference", back_populates="artist")


class Song(Base):
    __tablename__ = "songs"

    id = Column(UUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4, unique=True, nullable=False)
    artist_id = Column(UUID(as_uuid=True), ForeignKey(
        "artists.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    vocals_path = Column(String, nullable=False, unique=True)
    accompaniments_path = Column(String, nullable=False, unique=True)
    text_path = Column(String, nullable=False, unique=True)
    total_listeners = Column(Integer, nullable=False, default=0)
    length = Column(String, nullable=False)

    artist = relationship("Artist")
    listeners = relationship("UserPreference", back_populates="song")


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4, unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey(
        "users.id", ondelete="CASCADE"))
    artist_id = Column(UUID(as_uuid=True), ForeignKey(
        "artists.id", ondelete="CASCADE"))
    song_id = Column(UUID(as_uuid=True), ForeignKey(
        "songs.id", ondelete="CASCADE"))
    listen_count = Column(Integer, nullable=False, default=0)
    listened_at = Column(TIMESTAMP(timezone=True),
                         nullable=False, server_default=text("now()"))

    user = relationship("User", back_populates="preferences")
    artist = relationship("Artist", back_populates="listeners")
    song = relationship("Song", back_populates="listeners")
