from collections.abc import Callable

from fastcrud import FastCRUD
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.clients.database.models.anime import Anime
from src.clients.database.models.anime_rating import AnimeRating
from src.services.anime_rating.interface import AnimeRatingServiceI
from src.services.anime_rating.schemas import CreateAnimeRatingSchema, UpdateAnimeRatingSchema
from src.services.base import BaseService
from src.services.errors import AnimeReviewNotFoundError


class AnimeRatingService(BaseService, AnimeRatingServiceI):
    def __init__(self, session: Callable[..., AsyncSession], anime_rating_crud: FastCRUD) -> None:
        super().__init__(session)
        self.anime_rating_crud = anime_rating_crud

    async def create(self, anime_rating: CreateAnimeRatingSchema) -> None:
        async with self.session() as session:
            rating = await self.anime_rating_crud.create(session, anime_rating)
            await self._update_anime_rating(rating.anime_id)

    async def update(self, review_id: int, anime_rating: UpdateAnimeRatingSchema) -> None:
        async with self.session() as session:
            await self.anime_rating_crud.update(session, anime_rating, id=review_id, allow_multiple=True)
            await self._update_anime_rating(anime_rating.anime_id)

    async def delete(self, rating_id) -> None:
        async with self.session() as session:
            rating = await self.anime_rating_crud.get(session, id=rating_id)
            if rating is None:
                raise AnimeReviewNotFoundError

            await self.anime_rating_crud.delete(session, id=rating_id)
            await self._update_anime_rating(rating["anime_id"])

    async def _update_anime_rating(self, anime_id: int) -> None:
        async with self.session() as session:
            avg_rating = await session.scalar(
                select(func.avg(AnimeRating.rating)).where(AnimeRating.anime_id == anime_id)
            )
            await session.execute(update(Anime).where(Anime.id == anime_id).values(rating=avg_rating or 0.0))
            await session.commit()
