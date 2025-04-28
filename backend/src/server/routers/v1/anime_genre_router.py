from fastcrud import crud_router

from src.clients.database.models.anime_genre import AnimeGenre
from src.container import container
from src.services.anime_genre.schemas import CreateAnimeGenreSchema, UpdateAnimeGenreSchema


anime_genre_router = crud_router(
    session=container.database().get_db_session,
    model=AnimeGenre,
    create_schema=CreateAnimeGenreSchema,
    update_schema=UpdateAnimeGenreSchema,
    crud=container.anime_genre_crud(),
    path="/anime_genre",
    tags=["Anime genre"],
)