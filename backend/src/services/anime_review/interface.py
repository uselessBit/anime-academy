from abc import abstractmethod
from typing import Protocol


class AnimeReviewServiceI(Protocol):
    @abstractmethod
    async def update_anime_rating(self, anime_id: int) -> None: ...
