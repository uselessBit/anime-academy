from typing import TYPE_CHECKING

from dependency_injector import containers
from dependency_injector.providers import Factory, Resource, Singleton
from fastcrud import FastCRUD
from redis.asyncio import Redis

from src.clients.database.engine import Database, async_engine
from src.clients.database.models.anime import Anime
from src.clients.database.models.anime_comment import AnimeComment
from src.clients.database.models.anime_rating import AnimeRating
from src.clients.database.models.anime_series import AnimeSeries
from src.clients.database.models.genre import Genre
from src.clients.database.models.user_anime_status import UserAnimeStatus
from src.clients.redis_cache import RedisCache
from src.services.anime.service import AnimeService, AnimeGenreService
from src.services.anime_comment.service import AnimeCommentService
from src.services.anime_rating.service import AnimeRatingService
from src.services.anime_series.interface import AnimeSeriesServiceI
from src.services.anime_series.service import AnimeSeriesService
from src.services.user_anime_status.interface import UserAnimeStatusServiceI
from src.services.user_anime_status.service import StatusService
from src.settings.database import DatabaseSettings
from src.settings.redis import RedisSettings

if TYPE_CHECKING:
    from collections.abc import AsyncGenerator

    from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession

    from src.services.anime.interface import AnimeServiceI, AnimeGenreServiceI
    from src.services.anime_comment.interface import AnimeCommentServiceI
    from src.services.anime_rating.interface import AnimeRatingServiceI


class DependencyContainer(containers.DeclarativeContainer):
    database_settings: Singleton["DatabaseSettings"] = Singleton(DatabaseSettings)
    redis_settings: Singleton["RedisSettings"] = Singleton(RedisSettings)

    async_engine: Singleton["AsyncEngine"] = Singleton(
        async_engine,
        database_settings=database_settings.provided,
    )
    database: Factory["Database"] = Factory(Database, engine=async_engine.provided)
    database_session: Resource["AsyncGenerator[AsyncSession, None]"] = Resource(database.provided.get_session)
    database_session_no_context: Resource["AsyncGenerator[AsyncSession, None]"] = Resource(
        database.provided.get_db_session
    )

    redis_client: Singleton["Redis"] = Singleton(
        Redis,
        host=redis_settings.provided.host,
        port=redis_settings.provided.port,
        decode_responses=redis_settings.provided.decode_responses,
    )
    redis_cache: Factory["RedisCache"] = Factory(RedisCache, client=redis_client, settings=redis_settings)

    genre_crud: Factory["FastCRUD"] = Factory(FastCRUD, model=Genre)
    anime_series_crud: Factory["FastCRUD"] = Factory(FastCRUD, model=AnimeSeries)
    user_anime_status_crud: Factory["FastCRUD"] = Factory(FastCRUD, model=UserAnimeStatus)
    anime_rating_crud: Factory["FastCRUD"] = Factory(FastCRUD, model=AnimeRating)
    anime_comment_crud: Factory["FastCRUD"] = Factory(FastCRUD, model=AnimeComment)

    anime_genre_service: Factory["AnimeGenreServiceI"] = Factory(
        AnimeGenreService, session=database_session
    )
    anime_rating_service: Factory["AnimeRatingServiceI"] = Factory(
        AnimeRatingService, session=database_session, anime_rating_crud=anime_rating_crud
    )
    anime_service: Factory["AnimeServiceI"] = Factory(AnimeService, session=database_session,
                                                      anime_genre_service=anime_genre_service)
    anime_comment_service: Factory["AnimeCommentServiceI"] = Factory(AnimeCommentService, session=database_session)
    anime_series_service: Factory["AnimeSeriesServiceI"] = Factory(AnimeSeriesService, session=database_session)
    user_anime_status_service: Factory["UserAnimeStatusServiceI"] = Factory(StatusService, session=database_session)


container = DependencyContainer()
