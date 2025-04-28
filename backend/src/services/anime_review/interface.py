from abc import abstractmethod
from typing import Protocol

from src.services.anime_review.schemas import CreateAnimeReviewSchema, UpdateAnimeReviewSchema


class AnimeReviewServiceI(Protocol):
    @abstractmethod
    async def create(self, anime_review: CreateAnimeReviewSchema) -> None: ...

    @abstractmethod
    async def update(self, review_id: int, anime_review: UpdateAnimeReviewSchema) -> None: ...

    @abstractmethod
    async def delete(self, review_id: int) -> None: ...

    @abstractmethod
    async def _update_anime_rating(self, anime_id: int) -> None: ...
