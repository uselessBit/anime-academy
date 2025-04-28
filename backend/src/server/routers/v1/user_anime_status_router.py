from fastcrud import crud_router

from src.clients.database.models.user_anime_status import UserAnimeStatus
from src.container import container
from src.services.user_anime_status.schemas import CreateUserAnimeStatusSchema, UpdateUserAnimeStatusSchema


user_anime_status_router = crud_router(
    session=container.database().get_db_session,
    model=UserAnimeStatus,
    create_schema=CreateUserAnimeStatusSchema,
    update_schema=UpdateUserAnimeStatusSchema,
    crud=container.user_anime_status_crud(),
    path="/user_anime_status",
    tags=["User anime status"],
)