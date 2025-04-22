from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from src.clients.database.base import Base
from src.container import DependencyContainer, container
from src.server.handle_erros import patch_exception_handlers
from src.server.routers.v1.routers import api_v1_router
from sqlalchemy.ext.asyncio import AsyncEngine

class CustomFastAPI(FastAPI):
    container: DependencyContainer


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

async def lifespan(app: FastAPI):
    engine: AsyncEngine = container.async_engine()

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield

    await engine.dispose()


def create_application() -> CustomFastAPI:
    server = CustomFastAPI(title="anime_academy", lifespan=lifespan)
    server.container = DependencyContainer()
    server.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    patch_exception_handlers(app=server)
    # server.mount("/media", StaticFiles(directory="/media"), name="media")
    server.include_router(api_v1_router)
    return server
