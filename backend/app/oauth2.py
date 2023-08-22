import base64
import httpx
from jose import jwt, JWTError, ExpiredSignatureError
from jose.exceptions import JWTClaimsError
from typing import List

from fastapi import Depends, HTTPException, status, Cookie
from fastapi_jwt_auth import AuthJWT

from pydantic import BaseModel
from sqlalchemy.orm import Session

from . import models
from .config import settings
from .database import get_db


DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"


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


async def verify_google_token(id_token: str, audience: str, issuer: List, access_token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(DISCOVERY_URL)
        data = response.json()

    jwks_uri = data['jwks_uri']
    async with httpx.AsyncClient() as client:
        response = await client.get(jwks_uri)
        jwks = response.json()

    try:
        kid = jwt.get_unverified_header(id_token)["kid"]

        public_keys = [k for k in jwks["keys"] if k["kid"] == kid]

        if public_keys:
            public_key = public_keys[0]
        else:
            return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid login")

        payload = jwt.decode(token=id_token, key=public_key, algorithms=[
            "RS256"], audience=audience, issuer=issuer, access_token=access_token)

        if payload:
            return True

    except (JWTError, ExpiredSignatureError, JWTClaimsError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid login")
