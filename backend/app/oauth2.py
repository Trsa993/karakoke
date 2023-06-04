import base64
from typing import List

from fastapi import Depends, HTTPException, status, Cookie
from fastapi_jwt_auth import AuthJWT

from pydantic import BaseModel
from sqlalchemy.orm import Session

from . import models
from .config import settings
from .database import get_db


class Settings(BaseModel):
    authjwt_algorithm: str = settings.jwt_algorithm
    authjwt_decode_algorithms: List[str] = [settings.jwt_algorithm]
    authjwt_token_location: set = {'cookies', 'headers'}
    authjwt_access_cookie_key: str = 'access_token'
    authjwt_refresh_cookie_key: str = 'refresh_token'
    authjwt_cookie_secure: bool = False
    authjwt_cookie_csrf_protect: bool = True
    authjwt_cookie_samesite: str = 'lax'
    authjwt_public_key: str = base64.b64decode(
        settings.jwt_public_key).decode('utf-8')
    authjwt_private_key: str = base64.b64decode(
        settings.jwt_private_key).decode('utf-8')


@AuthJWT.load_config
def get_config():
    return Settings()


class UserNotFound(Exception):
    pass


def require_user(db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
        user_id = Authorize.get_jwt_subject()
        user = db.query(models.User).filter(models.User.id == user_id).first()

        if not user:
            raise UserNotFound('Could not validate credentials')

    except Exception as e:
        error = e.__class__.__name__
        print(error)
        if error == 'MissingTokenError':
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='You are not logged in')
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Could not validate credentials')

    return user_id
