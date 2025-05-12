from abc import abstractmethod
from typing import Protocol

from src.services.anime.schemas import CreateAnimeSchema, UpdateAnimeSchema, AnimeResponseSchema
from src.services.schemas import Image


class AnimeServiceI(Protocol):
    @abstractmethod
    async def create(self, anime_data: CreateAnimeSchema, image: Image) -> None: ...

    @abstractmethod
    async def get_multi(self, offset: int | None, limit: int | None) -> list[AnimeResponseSchema]: ...

    @abstractmethod
    async def get(self, anime_id: int) -> AnimeResponseSchema: ...

    @abstractmethod
    async def update(self, anime_id: int, anime_data: UpdateAnimeSchema, image: Image) -> None: ...

    @abstractmethod
    async def delete(self, anime_id: int) -> None: ...


class AnimeGenreServiceI(Protocol):
    @abstractmethod
    async def create(self, anime_id: int, genre_id: int) -> None: ...

    @abstractmethod
    async def update(self, anime_id: int, anime_data: UpdateAnimeSchema) -> None: ...
