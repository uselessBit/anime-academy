from src.clients.database.engine import Database
from src.container import container

database = Database(container.async_engine())

async def get_session():
    async with database.session() as session:
        yield session