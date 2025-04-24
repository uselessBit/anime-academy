from fastcrud import FastCRUD, crud_router

from src.clients.database.models.anime_review import AnimeReview
from src.clients.database.utils import get_session
from src.services.anime_review.schemas import CreateAnimeReviewSchema, UpdateAnimeReviewSchema

anime_review_crud = FastCRUD(AnimeReview)


anime_review_router = crud_router(
    session=get_session,
    model=AnimeReview,
    create_schema=CreateAnimeReviewSchema,
    update_schema=UpdateAnimeReviewSchema,
    crud=anime_review_crud,
    path="/anime_review",
    tags=["Anime review"],
)