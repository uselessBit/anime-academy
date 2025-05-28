from uuid import UUID

from sqlalchemy import select

from src.clients.database.models.user_anime_status import UserAnimeStatus
from src.services.base import BaseService
from pydantic import TypeAdapter

from src.services.user_anime_status.interface import UserAnimeStatusServiceI
from src.services.user_anime_status.schemas import UserAnimeStatusResponseSchema


class UserAnimeStatusService(BaseService, UserAnimeStatusServiceI):
    async def get_user_anime_status(self, anime_id: int, user_id: UUID) -> UserAnimeStatusResponseSchema | None:
        async with self.session() as session:
            result = await session.execute(
                select(UserAnimeStatus).where(
                    UserAnimeStatus.anime_id == anime_id,
                    UserAnimeStatus.user_id == user_id
                )
            )
            anime_status =  result.scalar_one_or_none()
            if anime_status:
                type_adapter = TypeAdapter(UserAnimeStatusResponseSchema)
                return type_adapter.validate_python(anime_status)
            return None


    async def get_user_statuses(self, user_id: UUID) -> list[UserAnimeStatusResponseSchema]:
        async with self.session() as session:
            result = await session.execute(
                select(UserAnimeStatus).where(
                    UserAnimeStatus.user_id == user_id
                )
            )
            anime_statuses =  result.scalars().all()
            if anime_statuses:
                type_adapter = TypeAdapter(list[UserAnimeStatusResponseSchema])
                return type_adapter.validate_python(anime_statuses)