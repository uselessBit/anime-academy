from fastcrud import FastCRUD, crud_router

from src.clients.database.models.user_favorite import UserFavorite
from src.clients.database.utils import get_session
from src.services.user_favorite.schemas import CreateUserFavoriteSchema, UpdateUserFavoriteSchema

user_favorite_crud = FastCRUD(UserFavorite)


user_favorite_router = crud_router(
    session=get_session,
    model=UserFavorite,
    create_schema=CreateUserFavoriteSchema,
    update_schema=UpdateUserFavoriteSchema,
    crud=user_favorite_crud,
    path="/user_favorite",
    tags=["User favorite"],
)