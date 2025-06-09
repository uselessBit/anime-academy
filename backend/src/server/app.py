from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from sqladmin import Admin

from src.admin.models.anime_admin import AnimeAdmin
from src.admin.models.anime_comment_admin import AnimeCommentAdmin
from src.admin.models.anime_rating_admin import AnimeRatingAdmin
from src.admin.models.anime_series_admin import AnimeSeriesAdmin
from src.admin.models.genre_admin import GenreAdmin
from src.admin.models.user_admin import UserAdmin
from src.admin.models.user_anime_status_admin import UserAnimeStatusAdmin
from src.container import DependencyContainer, container
from src.server.handle_erros import patch_exception_handlers
from src.server.middlewares.cache import CacheMiddleware
from src.server.routers.v1.routers import api_v1_router


class CustomFastAPI(FastAPI):
    container: DependencyContainer


origins = ["http://localhost:5174", "http://127.0.0.1:5174", "http://0.0.0.0:8000", "https://anime-academy.netlify.app"]


@asynccontextmanager
async def lifespan(app: FastAPI):
    await container.database().create_db_and_tables()
    yield


def create_application() -> CustomFastAPI:
    server = CustomFastAPI(title="anime_academy", lifespan=lifespan)
    server.container = DependencyContainer()
    server.add_middleware(CacheMiddleware, redis_cache=container.redis_cache())
    server.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    admin = Admin(server, engine=container.database().engine)
    admin.add_view(UserAdmin)
    admin.add_view(AnimeAdmin)
    admin.add_view(AnimeCommentAdmin)
    admin.add_view(AnimeRatingAdmin)
    admin.add_view(AnimeSeriesAdmin)
    admin.add_view(GenreAdmin)
    admin.add_view(UserAnimeStatusAdmin)

    patch_exception_handlers(app=server)
    server.mount("/media", StaticFiles(directory="/media"), name="media")  # noqa: ERA001
    server.include_router(api_v1_router)
    return server
