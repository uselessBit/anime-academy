from asyncio import current_task
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from fastapi import Depends
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_scoped_session,
    async_sessionmaker,
    create_async_engine,
)

from src.clients.database.base import Base
from src.settings.database import DatabaseSettings


def async_engine(database_settings: DatabaseSettings) -> AsyncEngine:
    return create_async_engine(url=database_settings.url, echo=True)


class Database:
    def __init__(self, engine: AsyncEngine) -> None:
        self.engine = engine
        self.session = async_scoped_session(
            async_sessionmaker(self.engine, expire_on_commit=False), scopefunc=current_task
        )

    @asynccontextmanager
    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        async with self.session() as session:
            yield session

    async def get_db_session(self) -> AsyncGenerator[AsyncSession, None]:
        async with self.session() as session:
            yield session

    async def create_db_and_tables(self):
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        await self.engine.dispose()


# alembic revision --autogenerate -m 'initial'
# alembic upgrade head
