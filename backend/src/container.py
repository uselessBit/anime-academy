from typing import TYPE_CHECKING

from dependency_injector import containers
from dependency_injector.providers import Factory, Resource, Singleton

from src.clients.database.engine import Database, async_engine
from src.settings.database import DatabaseSettings

if TYPE_CHECKING:
    from collections.abc import AsyncGenerator

    from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession


class DependencyContainer(containers.DeclarativeContainer):
    database_settings: Singleton["DatabaseSettings"] = Singleton(DatabaseSettings)
    async_engine: Singleton["AsyncEngine"] = Singleton(
        async_engine,
        database_settings=database_settings.provided,
    )
    database: Factory["Database"] = Factory(Database, engine=async_engine.provided)
    database_session: Resource["AsyncGenerator[AsyncSession, None]"] = Resource(database.provided.get_session)



container = DependencyContainer()
