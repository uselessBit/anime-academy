from abc import abstractmethod
from typing import Protocol

from src.services.anime_series.schemas import AnimeSeriesResponseSchema


class AnimeSeriesServiceI(Protocol):
    @abstractmethod
    async def get_anime_series(self, anime_id: int) -> list[AnimeSeriesResponseSchema]: ...

