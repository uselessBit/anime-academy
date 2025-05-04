from typing import TYPE_CHECKING

from dependency_injector import containers
from dependency_injector.providers import Factory, Resource, Singleton

from src.clients.database.engine import Database, async_engine
from src.clients.database.models.anime import Anime
from src.clients.database.models.anime_comment import AnimeComment
from src.clients.database.models.anime_genre import AnimeGenre
from src.clients.database.models.anime_rating import AnimeRating
from src.clients.database.models.genre import Genre
from src.clients.database.models.user_anime_status import UserAnimeStatus
from src.services.anime.service import AnimeService
from src.services.anime_comment.service import AnimeCommentService
from src.services.anime_rating.service import AnimeRatingService
from src.settings.database import DatabaseSettings
from fastcrud import FastCRUD

if TYPE_CHECKING:
    from collections.abc import AsyncGenerator

    from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession
    from src.services.anime_rating.interface import AnimeRatingServiceI
    from src.services.anime.interface import AnimeServiceI
    from src.services.anime_comment.interface import AnimeCommentServiceI


class DependencyContainer(containers.DeclarativeContainer):
    database_settings: Singleton["DatabaseSettings"] = Singleton(DatabaseSettings)
    async_engine: Singleton["AsyncEngine"] = Singleton(
        async_engine,
        database_settings=database_settings.provided,
    )
    database: Factory["Database"] = Factory(Database, engine=async_engine.provided)
    database_session: Resource["AsyncGenerator[AsyncSession, None]"] = Resource(database.provided.get_session)
    database_session_no_context: Resource["AsyncGenerator[AsyncSession, None]"] = Resource(database.provided.get_db_session)

    anime_crud: Factory["FastCRUD"] = Factory(FastCRUD, model=Anime)
    anime_genre_crud: Factory["FastCRUD"] = Factory(FastCRUD, model=AnimeGenre)
    genre_crud: Factory["FastCRUD"] = Factory(FastCRUD, model=Genre)
    user_anime_status_crud: Factory["FastCRUD"] = Factory(FastCRUD, model=UserAnimeStatus)
    anime_rating_crud: Factory["FastCRUD"] = Factory(FastCRUD, model=AnimeRating)
    anime_comment_crud: Factory["FastCRUD"] = Factory(FastCRUD, model=AnimeComment)

    anime_rating_service: Factory["AnimeRatingServiceI"] = Factory(AnimeRatingService, session=database_session, anime_rating_crud=anime_rating_crud)
    anime_service: Factory["AnimeServiceI"] = Factory(AnimeService, session=database_session, anime_crud=anime_crud)
    anime_comment_service: Factory["AnimeCommentServiceI"] = Factory(AnimeCommentService, session=database_session)



container = DependencyContainer()
