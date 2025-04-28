from typing import TYPE_CHECKING

from dependency_injector import containers
from dependency_injector.providers import Factory, Resource, Singleton

from src.clients.database.engine import Database, async_engine
from src.clients.database.models.anime import Anime
from src.clients.database.models.anime_genre import AnimeGenre
from src.clients.database.models.anime_review import AnimeReview
from src.clients.database.models.genre import Genre
from src.clients.database.models.user_favorite import UserFavorite
from src.services.anime.service import AnimeService
from src.services.anime_review.service import AnimeReviewService
from src.settings.database import DatabaseSettings
from fastcrud import FastCRUD

if TYPE_CHECKING:
    from collections.abc import AsyncGenerator

    from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession
    from src.services.anime_review.interface import AnimeReviewServiceI
    from src.services.anime.interface import AnimeServiceI


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
    user_favorite_crud: Factory["FastCRUD"] = Factory(FastCRUD, model=UserFavorite)
    anime_review_crud: Factory["FastCRUD"] = Factory(FastCRUD, model=AnimeReview)

    anime_review_service: Factory["AnimeReviewServiceI"] = Factory(AnimeReviewService, session=database_session, anime_review_crud=anime_review_crud)
    anime_service: Factory["AnimeServiceI"] = Factory(AnimeService, session=database_session, anime_crud=anime_crud)



container = DependencyContainer()
