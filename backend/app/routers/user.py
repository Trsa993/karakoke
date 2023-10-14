from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from uuid import UUID

from .. import models, oauth2, schemas, utils
from ..database import get_db

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
async def create_user(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    user = (
        db.query(models.User)
        .filter(models.User.email == payload.email)
        .first()
    )

    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"User with email {user.email} already exist")

    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail='Passwords do not match')

    del payload.confirm_password

    hashed_password = utils.hash(payload.password)
    payload.password = hashed_password
    new_user = models.User(**payload.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get("/{id}", response_model=schemas.UserOut)
async def get_user(id: UUID, db: Session = Depends(get_db), user_id: UUID = Depends(oauth2.require_user)):
    user = (
        db.query(models.User)
        .filter(models.User.id == id)
        .first()
    )
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"user with id {id} was not found")
    return user
