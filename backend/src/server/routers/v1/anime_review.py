from http import HTTPStatus

from fastcrud import FastCRUD, crud_router

from src.clients.database.models.anime_review import AnimeReview
from src.clients.database.utils import get_session
from src.container import container
from src.services.anime_review.interface import AnimeReviewServiceI
from src.services.anime_review.schemas import CreateAnimeReviewSchema, UpdateAnimeReviewSchema
from fastapi import Depends, APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse
from src.services.errors import AnimeReviewNotFoundError

anime_review_crud = FastCRUD(AnimeReview)


async def get_anime_review_service() -> AnimeReviewServiceI:
    return container.anime_review_service()


anime_review_auto_router = crud_router(
    session=get_session,
    model=AnimeReview,
    create_schema=CreateAnimeReviewSchema,
    update_schema=UpdateAnimeReviewSchema,
    crud=anime_review_crud,
    included_methods=["read_multi", "read",],
    path="/anime_review"
)

anime_review_router = APIRouter(tags=["Anime review"],)
anime_review_router.include_router(anime_review_auto_router)


@anime_review_router.post("/anime_review", response_model=CreateAnimeReviewSchema)
async def create_anime_review(
        payload: CreateAnimeReviewSchema,
        anime_review_service: AnimeReviewServiceI = Depends(get_anime_review_service),
        session = Depends(get_session)
):

    review = await anime_review_crud.create(session, payload)
    await anime_review_service.update_anime_rating(review.anime_id)
    return JSONResponse(content={"message": "Anime review created successfully"}, status_code=HTTPStatus.CREATED)


@anime_review_router.patch("/anime_review/{review_id}", response_model=UpdateAnimeReviewSchema)
async def update_anime_review(
        review_id: int,
        payload: UpdateAnimeReviewSchema,
        anime_review_service: AnimeReviewServiceI = Depends(get_anime_review_service),
        session: AsyncSession = Depends(get_session),
):
    await anime_review_crud.update(session, payload, id=review_id, allow_multiple=True)
    await anime_review_service.update_anime_rating(payload.anime_id)
    return JSONResponse(content={"message": "Anime review updated successfully"}, status_code=HTTPStatus.OK)


@anime_review_router.delete("/anime_review/{review_id}")
async def delete_anime_review(
        review_id: int,
        session: AsyncSession = Depends(get_session),
        anime_review_service: AnimeReviewServiceI = Depends(get_anime_review_service),
):
    review = await anime_review_crud.get(session, id=review_id)
    if review is None:
        raise AnimeReviewNotFoundError

    await anime_review_crud.delete(session, id=review_id)
    await anime_review_service.update_anime_rating(review["anime_id"])
    return JSONResponse(content={"message": "Anime review deleted successfully"}, status_code=HTTPStatus.OK)