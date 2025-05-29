import uuid

from fastapi_users import schemas
from pydantic import EmailStr, Field


class UserRead(schemas.BaseUser[uuid.UUID]):
    username: str
    email: EmailStr | None
    description: str | None


class UserCreate(schemas.BaseUserCreate):
    username: str
    email: EmailStr | None = Field(None)
    description: str | None


class UserUpdate(schemas.BaseUserUpdate):
    username: str | None = None
    description: str | None
