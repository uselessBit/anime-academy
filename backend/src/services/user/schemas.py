import uuid

from fastapi_users import schemas
from pydantic import EmailStr, Field


class UserRead(schemas.BaseUser[uuid.UUID]):
    username: str
    email: EmailStr | None


class UserCreate(schemas.BaseUserCreate):
    username: str
    email: EmailStr | None = Field(None)


class UserUpdate(schemas.BaseUserUpdate):
    username: str | None = None
