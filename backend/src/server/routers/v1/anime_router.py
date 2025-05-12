from http import HTTPStatus

from fastapi import APIRouter, Depends, File, UploadFile
from starlette.responses import JSONResponse

from src.container import container
from src.services.anime.interface import AnimeServiceI
from src.services.anime.schemas import CreateAnimeSchema, UpdateAnimeSchema, AnimeResponseSchema
from src.services.schemas import Image
from src.services.static import create_message, delete_message, update_message

anime_tag = "Anime"
anime_router = APIRouter(prefix="/anime", tags=[anime_tag])


async def get_anime_service() -> AnimeServiceI:
    return container.anime_service()


@anime_router.post("/")
async def create(
        anime: CreateAnimeSchema,
        file: UploadFile | None = File(None),
        anime_service: AnimeServiceI = Depends(get_anime_service),
) -> JSONResponse:
    image = Image()
    if file:
        image.file_bytes = await file.read()
        image.filename = file.filename
    await anime_service.create(anime, image)
    return JSONResponse(content={"message": create_message.format(entity=anime_tag)}, status_code=HTTPStatus.CREATED)


@anime_router.get("/", response_model=list[AnimeResponseSchema])
async def get_multi(offset: int | None = None, limit: int | None = None,
                    anime_service: AnimeServiceI = Depends(get_anime_service)) -> list[AnimeResponseSchema]:
    return await anime_service.get_multi(offset, limit)


@anime_router.get("/{anime_id}", response_model=AnimeResponseSchema)
async def get(anime_id: int, anime_service: AnimeServiceI = Depends(get_anime_service)) -> AnimeResponseSchema:
    return await anime_service.get(anime_id)


@anime_router.patch("/{anime_id}")
async def update(
        anime_id: int,
        anime: UpdateAnimeSchema,
        file: UploadFile | None = File(None),
        anime_service: AnimeServiceI = Depends(get_anime_service),
) -> JSONResponse:
    image = Image()
    if file:
        image.file_bytes = await file.read()
        image.filename = file.filename
    await anime_service.update(anime_id, anime, image)
    return JSONResponse(content={"message": update_message.format(entity=anime_tag)}, status_code=HTTPStatus.OK)


@anime_router.delete("/{anime_id}")
async def delete(
        anime_id: int,
        anime_service: AnimeServiceI = Depends(get_anime_service),
) -> JSONResponse:
    await anime_service.delete(anime_id)
    return JSONResponse(content={"message": delete_message.format(entity=anime_tag)}, status_code=HTTPStatus.OK)
