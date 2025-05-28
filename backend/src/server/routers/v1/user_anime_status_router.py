from http import HTTPStatus
from uuid import UUID

from fastcrud import crud_router
from fastapi import APIRouter, Depends, Response

from src.clients.database.models.user_anime_status import UserAnimeStatus
from src.container import container
from src.services.user_anime_status.interface import UserAnimeStatusServiceI
from src.services.user_anime_status.schemas import CreateUserAnimeStatusSchema, UpdateUserAnimeStatusSchema, \
    UserAnimeStatusResponseSchema


async def get_user_anime_status_service() -> UserAnimeStatusServiceI:
    return container.user_anime_status_service()

user_anime_status_auto_router = crud_router(
    session=container.database().get_db_session,
    model=UserAnimeStatus,
    create_schema=CreateUserAnimeStatusSchema,
    update_schema=UpdateUserAnimeStatusSchema,
    crud=container.user_anime_status_crud(),
    path="/user_anime_status",
    tags=["User anime status"],
)


user_anime_status_router = APIRouter(
    tags=["User anime status"],
)
user_anime_status_router.include_router(user_anime_status_auto_router)


@user_anime_status_router.get("/user_anime_status/anime/{anime_id}/{user_id}", response_model=None)
async def get_user_anime_status(
    anime_id: int,
    user_id: UUID,
    user_anime_status_service: UserAnimeStatusServiceI = Depends(get_user_anime_status_service),
) -> UserAnimeStatusResponseSchema | Response:
    anime_status = await user_anime_status_service.get_user_anime_status(anime_id, user_id)
    if anime_status:
        return anime_status
    return Response(status_code=HTTPStatus.NO_CONTENT)


@user_anime_status_router.get("/user_anime_status/user/{user_id}", response_model=list[UserAnimeStatusResponseSchema])
async def get_user_statuses(
    user_id: UUID,
    user_anime_status_service: UserAnimeStatusServiceI = Depends(get_user_anime_status_service),
) -> list[UserAnimeStatusResponseSchema]:
    return await user_anime_status_service.get_user_statuses(user_id)
