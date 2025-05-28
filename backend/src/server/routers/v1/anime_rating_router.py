from http import HTTPStatus
from uuid import UUID

from fastapi import APIRouter, Depends, Response
from fastcrud import FastCRUD, crud_router
from starlette.responses import JSONResponse

from src.clients.database.models.anime_rating import AnimeRating
from src.container import container
from src.services.anime_rating.interface import AnimeRatingServiceI
from src.services.anime_rating.schemas import CreateAnimeRatingSchema, UpdateAnimeRatingSchema, \
    AnimeRatingResponseSchema


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


@anime_rating_router.get("/anime_rating/{anime_id}/rating_stats")
async def get_rating_stats(
    anime_id: int,
    anime_rating_service: AnimeRatingServiceI = Depends(get_anime_rating_service),
) -> JSONResponse:
    stats = await anime_rating_service.get_rating_stats(anime_id)
    return JSONResponse(content=stats, status_code=HTTPStatus.OK)


@anime_rating_router.get("/anime_rating/{anime_id}/{user_id}", response_model=None)
async def get_user_rating(
    anime_id: int,
    user_id: UUID,
    anime_rating_service: AnimeRatingServiceI = Depends(get_anime_rating_service),
) -> AnimeRatingResponseSchema | Response:
    anime_rating = await anime_rating_service.get_user_rating(anime_id, user_id)
    if anime_rating:
        return anime_rating
    return Response(status_code=HTTPStatus.NO_CONTENT)
