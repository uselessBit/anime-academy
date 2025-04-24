from src.clients.database.models.anime import Anime
from fastcrud import FastCRUD, crud_router

from src.clients.database.utils import get_session
from src.services.anime.schemas import CreateAnimeSchema, UpdateAnimeSchema

anime_crud = FastCRUD(Anime)


anime_router = crud_router(
    session=get_session,
    model=Anime,
    create_schema=CreateAnimeSchema,
    update_schema=UpdateAnimeSchema,
    crud=anime_crud,
    path="/anime",
    tags=["Anime"],
)