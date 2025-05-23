from abc import abstractmethod
from typing import Protocol

from src.services.anime_rating.schemas import CreateAnimeRatingSchema, UpdateAnimeRatingSchema


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
