from collections.abc import Callable
from uuid import UUID

from fastcrud import FastCRUD
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import TypeAdapter

from src.clients.database.models.anime import Anime
from src.clients.database.models.anime_rating import AnimeRating
from src.services.anime_rating.interface import AnimeRatingServiceI
from src.services.anime_rating.schemas import CreateAnimeRatingSchema, UpdateAnimeRatingSchema, \
    AnimeRatingResponseSchema
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

    async def get_rating_stats(self, anime_id: int) -> dict[str, int]:
        async with self.session() as session:
            result = await session.execute(
                select(
                    AnimeRating.rating,
                    func.count(AnimeRating.rating).label("count")
                )
                .where(AnimeRating.anime_id == anime_id)
                .group_by(AnimeRating.rating)
            )
            rows = result.all()
            rating_counts = {row.rating: row.count for row in rows}

            full_stats = {f"star_{i}": rating_counts.get(i, 0) for i in range(1, 11)}
            return full_stats

    async def get_user_rating(self, anime_id: int, user_id: UUID) -> AnimeRatingResponseSchema | None:
        async with self.session() as session:
            result = await session.execute(
                select(AnimeRating).where(
                    AnimeRating.anime_id == anime_id,
                    AnimeRating.user_id == user_id
                )
            )
            anime_rating =  result.scalar_one_or_none()
            if anime_rating:
                type_adapter = TypeAdapter(AnimeRatingResponseSchema)
                return type_adapter.validate_python(anime_rating)
            return None
