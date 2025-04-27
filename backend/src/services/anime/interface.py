from abc import abstractmethod
from typing import Protocol

from src.services.anime.schemas import CreateAnimeSchema, UpdateAnimeSchema
from src.services.schemas import Image


class AnimeServiceI(Protocol):
    @abstractmethod
    async def create(self, anime: CreateAnimeSchema, image: Image) -> None:
        ...

    @abstractmethod
    async def update(self, anime_id: int, anime: UpdateAnimeSchema, image: Image) -> None:
        ...

    @abstractmethod
    async def delete(self, anime_id: int) -> None:
        ...