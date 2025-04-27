from fastcrud import FastCRUD, crud_router

from src.clients.database.models.anime_genre import AnimeGenre
from src.clients.database.utils import get_session
from src.services.anime_genre.schemas import CreateAnimeGenreSchema, UpdateAnimeGenreSchema

anime_genre_crud = FastCRUD(AnimeGenre)


anime_genre_router = crud_router(
    session=get_session,
    model=AnimeGenre,
    create_schema=CreateAnimeGenreSchema,
    update_schema=UpdateAnimeGenreSchema,
    crud=anime_genre_crud,
    path="/anime_genre",
    tags=["Anime genre"],
)