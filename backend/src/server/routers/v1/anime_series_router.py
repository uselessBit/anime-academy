from fastcrud import crud_router

from src.clients.database.models.anime_series import AnimeSeries
from src.container import container
from src.services.anime_series.schemas import CreateAnimeSeriesSchema, UpdateAnimeSeriesSchema

anime_series_router = crud_router(
    session=container.database().get_db_session,
    model=AnimeSeries,
    create_schema=CreateAnimeSeriesSchema,
    update_schema=UpdateAnimeSeriesSchema,
    crud=container.anime_series_crud(),
    path="/anime_series",
    tags=["Anime series"],
)
