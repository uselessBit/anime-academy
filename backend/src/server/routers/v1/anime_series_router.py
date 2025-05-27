from fastcrud import crud_router
from fastapi import APIRouter, Depends

from src.clients.database.models.anime_series import AnimeSeries
from src.container import container
from src.services.anime_series.interface import AnimeSeriesServiceI
from src.services.anime_series.schemas import CreateAnimeSeriesSchema, UpdateAnimeSeriesSchema, \
    AnimeSeriesResponseSchema


async def get_anime_series_service() -> AnimeSeriesServiceI:
    return container.anime_series_service()

anime_series_auto_router = crud_router(
    session=container.database().get_db_session,
    model=AnimeSeries,
    create_schema=CreateAnimeSeriesSchema,
    update_schema=UpdateAnimeSeriesSchema,
    crud=container.anime_series_crud(),
    path="/anime_series",
    tags=["Anime series"],
)

anime_series_router = APIRouter(
    tags=["Anime series"],
)
anime_series_router.include_router(anime_series_auto_router)


@anime_series_router.get("/anime_series/anime/{anime_id}", response_model=list[AnimeSeriesResponseSchema])
async def get_anime_series(
    anime_id: int,
    anime_series_service: AnimeSeriesServiceI = Depends(get_anime_series_service),
) -> list[AnimeSeriesResponseSchema]:
    return await anime_series_service.get_anime_series(anime_id)