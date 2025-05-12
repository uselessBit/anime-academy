from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware

from src.container import DependencyContainer, container
from src.server.handle_erros import patch_exception_handlers
from src.server.middlewares.cache import CacheMiddleware
from src.server.routers.v1.routers import api_v1_router


class CustomFastAPI(FastAPI):
    container: DependencyContainer


origins = ["http://localhost:5173", "http://127.0.0.1:5173", "http://0.0.0.0:8000"]


@asynccontextmanager
async def lifespan(app: FastAPI):
    await container.database().create_db_and_tables()
    yield


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
    server.add_middleware(CacheMiddleware, redis_cache=container.redis_cache())
    patch_exception_handlers(app=server)
    # server.mount("/media", StaticFiles(directory="/media"), name="media")  # noqa: ERA001
    server.include_router(api_v1_router)
    return server
