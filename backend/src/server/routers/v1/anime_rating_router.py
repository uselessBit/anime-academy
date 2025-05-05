from http import HTTPStatus

from fastapi import APIRouter, Depends
from fastcrud import FastCRUD, crud_router
from starlette.responses import JSONResponse

from src.clients.database.models.anime_rating import AnimeRating
from src.container import container
from src.services.anime_rating.interface import AnimeRatingServiceI
from src.services.anime_rating.schemas import CreateAnimeRatingSchema, UpdateAnimeRatingSchema


async def get_anime_rating_service() -> AnimeRatingServiceI:
    return container.anime_rating_service()


async def get_anime_rating_crud() -> FastCRUD:
    return container.anime_rating_crud()


anime_rating_auto_router = crud_router(
    session=container.database().get_db_session,
    model=AnimeRating,
    create_schema=CreateAnimeRatingSchema,
    update_schema=UpdateAnimeRatingSchema,
    crud=container.anime_rating_crud(),
    included_methods=[
        "read_multi",
        "read",
    ],
    path="/anime_rating",
)

anime_rating_router = APIRouter(
    tags=["Anime rating"],
)
anime_rating_router.include_router(anime_rating_auto_router)


@anime_rating_router.post("/anime_rating", response_model=CreateAnimeRatingSchema)
async def create(
    anime_rating: CreateAnimeRatingSchema,
    anime_rating_service: AnimeRatingServiceI = Depends(get_anime_rating_service),
) -> JSONResponse:
    await anime_rating_service.create(anime_rating)
    return JSONResponse(content={"message": "Anime rating created successfully"}, status_code=HTTPStatus.CREATED)


@anime_rating_router.patch("/anime_rating/{rating_id}", response_model=UpdateAnimeRatingSchema)
async def update(
    rating_id: int,
    anime_rating: UpdateAnimeRatingSchema,
    anime_rating_service: AnimeRatingServiceI = Depends(get_anime_rating_service),
) -> JSONResponse:
    await anime_rating_service.update(rating_id, anime_rating)
    return JSONResponse(content={"message": "Anime rating updated successfully"}, status_code=HTTPStatus.OK)


@anime_rating_router.delete("/anime_rating/{rating_id}")
async def delete(
    rating_id: int,
    anime_rating_service: AnimeRatingServiceI = Depends(get_anime_rating_service),
) -> JSONResponse:
    await anime_rating_service.delete(rating_id)
    return JSONResponse(content={"message": "Anime rating deleted successfully"}, status_code=HTTPStatus.OK)
