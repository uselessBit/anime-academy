from fastapi import APIRouter

from src.server.routers.v1.anime_comment_router import anime_comment_router
from src.server.routers.v1.user_router import user_router
from src.server.routers.v1.anime_router import anime_router
from src.server.routers.v1.anime_genre_router import anime_genre_router
from src.server.routers.v1.anime_rating_router import anime_rating_router
from src.server.routers.v1.genre_router import genre_router
from src.server.routers.v1.user_anime_status_router import user_anime_status_router

crud_router = APIRouter(prefix="/crud")
crud_router.include_router(anime_router)
crud_router.include_router(anime_genre_router)
crud_router.include_router(anime_rating_router)
crud_router.include_router(genre_router)
crud_router.include_router(user_anime_status_router)
crud_router.include_router(anime_comment_router)

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(crud_router)
api_v1_router.include_router(user_router)