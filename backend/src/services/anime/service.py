from typing import Callable

from src.services.anime.interface import AnimeServiceI
from src.services.anime.schemas import CreateAnimeSchema, UpdateAnimeSchema
from src.services.base import BaseService
from src.services.errors import AnimeNotFoundError
from src.services.schemas import Image
from sqlalchemy.ext.asyncio import AsyncSession
from fastcrud import FastCRUD

from src.services.static import anime_path
from src.services.utils import save_image, delete_image


class AnimeService(BaseService, AnimeServiceI):
    def __init__(self, session: Callable[..., AsyncSession], anime_crud: FastCRUD) -> None:
        super().__init__(session)
        self.anime_crud = anime_crud

    async def create(self, anime: CreateAnimeSchema, image: Image) -> None:
        async with self.session() as session:
            image_url = await save_image(image, anime_path) if image.filename else None
            if image_url:
                anime.image_url = image_url
            await self.anime_crud.create(session, anime)

    async def update(self, anime_id: int, anime: UpdateAnimeSchema, image: Image) -> None:
        async with self.session() as session:
            image_url = await save_image(image, anime_path) if image.filename else None
            anime_model = await self.anime_crud.get(session, id=anime_id)
            if image_url:
                if filename := anime_model["image_url"]:
                    await delete_image(str(filename), anime_path)
                anime.image_url = image_url
            await self.anime_crud.update(session, anime, id=anime_id)

    async def delete(self, anime_id: int) -> None:
        async with self.session() as session:
            anime_model = await self.anime_crud.get(session, id=anime_id)
            if not anime_model:
                raise AnimeNotFoundError
            if filename := anime_model["image_url"]:
                await delete_image(str(filename), anime_path)
            await self.anime_crud.delete(session, id=anime_id)