from typing import Callable

from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.clients.database.models.anime import Anime
from src.clients.database.models.anime_review import AnimeReview
from src.services.anime_review.interface import AnimeReviewServiceI
from src.services.anime_review.schemas import CreateAnimeReviewSchema, UpdateAnimeReviewSchema
from src.services.base import BaseService
from fastcrud import FastCRUD

from src.services.errors import AnimeReviewNotFoundError


class AnimeReviewService(BaseService, AnimeReviewServiceI):
    def __init__(self, session: Callable[..., AsyncSession], anime_review_crud: FastCRUD) -> None:
        super().__init__(session)
        self.anime_review_crud = anime_review_crud

    async def create(self, anime_review: CreateAnimeReviewSchema) -> None:
        async with self.session() as session:
            review = await self.anime_review_crud.create(session, anime_review)
            await self._update_anime_rating(review.anime_id)

    async def update(self, review_id: int, anime_review: UpdateAnimeReviewSchema) -> None:
        async with self.session() as session:
            await self.anime_review_crud.update(session, anime_review, id=review_id, allow_multiple=True)
            await self._update_anime_rating(anime_review.anime_id)

    async def delete(self, review_id) -> None:
        async with self.session() as session:
            review = await self.anime_review_crud.get(session, id=review_id)
            if review is None:
                raise AnimeReviewNotFoundError

            await self.anime_review_crud.delete(session, id=review_id)
            await self._update_anime_rating(review["anime_id"])

    async def _update_anime_rating(self, anime_id: int) -> None:
        async with self.session() as session:
            avg_rating = await session.scalar(
                select(func.avg(AnimeReview.rating)).where(AnimeReview.anime_id == anime_id)
            )
            await session.execute(
                update(Anime)
                .where(Anime.id == anime_id)
                .values(rating=avg_rating or 0.0)
            )
            await session.commit()
