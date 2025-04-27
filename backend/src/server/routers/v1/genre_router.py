from fastcrud import FastCRUD, crud_router

from src.clients.database.models.genre import Genre
from src.clients.database.utils import get_session
from src.services.genre.schemas import CreateGenreSchema, UpdateGenreSchema

genre_crud = FastCRUD(Genre)


genre_router = crud_router(
    session=get_session,
    model=Genre,
    create_schema=CreateGenreSchema,
    update_schema=UpdateGenreSchema,
    crud=genre_crud,
    path="/genre",
    tags=["Genre"],
)