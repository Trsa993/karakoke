from datetime import timedelta
from authlib.integrations.starlette_client import OAuth

from fastapi import (APIRouter, Depends, HTTPException, Request, Response,
                     status)
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import models, oauth2, utils
from ..config import settings
from ..database import get_db

ACCESS_TOKEN_EXPIRES_IN = settings.access_token_expires_in


router = APIRouter(
    tags=["Authentication"]
)

oauth = OAuth()
oauth.register(
    name="google",
    client_id=settings.google_client_id,
    client_secret=settings.google_client_secret,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},

)


@router.get("/login/google")
async def login(request: Request):
    redirect_uri = str(request.url_for("auth_via_google"))
    return await oauth.google.authorize_redirect(request, redirect_uri, prompt="select_account")


@router.get("/auth/google")
async def auth_via_google(request: Request, db: Session = Depends(get_db), Authorize: oauth2.AuthJWT = Depends()):
    token = await oauth.google.authorize_access_token(request)
    userinfo = token["userinfo"]

    email = userinfo.get("email")
    profile_name = userinfo.get("name")

    user = (
        db.query(models.User)
        .filter(models.User.email == email)
        .first())

    if not user:
        new_user = models.User(email=email, password=None,
                               profile_name=profile_name)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        user = new_user

    access_token = Authorize.create_access_token(
        subject=str(user.id), expires_time=timedelta(minutes=ACCESS_TOKEN_EXPIRES_IN))
    refresh_token = Authorize.create_refresh_token(
        subject=str(user.id), expires_time=False)

    Authorize.set_access_cookies(access_token)
    Authorize.set_refresh_cookies(refresh_token)

    return {"access_token": access_token, "refresh_token": refresh_token}

oauth.register(
    name="facebook",
    client_id=settings.facebook_app_id,
    client_secret=settings.facebook_app_secret,
    access_token_url="https://graph.facebook.com/oauth/access_token",
    access_token_params=None,
    authorize_url="https://www.facebook.com/dialog/oauth",
    authorize_params=None,
    api_base_url="https://graph.facebook.com/",
    client_kwargs={"scope": "email"},
)


@router.get("/login/facebook")
async def login(request: Request):
    redirect_uri = str(request.url_for("auth_via_facebook"))
    return await oauth.facebook.authorize_redirect(request, redirect_uri)


@router.get("/auth/facebook")
async def auth_via_facebook(request: Request, db: Session = Depends(get_db), Authorize: oauth2.AuthJWT = Depends()):
    token = await oauth.facebook.authorize_access_token(request)

    response = await oauth.facebook.get("https://graph.facebook.com/me?fields=id,name,email", token=token)

    userinfo = response.json()

    email = userinfo.get("email")
    profile_name = userinfo.get("name")

    user = (
        db.query(models.User)
        .filter(models.User.email == email)
        .first())

    if not user:
        new_user = models.User(email=email, password=None,
                               profile_name=profile_name)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        user = new_user

    access_token = Authorize.create_access_token(
        subject=str(user.id), expires_time=timedelta(minutes=ACCESS_TOKEN_EXPIRES_IN))
    refresh_token = Authorize.create_refresh_token(
        subject=str(user.id), expires_time=False)

    Authorize.set_access_cookies(access_token)
    Authorize.set_refresh_cookies(refresh_token)

    return {"access_token": access_token, "refresh_token": refresh_token}


@router.post("/login")
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db), Authorize: oauth2.AuthJWT = Depends()):
    user = (
        db.query(models.User)
        .filter(models.User.email == user_credentials.username)
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")
    if not utils.verify(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")

    access_token = Authorize.create_access_token(
        subject=str(user.id), expires_time=timedelta(minutes=ACCESS_TOKEN_EXPIRES_IN))
    refresh_token = Authorize.create_refresh_token(
        subject=str(user.id), expires_time=False)

    Authorize.set_access_cookies(access_token)
    Authorize.set_refresh_cookies(refresh_token)

    return {"access_token": access_token, "refresh_token": refresh_token}


@router.get("/refresh")
def refresh_token(Authorize: oauth2.AuthJWT = Depends(), db: Session = Depends(get_db)):
    try:
        Authorize.jwt_refresh_token_required()

        user_id = Authorize.get_jwt_subject()
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Could not refresh access token")
        user = (
            db.query(models.User)
            .filter(models.User.id == user_id)
            .first()
        )
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="The user belonging to this token no logger exist")

        access_token = Authorize.create_access_token(
            subject=str(user.id), expires_time=timedelta(minutes=ACCESS_TOKEN_EXPIRES_IN))

    except Exception as e:
        error = e.__class__.__name__
        if error == "MissingTokenError":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="Please provide refresh token")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=error)

    Authorize.set_access_cookies(access_token)

    return {"access_token": access_token}


@router.get("/is-logged-in")
def is_logged_in(Authorize: oauth2.AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
    except Exception as e:
        return {"is_logged_in": False}

    return {"is_logged_in": True}


@router.get("/logout")
def logout(request: Request, Authorize: oauth2.AuthJWT = Depends(), user_id: int = Depends(oauth2.require_user)):
    response = RedirectResponse(url="/home/guest")

    Authorize.unset_jwt_cookies(response=response)

    request.session.clear()

    return response
