from sqlalchemy import select

from src.clients.database.models.anime_comment import AnimeComment
from src.clients.database.models.anime_series import AnimeSeries
from src.services.anime_comment.schemas import CommentTreeResponse
from src.services.anime_series.interface import AnimeSeriesServiceI
from src.services.anime_series.schemas import AnimeSeriesResponseSchema
from src.services.base import BaseService
from pydantic import TypeAdapter


class AnimeSeriesService(BaseService, AnimeSeriesServiceI):
    async def get_anime_series(self, anime_id: int) -> list[AnimeSeriesResponseSchema]:
        async with self.session() as session:
            query = select(AnimeSeries).where(AnimeSeries.anime_id == anime_id)
            result = await session.execute(query)
            series = result.scalars().all()

            return [AnimeSeriesResponseSchema.model_validate(s) for s in series]
