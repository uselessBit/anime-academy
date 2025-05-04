from fastcrud import crud_router

from src.clients.database.models.anime_comment import AnimeComment
from src.container import container
from src.services.anime_comment.schemas import CreateAnimeCommentSchema, UpdateAnimeCommentSchema


anime_comment_router = crud_router(
    session=container.database().get_db_session,
    model=AnimeComment,
    create_schema=CreateAnimeCommentSchema,
    update_schema=UpdateAnimeCommentSchema,
    crud=container.anime_comment_crud(),
    path="/comment",
    tags=["Comment"],
)