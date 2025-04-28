from http import HTTPStatus

from fastcrud import crud_router

from src.clients.database.models.anime_review import AnimeReview
from src.container import container
from src.services.anime_review.interface import AnimeReviewServiceI
from src.services.anime_review.schemas import CreateAnimeReviewSchema, UpdateAnimeReviewSchema
from fastapi import Depends, APIRouter
from starlette.responses import JSONResponse
from fastcrud import FastCRUD


async def get_anime_review_service() -> AnimeReviewServiceI:
    return container.anime_review_service()

async def get_anime_review_crud() -> FastCRUD:
    return container.anime_review_crud()

anime_review_auto_router = crud_router(
    session=container.database().get_db_session,
    model=AnimeReview,
    create_schema=CreateAnimeReviewSchema,
    update_schema=UpdateAnimeReviewSchema,
    crud=container.anime_review_crud(),
    included_methods=["read_multi", "read",],
    path="/anime_review"
)

anime_review_router = APIRouter(tags=["Anime review"],)
anime_review_router.include_router(anime_review_auto_router)


@anime_review_router.post("/anime_review", response_model=CreateAnimeReviewSchema)
async def create(
        anime_review: CreateAnimeReviewSchema,
        anime_review_service: AnimeReviewServiceI = Depends(get_anime_review_service),
) -> JSONResponse:
    await anime_review_service.create(anime_review)
    return JSONResponse(content={"message": "Anime review created successfully"}, status_code=HTTPStatus.CREATED)


@anime_review_router.patch("/anime_review/{review_id}", response_model=UpdateAnimeReviewSchema)
async def update(
        review_id: int,
        anime_review: UpdateAnimeReviewSchema,
        anime_review_service: AnimeReviewServiceI = Depends(get_anime_review_service),
) -> JSONResponse:
    await anime_review_service.update(review_id, anime_review)
    return JSONResponse(content={"message": "Anime review updated successfully"}, status_code=HTTPStatus.OK)


@anime_review_router.delete("/anime_review/{review_id}")
async def delete(
        review_id: int,
        anime_review_service: AnimeReviewServiceI = Depends(get_anime_review_service),
) -> JSONResponse:
    await anime_review_service.delete(review_id)
    return JSONResponse(content={"message": "Anime review deleted successfully"}, status_code=HTTPStatus.OK)