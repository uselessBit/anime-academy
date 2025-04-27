from http import HTTPStatus

from src.clients.database.models.anime import Anime
from fastcrud import crud_router

from src.clients.database.utils import get_session
from src.container import container
from src.services.anime.interface import AnimeServiceI
from src.services.anime.schemas import CreateAnimeSchema, UpdateAnimeSchema
from fastapi import APIRouter, Depends, File, UploadFile
from starlette.responses import JSONResponse

from src.services.schemas import Image
from src.services.static import create_message, update_message, delete_message


async def get_anime_service() -> AnimeServiceI:
    return container.anime_service()

anime_tag = "Anime"
anime_auto_router = crud_router(
    session=get_session,
    model=Anime,
    create_schema=CreateAnimeSchema,
    update_schema=UpdateAnimeSchema,
    crud=container.anime_service().anime_crud,
    included_methods=["read_multi", "read",],
    path="/anime",
)
anime_router = APIRouter(tags=[anime_tag],)
anime_router.include_router(anime_auto_router)


@anime_router.post("/anime")
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
    return JSONResponse(
        content={"message": create_message.format(entity=anime_tag)}, status_code=HTTPStatus.CREATED
    )

@anime_router.patch("/anime/{anime_id}")
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
    return JSONResponse(
        content={"message": update_message.format(entity=anime_tag)}, status_code=HTTPStatus.OK
    )

@anime_router.delete("/anime/{anime_id}")
async def delete(
        anime_id: int,
        anime_service: AnimeServiceI = Depends(get_anime_service),
) -> JSONResponse:
    await anime_service.delete(anime_id)
    return JSONResponse(
        content={"message": delete_message.format(entity=anime_tag)}, status_code=HTTPStatus.OK
    )