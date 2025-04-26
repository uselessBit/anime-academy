from src.clients.database.base import Base
from src.clients.database.engine import Database
from src.clients.database.models.user import User
from src.container import container
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession
from fastapi_users.db import SQLAlchemyUserDatabase
from fastapi import Depends

engine: AsyncEngine = container.async_engine()
database = Database(engine)

async def get_session():
    async with database.session() as session:
        yield session

async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await engine.dispose()

async def get_user_db(session: AsyncSession = Depends(get_session)):
    yield SQLAlchemyUserDatabase(session, User)