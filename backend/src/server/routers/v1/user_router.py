from uuid import UUID

from src.clients.database.models.user import User
from src.container import container
from src.services.user.schemas import UserCreate, UserRead, UserUpdate
from src.services.user.service import auth_backend, fastapi_users
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

user_router = APIRouter(prefix="")

user_router.include_router(fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"])
user_router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
user_router.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)
user_router.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)

user_router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)


@user_router.get("/users/open-data/{user_id}", response_model=UserRead, tags=["users"])
async def get_user_by_id(user_id: UUID, session: AsyncSession = Depends(container.database_session_no_context())):
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
