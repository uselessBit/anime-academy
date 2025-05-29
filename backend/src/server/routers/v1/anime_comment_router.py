from http import HTTPStatus

from fastapi import APIRouter, Depends
from fastcrud import crud_router
from starlette.responses import JSONResponse
from src.clients.database.models.anime_comment import AnimeComment
from src.container import container
from src.services.anime_comment.interface import AnimeCommentServiceI
from src.services.anime_comment.schemas import CommentTreeResponse, CreateAnimeCommentSchema, UpdateAnimeCommentSchema, \
    AnimeCommentResponseSchema


async def get_anime_comment_service() -> AnimeCommentServiceI:
    return container.anime_comment_service()


anime_comment_auto_router = crud_router(
    session=container.database().get_db_session,
    model=AnimeComment,
    create_schema=CreateAnimeCommentSchema,
    update_schema=UpdateAnimeCommentSchema,
    crud=container.anime_comment_crud(),
    included_methods=[
        "read_multi",
        "read",
        "update",
        "delete",
    ],
    path="/comment",
    tags=["Anime comment"],
)

anime_comment_router = APIRouter(
    tags=["Anime comment"],
)
anime_comment_router.include_router(anime_comment_auto_router)


@anime_comment_router.post("/comment")
async def create(
    anime_comment: CreateAnimeCommentSchema,
    anime_comment_service: AnimeCommentServiceI = Depends(get_anime_comment_service),
):
    return await anime_comment_service.create(anime_comment)



@anime_comment_router.get("/comment_tree", response_model=CommentTreeResponse)
async def get_comment_tree(
    comment_id: int,
    anime_comment_service: AnimeCommentServiceI = Depends(get_anime_comment_service),
) -> CommentTreeResponse:
    return await anime_comment_service.get_comment_tree(comment_id)


@anime_comment_router.get("/comment/anime/{anime_id}", response_model=list[AnimeCommentResponseSchema])
async def get_anime_comments(
    anime_id: int,
    anime_comment_service: AnimeCommentServiceI = Depends(get_anime_comment_service),
) -> list[AnimeCommentResponseSchema]:
    return await anime_comment_service.get_anime_comments(anime_id)