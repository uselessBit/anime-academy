from fastcrud import crud_router

from src.clients.database.models.user_favorite import UserFavorite
from src.container import container
from src.services.user_favorite.schemas import CreateUserFavoriteSchema, UpdateUserFavoriteSchema


user_favorite_router = crud_router(
    session=container.database().get_db_session,
    model=UserFavorite,
    create_schema=CreateUserFavoriteSchema,
    update_schema=UpdateUserFavoriteSchema,
    crud=container.user_favorite_crud(),
    path="/user_favorite",
    tags=["User favorite"],
)