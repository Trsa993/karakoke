from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from fastapi.responses import ORJSONResponse
from .routers import artist, auth, home, search, song, user, update_db
from .config import settings

app = FastAPI(default_response_class=ORJSONResponse)

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SessionMiddleware, secret_key=settings.secret_key)

app.include_router(artist.router)
app.include_router(auth.router)
app.include_router(home.router)
app.include_router(search.router)
app.include_router(song.router)
app.include_router(user.router)
app.include_router(update_db.router)
