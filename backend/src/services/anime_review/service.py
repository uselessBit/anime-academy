from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.clients.database.models.anime import Anime
from src.clients.database.models.anime_review import AnimeReview
from src.services.anime_review.interface import AnimeReviewServiceI
from src.services.base import BaseService


class AnimeReviewService(BaseService, AnimeReviewServiceI):
    async def update_anime_rating(self, anime_id: int) -> None:
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
