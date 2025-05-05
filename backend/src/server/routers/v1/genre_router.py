from fastcrud import crud_router

from src.clients.database.models.genre import Genre
from src.container import container
from src.services.genre.schemas import CreateGenreSchema, UpdateGenreSchema

genre_router = crud_router(
    session=container.database().get_db_session,
    model=Genre,
    create_schema=CreateGenreSchema,
    update_schema=UpdateGenreSchema,
    crud=container.genre_crud(),
    path="/genre",
    tags=["Genre"],
)
