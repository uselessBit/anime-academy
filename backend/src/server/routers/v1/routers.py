from fastapi import APIRouter

from src.server.routers.v1.user_router import user_router
from src.server.routers.v1.anime_router import anime_router
from src.server.routers.v1.anime_genre_router import anime_genre_router
from src.server.routers.v1.anime_review_router import anime_review_router
from src.server.routers.v1.genre_router import genre_router
from src.server.routers.v1.user_anime_status_router import user_anime_status_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(user_router)
api_v1_router.include_router(anime_router)
api_v1_router.include_router(anime_genre_router)
api_v1_router.include_router(anime_review_router)
api_v1_router.include_router(genre_router)
api_v1_router.include_router(user_anime_status_router)