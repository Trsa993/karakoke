import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

SQLALCHEMY_DATABASE_URL = f"postgresql://postgres:password@localhost:5432/karaoke-web"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

from contextlib import contextmanager


@contextmanager
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key = True, nullable = False)
    email = Column(String, nullable = False, unique=True)
    password = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default = text("now()"))
    
    preferences = relationship("UserPreference", back_populates="user")

class Artist(Base):
    __tablename__ = "artists"

    id = Column(Integer, primary_key = True, nullable = False)
    artist = Column(String, nullable=False, unique=True)
    image_path = Column(String, nullable=False, unique=True)

    listeners = relationship("UserPreference", back_populates="artist")

class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key = True, nullable = False)
    artist_id = Column(Integer, ForeignKey("artists.id", ondelete="CASCADE"), nullable=False)
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
    listened_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default = text("now()"))

    user = relationship("User", back_populates="preferences")
    artist = relationship("Artist", back_populates="listeners")
    song = relationship("Song", back_populates="listeners")


def process_artist_folder(artist_folder, session, base_url):
    artist_name = os.path.basename(artist_folder)
    artist_image_path = os.path.join(artist_folder, "artist_image.jpg").replace('\\', '/')

    # Replace the local path with the base URL
    artist_image_url = artist_image_path.replace('D:/Milos/Pesme za karaoke/Karaoke', base_url)

    artist = session.query(Artist).filter(Artist.artist == artist_name).first()

    if not artist:
        artist = Artist(artist=artist_name, image_path=artist_image_url)
        session.add(artist)
        session.commit()

    for song_folder in os.listdir(artist_folder):
        song_path = os.path.join(artist_folder, song_folder)
        if os.path.isdir(song_path):
            process_song_folder(artist.id, song_path, session, base_url)

def process_song_folder(artist_id, song_folder, session, base_url):
    song_name = os.path.basename(song_folder)
    vocals_path = os.path.join(song_folder, "vocals.mp3").replace('\\', '/')
    accompaniments_path = os.path.join(song_folder, "no_vocals.mp3").replace('\\', '/')
    text_path = os.path.join(song_folder, "text.json").replace('\\', '/')

    vocals_url = vocals_path.replace('D:/Milos/Pesme za karaoke/Karaoke', base_url)
    accompaniments_url = accompaniments_path.replace('D:/Milos/Pesme za karaoke/Karaoke', base_url)
    text_url = text_path.replace('D:/Milos/Pesme za karaoke/Karaoke', base_url)

    song = session.query(Song).filter(Song.title == song_name, Song.artist_id == artist_id).first()

    if not song:
        song = Song(
            artist_id=artist_id,
            title=song_name,
            vocals_path=vocals_url,
            accompaniments_path=accompaniments_url,
            text_path=text_url
        )
        session.add(song)
        session.commit()

def main():
    karaoke_folder = "D:\\Milos\\Pesme za karaoke\\Karaoke"
    base_url = "http://127.0.0.1:8887"

    with get_db() as session:
        for artist_folder in os.listdir(karaoke_folder):
            artist_path = os.path.join(karaoke_folder, artist_folder)
            if os.path.isdir(artist_path):
                process_artist_folder(artist_path, session, base_url)

if __name__ == "__main__":
    main()