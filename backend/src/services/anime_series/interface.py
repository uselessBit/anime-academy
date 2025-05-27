from abc import abstractmethod
from typing import Protocol

from src.clients.database.models.anime_comment import AnimeComment
from src.services.anime_comment.schemas import CommentTreeResponse
from src.services.anime_series.schemas import AnimeSeriesResponseSchema


class AnimeSeriesServiceI(Protocol):
    @abstractmethod
    async def get_anime_series(self, anime_id: int) -> list[AnimeSeriesResponseSchema]: ...

