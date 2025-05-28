from abc import abstractmethod
from typing import Protocol
from uuid import UUID

from src.services.user_anime_status.schemas import UserAnimeStatusResponseSchema


class UserAnimeStatusServiceI(Protocol):
    @abstractmethod
    async def get_user_anime_status(self, anime_id: int, user_id: UUID) -> UserAnimeStatusResponseSchema | None: ...

    @abstractmethod
    async def get_user_statuses(self, user_id: UUID) -> list[UserAnimeStatusResponseSchema]: ...

