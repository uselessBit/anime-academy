from collections.abc import Callable

from fastcrud import FastCRUD
from pydantic import TypeAdapter
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select, exists, func, inspect
from sqlalchemy.orm import selectinload

from src.clients.database.models.anime import AnimeGenre, Anime
from src.clients.database.models.genre import Genre
from src.services.anime.interface import AnimeServiceI, AnimeGenreServiceI
from src.services.anime.schemas import CreateAnimeSchema, UpdateAnimeSchema, AnimeResponseSchema, SortBy, Order
from src.services.base import BaseService
from src.services.errors import AnimeNotFoundError, GenreNotFoundError
from src.services.schemas import Image
from src.services.static import anime_path, relationship_not_found, genres_not_found
from src.services.utils import delete_image, save_image, try_commit


class AnimeService(BaseService, AnimeServiceI):
    def __init__(
        self, session: Callable[..., AsyncSession], anime_genre_service: AnimeGenreServiceI
    ) -> None:
        super().__init__(session)
        self.anime_genre_service = anime_genre_service

    async def create(self, anime_data: CreateAnimeSchema, image: Image) -> None:
        async with self.session() as session:
            query = select(Genre).where(Genre.id.in_(anime_data.genre_ids))
            result = await session.execute(query)
            genres = result.scalars().all()

            if len(genres) != len(anime_data.genre_ids):
                missing_ids = set(anime_data.genre_ids) - {
                    genre.id for genre in genres
                }
                raise GenreNotFoundError(genres_not_found.format(missing_ids=missing_ids))

            image_url = await save_image(image, anime_path) if image.filename else None
            if image_url:
                anime_data.image_url = image_url

            new_anime = Anime(
                image_url=image_url,
                **anime_data.model_dump(exclude={'genre_ids', 'image_url'})
            )
            session.add(new_anime)
            await try_commit(session, new_anime.title, delete_image, anime_path)
            await session.flush()

            for genre_id in anime_data.genre_ids:
                await self.anime_genre_service.create(
                    anime_id=new_anime.id,
                    genre_id=genre_id,
                )

    async def get_multi(
            self,
            offset: int | None = None,
            limit: int | None = None,
            sort_by: SortBy = SortBy.TITLE,
            order: Order = Order.ASC,
            genre_ids: list[int] | None = None,
            min_year: int | None = None,
            max_year: int | None = None,
            min_rating: float | None = None,
            max_rating: float | None = None
    ) -> list[AnimeResponseSchema]:
        async with self.session() as session:
            query = select(Anime).options(selectinload(Anime.genres))

            if genre_ids:
                query = query.where(
                    exists().where(
                        AnimeGenre.anime_id == Anime.id,
                        AnimeGenre.genre_id.in_(genre_ids)
                    )
                )

            if min_year is not None and max_year is not None:
                query = query.where(Anime.release_year.between(min_year, max_year))
            elif min_year is not None:
                query = query.where(Anime.release_year >= min_year)
            elif max_year is not None:
                query = query.where(Anime.release_year <= max_year)

            if min_rating is not None:
                query = query.where(Anime.rating >= min_rating)
            if max_rating is not None:
                query = query.where(Anime.rating <= max_rating)

            order_attr = getattr(Anime, sort_by)
            if order == Order.DESC:
                query = query.order_by(order_attr.desc())
            else:
                query = query.order_by(order_attr.asc())

            if offset is not None:
                query = query.offset(offset)
            if limit is not None:
                query = query.limit(limit)

            result = await session.execute(query)
            anime_list = result.scalars().all()

            anime_data_list = [
                {
                    **anime.__dict__,
                    "genre_ids": [genre.id for genre in anime.genres] if anime.genres else []
                }
                for anime in anime_list
            ]

            return TypeAdapter(list[AnimeResponseSchema]).validate_python(anime_data_list)

    def model_to_dict(self, instance):
        return {
            key: getattr(instance, key)
            for key in inspect(instance).mapper.column_attrs.keys()
        }

    async def get(self, anime_id: int) -> AnimeResponseSchema:
        async with self.session() as session:
            query = select(Anime).options(selectinload(Anime.genres)).where(Anime.id == anime_id)
            result = await session.execute(query)
            anime = result.scalar_one_or_none()

            if not anime:
                raise AnimeNotFoundError

            anime_data = self.model_to_dict(anime)

            anime_data["genre_ids"] = [genre.id for genre in anime.genres] if anime.genres else []

            type_adapter = TypeAdapter(AnimeResponseSchema)
            return type_adapter.validate_python(anime_data)


    async def get_by_title(self, title: str) -> list[AnimeResponseSchema]:
        async with self.session() as session:
            query = (
                select(Anime)
                .options(selectinload(Anime.genres))
                .where(Anime.title.ilike(f"%{title}%"))
                .order_by(func.length(Anime.title).asc())
                .limit(10)
            )

            result = await session.execute(query)
            animes = result.scalars().all()

            type_adapter = TypeAdapter(list[AnimeResponseSchema])
            return type_adapter.validate_python([
                {
                    **{
                        key: getattr(anime, key)
                        for key in inspect(anime).mapper.column_attrs.keys()
                    },
                    "genre_ids": [genre.id for genre in anime.genres] if anime.genres else []
                }
                for anime in animes
            ])

    async def update(self, anime_id: int, anime_data: UpdateAnimeSchema, image: Image) -> None:
        updates = anime_data.model_dump(exclude_unset=True)
        async with self.session() as session:
            query = select(Anime).options(selectinload(Anime.genres)).where(Anime.id == anime_id)

            result = await session.execute(query)
            anime = result.scalar_one_or_none()
            if not anime:
                raise AnimeNotFoundError

            for attr, value in updates.items():
                if attr != "genre_ids" and hasattr(anime, attr):
                    setattr(anime, attr, value)

            if "genre_ids" in updates:
                await self.anime_genre_service.update(
                    anime_id=anime_id,
                    anime_data=anime_data,
                    anime_genres=anime.genres,
                )

            image_url = await save_image(image, anime_path) if image.filename else None
            if image_url:
                if filename := anime.image_url:
                    await delete_image(str(filename), anime_path)
                anime.image_url = image_url
            await try_commit(session, anime_data.title, delete_image, anime_path)

    async def delete(self, anime_id: int) -> None:
        async with self.session() as session:
            anime = await session.get(Anime, anime_id)
            if not anime:
                raise AnimeNotFoundError
            if filename := anime.image_url:
                await delete_image(str(filename), anime_path)
            await session.delete(anime)
            await session.commit()



class AnimeGenreService(BaseService, AnimeGenreServiceI):
    async def create(self, anime_id: int, genre_id: int) -> None:
        async with self.session() as session:
            new_anime_genre = AnimeGenre(anime_id=anime_id, genre_id=genre_id)
            session.add(new_anime_genre)
            await try_commit(session, str(anime_id))

    async def update(self, anime_id: int, anime_data: UpdateAnimeSchema, anime_genres: list[int]) -> None:
        async with self.session() as session:
            if anime_genres:
                query = delete(AnimeGenre).where(AnimeGenre.anime_id == anime_id)
                result = await session.execute(query)

                if result.rowcount == 0:
                    raise AnimeNotFoundError(relationship_not_found)

            for genre_id in anime_data.genre_ids:
                new_product_ingredient = AnimeGenre(anime_id=anime_id, genre_id=genre_id)
                session.add(new_product_ingredient)
            await session.commit()
