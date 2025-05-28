from abc import abstractmethod
from typing import Protocol
from uuid import UUID

from src.services.anime_rating.schemas import CreateAnimeRatingSchema, UpdateAnimeRatingSchema, AnimeRatingResponseSchema


class AnimeRatingServiceI(Protocol):
    @abstractmethod
    async def create(self, anime_review: CreateAnimeRatingSchema) -> None: ...

    @abstractmethod
    async def update(self, review_id: int, anime_review: UpdateAnimeRatingSchema) -> None: ...

    @abstractmethod
    async def delete(self, review_id: int) -> None: ...

    @abstractmethod
    async def _update_anime_rating(self, anime_id: int) -> None: ...

    @abstractmethod
    async def get_rating_stats(self, anime_id: int) -> dict[str, int]: ...

    @abstractmethod
    async def get_user_rating(self, anime_id: int, user_id: UUID) -> AnimeRatingResponseSchema | None: ...
